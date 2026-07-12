# Digital Shop

A mobile-first digital marketplace built with Next.js, TypeScript, Tailwind CSS, and Supabase. The application supports product discovery, customer accounts, server-validated checkout, manual GCash payments, private payment-proof review, inventory, and administrator workflows.

## Features

### Storefront

- Responsive marketplace homepage, header, footer, and mobile navigation
- Product, category, brand, search, filtering, and sorting pages
- Product variants, stock states, sale prices, badges, and image galleries
- Persistent Zustand cart and recently viewed products
- Custom Digital Shop branding and vector logo

### Customer Account

- Registration, email verification, login, logout, and password recovery
- Protected profile and order routes
- Editable profile details and saved delivery addresses
- Order search, filtering, status history, notifications, and payment status
- Payment-proof submission and rejected-proof resubmission
- Eligible unpaid-order cancellation

### Checkout and GCash

- Server-side product, variant, price, quantity, and stock validation
- Unique order-number generation and immutable order-item snapshots
- Fixed manual GCash QR with exact order totals
- Private receipt uploads with server-side type and size validation
- Duplicate GCash reference prevention
- Payment approval never occurs automatically after upload

### Administration

- Role-protected staff and administrator area
- Dashboard metrics and recent activity
- Product, category, brand, variant, image, and archive management
- Variant-level inventory adjustments and movement history
- Payment-proof approval, rejection, and resubmission workflow
- Order status, notes, courier, tracking, and inventory updates
- Homepage banner and section management
- Audit logs and customer notifications

## Technology

- Next.js 16 App Router and React 19
- TypeScript and Tailwind CSS 4
- Supabase PostgreSQL, Auth, Storage, and Row Level Security
- Zustand, TanStack Query, Motion, and Embla Carousel
- Zod validation
- Vitest and Playwright
- Sentry and Vercel

## Project Structure

```text
src/
|-- app/
|   |-- (storefront)/       # Public marketplace routes
|   |-- account/            # Protected customer account
|   |-- admin/              # Staff and administrator operations
|   |-- api/                # Route handlers
|   +-- auth/               # Authentication and recovery flows
|-- components/
|   |-- account/
|   |-- admin/
|   |-- forms/
|   |-- shared/
|   +-- storefront/
|-- hooks/
|-- lib/                    # Supabase, auth, checkout, and data helpers
|-- stores/
|-- types/
+-- utils/

supabase/
|-- migrations/             # Ordered database and RLS migrations
+-- templates/              # Supabase email templates
```

## Prerequisites

- Node.js 20 or newer
- npm
- A hosted Supabase project
- Docker Desktop only if you choose the optional local Supabase workflow

## Quick Start With Hosted Supabase

Docker is not required when using a hosted Supabase project.

### 1. Install dependencies

```bash
npm install
```

### 2. Create the environment file

Copy `.env.example` to `.env.local` and replace the sample values:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_APP_ENV=local
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
ADMIN_BOOTSTRAP_EMAIL=your-admin-email@example.com
```

Find the project URL and API keys in **Supabase Dashboard > Project Settings > API**. The service-role key is server-only: never expose it in browser code, prefix it with `NEXT_PUBLIC_`, or commit `.env.local`.

Sentry variables are optional for local development. See [Environment Setup](docs/environment.md) for the complete variable matrix.

### 3. Apply database migrations

Run the SQL files in chronological order from `supabase/migrations/` using the Supabase SQL Editor:

1. `20260709153205_phase_1_foundation.sql`
2. `20260710120724_phase_3_checkout_payment.sql`
3. `20260710122736_phase_4_admin_workflows.sql`

The migrations create the tables, functions, triggers, constraints, grants, RLS policies, and private `payment-proofs` storage bucket.

Alternatively, use the Supabase CLI against the hosted project:

```bash
npx supabase login
npx supabase link --project-ref your-project-ref
npx supabase db push
```

### 4. Configure authentication URLs

In **Supabase Dashboard > Authentication > URL Configuration**:

- Set **Site URL** to `http://localhost:3000` during local development.
- Add `http://localhost:3000/auth/callback` to the allowed redirect URLs.
- Add `http://localhost:3000/auth/reset-password` to the allowed redirect URLs.

For hosted password recovery, update the Reset Password email link to:

```html
{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=recovery&next=/auth/reset-password
```

The repository version is available at `supabase/templates/recovery.html`.

### 5. Run the application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Activation and password-reset links pointing to localhost only work while the development server is running.

## Create the First Administrator

1. Register through `/auth/register`.
2. Verify the account email.
3. Set `ADMIN_BOOTSTRAP_EMAIL` in `.env.local` to the registered email.
4. Run:

```bash
npm run bootstrap:admin
```

The script uses the server-only service-role key to update the matching `profiles.role` to `administrator`. Sign out and back in before opening `/admin`.

## Product Catalog

The application no longer injects mock products. A new Supabase project therefore displays an empty catalog until an administrator creates active products, variants, images, and inventory through `/admin/products`.

Public visitors can read only active storefront data. Product writes and inventory operations remain protected by server-side role checks and Supabase RLS.

## Manual GCash Configuration

Automated payment gateways are intentionally not used.

Before accepting orders:

1. Replace `public/payment/gcash-qr.svg` with the permanent merchant GCash QR.
2. Update the account name and masked number in `src/lib/gcash.ts`.
3. Keep the QR static; the order number and exact payable amount change per order.
4. Verify every submitted receipt manually from the administrator payment screen.

Payment proofs are stored privately and viewed through temporary signed URLs. Uploading a receipt sets the payment state to `proof_submitted`, never directly to `paid`.

## Available Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm run start` | Run the production build |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript checking |
| `npm run test` | Run Vitest tests |
| `npm run test:e2e` | Run desktop and mobile Playwright tests |
| `npm run bootstrap:admin` | Promote the configured account to administrator |

## Important Routes

| Route | Access |
| --- | --- |
| `/` | Public storefront |
| `/products` | Public product catalog |
| `/product/[slug]` | Public product details |
| `/cart` | Customer cart |
| `/checkout` | Authenticated checkout |
| `/account` | Protected account overview |
| `/account/orders` | Protected customer order tracking |
| `/admin` | Staff and administrator area |
| `/admin/products` | Administrator product management |
| `/admin/inventory` | Administrator inventory management |
| `/admin/payments` | Administrator payment verification |
| `/admin/orders` | Staff and administrator order management |

## Verification

Run the critical checks before merging or deploying:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
npm run test:e2e
```

Playwright uses a production server on port `3002` and checks desktop and mobile layouts. Authentication, checkout, payment upload, and administrator workflows also require a configured Supabase project and suitable test accounts for complete end-to-end coverage.

## Security Notes

- Prices, totals, roles, stock, and order state are never trusted from the browser.
- Sensitive mutations authenticate and authorize again on the server.
- RLS protects all browser-accessible tables.
- The service-role key is loaded only by server-side modules and scripts.
- Payment receipts use a private storage bucket and signed URLs.
- Duplicate GCash references are blocked by a database constraint.
- Administrator payment approval is idempotent and records audit history.
- Important authentication and proof-submission actions are rate limited.

Review [Security Review](docs/security-review.md) before production deployment.

## Deployment

The application is designed for Vercel with separate preview, staging, and production environments. Use separate Supabase projects where practical and configure secrets independently for each environment.

See:

- [Deployment Runbook](docs/deployment.md)
- [Environment Setup](docs/environment.md)
- [Backup and Recovery](docs/backup-recovery.md)
- [Final Test Report](docs/final-test-report.md)

## Optional Local Supabase

Local Supabase requires Docker Desktop:

```bash
npx supabase start
npx supabase db reset
```

Use this only when you want a fully local database and authentication stack. Hosted Supabase is the recommended setup when Docker is not installed.
