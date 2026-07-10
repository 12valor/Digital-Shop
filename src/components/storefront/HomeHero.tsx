import Image from "next/image";
import Link from "next/link";

import type { HomepageBanner, StorefrontCategory } from "@/types/storefront";

export function HomeHero({
  banner,
  categories,
}: {
  banner: HomepageBanner;
  categories: StorefrontCategory[];
}) {
  return (
    <section className="border-b border-orange-100 bg-orange-50">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 md:grid-cols-[1.1fr_0.9fr] md:items-center md:py-8">
        <div>
          <p className="text-sm font-black uppercase tracking-wide text-orange-700">
            Digital marketplace
          </p>
          <h1 className="mt-3 max-w-2xl text-4xl font-black leading-tight text-zinc-950 md:text-6xl">
            {banner.title}
          </h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-zinc-700 md:text-lg">
            {banner.subtitle}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={banner.href}
              className="inline-flex h-11 items-center bg-orange-600 px-5 text-sm font-black text-white hover:bg-orange-700"
            >
              Shop deals
            </Link>
            <Link
              href="/products"
              className="inline-flex h-11 items-center border border-zinc-300 bg-white px-5 text-sm font-black text-zinc-950 hover:border-zinc-950"
            >
              All products
            </Link>
          </div>
        </div>
        <div className="relative aspect-[16/10] overflow-hidden border border-orange-200 bg-white">
          <Image
            src={banner.imageUrl}
            alt={banner.title}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 48vw"
            className="object-cover"
          />
        </div>
      </div>
      <div className="mx-auto flex max-w-7xl gap-3 overflow-x-auto px-4 pb-5">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/category/${category.slug}`}
            className="shrink-0 border border-orange-200 bg-white px-4 py-3 text-sm font-black text-zinc-900 hover:border-orange-500"
          >
            {category.name}
          </Link>
        ))}
      </div>
    </section>
  );
}
