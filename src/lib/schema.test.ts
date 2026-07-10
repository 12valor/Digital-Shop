import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

const migration = readFileSync(
  join(process.cwd(), "supabase/migrations/20260709153205_phase_1_foundation.sql"),
  "utf8",
);

describe("phase 1 migration", () => {
  it("enables RLS on exposed phase 1 tables", () => {
    for (const table of [
      "profiles",
      "addresses",
      "categories",
      "brands",
      "products",
      "product_variants",
      "product_images",
      "inventory",
      "orders",
      "order_items",
      "payment_proofs",
      "homepage_banners",
      "homepage_sections",
      "audit_logs",
    ]) {
      expect(migration).toContain(`alter table public.${table} enable row level security;`);
    }
  });

  it("keeps public product access read-only and active-only", () => {
    expect(migration).toContain('create policy "public reads active products"');
    expect(migration).toContain("using (status = 'active'");
    expect(migration).toContain('create policy "admins manage products"');
  });

  it("stores the GCash reference as a unique payment proof field for later phases", () => {
    expect(migration).toContain("gcash_reference_number text not null unique");
  });
});
