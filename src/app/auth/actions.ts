"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { getPublicSiteUrl } from "@/lib/env";
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

  const supabase = await getSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    return errorState(error.message);
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

  const supabase = await getSupabaseServerClient();
  const { error } = await supabase.auth.updateUser({
    password: parsed.data,
  });

  if (error) {
    return errorState(error.message);
  }

  redirect("/account");
}
