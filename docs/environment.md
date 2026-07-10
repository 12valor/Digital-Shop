# Environment Setup

Phase 1 expects Supabase credentials in environment variables. Keep service-role keys server-only and never prefix them with `NEXT_PUBLIC_`.

## Local Supabase

1. Install Docker Desktop.
2. Run `npx supabase start`.
3. Copy the local API URL, publishable key, and service-role key into `.env.local`.
4. Apply migrations with `npx supabase db reset`.

## Required Variables

- `NEXT_PUBLIC_SITE_URL`: Local or deployed site URL used for auth redirects.
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL.
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`: Browser-safe Supabase publishable key.
- `SUPABASE_SERVICE_ROLE_KEY`: Server-only service role key for bootstrap/admin operations.
- `ADMIN_BOOTSTRAP_EMAIL`: Email to promote after the account has registered and verified.

## First Administrator

1. Register the admin account through `/auth/register`.
2. Verify the email.
3. Set `ADMIN_BOOTSTRAP_EMAIL` to that account email.
4. Run `npm run bootstrap:admin`.

The bootstrap script updates the matching profile with the `administrator` role using the service-role key.
