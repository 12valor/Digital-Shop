"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type StorefrontState = {
  wishlistIds: string[];
  recentlyViewedSlugs: string[];
  recentSearches: string[];
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
  addRecentlyViewed: (slug: string) => void;
  addRecentSearch: (query: string) => void;
};

function uniqueLatest(values: string[], value: string, limit: number) {
  return [value, ...values.filter((item) => item !== value)].slice(0, limit);
}

export const useStorefrontStore = create<StorefrontState>()(
  persist(
    (set, get) => ({
      wishlistIds: [],
      recentlyViewedSlugs: [],
      recentSearches: [],
      toggleWishlist: (productId) => {
        set((state) => ({
          wishlistIds: state.wishlistIds.includes(productId)
            ? state.wishlistIds.filter((id) => id !== productId)
            : [productId, ...state.wishlistIds],
        }));
      },
      isWishlisted: (productId) => get().wishlistIds.includes(productId),
      addRecentlyViewed: (slug) => {
        set((state) => ({
          recentlyViewedSlugs: uniqueLatest(state.recentlyViewedSlugs, slug, 8),
        }));
      },
      addRecentSearch: (query) => {
        const trimmed = query.trim();

        if (!trimmed) {
          return;
        }

        set((state) => ({
          recentSearches: uniqueLatest(state.recentSearches, trimmed, 6),
        }));
      },
    }),
    {
      name: "digital-shop-storefront",
    },
  ),
);
