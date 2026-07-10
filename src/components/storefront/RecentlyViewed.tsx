"use client";

import { useMemo } from "react";

import { ProductCarousel } from "@/components/storefront/ProductCarousel";
import { useStorefrontStore } from "@/stores/storefront-store";
import type { StorefrontProduct } from "@/types/storefront";

export function RecentlyViewed({ products }: { products: StorefrontProduct[] }) {
  const slugs = useStorefrontStore((state) => state.recentlyViewedSlugs);
  const recentlyViewed = useMemo(
    () =>
      slugs
        .map((slug) => products.find((product) => product.slug === slug))
        .filter((product): product is StorefrontProduct => Boolean(product)),
    [products, slugs],
  );

  if (recentlyViewed.length === 0) {
    return null;
  }

  return <ProductCarousel title="Recently viewed" href="/products" products={recentlyViewed} />;
}
