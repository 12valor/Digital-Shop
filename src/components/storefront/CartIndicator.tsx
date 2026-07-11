"use client";

import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useSyncExternalStore } from "react";

import { useCartStore } from "@/stores/cart-store";

export function CartIndicator() {
  const itemCount = useCartStore((state) => state.getItemCount());
  const hasHydrated = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false,
  );

  return (
    <Link href="/cart" className="relative flex items-center gap-2 hover:text-orange-600">
      <ShoppingCart className="size-5" aria-hidden="true" />
      <span>Cart</span>
      {hasHydrated && itemCount > 0 ? (
        <span className="absolute -right-3 -top-3 grid size-5 place-items-center rounded-full bg-orange-500 text-[10px] font-black text-white">
          {itemCount}
        </span>
      ) : null}
    </Link>
  );
}
