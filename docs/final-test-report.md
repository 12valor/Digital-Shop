# Final Test Report

## Automated Checks

Run before every release:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
npm run test:e2e
```

## Browser Viewports

Smoke coverage checks:

- 390 x 844 mobile storefront.
- 390 x 844 mobile admin setup/guard state.
- 1366 x 768 desktop storefront.
- 1366 x 768 desktop admin setup/guard state.

Full production QA should also check 320px mobile width, common Android sizes, iPhone sizes, tablet, laptop, and large desktop.

## End-to-End Production Workflow

Verify in staging before production:

1. Browse active products.
2. Add an in-stock product to cart.
3. Submit checkout.
4. Confirm the order is created as `awaiting_payment`.
5. Confirm the static GCash QR appears with the exact order total.
6. Upload payment proof.
7. Confirm status becomes `proof_submitted` / `for_verification`, not `paid`.
8. Approve payment as administrator.
9. Confirm inventory is decremented once.
10. Add courier and tracking details.
11. Confirm the customer can see tracking.
12. Complete the order.

## Current Local Result

Local checks can verify build quality and guard states without credentials. Full checkout/admin verification requires Supabase credentials, applied migrations, storage buckets, and an administrator account.
