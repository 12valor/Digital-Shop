import { LogOut, ShieldCheck, ShoppingBag } from "lucide-react";
import Link from "next/link";

import { signOutAction } from "@/app/auth/actions";
import { AccountNavigation } from "@/components/account/AccountNavigation";
import { BrandLogo } from "@/components/shared/BrandLogo";
import { requireAuth } from "@/lib/auth";

export const dynamic = "force-dynamic";

function initials(name: string | null, email: string) {
  const source = name?.trim() || email;
  return source
    .split(/[\s@._-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export default async function AccountLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const profile = await requireAuth("/account");
  const displayName = profile.full_name?.trim() || "Digital shopper";

  return (
    <div className="min-h-screen bg-zinc-100 text-zinc-950">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex min-h-17 max-w-7xl items-center justify-between gap-3 px-4">
          <BrandLogo />
          <div className="flex items-center gap-1 sm:gap-3">
            <Link
              href="/products"
              className="inline-flex h-10 items-center gap-2 px-3 text-sm font-bold text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950"
            >
              <ShoppingBag className="size-4" aria-hidden="true" />
              <span className="hidden sm:inline">Continue shopping</span>
            </Link>
            <form action={signOutAction}>
              <button
                className="inline-flex h-10 items-center gap-2 px-3 text-sm font-bold text-red-700 hover:bg-red-50"
                type="submit"
              >
                <LogOut className="size-4" aria-hidden="true" />
                <span className="hidden sm:inline">Sign out</span>
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="border-b border-blue-800 bg-blue-950 text-white">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-5">
          <div className="grid size-12 shrink-0 place-items-center bg-orange-500 text-sm font-black">
            {initials(profile.full_name, profile.email)}
          </div>
          <div className="min-w-0">
            <p className="truncate text-lg font-black">{displayName}</p>
            <p className="truncate text-xs text-blue-200">{profile.email}</p>
          </div>
          <span className="ml-auto hidden items-center gap-1.5 border border-blue-700 px-3 py-1.5 text-xs font-bold text-blue-100 sm:inline-flex">
            <ShieldCheck className="size-4 text-emerald-400" aria-hidden="true" />
            Verified account
          </span>
        </div>
      </div>

      <main className="mx-auto grid max-w-7xl gap-5 px-4 py-5 md:grid-cols-[230px_minmax(0,1fr)] md:gap-8 md:py-8">
        <aside className="min-w-0 border border-zinc-200 bg-white p-2 md:sticky md:top-5 md:self-start">
          <AccountNavigation />
        </aside>
        <section className="min-w-0">{children}</section>
      </main>

      <footer className="mt-8 border-t border-zinc-200 bg-white px-4 py-6">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 text-xs text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
          <p>Digital Shop account center</p>
          <p>Your profile, addresses, orders, and payment updates stay protected.</p>
        </div>
      </footer>
    </div>
  );
}