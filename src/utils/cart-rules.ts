import type { StorefrontProduct, StorefrontVariant } from "@/types/storefront";

export function getAvailableStock(product: StorefrontProduct, variant?: StorefrontVariant | null) {
  return variant ? variant.stock : product.stock;
}

export function canAddProductToCart(
  product: StorefrontProduct,
  quantity: number,
  variant?: StorefrontVariant | null,
) {
  const stock = getAvailableStock(product, variant);
  return quantity > 0 && stock > 0 && quantity <= stock;
}
