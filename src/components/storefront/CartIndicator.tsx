"use client";

import Link from "next/link";

import { useCartStore } from "@/stores/cart-store";

export function CartIndicator() {
  const itemCount = useCartStore((state) => state.getItemCount());

  return (
    <Link href="/cart" className="relative hover:text-orange-700">
      Cart
      {itemCount > 0 ? (
        <span className="absolute -right-4 -top-2 grid size-5 place-items-center bg-orange-600 text-[10px] font-black text-white">
          {itemCount}
        </span>
      ) : null}
    </Link>
  );
}
