import Link from "next/link";

import { signOutAction } from "@/app/auth/actions";
import { requireAuth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AccountLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const profile = await requireAuth("/account");

  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="border-b border-zinc-200 bg-white px-4 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <Link href="/" className="font-black text-orange-600">
            Digital Shop
          </Link>
          <form action={signOutAction}>
            <button className="text-sm font-bold text-zinc-700 hover:text-orange-700" type="submit">
              Logout
            </button>
          </form>
        </div>
      </header>
      <main className="mx-auto grid max-w-6xl gap-6 px-4 py-8 md:grid-cols-[220px_1fr]">
        <aside className="border border-zinc-200 bg-white p-4">
          <p className="text-sm font-bold text-zinc-950">{profile.email}</p>
          <p className="mt-1 text-xs uppercase tracking-wide text-orange-700">{profile.role}</p>
          <nav className="mt-5 grid gap-3 text-sm font-semibold text-zinc-700">
            <Link href="/account" className="hover:text-orange-700">
              Profile
            </Link>
            <Link href="/account/orders" className="hover:text-orange-700">
              Orders
            </Link>
            <Link href="/" className="hover:text-orange-700">
              Storefront
            </Link>
          </nav>
        </aside>
        <section>{children}</section>
      </main>
    </div>
  );
}
