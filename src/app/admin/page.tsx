export const dynamic = "force-dynamic";

export default function AdminPage() {
  return (
    <div className="border border-zinc-800 bg-zinc-900 p-6">
      <p className="text-sm font-bold uppercase tracking-wide text-orange-300">Phase 1</p>
      <h1 className="mt-2 text-3xl font-black text-white">Admin access is protected</h1>
      <p className="mt-4 max-w-2xl text-sm leading-6 text-zinc-300">
        Product, inventory, payment, and content management screens are scheduled for Phase 4. This area is already guarded by server-side role checks and Supabase RLS policies.
      </p>
    </div>
  );
}
