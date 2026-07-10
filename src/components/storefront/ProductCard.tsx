"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";

import { formatPeso, getDiscountPercent } from "@/lib/format";
import type { StorefrontProduct } from "@/types/storefront";
import { WishlistButton } from "@/components/storefront/WishlistButton";
import { getProductPrimaryImage } from "@/utils/storefront-product";

export function ProductCard({ product }: { product: StorefrontProduct }) {
  const currentPrice = product.salePriceCents ?? product.priceCents;
  const discount = getDiscountPercent(product.priceCents, product.salePriceCents);
  const imageUrl = getProductPrimaryImage(product);

  return (
    <motion.article
      whileHover={{ y: -2 }}
      transition={{ duration: 0.18 }}
      className="group relative flex h-full flex-col border border-zinc-200 bg-white transition hover:border-orange-300 hover:shadow-sm"
    >
      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-zinc-100">
          <Image
            src={imageUrl}
            alt={product.images[0]?.alt ?? product.name}
            fill
            loading="eager"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 220px"
            className="object-cover transition duration-300 group-hover:scale-105"
          />
          {product.badge ? (
            <span className="absolute left-2 top-2 bg-orange-600 px-2 py-1 text-[11px] font-black uppercase tracking-wide text-white">
              {product.badge}
            </span>
          ) : null}
          {discount > 0 ? (
            <span className="absolute right-2 top-2 bg-zinc-950 px-2 py-1 text-[11px] font-black text-white">
              -{discount}%
            </span>
          ) : null}
        </div>
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate text-xs font-bold uppercase tracking-wide text-zinc-500">
              {product.brand?.name ?? "Digital Shop"}
            </p>
            <Link
              href={`/product/${product.slug}`}
              className="mt-1 line-clamp-2 text-sm font-bold leading-5 text-zinc-950 hover:text-orange-700"
            >
              {product.name}
            </Link>
          </div>
          <WishlistButton productId={product.id} productName={product.name} />
        </div>
        <div className="mt-auto">
          <div className="flex flex-wrap items-baseline gap-2">
            <p className="text-lg font-black text-orange-600">{formatPeso(currentPrice)}</p>
            {product.salePriceCents ? (
              <p className="text-xs font-semibold text-zinc-400 line-through">
                {formatPeso(product.priceCents)}
              </p>
            ) : null}
          </div>
          <p
            className={
              product.stock > 0
                ? "mt-1 text-xs font-semibold text-emerald-700"
                : "mt-1 text-xs font-semibold text-red-600"
            }
          >
            {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
          </p>
        </div>
      </div>
    </motion.article>
  );
}
