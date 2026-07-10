"use client";

import useEmblaCarousel from "embla-carousel-react";
import Link from "next/link";

import { ProductCard } from "@/components/storefront/ProductCard";
import type { StorefrontProduct } from "@/types/storefront";

export function ProductCarousel({
  title,
  href,
  products,
}: {
  title: string;
  href: string;
  products: StorefrontProduct[];
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    dragFree: true,
  });

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="py-5">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-lg font-black text-zinc-950 md:text-2xl">{title}</h2>
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label={`Previous ${title}`}
            onClick={() => emblaApi?.scrollPrev()}
            className="hidden size-9 place-items-center border border-zinc-300 text-lg font-bold md:grid"
          >
            ‹
          </button>
          <button
            type="button"
            aria-label={`Next ${title}`}
            onClick={() => emblaApi?.scrollNext()}
            className="hidden size-9 place-items-center border border-zinc-300 text-lg font-bold md:grid"
          >
            ›
          </button>
          <Link href={href} className="text-sm font-bold text-orange-700 hover:text-orange-800">
            View all
          </Link>
        </div>
      </div>
      <div ref={emblaRef} className="overflow-hidden">
        <div className="-ml-3 flex">
          {products.map((product) => (
            <div
              key={product.id}
              className="min-w-0 flex-[0_0_50%] pl-3 sm:flex-[0_0_33.333%] lg:flex-[0_0_20%]"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
