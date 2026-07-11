import type { EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";

import {
  PASSWORD_RECOVERY_COOKIE,
  PASSWORD_RECOVERY_MAX_AGE,
} from "@/lib/auth-recovery";
import { getSupabaseServerClient } from "@/lib/supabase/server";

const allowedEmailOtpTypes = new Set([
  "signup",
  "invite",
  "magiclink",
  "recovery",
  "email_change",
  "email",
]);

function parseEmailOtpType(value: string | null): EmailOtpType | null {
  return value && allowedEmailOtpTypes.has(value) ? (value as EmailOtpType) : null;
}

function safeNextPath(next: string | null, type: EmailOtpType | null) {
  const fallback = type === "recovery" ? "/auth/reset-password" : "/account";
  return next?.startsWith("/") && !next.startsWith("//") ? next : fallback;
}

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const tokenHash = requestUrl.searchParams.get("token_hash");
  const type = parseEmailOtpType(requestUrl.searchParams.get("type"));
  const next = safeNextPath(requestUrl.searchParams.get("next"), type);

  if (tokenHash && type) {
    const supabase = await getSupabaseServerClient();
    const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type });

    if (!error) {
      const response = NextResponse.redirect(new URL(next, requestUrl.origin));

      if (type === "recovery" && next === "/auth/reset-password") {
        response.cookies.set(PASSWORD_RECOVERY_COOKIE, "1", {
          httpOnly: true,
          maxAge: PASSWORD_RECOVERY_MAX_AGE,
          path: "/",
          sameSite: "lax",
          secure: requestUrl.protocol === "https:",
        });
      }

      return response;
    }
  }

  const errorUrl = new URL(
    type === "recovery" ? "/auth/forgot-password" : "/auth/login",
    requestUrl.origin,
  );
  errorUrl.searchParams.set("error", "invalid_link");
  return NextResponse.redirect(errorUrl);
}