import { notFound } from "next/navigation";

import { ProductCarousel } from "@/components/storefront/ProductCarousel";
import { ProductGallery } from "@/components/storefront/ProductGallery";
import { ProductPurchasePanel } from "@/components/storefront/ProductPurchasePanel";
import { RecentlyViewedMarker } from "@/components/storefront/RecentlyViewedMarker";
import { getProductBySlug } from "@/lib/storefront-data";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getProductBySlug(slug);

  if (!data) {
    notFound();
  }

  const { product, relatedProducts } = data;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <RecentlyViewedMarker slug={product.slug} />
      <div className="grid gap-6 lg:grid-cols-[520px_1fr]">
        <ProductGallery product={product} />
        <div>
          <p className="text-sm font-black uppercase tracking-wide text-orange-700">
            {product.brand?.name ?? "Digital Shop"}
          </p>
          <h1 className="mt-2 text-3xl font-black leading-tight text-zinc-950 md:text-5xl">
            {product.name}
          </h1>
          <p className="mt-3 text-sm font-semibold text-zinc-500">
            {product.category?.name ?? "Product"}
          </p>
          <div className="mt-5">
            <ProductPurchasePanel product={product} />
          </div>
        </div>
      </div>
      <section className="mt-8 grid gap-5 lg:grid-cols-[1fr_360px]">
        <div className="border border-zinc-200 bg-white p-5">
          <h2 className="text-xl font-black text-zinc-950">Description</h2>
          <p className="mt-3 text-sm leading-7 text-zinc-700">{product.description}</p>
        </div>
        <div className="border border-zinc-200 bg-white p-5">
          <h2 className="text-xl font-black text-zinc-950">Specifications</h2>
          <dl className="mt-3 grid gap-3 text-sm">
            {Object.entries(product.specifications).map(([key, value]) => (
              <div key={key} className="flex justify-between gap-4 border-b border-zinc-100 pb-2">
                <dt className="font-bold text-zinc-500">{key}</dt>
                <dd className="text-right font-semibold text-zinc-900">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
      <div className="mt-8">
        <ProductCarousel title="Related products" href="/products" products={relatedProducts} />
      </div>
    </div>
  );
}
