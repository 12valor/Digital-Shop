import { describe, expect, it } from "vitest";

import { validateCheckoutCart } from "@/lib/checkout-validation";
import { demoProducts } from "@/lib/storefront-demo-data";

describe("checkout validation", () => {
  it("recalculates totals from trusted product data", () => {
    const product = demoProducts.find((item) => item.slug === "gosurf-99-data-promo")!;

    const result = validateCheckoutCart(demoProducts, [
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
    const product = demoProducts.find((item) => item.slug === "techmate-fast-charge-cable")!;

    expect(() =>
      validateCheckoutCart(demoProducts, [
        {
          productId: product.id,
          variantId: product.variants[0].id,
          quantity: 1,
        },
      ]),
    ).toThrow(/stock/i);
  });

  it("rejects invalid variants", () => {
    const product = demoProducts[0];

    expect(() =>
      validateCheckoutCart(demoProducts, [
        {
          productId: product.id,
          variantId: "missing",
          quantity: 1,
        },
      ]),
    ).toThrow(/invalid variant/i);
  });
});
