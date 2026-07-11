import type { StorefrontProduct } from "@/types/storefront";

const category = {
  id: "category-test",
  name: "Test Category",
  slug: "test-category",
};

const brand = {
  id: "brand-test",
  name: "Test Brand",
  slug: "test-brand",
};

export const testProducts: StorefrontProduct[] = [
  {
    id: "product-in-stock",
    name: "Test Digital Product",
    slug: "test-digital-product",
    description: "A product fixture used only by automated tests.",
    specifications: {},
    keywords: ["digital", "test"],
    brand,
    category,
    priceCents: 9900,
    salePriceCents: 8900,
    badge: "Sale",
    isFeatured: true,
    stock: 10,
    images: [
      {
        id: "test-image",
        url: "/product-art/product-fallback.svg",
        alt: "Test product",
        isPrimary: true,
      },
    ],
    variants: [
      {
        id: "variant-in-stock",
        name: "Digital delivery",
        sku: "TEST-001",
        priceCents: null,
        salePriceCents: null,
        attributes: { Delivery: "Digital" },
        stock: 10,
      },
    ],
    createdAt: "2026-07-10T00:00:00.000Z",
  },
  {
    id: "product-out-of-stock",
    name: "Unavailable Test Product",
    slug: "unavailable-test-product",
    description: "An unavailable product fixture used only by automated tests.",
    specifications: {},
    keywords: ["unavailable", "test"],
    brand,
    category,
    priceCents: 19900,
    salePriceCents: null,
    badge: null,
    isFeatured: false,
    stock: 0,
    images: [],
    variants: [
      {
        id: "variant-out-of-stock",
        name: "Unavailable",
        sku: "TEST-002",
        priceCents: null,
        salePriceCents: null,
        attributes: {},
        stock: 0,
      },
    ],
    createdAt: "2026-07-09T00:00:00.000Z",
  },
];