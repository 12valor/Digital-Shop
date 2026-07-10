import { notFound } from "next/navigation";

import { CatalogFilters } from "@/components/storefront/CatalogFilters";
import { ProductGrid } from "@/components/storefront/ProductGrid";
import {
  getCatalogData,
  getCategoryBySlug,
  parseCatalogSearchParams,
} from "@/lib/storefront-data";

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const filters = {
    ...parseCatalogSearchParams(await searchParams),
    category: slug,
  };
  const catalog = await getCatalogData(filters);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <div className="mb-5">
        <p className="text-sm font-black uppercase tracking-wide text-orange-700">Category</p>
        <h1 className="text-3xl font-black text-zinc-950">{category.name}</h1>
        {category.description ? (
          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-600">{category.description}</p>
        ) : null}
      </div>
      <div className="grid gap-5 md:grid-cols-[260px_1fr]">
        <CatalogFilters
          filters={filters}
          categories={catalog.categories}
          brands={catalog.brands}
          basePath={`/category/${slug}`}
        />
        <ProductGrid products={catalog.products} />
      </div>
    </div>
  );
}
