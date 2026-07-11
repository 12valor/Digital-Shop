"use client";

import useEmblaCarousel from "embla-carousel-react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

import { ProductCard } from "@/components/storefront/ProductCard";
import type { StorefrontProduct } from "@/types/storefront";

export function ProductCarousel({
  title,
  href,
  products,
  tone = "default",
}: {
  title: string;
  href: string;
  products: StorefrontProduct[];
  tone?: "default" | "sale";
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    dragFree: true,
  });

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="border-b border-zinc-200 bg-white py-7">
      <div className="mx-auto max-w-7xl px-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className={tone === "sale" ? "h-7 w-1.5 bg-orange-500" : "h-7 w-1.5 bg-blue-800"} />
          <h2 className="text-xl font-black text-zinc-950 md:text-2xl">{title}</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label={`Previous ${title}`}
            onClick={() => emblaApi?.scrollPrev()}
            title={`Previous ${title}`}
            className="hidden size-9 place-items-center border border-zinc-300 text-zinc-700 hover:border-blue-700 hover:text-blue-800 md:grid"
          >
            <ChevronLeft className="size-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label={`Next ${title}`}
            onClick={() => emblaApi?.scrollNext()}
            title={`Next ${title}`}
            className="hidden size-9 place-items-center border border-zinc-300 text-zinc-700 hover:border-blue-700 hover:text-blue-800 md:grid"
          >
            <ChevronRight className="size-5" aria-hidden="true" />
          </button>
          <Link href={href} className="flex items-center gap-1 text-sm font-bold text-blue-800 hover:text-orange-600">
            View all <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
      <div ref={emblaRef} className="overflow-hidden">
        <div className="-ml-3 flex">
          {products.map((product) => (
            <div
              key={product.id}
              className="min-w-0 flex-[0_0_72%] pl-3 min-[430px]:flex-[0_0_50%] sm:flex-[0_0_33.333%] lg:flex-[0_0_20%]"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
      </div>
    </section>
  );
}
