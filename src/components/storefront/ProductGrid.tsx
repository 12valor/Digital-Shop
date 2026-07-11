import Link from "next/link";

import { ProductCard } from "@/components/storefront/ProductCard";
import type { StorefrontProduct } from "@/types/storefront";

export function ProductGrid({
  products,
  emptyTitle = "No products found",
  emptyHref = "/products",
}: {
  products: StorefrontProduct[];
  emptyTitle?: string;
  emptyHref?: string;
}) {
  if (products.length === 0) {
    return (
      <div className="border border-zinc-200 bg-white px-4 py-12 text-center">
        <h2 className="text-xl font-black text-zinc-950">{emptyTitle}</h2>
        <p className="mt-2 text-sm text-zinc-600">
          Try another search, remove filters, or browse all active products.
        </p>
        <Link
          href={emptyHref}
          className="mt-5 inline-flex h-10 items-center bg-orange-600 px-4 text-sm font-bold text-white hover:bg-orange-700"
        >
          View all products
        </Link>
      </div>
    );
  }

  return (
    <div className="grid w-full self-start content-start grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
