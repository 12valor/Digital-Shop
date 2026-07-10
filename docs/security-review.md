# Security Review

## Current Controls

- Supabase RLS is enabled for exposed public tables in the migrations.
- Public users can read active storefront data only.
- Customer policies scope profiles, addresses, orders, payment proofs, history, and notifications to the owning user.
- Staff and administrator policies use `profiles.role` through server-side helpers and RLS checks.
- The service-role key is read only from server code and is not prefixed with `NEXT_PUBLIC_`.
- Checkout totals, discounts, shipping, active product state, variants, and stock are recalculated on the server.
- Payment proofs are uploaded to a private bucket with randomized paths.
- Duplicate GCash references are blocked and logged.
- Login, registration, forgot-password, and payment-proof submission use server-side rate limits.
- Sentry event scrubbing filters password, token, receipt, screenshot, GCash, reference, mobile, phone, and amount fields.

## Manual Production Checks

- Confirm every public-schema table has RLS enabled after migrations are applied.
- Confirm the `payment-proofs` bucket is private and only staff/admin policies can read receipt objects.
- Confirm Sentry does not receive receipt files, full GCash numbers, passwords, or service keys.
- Confirm Supabase Auth email redirects use the correct production `NEXT_PUBLIC_SITE_URL`.
- Confirm administrator actions are recorded in `audit_logs`.
- Confirm failed login and proof upload attempts are rate-limited in the target runtime.

## Known Limits

The in-memory rate limiter is suitable for Phase 5 local and single-instance validation. For production scale, replace it with a shared store such as Redis, Upstash, or a Supabase-backed counter so limits apply across serverless instances.
