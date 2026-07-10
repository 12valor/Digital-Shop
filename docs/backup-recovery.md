# Backup and Recovery

## Supabase Backups

Use Supabase managed backups for hosted production projects. Before high-risk releases, create an on-demand backup or export:

```bash
npx supabase db dump --db-url "$SUPABASE_DB_URL" --file backups/pre-release.sql
```

Store backups outside the application repository with restricted access.

## Restore Procedure

1. Confirm the target environment. Never restore production data into staging without removing customer data.
2. Put the shop in maintenance mode through Vercel if recovery affects checkout.
3. Restore the selected Supabase backup from the dashboard or a reviewed SQL dump.
4. Re-run smoke checks for browsing, checkout, GCash proof upload, admin approval, and tracking.
5. Record the recovery action in an incident note.

## Deleted Product Recovery

Products tied to orders should be archived instead of deleted. If product data is deleted:

1. Restore from the latest backup into a temporary database.
2. Copy only the missing product, variant, image, and inventory records.
3. Keep historical `order_items.snapshot` values unchanged.
4. Add an `audit_logs` entry describing the recovery.

## Failed Deployments

If deployment fails after database migrations:

1. Redeploy the last known good Vercel build.
2. Leave compatible forward migrations in place.
3. Patch code forward if the schema is already used by live orders.
4. Avoid destructive rollback while checkout or payment review is active.
