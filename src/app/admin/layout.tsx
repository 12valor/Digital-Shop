import Link from "next/link";

import { requireAdminArea } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
