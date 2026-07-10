"use client";

import Link from "next/link";
import { useState } from "react";

const categories = ["Load", "Game Credits", "Vouchers", "Accessories"];

export function StorefrontHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-orange-100 bg-white">
      <div className="bg-zinc-950 px-4 py-2 text-center text-xs font-medium text-white">
        Phase 1 foundation is active: accounts and secure routes are ready.
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
        <form action="/" role="search" className="hidden flex-1 md:block">
          <label className="sr-only" htmlFor="site-search">
            Search products
          </label>
          <input
            id="site-search"
            name="q"
            placeholder="Search products, brands, and categories"
            className="h-11 w-full border border-orange-200 bg-orange-50/70 px-4 text-sm outline-none transition focus:border-orange-500 focus:bg-white focus:ring-2 focus:ring-orange-100"
          />
        </form>
        <nav className="ml-auto hidden items-center gap-5 text-sm font-semibold text-zinc-800 md:flex">
          <Link href="/account" className="hover:text-orange-700">
            Account
          </Link>
          <Link href="/cart" className="hover:text-orange-700">
            Cart
          </Link>
        </nav>
      </div>
      <nav className="hidden border-t border-orange-100 md:block">
        <div className="mx-auto flex max-w-7xl gap-6 overflow-x-auto px-4 py-2 text-sm font-medium text-zinc-700">
          {categories.map((category) => (
            <Link key={category} href="/" className="shrink-0 hover:text-orange-700">
              {category}
            </Link>
          ))}
        </div>
      </nav>
      {menuOpen ? (
        <div id="mobile-storefront-menu" className="border-t border-orange-100 bg-white px-4 py-4 md:hidden">
          <form action="/" role="search">
            <label className="sr-only" htmlFor="mobile-site-search">
              Search products
            </label>
            <input
              id="mobile-site-search"
              name="q"
              placeholder="Search products"
              className="h-11 w-full border border-orange-200 bg-orange-50 px-3 text-sm outline-none focus:border-orange-500"
            />
          </form>
          <div className="mt-4 grid gap-3 text-sm font-semibold text-zinc-800">
            {categories.map((category) => (
              <Link key={category} href="/" onClick={() => setMenuOpen(false)}>
                {category}
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
