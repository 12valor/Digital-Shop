import { describe, expect, it } from "vitest";

import { validateCheckoutCart } from "@/lib/checkout-validation";
import { testProducts } from "@/test/fixtures/storefront-products";

describe("checkout validation", () => {
  it("recalculates totals from trusted product data", () => {
    const product = testProducts.find((item) => item.stock > 0)!;

    const result = validateCheckoutCart(testProducts, [
      {
        productId: product.id,
        variantId: product.variants[0].id,
        quantity: 2,
      },
    ]);

    expect(result.items[0].unitPriceCents).toBe(8900);
    expect(result.subtotalCents).toBe(17800);
    expect(result.totalCents).toBe(23700);
  });

  it("rejects invalid stock at checkout", () => {
    const product = testProducts.find((item) => item.stock === 0)!;

    expect(() =>
      validateCheckoutCart(testProducts, [
        {
          productId: product.id,
          variantId: product.variants[0].id,
          quantity: 1,
        },
      ]),
    ).toThrow(/stock/i);
  });

  it("rejects invalid variants", () => {
    const product = testProducts[0];

    expect(() =>
      validateCheckoutCart(testProducts, [
        {
          productId: product.id,
          variantId: "missing",
          quantity: 1,
        },
      ]),
    ).toThrow(/invalid variant/i);
  });
});
