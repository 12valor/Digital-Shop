import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Zap } from "lucide-react";

import type { HomepageBanner, StorefrontCategory } from "@/types/storefront";

export function HomeHero({
  banner,
  categories,
}: {
  banner: HomepageBanner;
  categories: StorefrontCategory[];
}) {
  return (
    <section className="border-b border-zinc-200 bg-zinc-100">
      <div className="mx-auto max-w-7xl px-0 sm:px-4 sm:py-5">
        <div className="relative min-h-[430px] overflow-hidden bg-blue-900 sm:min-h-[390px]">
          <Image
            src={banner.imageUrl}
            alt=""
            fill
            priority
            sizes="(max-width: 1280px) 100vw, 1280px"
            className="object-cover object-[62%_center] sm:object-center"
          />
          <div className="absolute inset-0 bg-blue-950/45 sm:bg-transparent" aria-hidden="true" />
          <div className="relative flex min-h-[430px] max-w-xl flex-col justify-center px-5 py-10 text-white sm:min-h-[390px] sm:px-10 md:px-14">
            <p className="flex items-center gap-2 text-xs font-black uppercase text-orange-300">
              <Zap className="size-4 fill-current" aria-hidden="true" /> Today&apos;s digital marketplace
            </p>
            <h1 className="mt-3 text-4xl font-black leading-tight sm:text-5xl md:text-6xl">
              {banner.title}
            </h1>
            <p className="mt-4 max-w-md text-sm leading-6 text-blue-50 sm:text-base">
              {banner.subtitle}
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href={banner.href}
                className="inline-flex h-12 items-center gap-2 bg-orange-500 px-6 text-sm font-black text-white hover:bg-orange-600"
              >
                Shop deals <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
              <Link
                href="/products"
                className="inline-flex h-12 items-center border border-white bg-white px-6 text-sm font-black text-blue-950 hover:bg-blue-50"
              >
                All products
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase text-orange-600">Browse faster</p>
            <h2 className="mt-1 text-xl font-black text-zinc-950">Shop by category</h2>
          </div>
          <Link href="/products" className="text-sm font-bold text-blue-800 hover:text-orange-600">
            View all
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {categories.map((category, index) => (
            <Link
              key={category.id}
              href={`/category/${category.slug}`}
              className="group flex min-h-28 min-w-0 flex-col items-center justify-center gap-2 border border-zinc-200 bg-white p-3 text-center hover:border-orange-400 sm:min-h-24 sm:flex-row sm:justify-start sm:gap-3 sm:text-left"
            >
              <span className="relative size-14 shrink-0 overflow-hidden bg-zinc-100">
                <Image
                  src={category.imageUrl || "/product-art/product-fallback.svg"}
                  alt=""
                  fill
                  loading={index === 0 ? "eager" : "lazy"}
                  sizes="56px"
                  className="object-cover transition group-hover:scale-105"
                />
              </span>
              <span className="min-w-0 break-words text-xs font-black text-zinc-900 group-hover:text-orange-600 sm:text-sm">
                {category.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
