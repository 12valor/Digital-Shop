"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { StorefrontProduct, StorefrontVariant } from "@/types/storefront";
import { canAddProductToCart, getAvailableStock } from "@/utils/cart-rules";

export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  imageUrl: string;
  variantId: string | null;
  variantName: string | null;
  unitPriceCents: number;
  quantity: number;
  stock: number;
};

type CartState = {
  items: CartItem[];
  addItem: (product: StorefrontProduct, imageUrl: string, quantity: number, variant?: StorefrontVariant | null) => boolean;
  removeItem: (key: string) => void;
  updateQuantity: (key: string, quantity: number) => void;
  getItemCount: () => number;
  getSubtotalCents: () => number;
};

export function getCartItemKey(productId: string, variantId: string | null) {
  return `${productId}:${variantId ?? "default"}`;
}

function clampQuantity(quantity: number, stock: number) {
  return Math.max(1, Math.min(quantity, Math.max(1, stock)));
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, imageUrl, quantity, variant = null) => {
        const stock = getAvailableStock(product, variant);

        if (!canAddProductToCart(product, quantity, variant)) {
          return false;
        }

        const key = getCartItemKey(product.id, variant?.id ?? null);
        const unitPriceCents =
          variant?.salePriceCents ??
          variant?.priceCents ??
          product.salePriceCents ??
          product.priceCents;

        set((state) => {
          const existing = state.items.find(
            (item) => getCartItemKey(item.productId, item.variantId) === key,
          );

          if (existing) {
            return {
              items: state.items.map((item) =>
                getCartItemKey(item.productId, item.variantId) === key
                  ? {
                      ...item,
                      quantity: clampQuantity(item.quantity + quantity, stock),
                      stock,
                    }
                  : item,
              ),
            };
          }

          return {
            items: [
              {
                productId: product.id,
                slug: product.slug,
                name: product.name,
                imageUrl,
                variantId: variant?.id ?? null,
                variantName: variant?.name ?? null,
                unitPriceCents,
                quantity: clampQuantity(quantity, stock),
                stock,
              },
              ...state.items,
            ],
          };
        });

        return true;
      },
      removeItem: (key) => {
        set((state) => ({
          items: state.items.filter(
            (item) => getCartItemKey(item.productId, item.variantId) !== key,
          ),
        }));
      },
      updateQuantity: (key, quantity) => {
        set((state) => ({
          items: state.items.map((item) =>
            getCartItemKey(item.productId, item.variantId) === key
              ? { ...item, quantity: clampQuantity(quantity, item.stock) }
              : item,
          ),
        }));
      },
      getItemCount: () => get().items.reduce((total, item) => total + item.quantity, 0),
      getSubtotalCents: () =>
        get().items.reduce((total, item) => total + item.quantity * item.unitPriceCents, 0),
    }),
    {
      name: "digital-shop-cart",
    },
  ),
);
