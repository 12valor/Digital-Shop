# Deployment Runbook

## Git Flow

Use feature branches for changes, a `development` branch for staging, and `main` for production.

1. Push a feature branch and review the Vercel preview deployment.
2. Merge to `development` after lint, typecheck, tests, build, and smoke checks pass.
3. Promote to `main` only after checkout, payment proof upload, admin approval, and order tracking are verified against staging.

## Vercel Setup

1. Create a Vercel project from the GitHub repository.
2. Set the framework preset to Next.js.
3. Add all variables from `.env.example` to the correct Vercel environment.
4. Keep `SUPABASE_SERVICE_ROLE_KEY` and `SENTRY_AUTH_TOKEN` server-only secrets.
5. Use separate Supabase projects for staging and production.

## Release Checklist

- Run `npm run lint`.
- Run `npm run typecheck`.
- Run `npm run test`.
- Run `npm run build`.
- Run `npm run test:e2e` for browser smoke coverage.
- Apply Supabase migrations to the target project.
- Run `npm run bootstrap:admin` only for the intended administrator account.
- Verify Sentry receives a test error in staging before enabling production alerts.

## Rollback

1. Revert or redeploy the previous Vercel deployment.
2. Do not roll back database migrations blindly after orders exist.
3. If a migration must be reversed, create a forward-only repair migration.
4. Record incorrect order-status changes in `audit_logs` and correct them through the admin UI or a reviewed service-role script.
