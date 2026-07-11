import { FileLock2, QrCode, ShieldCheck, ShoppingBag } from "lucide-react";
import Link from "next/link";

import type { StorefrontCategory } from "@/types/storefront";

const footerLinkClass =
  "text-sm text-blue-100 transition hover:text-orange-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-400";

export function StorefrontFooter({ categories }: { categories: StorefrontCategory[] }) {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-blue-950 text-white">
      <div className="border-b border-blue-800 bg-orange-500">
        <div className="mx-auto grid max-w-7xl divide-y divide-orange-400 px-4 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          <div className="flex min-h-20 items-center gap-3 py-4 sm:px-5">
            <ShieldCheck className="size-7 shrink-0" aria-hidden="true" />
            <div>
              <p className="text-sm font-black">Server-validated checkout</p>
              <p className="mt-1 text-xs text-orange-950">Prices and stock are confirmed securely.</p>
            </div>
          </div>
          <div className="flex min-h-20 items-center gap-3 py-4 sm:px-5">
            <QrCode className="size-7 shrink-0" aria-hidden="true" />
            <div>
              <p className="text-sm font-black">Manual GCash payment</p>
              <p className="mt-1 text-xs text-orange-950">Pay the exact order total using our fixed QR.</p>
            </div>
          </div>
          <div className="flex min-h-20 items-center gap-3 py-4 sm:px-5">
            <FileLock2 className="size-7 shrink-0" aria-hidden="true" />
            <div>
              <p className="text-sm font-black">Private payment proofs</p>
              <p className="mt-1 text-xs text-orange-950">Receipts stay protected during verification.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_0.8fr_0.9fr_0.9fr] lg:py-12">
        <div className="max-w-sm">
          <Link
            href="/"
            className="inline-flex items-center gap-3 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-400"
            aria-label="Digital Shop home"
          >
            <span className="grid size-11 place-items-center bg-orange-500 text-white">
              <ShoppingBag className="size-6" aria-hidden="true" />
            </span>
            <span className="leading-none">
              <span className="block text-xl font-black">DIGITAL</span>
              <span className="block text-sm font-black text-orange-400">SHOP</span>
            </span>
          </Link>
          <p className="mt-5 text-sm leading-6 text-blue-100">
            A mobile-first marketplace for load, game credits, gift vouchers, and everyday digital essentials.
          </p>
          <p className="mt-4 text-xs leading-5 text-blue-300">
            Orders, totals, payment proofs, and status updates are managed through your secure account.
          </p>
        </div>

        <nav aria-label="Shop links">
          <h2 className="text-sm font-black uppercase text-orange-400">Shop</h2>
          <div className="mt-4 grid gap-3">
            <Link href="/products" className={footerLinkClass}>All products</Link>
            <Link href="/products?discount=sale" className={footerLinkClass}>Deals</Link>
            <Link href="/products?sort=latest" className={footerLinkClass}>New arrivals</Link>
            <Link href="/search" className={footerLinkClass}>Search</Link>
          </div>
        </nav>

        <nav aria-label="Product categories">
          <h2 className="text-sm font-black uppercase text-orange-400">Categories</h2>
          <div className="mt-4 grid gap-3">
            {categories.slice(0, 6).map((category) => (
              <Link
                key={category.id}
                href={`/category/${category.slug}`}
                className={footerLinkClass}
              >
                {category.name}
              </Link>
            ))}
          </div>
        </nav>

        <nav aria-label="Account links">
          <h2 className="text-sm font-black uppercase text-orange-400">Your account</h2>
          <div className="mt-4 grid gap-3">
            <Link href="/account" className={footerLinkClass}>My account</Link>
            <Link href="/account/orders" className={footerLinkClass}>Track orders</Link>
            <Link href="/cart" className={footerLinkClass}>Shopping cart</Link>
            <Link href="/auth/login" className={footerLinkClass}>Sign in</Link>
            <Link href="/auth/register" className={footerLinkClass}>Create account</Link>
          </div>
        </nav>
      </div>

      <div className="border-t border-blue-800 px-4 py-5 text-xs text-blue-300">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {year} Digital Shop. All rights reserved.</p>
          <p>Built with Next.js and Supabase.</p>
        </div>
      </div>
    </footer>
  );
}
