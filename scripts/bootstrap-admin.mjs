import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const adminEmail = process.env.ADMIN_BOOTSTRAP_EMAIL;

if (!url || !serviceRoleKey || !adminEmail) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, or ADMIN_BOOTSTRAP_EMAIL.",
  );
  process.exit(1);
}

const supabase = createClient(url, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const { data, error } = await supabase
  .from("profiles")
  .update({ role: "administrator" })
  .eq("email", adminEmail)
  .select("id,email,role")
  .single();

if (error) {
  console.error(`Could not promote ${adminEmail}: ${error.message}`);
  process.exit(1);
}

console.log(`Promoted ${data.email} to ${data.role}.`);
