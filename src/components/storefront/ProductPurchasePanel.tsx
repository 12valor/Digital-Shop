"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { formatPeso } from "@/lib/format";
import { useCartStore } from "@/stores/cart-store";
import type { StorefrontProduct } from "@/types/storefront";
import { getProductPrimaryImage } from "@/utils/storefront-product";

export function ProductPurchasePanel({ product }: { product: StorefrontProduct }) {
  const router = useRouter();
  const [selectedVariantId, setSelectedVariantId] = useState(
    product.variants.find((variant) => variant.stock > 0)?.id ?? product.variants[0]?.id ?? "",
  );
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");
  const addItem = useCartStore((state) => state.addItem);

  const selectedVariant = useMemo(
    () => product.variants.find((variant) => variant.id === selectedVariantId) ?? null,
    [product.variants, selectedVariantId],
  );
  const stock = selectedVariant ? selectedVariant.stock : product.stock;
  const price =
    selectedVariant?.salePriceCents ??
    selectedVariant?.priceCents ??
    product.salePriceCents ??
    product.priceCents;
  const imageUrl = getProductPrimaryImage(product);

  function addToCart(redirectToCart: boolean) {
    const added = addItem(product, imageUrl, quantity, selectedVariant);

    if (!added) {
      setMessage("This product is out of stock.");
      return;
    }

    setMessage("Added to cart.");

    if (redirectToCart) {
      router.push("/cart");
    }
  }

  return (
    <div className="border border-zinc-200 bg-white p-4">
      <p className="text-3xl font-black text-orange-600">{formatPeso(price)}</p>
      {product.salePriceCents ? (
        <p className="mt-1 text-sm font-semibold text-zinc-400 line-through">
          {formatPeso(product.priceCents)}
        </p>
      ) : null}
      <p
        className={
          stock > 0
            ? "mt-3 text-sm font-bold text-emerald-700"
            : "mt-3 text-sm font-bold text-red-600"
        }
      >
        {stock > 0 ? `${stock} available` : "Out of stock"}
      </p>
      {product.variants.length > 0 ? (
        <fieldset className="mt-5">
          <legend className="text-sm font-black text-zinc-950">Variant</legend>
          <div className="mt-2 grid gap-2">
            {product.variants.map((variant) => (
              <label
                key={variant.id}
                className="flex cursor-pointer items-center justify-between border border-zinc-200 px-3 py-2 text-sm font-semibold has-[:checked]:border-orange-500 has-[:checked]:bg-orange-50"
              >
                <span>
                  {variant.name}
                  {variant.stock <= 0 ? (
                    <span className="ml-2 text-xs text-red-600">Out of stock</span>
                  ) : null}
                </span>
                <input
                  type="radio"
                  name="variant"
                  value={variant.id}
                  checked={selectedVariantId === variant.id}
                  onChange={() => setSelectedVariantId(variant.id)}
                />
              </label>
            ))}
          </div>
        </fieldset>
      ) : null}
      <div className="mt-5">
        <label className="text-sm font-black text-zinc-950" htmlFor="quantity">
          Quantity
        </label>
        <div className="mt-2 flex w-36 border border-zinc-300">
          <button
            type="button"
            onClick={() => setQuantity((value) => Math.max(1, value - 1))}
            className="size-10 text-lg font-black"
          >
            -
          </button>
          <input
            id="quantity"
            type="number"
            min="1"
            max={Math.max(1, stock)}
            value={quantity}
            onChange={(event) => {
              const next = Number(event.target.value);
              setQuantity(Number.isFinite(next) ? Math.max(1, Math.min(next, Math.max(1, stock))) : 1);
            }}
            className="h-10 w-14 border-x border-zinc-300 text-center text-sm font-bold outline-none"
          />
          <button
            type="button"
            onClick={() => setQuantity((value) => Math.min(Math.max(1, stock), value + 1))}
            className="size-10 text-lg font-black"
          >
            +
          </button>
        </div>
      </div>
      {message ? <p className="mt-3 text-sm font-semibold text-zinc-700">{message}</p> : null}
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          disabled={stock <= 0}
          onClick={() => addToCart(false)}
          className="h-11 border border-orange-600 bg-white px-4 text-sm font-black text-orange-700 disabled:cursor-not-allowed disabled:border-zinc-300 disabled:text-zinc-400"
        >
          Add to cart
        </button>
        <button
          type="button"
          disabled={stock <= 0}
          onClick={() => addToCart(true)}
          className="h-11 bg-orange-600 px-4 text-sm font-black text-white hover:bg-orange-700 disabled:cursor-not-allowed disabled:bg-zinc-300"
        >
          Buy now
        </button>
      </div>
    </div>
  );
}
