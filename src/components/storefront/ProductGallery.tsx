"use client";

import Image from "next/image";
import { useState } from "react";

import type { StorefrontProduct } from "@/types/storefront";

export function ProductGallery({ product }: { product: StorefrontProduct }) {
  const [activeImage, setActiveImage] = useState(product.images[0]);

  return (
    <div>
      <div className="relative aspect-square overflow-hidden border border-zinc-200 bg-zinc-100">
        <Image
          src={activeImage?.url ?? "/product-art/product-fallback.svg"}
          alt={activeImage?.alt ?? product.name}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 520px"
          className="object-cover"
        />
      </div>
      {product.images.length > 1 ? (
        <div className="mt-3 grid grid-cols-5 gap-2">
          {product.images.map((image) => (
            <button
              type="button"
              key={image.id}
              onClick={() => setActiveImage(image)}
              className="relative aspect-square border border-zinc-200 bg-zinc-100"
            >
              <Image src={image.url} alt={image.alt} fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
