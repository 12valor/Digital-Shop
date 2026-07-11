"use client";

import { Heart } from "lucide-react";

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
      title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
      className="grid size-8 place-items-center border border-zinc-200 bg-white text-orange-600 transition hover:border-orange-300"
    >
      <Heart className={isWishlisted ? "size-4 fill-current" : "size-4"} aria-hidden="true" />
    </button>
  );
}
