import Link from "next/link";

import type { CatalogFilters as CatalogFiltersType, StorefrontBrand, StorefrontCategory } from "@/types/storefront";

export function CatalogFilters({
  filters,
  categories,
  brands,
  basePath = "/products",
}: {
  filters: CatalogFiltersType;
  categories: StorefrontCategory[];
  brands: StorefrontBrand[];
  basePath?: string;
}) {
  return (
    <form action={basePath} className="grid gap-3 border border-zinc-200 bg-white p-4">
      <div>
        <label htmlFor="catalog-q" className="text-xs font-black uppercase tracking-wide text-zinc-500">
          Search
        </label>
        <input
          id="catalog-q"
          name="q"
          defaultValue={filters.q}
          className="mt-1 h-10 w-full border border-zinc-300 px-3 text-sm outline-none focus:border-orange-500"
          placeholder="Product or keyword"
        />
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-1">
        <label className="grid gap-1 text-xs font-black uppercase tracking-wide text-zinc-500">
          Category
          <select
            name="category"
            defaultValue={filters.category ?? ""}
            className="h-10 border border-zinc-300 bg-white px-2 text-sm font-medium normal-case tracking-normal text-zinc-900"
          >
            <option value="">All categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.slug}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1 text-xs font-black uppercase tracking-wide text-zinc-500">
          Brand
          <select
            name="brand"
            defaultValue={filters.brand ?? ""}
            className="h-10 border border-zinc-300 bg-white px-2 text-sm font-medium normal-case tracking-normal text-zinc-900"
          >
            <option value="">All brands</option>
            {brands.map((brand) => (
              <option key={brand.id} value={brand.slug}>
                {brand.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <label className="grid min-w-0 gap-1 text-xs font-black uppercase tracking-wide text-zinc-500">
          Min price
          <input
            name="min"
            type="number"
            min="0"
            defaultValue={filters.min}
            className="h-10 w-full min-w-0 border border-zinc-300 px-2 text-sm font-medium normal-case tracking-normal text-zinc-900"
          />
        </label>
        <label className="grid min-w-0 gap-1 text-xs font-black uppercase tracking-wide text-zinc-500">
          Max price
          <input
            name="max"
            type="number"
            min="0"
            defaultValue={filters.max}
            className="h-10 w-full min-w-0 border border-zinc-300 px-2 text-sm font-medium normal-case tracking-normal text-zinc-900"
          />
        </label>
      </div>
      <label className="grid gap-1 text-xs font-black uppercase tracking-wide text-zinc-500">
        Availability
        <select
          name="availability"
          defaultValue={filters.availability ?? "all"}
          className="h-10 border border-zinc-300 bg-white px-2 text-sm font-medium normal-case tracking-normal text-zinc-900"
        >
          <option value="all">All stock states</option>
          <option value="in-stock">In stock</option>
          <option value="out-of-stock">Out of stock</option>
        </select>
      </label>
      <label className="grid gap-1 text-xs font-black uppercase tracking-wide text-zinc-500">
        Deals
        <select
          name="discount"
          defaultValue={filters.discount ?? "all"}
          className="h-10 border border-zinc-300 bg-white px-2 text-sm font-medium normal-case tracking-normal text-zinc-900"
        >
          <option value="all">All products</option>
          <option value="sale">Sale only</option>
        </select>
      </label>
      <label className="grid gap-1 text-xs font-black uppercase tracking-wide text-zinc-500">
        Sort
        <select
          name="sort"
          defaultValue={filters.sort ?? "featured"}
          className="h-10 border border-zinc-300 bg-white px-2 text-sm font-medium normal-case tracking-normal text-zinc-900"
        >
          <option value="featured">Featured</option>
          <option value="latest">Latest</option>
          <option value="price-asc">Price: low to high</option>
          <option value="price-desc">Price: high to low</option>
          <option value="discount">Biggest discount</option>
        </select>
      </label>
      <button
        type="submit"
        className="h-10 bg-orange-600 px-4 text-sm font-black text-white hover:bg-orange-700"
      >
        Apply filters
      </button>
      <Link
        href={basePath}
        className="text-center text-sm font-bold text-zinc-700 hover:text-orange-700"
      >
        Reset filters
      </Link>
    </form>
  );
}
