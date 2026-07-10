"use client";

import { useStorefrontStore } from "@/stores/storefront-store";

export function WishlistButton({
  productId,
  productName,
}: {
  productId: string;
  productName: string;
}) {
  const isWishlisted = useStorefrontStore((state) => state.isWishlisted(productId));
  const toggleWishlist = useStorefrontStore((state) => state.toggleWishlist);

  return (
    <button
      type="button"
      onClick={() => toggleWishlist(productId)}
      aria-pressed={isWishlisted}
      aria-label={
        isWishlisted ? `Remove ${productName} from wishlist` : `Add ${productName} to wishlist`
      }
      className="grid size-9 place-items-center border border-zinc-200 bg-white text-lg font-black text-orange-600 shadow-sm transition hover:border-orange-300"
    >
      {isWishlisted ? "♥" : "♡"}
    </button>
  );
}
