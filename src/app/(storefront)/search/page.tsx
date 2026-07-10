import { CatalogFilters } from "@/components/storefront/CatalogFilters";
import { ProductGrid } from "@/components/storefront/ProductGrid";
import { getCatalogData, parseCatalogSearchParams } from "@/lib/storefront-data";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const filters = parseCatalogSearchParams(params);
  const catalog = await getCatalogData(filters);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <div className="mb-5">
        <p className="text-sm font-black uppercase tracking-wide text-orange-700">Search</p>
        <h1 className="text-3xl font-black text-zinc-950">
          {filters.q ? `Results for "${filters.q}"` : "Search products"}
        </h1>
        <p className="mt-1 text-sm font-semibold text-zinc-600">
          {catalog.total} matching active products
        </p>
      </div>
      <div className="grid gap-5 md:grid-cols-[260px_1fr]">
        <CatalogFilters
          basePath="/search"
          filters={filters}
          categories={catalog.categories}
          brands={catalog.brands}
        />
        <ProductGrid
          products={catalog.products}
          emptyTitle="No search results"
          emptyHref="/search"
        />
      </div>
    </div>
  );
}
