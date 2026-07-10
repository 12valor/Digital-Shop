import Link from "next/link";

export default function StorefrontHomePage() {
  return (
    <div className="bg-white">
      <section className="border-b border-orange-100 bg-orange-50">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-10 md:grid-cols-[1.1fr_0.9fr] md:items-center md:py-14">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-wide text-orange-700">
              Phase 1 storefront shell
            </p>
            <h1 className="mt-3 text-4xl font-black leading-tight text-zinc-950 md:text-6xl">
              A marketplace foundation ready for products.
            </h1>
            <p className="mt-4 text-base leading-7 text-zinc-700 md:text-lg">
              Authentication, roles, route protection, starter data tables, and RLS are in place before catalog work begins.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/auth/register"
                className="inline-flex h-11 items-center justify-center bg-orange-600 px-5 text-sm font-bold text-white transition hover:bg-orange-700"
              >
                Create account
              </Link>
              <Link
                href="/auth/login"
                className="inline-flex h-11 items-center justify-center border border-zinc-300 bg-white px-5 text-sm font-bold text-zinc-950 transition hover:border-zinc-950"
              >
                Sign in
              </Link>
            </div>
          </div>
          <div className="grid border border-orange-200 bg-white p-4 shadow-sm">
            <div className="border-b border-zinc-200 pb-3 text-sm font-bold text-zinc-900">
              Storefront readiness
            </div>
            <div className="grid divide-y divide-zinc-200 text-sm">
              {["Supabase Auth", "Customer account routes", "Staff/admin protection", "Public product RLS"].map(
                (item) => (
                  <div key={item} className="flex items-center justify-between py-3">
                    <span>{item}</span>
                    <span className="font-bold text-emerald-700">Ready</span>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      </section>
      <section className="mx-auto grid max-w-7xl gap-4 px-4 py-8 md:grid-cols-4">
        {["Categories", "Brands", "Products", "Banners"].map((item) => (
          <div key={item} className="border border-zinc-200 bg-white p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-orange-700">Schema</p>
            <h2 className="mt-2 text-lg font-bold text-zinc-950">{item}</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-600">
              Ready for dynamic storefront data in Phase 2.
            </p>
          </div>
        ))}
      </section>
    </div>
  );
}
