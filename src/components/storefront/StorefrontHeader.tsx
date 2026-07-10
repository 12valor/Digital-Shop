"use client";

import Link from "next/link";
import { useState } from "react";

import { SearchBox } from "@/components/storefront/SearchBox";
import { CartIndicator } from "@/components/storefront/CartIndicator";
import type { StorefrontCategory } from "@/types/storefront";

export function StorefrontHeader({ categories }: { categories: StorefrontCategory[] }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-orange-100 bg-white">
      <div className="bg-zinc-950 px-4 py-2 text-center text-xs font-medium text-white">
        New deals every week. Manual GCash checkout arrives in Phase 3.
      </div>
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3">
        <button
          type="button"
          aria-expanded={menuOpen}
          aria-controls="mobile-storefront-menu"
          onClick={() => setMenuOpen((value) => !value)}
          className="grid size-10 place-items-center border border-zinc-300 text-zinc-800 md:hidden"
        >
          <span className="sr-only">Open menu</span>
          <span className="text-xl leading-none">{menuOpen ? "x" : "="}</span>
        </button>
        <Link href="/" className="shrink-0 text-lg font-black tracking-tight text-orange-600">
          Digital Shop
        </Link>
        <div className="hidden flex-1 md:block">
          <SearchBox id="site-search" />
        </div>
        <nav className="ml-auto hidden items-center gap-5 text-sm font-semibold text-zinc-800 md:flex">
          <Link href="/account" className="hover:text-orange-700">
            Account
          </Link>
          <CartIndicator />
        </nav>
      </div>
      <nav className="hidden border-t border-orange-100 md:block">
        <div className="mx-auto flex max-w-7xl gap-6 overflow-x-auto px-4 py-2 text-sm font-medium text-zinc-700">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/category/${category.slug}`}
              className="shrink-0 hover:text-orange-700"
            >
              {category.name}
            </Link>
          ))}
        </div>
      </nav>
      {menuOpen ? (
        <div id="mobile-storefront-menu" className="border-t border-orange-100 bg-white px-4 py-4 md:hidden">
          <SearchBox id="mobile-site-search" compact onSearch={() => setMenuOpen(false)} />
          <div className="mt-4 grid gap-3 text-sm font-semibold text-zinc-800">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/category/${category.slug}`}
                onClick={() => setMenuOpen(false)}
              >
                {category.name}
              </Link>
            ))}
            <Link href="/account" onClick={() => setMenuOpen(false)}>
              Account
            </Link>
            <Link href="/cart" onClick={() => setMenuOpen(false)}>
              Cart
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
