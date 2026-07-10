import Link from "next/link";

export default function CartPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-black text-zinc-950">Cart</h1>
      <div className="mt-6 border border-zinc-200 bg-white p-6">
        <p className="text-sm leading-6 text-zinc-700">
          Your cart is empty. Cart state and checkout are scheduled for Phase 3 after the product catalog is active.
        </p>
        <Link
          href="/"
          className="mt-5 inline-flex h-10 items-center bg-orange-600 px-4 text-sm font-bold text-white hover:bg-orange-700"
        >
          Continue browsing
        </Link>
      </div>
    </div>
  );
}
