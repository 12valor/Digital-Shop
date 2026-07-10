export type CheckoutCartItemInput = {
  productId: string;
  variantId: string | null;
  quantity: number;
};

export type ValidatedCheckoutItem = {
  productId: string;
  variantId: string | null;
  productName: string;
  variantName: string | null;
  sku: string | null;
  quantity: number;
  unitPriceCents: number;
  subtotalCents: number;
  stock: number;
  snapshot: {
    slug: string;
    brand: string | null;
    category: string | null;
    imageUrl: string | null;
    listPriceCents: number;
  };
};

export type ValidatedCheckout = {
  items: ValidatedCheckoutItem[];
  subtotalCents: number;
  discountCents: number;
  shippingCents: number;
  totalCents: number;
};
