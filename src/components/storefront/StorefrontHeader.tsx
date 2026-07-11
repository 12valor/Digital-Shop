"use client";

import {
  ChevronRight,
  Menu,
  PackageCheck,
  ShoppingBag,
  UserRound,
  X,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { SearchBox } from "@/components/storefront/SearchBox";
import { CartIndicator } from "@/components/storefront/CartIndicator";
import type { StorefrontCategory } from "@/types/storefront";

export function StorefrontHeader({ categories }: { categories: StorefrontCategory[] }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm">
      <div className="bg-blue-800 px-4 py-2 text-xs font-semibold text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-5 sm:justify-between">
          <p>Fresh digital deals every week</p>
          <div className="hidden items-center gap-5 sm:flex">
            <Link href="/account/orders" className="hover:text-orange-200">Track order</Link>
            <Link href="/auth/register" className="hover:text-orange-200">Create account</Link>
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 md:gap-7 md:py-4">
        <button
          type="button"
          aria-expanded={menuOpen}
          aria-controls="mobile-storefront-menu"
          onClick={() => setMenuOpen((value) => !value)}
          title={menuOpen ? "Close menu" : "Open menu"}
          className="grid size-10 place-items-center text-zinc-900 md:hidden"
        >
          <span className="sr-only">{menuOpen ? "Close menu" : "Open menu"}</span>
          {menuOpen ? <X className="size-6" aria-hidden="true" /> : <Menu className="size-6" aria-hidden="true" />}
        </button>

        <Link href="/" className="flex shrink-0 items-center gap-2" aria-label="Digital Shop home">
          <span className="grid size-10 place-items-center bg-orange-500 text-white">
            <ShoppingBag className="size-6" aria-hidden="true" />
          </span>
          <span className="hidden leading-none sm:block">
            <span className="block text-lg font-black text-blue-900">DIGITAL</span>
            <span className="block text-sm font-black text-orange-500">SHOP</span>
          </span>
        </Link>

        <div className="hidden flex-1 md:block">
          <SearchBox id="site-search" />
        </div>

        <nav className="ml-auto flex items-center gap-4 text-sm font-bold text-zinc-800 md:gap-7">
          <Link href="/account" className="hidden items-center gap-2 hover:text-orange-600 md:flex">
            <UserRound className="size-5" aria-hidden="true" />
            <span>
              <span className="block text-[10px] font-semibold text-zinc-500">Hello, sign in</span>
              <span>My account</span>
            </span>
          </Link>
          <CartIndicator />
        </nav>
      </div>

      <div className="px-4 pb-3 md:hidden">
        <SearchBox id="mobile-header-search" compact />
      </div>

      <nav className="hidden bg-blue-900 text-white md:block">
        <div className="mx-auto flex max-w-7xl items-center gap-7 overflow-x-auto px-4 py-3 text-sm font-bold">
          <Link href="/" className="shrink-0 hover:text-orange-300">Home</Link>
          <Link href="/products" className="shrink-0 hover:text-orange-300">Shop all</Link>
          {categories.map((category) => (
            <Link key={category.id} href={`/category/${category.slug}`} className="shrink-0 hover:text-orange-300">
              {category.name}
            </Link>
          ))}
          <Link href="/products?discount=sale" className="shrink-0 text-orange-300 hover:text-orange-200">Deals</Link>
          <Link href="/products?sort=latest" className="shrink-0 hover:text-orange-300">New arrivals</Link>
        </div>
      </nav>

      {menuOpen ? (
        <div id="mobile-storefront-menu" className="border-t border-zinc-200 bg-white px-4 py-4 shadow-lg md:hidden">
          <div className="grid gap-1 text-sm font-bold text-zinc-800">
            <Link href="/products" onClick={() => setMenuOpen(false)} className="flex items-center justify-between py-3">
              Shop all <ChevronRight className="size-4" aria-hidden="true" />
            </Link>
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/category/${category.slug}`}
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-between border-t border-zinc-100 py-3"
              >
                {category.name} <ChevronRight className="size-4" aria-hidden="true" />
              </Link>
            ))}
            <Link href="/account" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 border-t border-zinc-100 py-3">
              <UserRound className="size-4" aria-hidden="true" /> Account
            </Link>
            <Link href="/account/orders" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 border-t border-zinc-100 py-3">
              <PackageCheck className="size-4" aria-hidden="true" /> Track order
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
