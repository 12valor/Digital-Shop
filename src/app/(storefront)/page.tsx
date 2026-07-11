import { BadgePercent, Headphones, ShieldCheck, Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { HomeHero } from "@/components/storefront/HomeHero";
import { ProductCarousel } from "@/components/storefront/ProductCarousel";
import { RecentlyViewed } from "@/components/storefront/RecentlyViewed";
import { getHomepageData } from "@/lib/storefront-data";

export default async function StorefrontHomePage() {
  const data = await getHomepageData();

  const perks = [
    { icon: Zap, title: "Fast fulfillment", text: "Digital orders handled quickly" },
    { icon: ShieldCheck, title: "Secure checkout", text: "Server-validated order totals" },
    { icon: BadgePercent, title: "Weekly deals", text: "Fresh discounts across categories" },
    { icon: Headphones, title: "Order support", text: "Track every payment and delivery" },
  ];

  return (
    <div className="bg-zinc-100">
      <HomeHero banner={data.banners[0]} categories={data.categories} />

      <section className="border-b border-zinc-200 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-y divide-zinc-200 px-4 md:grid-cols-4 md:divide-y-0">
          {perks.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="flex min-h-24 items-center gap-3 p-4 md:px-5">
                <Icon className="size-7 shrink-0 text-orange-500" aria-hidden="true" />
                <div>
                  <p className="text-sm font-black text-zinc-950">{item.title}</p>
                  <p className="mt-1 text-xs leading-5 text-zinc-500">{item.text}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <ProductCarousel
        title="Flash deals"
        href="/products?discount=sale"
        products={data.saleProducts}
        tone="sale"
      />

      <section className="border-b border-zinc-200 bg-zinc-100 py-6">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 md:grid-cols-2">
          <Link
            href="/category/game-credits"
            className="group relative min-h-48 overflow-hidden bg-blue-900 p-6 text-white"
          >
            <Image
              src="/product-art/game-credits.svg"
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover opacity-30 transition group-hover:scale-105"
            />
            <div className="relative max-w-xs">
              <p className="text-xs font-black uppercase text-orange-300">Play more</p>
              <h2 className="mt-2 text-2xl font-black">Game credits ready when you are</h2>
              <p className="mt-3 text-sm font-bold text-blue-100">Browse game top-ups</p>
            </div>
          </Link>
          <Link
            href="/category/gift-vouchers"
            className="group relative min-h-48 overflow-hidden bg-orange-500 p-6 text-white"
          >
            <Image
              src="/product-art/gift-voucher.svg"
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover opacity-25 transition group-hover:scale-105"
            />
            <div className="relative max-w-xs">
              <p className="text-xs font-black uppercase text-blue-950">Easy gifting</p>
              <h2 className="mt-2 text-2xl font-black">Send a digital gift in minutes</h2>
              <p className="mt-3 text-sm font-bold text-orange-950">Shop gift vouchers</p>
            </div>
          </Link>
        </div>
      </section>

      <ProductCarousel
        title="Featured products"
        href="/products?sort=featured"
        products={data.featuredProducts}
      />
      <ProductCarousel title="New arrivals" href="/products?sort=latest" products={data.newProducts} />
      <ProductCarousel title="Best sellers" href="/products" products={data.bestSellers} />

      <section className="border-b border-zinc-200 bg-white py-8">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-4 flex items-center gap-3">
            <span className="h-7 w-1.5 bg-orange-500" />
            <h2 className="text-xl font-black text-zinc-950 md:text-2xl">Featured brands</h2>
          </div>
          <div className="grid grid-cols-2 border-l border-t border-zinc-200 sm:grid-cols-3 md:grid-cols-5">
            {data.brands.map((brand) => (
              <Link
                key={brand.id}
                href={`/brand/${brand.slug}`}
                className="border-b border-r border-zinc-200 bg-white p-5 text-center text-sm font-black text-zinc-950 hover:bg-orange-50 hover:text-orange-600"
              >
                {brand.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <RecentlyViewed products={data.products} />
    </div>
  );
}
