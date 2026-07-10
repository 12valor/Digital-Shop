"use client";

import Link from "next/link";

import { useCartStore } from "@/stores/cart-store";

export function CheckoutLink() {
  const items = useCartStore((state) => state.items);

  if (items.length === 0) {
    return null;
  }

  return (
    <Link
      href="/checkout"
      className="mt-4 flex h-11 items-center justify-center bg-orange-600 px-4 text-sm font-black text-white hover:bg-orange-700"
    >
      Checkout
    </Link>
  );
}
