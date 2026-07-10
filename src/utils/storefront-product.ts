import type { StorefrontProduct } from "@/types/storefront";

export function getProductPrimaryImage(product: StorefrontProduct) {
  return (
    product.images.find((image) => image.isPrimary)?.url ??
    product.images[0]?.url ??
    "/product-art/product-fallback.svg"
  );
}
