import { describe, expect, it } from "vitest";

import {
  getCatalogData,
  getProductBySlug,
  parseCatalogSearchParams,
} from "@/lib/storefront-data";
import { demoProducts } from "@/lib/storefront-demo-data";
import { canAddProductToCart } from "@/utils/cart-rules";

describe("storefront catalog", () => {
  it("returns matching active products for search queries", async () => {
    const result = await getCatalogData({ q: "garena" });

    expect(result.products.map((product) => product.slug)).toContain("garena-shells-100");
  });

  it("filters products by category and sale state", async () => {
    const result = await getCatalogData({
      category: "game-credits",
      discount: "sale",
    });

    expect(result.products.length).toBeGreaterThan(0);
    expect(result.products.every((product) => product.category?.slug === "game-credits")).toBe(true);
    expect(result.products.every((product) => product.salePriceCents)).toBe(true);
  });

  it("loads product details by slug", async () => {
    const result = await getProductBySlug("gosurf-99-data-promo");

    expect(result?.product.name).toBe("GoSURF 99 Data Promo");
    expect(result?.relatedProducts.length).toBeGreaterThan(0);
  });

  it("parses shareable URL filters", () => {
    const filters = parseCatalogSearchParams({
      q: "load",
      min: "50",
      max: "150",
      availability: "in-stock",
      sort: "price-asc",
    });

    expect(filters).toMatchObject({
      q: "load",
      min: 50,
      max: 150,
      availability: "in-stock",
      sort: "price-asc",
    });
  });

  it("prevents out-of-stock products from being added to cart", () => {
    const outOfStock = demoProducts.find((product) => product.slug === "techmate-fast-charge-cable");

    expect(outOfStock).toBeDefined();
    expect(canAddProductToCart(outOfStock!, 1)).toBe(false);
  });
});
