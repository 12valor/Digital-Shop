import { MdArrowBack, MdStorage } from "react-icons/md";
import Link from "next/link";

import { AdminShell } from "@/components/admin/AdminShell";
import { BrandLogo } from "@/components/shared/BrandLogo";
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
      <div className="grid min-h-screen place-items-center bg-[#f6f8fb] px-4 py-10 text-slate-950">
        <div className="w-full max-w-xl rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <BrandLogo />
          <span className="mt-8 grid size-12 place-items-center rounded-lg bg-orange-50 text-orange-600">
            <MdStorage className="size-6" aria-hidden="true" />
          </span>
          <p className="mt-5 text-xs font-black uppercase text-orange-600">Supabase setup required</p>
          <h1 className="mt-2 text-2xl font-black">Connect the admin workspace</h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Add the local environment file, apply the migrations, and create an administrator account before opening the protected admin tools.
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex h-10 items-center gap-2 rounded-md bg-blue-700 px-4 text-sm font-black text-white transition hover:bg-blue-800"
          >
            <MdArrowBack className="size-5" aria-hidden="true" /> Back to storefront
          </Link>
        </div>
      </div>
    );
  }

  const profile = await requireAdminArea("/admin");

  return (
    <AdminShell email={profile.email} role={profile.role}>
      {children}
    </AdminShell>
  );
}