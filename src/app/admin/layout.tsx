import Link from "next/link";

import { requireAdminArea } from "@/lib/auth";
import { hasSupabasePublicEnv } from "@/lib/env";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  if (!hasSupabasePublicEnv()) {
    return (
      <div className="min-h-screen bg-zinc-950 px-4 py-10 text-white">
        <div className="mx-auto max-w-3xl border border-orange-800 bg-zinc-900 p-6">
          <p className="text-sm font-black uppercase tracking-wide text-orange-300">
            Supabase setup required
          </p>
          <h1 className="mt-2 text-2xl font-black">Admin needs database credentials</h1>
          <p className="mt-3 text-sm leading-6 text-zinc-300">
            Add `.env.local`, run the migrations, create an administrator account, then return to `/admin`.
          </p>
          <Link href="/" className="mt-5 inline-flex text-sm font-bold text-orange-300">
            Back to storefront
          </Link>
        </div>
      </div>
    );
  }

  const profile = await requireAdminArea("/admin");

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <header className="border-b border-zinc-800 px-4 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <Link href="/admin" className="font-black text-orange-400">
            Digital Shop Admin
          </Link>
          <div className="text-right text-xs text-zinc-300">
            <p className="font-semibold text-white">{profile.email}</p>
            <p className="uppercase tracking-wide">{profile.role}</p>
          </div>
        </div>
      </header>
      <main className="mx-auto grid max-w-7xl gap-6 px-4 py-8 md:grid-cols-[240px_1fr]">
        <aside className="border border-zinc-800 bg-zinc-900 p-4">
          <nav className="grid gap-3 text-sm font-semibold text-zinc-300">
            <Link href="/admin" className="hover:text-orange-300">
              Overview
            </Link>
            <Link href="/admin/products" className="hover:text-orange-300">
              Products
            </Link>
            <Link href="/admin/inventory" className="hover:text-orange-300">
              Inventory
            </Link>
            <Link href="/admin/payments" className="hover:text-orange-300">
              Payments
            </Link>
            <Link href="/admin/orders" className="hover:text-orange-300">
              Orders
            </Link>
            <Link href="/admin/homepage" className="hover:text-orange-300">
              Homepage
            </Link>
            <Link href="/" className="hover:text-orange-300">
              Storefront
            </Link>
          </nav>
        </aside>
        <section>{children}</section>
      </main>
    </div>
  );
}
