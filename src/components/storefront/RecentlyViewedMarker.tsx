"use client";

import { useEffect } from "react";

import { useStorefrontStore } from "@/stores/storefront-store";

export function RecentlyViewedMarker({ slug }: { slug: string }) {
  const addRecentlyViewed = useStorefrontStore((state) => state.addRecentlyViewed);

  useEffect(() => {
    addRecentlyViewed(slug);
  }, [addRecentlyViewed, slug]);

  return null;
}
