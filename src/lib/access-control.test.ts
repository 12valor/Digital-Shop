import { describe, expect, it } from "vitest";

import {
  canAccessAdmin,
  canModifyProduct,
  canReadProduct,
  canReadPublicProduct,
} from "@/lib/access-control";

describe("access control", () => {
  it("blocks logged-out users from admin access", () => {
    expect(canAccessAdmin(null)).toBe(false);
  });

  it("blocks customers from admin access", () => {
    expect(canAccessAdmin({ id: "customer-id", role: "customer" })).toBe(false);
  });

  it("allows administrators into the admin area", () => {
    expect(canAccessAdmin({ id: "admin-id", role: "administrator" })).toBe(true);
  });

  it("allows public users to read active products only", () => {
    expect(canReadPublicProduct({ status: "active" })).toBe(true);
    expect(canReadPublicProduct({ status: "draft" })).toBe(false);
    expect(canReadProduct(null, { status: "archived" })).toBe(false);
  });

  it("does not allow public users or customers to modify products", () => {
    expect(canModifyProduct(null)).toBe(false);
    expect(canModifyProduct({ id: "customer-id", role: "customer" })).toBe(false);
    expect(canModifyProduct({ id: "admin-id", role: "administrator" })).toBe(true);
  });
});
