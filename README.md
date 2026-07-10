# Digital Shop

Phase 1 foundation for a mobile-first digital shop built with Next.js App Router, TypeScript, Tailwind CSS, and Supabase.

## Phase 1 Includes

- Storefront, auth, account, and admin route layouts.
- Supabase browser, server, and service-role clients.
- Registration, login, logout, email verification callback, forgot-password, and reset-password flows.
- Customer, staff, and administrator roles stored in `profiles.role`.
- SQL migration for the initial shop schema, constraints, grants, triggers, and RLS policies.
- Server-side route protection for account and admin pages.
- Environment documentation and first-admin bootstrap script.
- Minimal Vitest coverage for access-control rules and migration guardrails.

## Phase 2 and 3 Progress

- Phase 2 adds the marketplace homepage, catalog/search/category/brand/product routes, product cards, carousels, wishlist, recently viewed products, and a local cart.
- Phase 3 adds server-validated checkout, pending order creation, static GCash QR payment instructions, secure proof upload, duplicate-reference checks, and customer order status pages.

## Getting Started

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env.local` and fill in Supabase values before using auth-backed routes.

## Supabase

Local-first setup is documented in [docs/environment.md](docs/environment.md).

```bash
npx supabase start
npx supabase db reset
npm run bootstrap:admin
```

Run `npm run bootstrap:admin` only after the first administrator has registered and verified their email.

## Verification

```bash
npm run lint
npm run typecheck
npm run test
```
