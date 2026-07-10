import Link from "next/link";

import type { CatalogFilters } from "@/types/storefront";

function pageHref(basePath: string, filters: CatalogFilters, page: number) {
  const params = new URLSearchParams();

  Object.entries({ ...filters, page }).forEach(([key, value]) => {
    if (value && value !== "all" && value !== "featured") {
      params.set(key, String(value));
    }
  });

  const query = params.toString();
  return query ? `${basePath}?${query}` : basePath;
}

export function CatalogPagination({
  basePath,
  filters,
  page,
  totalPages,
}: {
  basePath: string;
  filters: CatalogFilters;
  page: number;
  totalPages: number;
}) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav className="mt-6 flex items-center justify-center gap-2">
      {page > 1 ? (
        <Link
          href={pageHref(basePath, filters, page - 1)}
          className="border border-zinc-300 px-3 py-2 text-sm font-bold hover:border-orange-500"
        >
          Previous
        </Link>
      ) : null}
      <span className="px-3 py-2 text-sm font-bold text-zinc-700">
        Page {page} of {totalPages}
      </span>
      {page < totalPages ? (
        <Link
          href={pageHref(basePath, filters, page + 1)}
          className="border border-zinc-300 px-3 py-2 text-sm font-bold hover:border-orange-500"
        >
          Next
        </Link>
      ) : null}
    </nav>
  );
}
