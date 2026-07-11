import { describe, expect, it } from "vitest";

import {
  applyCatalogFilters,
  parseCatalogSearchParams,
} from "@/lib/storefront-data";
import { testProducts } from "@/test/fixtures/storefront-products";
import { canAddProductToCart } from "@/utils/cart-rules";

describe("storefront catalog", () => {
  it("returns matching active products for search queries", () => {
    const products = applyCatalogFilters(testProducts, { q: "digital" });

    expect(products.map((product) => product.slug)).toContain("test-digital-product");
  });

  it("filters products by category and sale state", () => {
    const products = applyCatalogFilters(testProducts, {
      category: "test-category",
      discount: "sale",
    });

    expect(products).toHaveLength(1);
    expect(products[0].category?.slug).toBe("test-category");
    expect(products[0].salePriceCents).toBe(8900);
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
    const outOfStock = testProducts.find((product) => product.stock === 0);

    expect(outOfStock).toBeDefined();
    expect(canAddProductToCart(outOfStock!, 1)).toBe(false);
  });
});
