import { HomeHero } from "@/components/storefront/HomeHero";
import { ProductCarousel } from "@/components/storefront/ProductCarousel";
import { RecentlyViewed } from "@/components/storefront/RecentlyViewed";
import { getHomepageData } from "@/lib/storefront-data";

export default async function StorefrontHomePage() {
  const data = await getHomepageData();

  return (
    <div className="bg-white">
      <HomeHero banner={data.banners[0]} categories={data.categories} />
      <div className="mx-auto max-w-7xl px-4 py-5">
        <ProductCarousel title="Flash deals" href="/products?discount=sale" products={data.saleProducts} />
        <ProductCarousel title="Featured products" href="/products?sort=featured" products={data.featuredProducts} />
        <ProductCarousel title="New arrivals" href="/products?sort=latest" products={data.newProducts} />
        <ProductCarousel title="Best sellers" href="/products" products={data.bestSellers} />
        <section className="py-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-black text-zinc-950 md:text-2xl">Featured brands</h2>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
            {data.brands.map((brand) => (
              <a
                key={brand.id}
                href={`/brand/${brand.slug}`}
                className="border border-zinc-200 bg-white p-4 text-center text-sm font-black text-zinc-950 hover:border-orange-400"
              >
                {brand.name}
              </a>
            ))}
          </div>
        </section>
        <RecentlyViewed products={data.products} />
      </div>
    </div>
  );
}
