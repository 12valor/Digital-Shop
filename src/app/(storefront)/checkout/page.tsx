import { CheckoutForm } from "@/components/forms/CheckoutForm";
import { requireAuth } from "@/lib/auth";
import { hasSupabasePublicEnv } from "@/lib/env";

export const dynamic = "force-dynamic";

export default async function CheckoutPage() {
  if (!hasSupabasePublicEnv()) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8">
        <div className="border border-orange-200 bg-orange-50 p-6">
          <p className="text-sm font-black uppercase tracking-wide text-orange-700">
            Supabase setup required
          </p>
          <h1 className="mt-2 text-2xl font-black text-zinc-950">
            Checkout needs authentication and database credentials
          </h1>
          <p className="mt-3 text-sm leading-6 text-zinc-700">
            Copy `.env.example` to `.env.local`, add your Supabase values, run the migrations, then sign in to create a server-validated order.
          </p>
        </div>
      </div>
    );
  }

  const profile = await requireAuth("/checkout");

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6">
        <p className="text-sm font-black uppercase tracking-wide text-orange-700">Checkout</p>
        <h1 className="text-3xl font-black text-zinc-950">Create pending order</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-600">
          Product prices, discounts, shipping, stock, and final totals are recalculated on the server before your order is saved.
        </p>
      </div>
      <CheckoutForm email={profile.email} />
    </div>
  );
}
