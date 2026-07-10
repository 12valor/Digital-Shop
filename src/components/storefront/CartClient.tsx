"use client";

import Image from "next/image";
import Link from "next/link";

import { formatPeso } from "@/lib/format";
import { getCartItemKey, useCartStore } from "@/stores/cart-store";
import { CheckoutLink } from "@/components/storefront/CheckoutLink";

export function CartClient() {
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const subtotal = useCartStore((state) => state.getSubtotalCents());

  if (items.length === 0) {
    return (
      <div className="border border-zinc-200 bg-white p-6">
        <p className="text-sm leading-6 text-zinc-700">
          Your cart is empty. Add products from the storefront to review them here.
        </p>
        <Link
          href="/products"
          className="mt-5 inline-flex h-10 items-center bg-orange-600 px-4 text-sm font-bold text-white hover:bg-orange-700"
        >
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
      <div className="grid gap-3">
        {items.map((item) => {
          const key = getCartItemKey(item.productId, item.variantId);

          return (
            <article key={key} className="grid grid-cols-[88px_1fr] gap-3 border border-zinc-200 bg-white p-3">
              <div className="relative aspect-square overflow-hidden bg-zinc-100">
                <Image src={item.imageUrl} alt={item.name} fill sizes="88px" className="object-cover" />
              </div>
              <div className="min-w-0">
                <Link href={`/product/${item.slug}`} className="font-black text-zinc-950 hover:text-orange-700">
                  {item.name}
                </Link>
                {item.variantName ? (
                  <p className="mt-1 text-xs font-semibold text-zinc-500">{item.variantName}</p>
                ) : null}
                <p className="mt-2 text-sm font-black text-orange-600">
                  {formatPeso(item.unitPriceCents)}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <input
                    aria-label={`Quantity for ${item.name}`}
                    type="number"
                    min="1"
                    max={Math.max(1, item.stock)}
                    value={item.quantity}
                    onChange={(event) => updateQuantity(key, Number(event.target.value))}
                    className="h-9 w-20 border border-zinc-300 px-2 text-sm font-bold"
                  />
                  <button
                    type="button"
                    onClick={() => removeItem(key)}
                    className="text-sm font-bold text-red-600 hover:text-red-700"
                  >
                    Remove
                  </button>
                  {item.quantity >= item.stock ? (
                    <span className="text-xs font-bold text-red-600">Stock limit reached</span>
                  ) : null}
                </div>
              </div>
            </article>
          );
        })}
      </div>
      <aside className="h-fit border border-zinc-200 bg-white p-4">
        <h2 className="text-lg font-black text-zinc-950">Cart subtotal</h2>
        <div className="mt-4 flex items-center justify-between border-t border-zinc-200 pt-4">
          <span className="text-sm font-bold text-zinc-700">Subtotal</span>
          <span className="text-xl font-black text-orange-600">{formatPeso(subtotal)}</span>
        </div>
        <p className="mt-4 text-sm leading-6 text-zinc-600">
          Checkout recalculates product prices, stock, shipping, and totals on the server.
        </p>
        <CheckoutLink />
      </aside>
    </div>
  );
}
