import Link from "next/link";
import { cookies } from "next/headers";

import { ResetPasswordForm } from "@/components/forms/AuthForms";
import { PASSWORD_RECOVERY_COOKIE } from "@/lib/auth-recovery";
import { hasSupabasePublicEnv } from "@/lib/env";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function ResetPasswordPage() {
  const cookieStore = await cookies();
  const hasRecoveryMarker = cookieStore.get(PASSWORD_RECOVERY_COOKIE)?.value === "1";
  let hasRecoverySession = false;

  if (hasRecoveryMarker && hasSupabasePublicEnv()) {
    const supabase = await getSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    hasRecoverySession = Boolean(user);
  }

  if (!hasRecoverySession) {
    return (
      <>
        <h1 className="text-2xl font-black text-zinc-950">Reset link required</h1>
        <p className="mt-2 text-sm leading-6 text-zinc-600">
          This password reset link is invalid, expired, or was opened in a different browser session.
        </p>
        <Link
          href="/auth/forgot-password"
          className="mt-6 inline-flex h-11 items-center bg-orange-600 px-4 text-sm font-bold text-white hover:bg-orange-700"
        >
          Request a new reset link
        </Link>
      </>
    );
  }

  return (
    <>
      <h1 className="text-2xl font-black text-zinc-950">Choose new password</h1>
      <p className="mt-2 text-sm leading-6 text-zinc-600">
        Enter and confirm a new password for your account.
      </p>
      <div className="mt-6">
        <ResetPasswordForm />
      </div>
    </>
  );
}