"use client";

import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { useStorefrontStore } from "@/stores/storefront-store";

type Suggestion = {
  label: string;
  href: string;
  type: "product" | "category" | "brand";
};

export function SearchBox({
  id,
  compact = false,
  onSearch,
}: {
  id: string;
  compact?: boolean;
  onSearch?: () => void;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const addRecentSearch = useStorefrontStore((state) => state.addRecentSearch);
  const recentSearches = useStorefrontStore((state) => state.recentSearches);

  const suggestions = useQuery({
    queryKey: ["search-suggestions", query],
    queryFn: async () => {
      const response = await fetch(`/api/search/suggestions?q=${encodeURIComponent(query)}`);
      if (!response.ok) {
        return [] as Suggestion[];
      }

      return (await response.json()) as Suggestion[];
    },
    enabled: query.trim().length >= 2,
  });

  function submitSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = query.trim();

    if (!trimmed) {
      router.push("/search");
      return;
    }

    addRecentSearch(trimmed);
    onSearch?.();
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  }

  return (
    <div className="relative">
      <form onSubmit={submitSearch} role="search" className="flex">
        <label className="sr-only" htmlFor={id}>
          Search products
        </label>
        <input
          id={id}
          name="q"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search products, brands, and categories"
          className={
            compact
              ? "h-11 w-full border border-zinc-300 bg-white px-3 text-sm outline-none focus:border-blue-700"
              : "h-12 w-full border border-zinc-300 bg-white px-4 text-sm outline-none transition focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
          }
        />
        <button
          type="submit"
          aria-label="Search"
          title="Search"
          className={
            compact
              ? "grid size-11 shrink-0 place-items-center bg-orange-500 text-white hover:bg-orange-600"
              : "grid h-12 w-14 shrink-0 place-items-center bg-blue-800 text-white hover:bg-blue-900"
          }
        >
          <Search className="size-5" aria-hidden="true" />
        </button>
      </form>
      {(suggestions.data?.length || recentSearches.length) && query.length > 0 ? (
        <div className="absolute left-0 right-0 top-full z-50 border border-zinc-200 bg-white shadow-lg">
          {suggestions.data?.map((item) => (
            <Link
              key={`${item.type}-${item.href}`}
              href={item.href}
              onClick={onSearch}
              className="flex items-center justify-between border-b border-zinc-100 px-3 py-2 text-sm hover:bg-orange-50"
            >
              <span className="font-semibold text-zinc-800">{item.label}</span>
              <span className="text-xs uppercase tracking-wide text-zinc-500">{item.type}</span>
            </Link>
          ))}
          {recentSearches.length > 0 ? (
            <div className="px-3 py-2">
              <p className="text-xs font-black uppercase tracking-wide text-zinc-500">
                Recent searches
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {recentSearches.map((item) => (
                  <button
                    type="button"
                    key={item}
                    onClick={() => {
                      setQuery(item);
                      router.push(`/search?q=${encodeURIComponent(item)}`);
                      onSearch?.();
                    }}
                    className="border border-zinc-200 px-2 py-1 text-xs font-semibold text-zinc-700 hover:border-orange-300"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
