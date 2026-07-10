import { CatalogFilters } from "@/components/storefront/CatalogFilters";
import { CatalogPagination } from "@/components/storefront/CatalogPagination";
import { ProductGrid } from "@/components/storefront/ProductGrid";
import { getCatalogData, parseCatalogSearchParams } from "@/lib/storefront-data";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const filters = parseCatalogSearchParams(params);
  const catalog = await getCatalogData(filters);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <div className="mb-5 flex flex-col justify-between gap-2 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-black uppercase tracking-wide text-orange-700">Catalog</p>
          <h1 className="text-3xl font-black text-zinc-950">All products</h1>
        </div>
        <p className="text-sm font-semibold text-zinc-600">{catalog.total} active products</p>
      </div>
      <div className="grid gap-5 md:grid-cols-[260px_1fr]">
        <CatalogFilters
          filters={filters}
          categories={catalog.categories}
          brands={catalog.brands}
        />
        <div>
          <ProductGrid products={catalog.products} />
          <CatalogPagination
            basePath="/products"
            filters={filters}
            page={catalog.page}
            totalPages={catalog.totalPages}
          />
        </div>
      </div>
    </div>
  );
}
