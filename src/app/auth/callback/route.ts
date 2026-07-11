import { NextResponse, type NextRequest } from "next/server";

import {
  PASSWORD_RECOVERY_COOKIE,
  PASSWORD_RECOVERY_MAX_AGE,
} from "@/lib/auth-recovery";
import { getSupabaseServerClient } from "@/lib/supabase/server";

function safeNextPath(next: string | null) {
  return next?.startsWith("/") && !next.startsWith("//") ? next : "/account";
}

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = safeNextPath(requestUrl.searchParams.get("next"));
  const errorUrl = new URL(
    next === "/auth/reset-password" ? "/auth/forgot-password" : "/auth/login",
    requestUrl.origin,
  );
  errorUrl.searchParams.set("error", "invalid_link");

  if (!code) {
    return NextResponse.redirect(errorUrl);
  }

  const supabase = await getSupabaseServerClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(errorUrl);
  }

  const response = NextResponse.redirect(new URL(next, requestUrl.origin));

  if (next === "/auth/reset-password") {
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