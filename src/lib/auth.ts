import { redirect } from "next/navigation";

import { canAccessAdmin } from "@/lib/access-control";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { UserRole } from "@/types/database";

export async function getCurrentUser() {
  const supabase = await getSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

export async function getCurrentProfile() {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("id,email,full_name,phone,avatar_url,role,created_at,updated_at")
    .eq("id", user.id)
    .single();

  if (error) {
    return null;
  }

  return data;
}

export async function requireAuth(next = "/account") {
  const profile = await getCurrentProfile();

  if (!profile) {
    redirect(`/auth/login?next=${encodeURIComponent(next)}`);
  }

  return profile;
}

export async function requireRole(roles: UserRole[], next = "/admin") {
  const profile = await requireAuth(next);

  if (!roles.includes(profile.role)) {
    redirect("/account?error=unauthorized");
  }

  return profile;
}

export async function requireAdminArea(next = "/admin") {
  const profile = await requireAuth(next);

  if (!canAccessAdmin({ id: profile.id, role: profile.role })) {
    redirect("/account?error=unauthorized");
  }

  return profile;
}
