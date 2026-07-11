# Environment Setup

Phase 1 expects Supabase credentials in environment variables. Keep service-role keys server-only and never prefix them with `NEXT_PUBLIC_`.

## Local Supabase

1. Install Docker Desktop.
2. Run `npx supabase start`.
3. Copy the local API URL, publishable key, and service-role key into `.env.local`.
4. Apply migrations with `npx supabase db reset`.

## Required Variables

- `NEXT_PUBLIC_SITE_URL`: Local or deployed site URL used for auth redirects.
- `NEXT_PUBLIC_APP_ENV`: Public environment label such as `local`, `staging`, or `production`.
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL.
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`: Browser-safe Supabase publishable key.
- `SUPABASE_SERVICE_ROLE_KEY`: Server-only service role key for bootstrap/admin operations.
- `ADMIN_BOOTSTRAP_EMAIL`: Email to promote after the account has registered and verified.
- `NEXT_PUBLIC_SENTRY_DSN`: Browser-safe Sentry DSN. Leave blank to disable event delivery locally.
- `SENTRY_ENVIRONMENT`: Server-side Sentry environment label.
- `SENTRY_ORG`: Sentry organization slug for source-map uploads.
- `SENTRY_PROJECT`: Sentry project slug for source-map uploads.
- `SENTRY_AUTH_TOKEN`: Server/CI-only Sentry token for uploading source maps.

## Environment Matrix

| Variable | Local | Preview/Staging | Production |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` | Vercel preview or staging URL | Production domain |
| `NEXT_PUBLIC_APP_ENV` | `local` | `staging` | `production` |
| `NEXT_PUBLIC_SUPABASE_URL` | Local Supabase API URL | Staging Supabase URL | Production Supabase URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Local publishable key | Staging publishable key | Production publishable key |
| `SUPABASE_SERVICE_ROLE_KEY` | Local service role key | Staging service role key | Production service role key |
| `NEXT_PUBLIC_SENTRY_DSN` | Optional | Staging Sentry DSN | Production Sentry DSN |
| `SENTRY_AUTH_TOKEN` | Blank | CI/Vercel secret | CI/Vercel secret |

Do not store `.env.local`, service-role keys, or Sentry auth tokens in Git.

## First Administrator

1. Register the admin account through `/auth/register`.
2. Verify the email.
3. Set `ADMIN_BOOTSTRAP_EMAIL` to that account email.
4. Run `npm run bootstrap:admin`.

The bootstrap script updates the matching profile with the `administrator` role using the service-role key.

## Hosted Supabase Password Recovery

For reliable server-side password recovery, configure the hosted project to send the token hash to the app confirmation route:

1. In Supabase, open **Authentication > Email Templates > Reset Password**.
2. Replace the reset button URL with:

```html
{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=recovery&next=/auth/reset-password
```

3. Under **Authentication > URL Configuration**, set the Site URL to `NEXT_PUBLIC_SITE_URL` and allow `${NEXT_PUBLIC_SITE_URL}/auth/callback` and `${NEXT_PUBLIC_SITE_URL}/auth/reset-password` as redirect URLs.
4. Save the template, request a fresh reset email, and use the newest link only once. Previously opened or expired links cannot create a recovery session.

The repository copy of the recovery email is in `supabase/templates/recovery.html`. The `/auth/confirm` route verifies the token hash and stores the recovery session in cookies before opening the password form.
