"use client";

import Link from "next/link";
import { useActionState } from "react";

import {
  type AuthActionState,
  forgotPasswordAction,
  resetPasswordAction,
  signInAction,
  signUpAction,
} from "@/app/auth/actions";

const initialAuthState: AuthActionState = {
  status: "idle",
  message: "",
};

function SubmitButton({ children }: { children: React.ReactNode }) {
  return (
    <button
      type="submit"
      className="h-11 w-full bg-zinc-950 px-4 text-sm font-semibold text-white transition hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
    >
      {children}
    </button>
  );
}

function Field({
  label,
  name,
  type = "text",
  autoComplete,
}: {
  label: string;
  name: string;
  type?: string;
  autoComplete?: string;
}) {
  return (
    <label className="grid gap-2 text-sm font-medium text-zinc-800">
      {label}
      <input
        name={name}
        type={type}
        autoComplete={autoComplete}
        required
        className="h-11 border border-zinc-300 bg-white px-3 text-sm text-zinc-950 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
      />
    </label>
  );
}

function FormMessage({
  status,
  message,
}: {
  status: "idle" | "error" | "success";
  message: string;
}) {
  if (!message) {
    return null;
  }

  return (
    <p
      className={
        status === "success"
          ? "border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800"
          : "border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
      }
    >
      {message}
    </p>
  );
}

export function LoginForm({ next }: { next: string }) {
  const [state, formAction] = useActionState(signInAction, initialAuthState);

  return (
    <form action={formAction} className="grid gap-4">
      <input type="hidden" name="next" value={next} />
      <Field label="Email address" name="email" type="email" autoComplete="email" />
      <Field
        label="Password"
        name="password"
        type="password"
        autoComplete="current-password"
      />
      <FormMessage status={state.status} message={state.message} />
      <SubmitButton>Sign in</SubmitButton>
      <div className="flex items-center justify-between text-sm">
        <Link className="font-medium text-orange-700 hover:text-orange-800" href="/auth/register">
          Create account
        </Link>
        <Link
          className="font-medium text-zinc-700 hover:text-zinc-950"
          href="/auth/forgot-password"
        >
          Forgot password
        </Link>
      </div>
    </form>
  );
}

export function RegisterForm() {
  const [state, formAction] = useActionState(signUpAction, initialAuthState);

  return (
    <form action={formAction} className="grid gap-4">
      <Field label="Full name" name="fullName" autoComplete="name" />
      <Field label="Email address" name="email" type="email" autoComplete="email" />
      <Field label="Password" name="password" type="password" autoComplete="new-password" />
      <FormMessage status={state.status} message={state.message} />
      <SubmitButton>Create account</SubmitButton>
      <Link className="text-sm font-medium text-orange-700 hover:text-orange-800" href="/auth/login">
        Already have an account? Sign in
      </Link>
    </form>
  );
}

export function ForgotPasswordForm() {
  const [state, formAction] = useActionState(forgotPasswordAction, initialAuthState);

  return (
    <form action={formAction} className="grid gap-4">
      <Field label="Email address" name="email" type="email" autoComplete="email" />
      <FormMessage status={state.status} message={state.message} />
      <SubmitButton>Send reset link</SubmitButton>
      <Link className="text-sm font-medium text-zinc-700 hover:text-zinc-950" href="/auth/login">
        Back to sign in
      </Link>
    </form>
  );
}

export function ResetPasswordForm() {
  const [state, formAction] = useActionState(resetPasswordAction, initialAuthState);

  return (
    <form action={formAction} className="grid gap-4">
      <Field label="New password" name="password" type="password" autoComplete="new-password" />
      <Field
        label="Confirm password"
        name="confirmPassword"
        type="password"
        autoComplete="new-password"
      />
      <FormMessage status={state.status} message={state.message} />
      <SubmitButton>Update password</SubmitButton>
    </form>
  );
}
