"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

import { PASSWORD_RECOVERY_COOKIE } from "@/lib/auth-recovery";
import { getPublicSiteUrl } from "@/lib/env";
import { consumeRateLimit } from "@/lib/rate-limit";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export type AuthActionState = {
  status: "idle" | "error" | "success";
  message: string;
};

const emailSchema = z.string().trim().email("Enter a valid email address.");
const passwordSchema = z.string().min(8, "Password must be at least 8 characters.");

function getFormString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function safeNextPath(formData: FormData, fallback: string) {
  const next = getFormString(formData, "next");
  return next.startsWith("/") && !next.startsWith("//") ? next : fallback;
}

function errorState(message: string): AuthActionState {
  return {
    status: "error",
    message,
  };
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function requireAuthRateLimit(key: string, limit = 5) {
  const result = consumeRateLimit(`auth:${key}`, {
    limit,
    windowMs: 15 * 60 * 1000,
  });

  return result.allowed;
}

export async function signInAction(
  _previousState: AuthActionState,
  formData: FormData,
) {
  const parsed = z
    .object({
      email: emailSchema,
      password: z.string().min(1, "Enter your password."),
    })
    .safeParse({
      email: getFormString(formData, "email"),
      password: getFormString(formData, "password"),
    });

  if (!parsed.success) {
    return errorState(parsed.error.issues[0]?.message ?? "Check your login details.");
  }

  if (!requireAuthRateLimit(`login:${normalizeEmail(parsed.data.email)}`)) {
    return errorState("Too many attempts. Wait a few minutes before trying again.");
  }

  const supabase = await getSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    return errorState("Email or password is incorrect.");
  }

  redirect(safeNextPath(formData, "/account"));
}

export async function signUpAction(
  _previousState: AuthActionState,
  formData: FormData,
) {
  const parsed = z
    .object({
      fullName: z.string().trim().min(2, "Enter your full name."),
      email: emailSchema,
      password: passwordSchema,
    })
    .safeParse({
      fullName: getFormString(formData, "fullName"),
      email: getFormString(formData, "email"),
      password: getFormString(formData, "password"),
    });

  if (!parsed.success) {
    return errorState(parsed.error.issues[0]?.message ?? "Check your registration details.");
  }

  if (!requireAuthRateLimit(`register:${normalizeEmail(parsed.data.email)}`, 3)) {
    return errorState("Too many attempts. Wait a few minutes before trying again.");
  }

  const supabase = await getSupabaseServerClient();
  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: {
        full_name: parsed.data.fullName,
      },
      emailRedirectTo: `${getPublicSiteUrl()}/auth/callback?next=/account`,
    },
  });

  if (error) {
    return errorState(error.message);
  }

  return {
    status: "success",
    message: "Check your email to verify your account before signing in.",
  } satisfies AuthActionState;
}

export async function signOutAction() {
  const supabase = await getSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/");
}

export async function forgotPasswordAction(
  _previousState: AuthActionState,
  formData: FormData,
) {
  const parsed = emailSchema.safeParse(getFormString(formData, "email"));

  if (!parsed.success) {
    return errorState(parsed.error.issues[0]?.message ?? "Enter a valid email address.");
  }

  if (!requireAuthRateLimit(`forgot:${normalizeEmail(parsed.data)}`, 3)) {
    return {
      status: "success",
      message: "Password reset instructions were sent if that email exists.",
    } satisfies AuthActionState;
  }

  const supabase = await getSupabaseServerClient();
  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data, {
    redirectTo: `${getPublicSiteUrl()}/auth/callback?next=/auth/reset-password`,
  });

  if (error) {
    return errorState(error.message);
  }

  return {
    status: "success",
    message: "Password reset instructions were sent if that email exists.",
  } satisfies AuthActionState;
}

export async function resetPasswordAction(
  _previousState: AuthActionState,
  formData: FormData,
) {
  const password = getFormString(formData, "password");
  const confirmPassword = getFormString(formData, "confirmPassword");

  if (password !== confirmPassword) {
    return errorState("Passwords do not match.");
  }

  const parsed = passwordSchema.safeParse(password);

  if (!parsed.success) {
    return errorState(parsed.error.issues[0]?.message ?? "Choose a stronger password.");
  }

  const cookieStore = await cookies();

  if (cookieStore.get(PASSWORD_RECOVERY_COOKIE)?.value !== "1") {
    return errorState("This reset link is invalid or expired. Request a new password reset email.");
  }

  const supabase = await getSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return errorState("This reset link is invalid or expired. Request a new password reset email.");
  }

  const { error } = await supabase.auth.updateUser({
    password: parsed.data,
  });

  if (error) {
    return errorState("Unable to update your password. Request a new reset link and try again.");
  }

  cookieStore.delete(PASSWORD_RECOVERY_COOKIE);
  redirect("/account");
}
