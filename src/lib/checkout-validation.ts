import type { CheckoutCartItemInput, ValidatedCheckout } from "@/types/checkout";
import type { StorefrontProduct, StorefrontVariant } from "@/types/storefront";
import { getProductPrimaryImage } from "@/utils/storefront-product";

export const DEFAULT_SHIPPING_CENTS = 5900;

function getVariant(product: StorefrontProduct, variantId: string | null) {
  if (!variantId) {
    return null;
  }

  return product.variants.find((variant) => variant.id === variantId) ?? null;
}

function getUnitPrice(product: StorefrontProduct, variant: StorefrontVariant | null) {
  return (
    variant?.salePriceCents ??
    variant?.priceCents ??
    product.salePriceCents ??
    product.priceCents
  );
}

function getListPrice(product: StorefrontProduct, variant: StorefrontVariant | null) {
  return variant?.priceCents ?? product.priceCents;
}

function getStock(product: StorefrontProduct, variant: StorefrontVariant | null) {
  return variant ? variant.stock : product.stock;
}

export function validateCheckoutCart(
  products: StorefrontProduct[],
  cartItems: CheckoutCartItemInput[],
): ValidatedCheckout {
  if (cartItems.length === 0) {
    throw new Error("Your cart is empty.");
  }

  const normalizedItems = cartItems.map((item) => ({
    productId: item.productId,
    variantId: item.variantId,
    quantity: Number(item.quantity),
  }));

  const validatedItems = normalizedItems.map((item) => {
    const product = products.find((candidate) => candidate.id === item.productId);

    if (!product) {
      throw new Error("A product in your cart is no longer available.");
    }

    const variant = getVariant(product, item.variantId);

    if (item.variantId && !variant) {
      throw new Error(`${product.name} has an invalid variant.`);
    }

    if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
      throw new Error(`${product.name} has an invalid quantity.`);
    }

    const stock = getStock(product, variant);

    if (stock <= 0 || item.quantity > stock) {
      throw new Error(`${product.name} does not have enough stock.`);
    }

    const unitPriceCents = getUnitPrice(product, variant);
    const listPriceCents = getListPrice(product, variant);
    const subtotalCents = unitPriceCents * item.quantity;

    return {
      productId: product.id,
      variantId: variant?.id ?? null,
      productName: product.name,
      variantName: variant?.name ?? null,
      sku: variant?.sku ?? null,
      quantity: item.quantity,
      unitPriceCents,
      subtotalCents,
      stock,
      snapshot: {
        slug: product.slug,
        brand: product.brand?.name ?? null,
        category: product.category?.name ?? null,
        imageUrl: getProductPrimaryImage(product),
        listPriceCents,
      },
    };
  });

  const subtotalCents = validatedItems.reduce((total, item) => total + item.subtotalCents, 0);
  const discountCents = validatedItems.reduce(
    (total, item) =>
      total +
      Math.max(0, Number(item.snapshot.listPriceCents) - item.unitPriceCents) * item.quantity,
    0,
  );

  return {
    items: validatedItems,
    subtotalCents,
    discountCents,
    shippingCents: DEFAULT_SHIPPING_CENTS,
    totalCents: subtotalCents + DEFAULT_SHIPPING_CENTS,
  };
}
