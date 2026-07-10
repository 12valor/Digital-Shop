import { CartClient } from "@/components/storefront/CartClient";

export default function CartPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-3xl font-black text-zinc-950">Cart</h1>
      <div className="mt-6">
        <CartClient />
      </div>
    </div>
  );
}
