import { cache } from "react";

import { hasSupabasePublicEnv } from "@/lib/env";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import {
  demoBanners,
  demoBrands,
  demoCategories,
  demoProducts,
} from "@/lib/storefront-demo-data";
import type {
  CatalogFilters,
  CatalogResult,
  HomepageBanner,
  StorefrontBrand,
  StorefrontCategory,
  StorefrontProduct,
} from "@/types/storefront";

const PAGE_SIZE = 12;

function normalizeText(value?: string) {
  return value?.trim().toLowerCase() ?? "";
}

function normalizeSpecifications(value: unknown): Record<string, string> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(value).map(([key, item]) => [key, String(item)]),
  );
}

function currentPrice(product: StorefrontProduct) {
  return product.salePriceCents ?? product.priceCents;
}

function discountAmount(product: StorefrontProduct) {
  return product.salePriceCents ? product.priceCents - product.salePriceCents : 0;
}

function applyCatalogFilters(
  products: StorefrontProduct[],
  filters: CatalogFilters,
) {
  const query = normalizeText(filters.q);
  const min = typeof filters.min === "number" ? filters.min * 100 : null;
  const max = typeof filters.max === "number" ? filters.max * 100 : null;

  return products
    .filter((product) => {
      const searchable = [
        product.name,
        product.description,
        product.brand?.name,
        product.category?.name,
        ...product.keywords,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      if (query && !searchable.includes(query)) {
        return false;
      }

      if (filters.category && product.category?.slug !== filters.category) {
        return false;
      }

      if (filters.brand && product.brand?.slug !== filters.brand) {
        return false;
      }

      if (min !== null && currentPrice(product) < min) {
        return false;
      }

      if (max !== null && currentPrice(product) > max) {
        return false;
      }

      if (filters.availability === "in-stock" && product.stock <= 0) {
        return false;
      }

      if (filters.availability === "out-of-stock" && product.stock > 0) {
        return false;
      }

      if (filters.discount === "sale" && !product.salePriceCents) {
        return false;
      }

      return true;
    })
    .sort((a, b) => {
      switch (filters.sort) {
        case "latest":
          return Date.parse(b.createdAt) - Date.parse(a.createdAt);
        case "price-asc":
          return currentPrice(a) - currentPrice(b);
        case "price-desc":
          return currentPrice(b) - currentPrice(a);
        case "discount":
          return discountAmount(b) - discountAmount(a);
        case "featured":
        default:
          return Number(b.isFeatured) - Number(a.isFeatured);
      }
    });
}

function parseImagePath(path: string | null | undefined) {
  if (!path) {
    return "/product-art/product-fallback.svg";
  }

  if (path.startsWith("http") || path.startsWith("/")) {
    return path;
  }

  return `/product-art/${path}`;
}

async function getSupabaseStorefrontData() {
  if (!hasSupabasePublicEnv()) {
    return null;
  }

  const supabase = await getSupabaseServerClient();
  const [
    categoriesResult,
    brandsResult,
    productsResult,
    imagesResult,
    variantsResult,
    inventoryResult,
    bannersResult,
  ] = await Promise.all([
    supabase.from("categories").select("*").eq("is_active", true).order("sort_order"),
    supabase.from("brands").select("*").eq("is_active", true).order("name"),
    supabase.from("products").select("*").eq("status", "active").order("created_at", {
      ascending: false,
    }),
    supabase.from("product_images").select("*").order("sort_order"),
    supabase.from("product_variants").select("*").eq("is_active", true).order("sort_order"),
    supabase.from("inventory").select("*"),
    supabase
      .from("homepage_banners")
      .select("*")
      .eq("is_active", true)
      .order("sort_order"),
  ]);

  if (categoriesResult.error || brandsResult.error || productsResult.error) {
    return null;
  }

  const categories: StorefrontCategory[] =
    categoriesResult.data?.map((category) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      imageUrl: category.image_url,
    })) ?? [];

  const brands: StorefrontBrand[] =
    brandsResult.data?.map((brand) => ({
      id: brand.id,
      name: brand.name,
      slug: brand.slug,
      description: brand.description,
      logoUrl: brand.logo_url,
    })) ?? [];

  const products: StorefrontProduct[] =
    productsResult.data?.map((product) => {
      const productImages =
        imagesResult.data
          ?.filter((image) => image.product_id === product.id)
          .map((image) => ({
            id: image.id,
            url: parseImagePath(image.storage_path),
            alt: image.alt_text || product.name,
            isPrimary: image.is_primary,
          })) ?? [];

      const stock =
        inventoryResult.data
          ?.filter((item) => item.product_id === product.id && item.variant_id === null)
          .reduce((total, item) => total + Math.max(0, item.quantity - item.reserved_quantity), 0) ?? 0;
      const variants =
        variantsResult.data
          ?.filter((variant) => variant.product_id === product.id)
          .map((variant) => {
            const variantStock =
              inventoryResult.data
                ?.filter((item) => item.variant_id === variant.id)
                .reduce(
                  (total, item) =>
                    total + Math.max(0, item.quantity - item.reserved_quantity),
                  0,
                ) ?? 0;

            return {
              id: variant.id,
              name: variant.name,
              sku: variant.sku,
              priceCents: variant.price_cents,
              salePriceCents: variant.sale_price_cents,
              attributes: normalizeSpecifications(variant.attributes),
              stock: variantStock,
            };
          }) ?? [];

      return {
        id: product.id,
        name: product.name,
        slug: product.slug,
        description: product.description ?? "",
        specifications: normalizeSpecifications(product.specifications),
        keywords: product.keywords ?? [],
        brand: brands.find((brand) => brand.id === product.brand_id) ?? null,
        category:
          categories.find((category) => category.id === product.category_id) ?? null,
        priceCents: product.price_cents,
        salePriceCents: product.sale_price_cents,
        badge: product.badge,
        isFeatured: product.is_featured,
        stock,
        variants,
        images:
          productImages.length > 0
            ? productImages
            : [
                {
                  id: `${product.id}-fallback`,
                  url: "/product-art/product-fallback.svg",
                  alt: product.name,
                  isPrimary: true,
                },
              ],
        createdAt: product.created_at,
      };
    }) ?? [];

  const banners: HomepageBanner[] =
    bannersResult.data?.map((banner) => ({
      id: banner.id,
      title: banner.title,
      subtitle: banner.subtitle ?? "",
      imageUrl: parseImagePath(banner.image_url),
      href: banner.href ?? "/products",
    })) ?? [];

  return {
    categories,
    brands,
    products,
    banners: banners.length > 0 ? banners : demoBanners,
  };
}

export const getStorefrontData = cache(async () => {
  const supabaseData = await getSupabaseStorefrontData();

  return (
    supabaseData ?? {
      categories: demoCategories,
      brands: demoBrands,
      products: demoProducts,
      banners: demoBanners,
    }
  );
});

export async function getHomepageData() {
  const data = await getStorefrontData();
  const featuredProducts = data.products.filter((product) => product.isFeatured).slice(0, 8);
  const saleProducts = data.products.filter((product) => product.salePriceCents).slice(0, 8);
  const newProducts = [...data.products]
    .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
    .slice(0, 8);
  const bestSellers = [...data.products].sort((a, b) => b.stock - a.stock).slice(0, 8);

  return {
    ...data,
    featuredProducts,
    saleProducts,
    newProducts,
    bestSellers,
  };
}

export async function getCatalogData(filters: CatalogFilters): Promise<CatalogResult> {
  const data = await getStorefrontData();
  const page = Math.max(1, filters.page ?? 1);
  const filtered = applyCatalogFilters(data.products, filters);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  return {
    products: filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    total: filtered.length,
    page,
    pageSize: PAGE_SIZE,
    totalPages,
    categories: data.categories,
    brands: data.brands,
  };
}

export async function getProductBySlug(slug: string) {
  const data = await getStorefrontData();
  const product = data.products.find((item) => item.slug === slug) ?? null;

  if (!product) {
    return null;
  }

  const relatedProducts = data.products
    .filter(
      (item) =>
        item.id !== product.id &&
        (item.category?.slug === product.category?.slug ||
          item.brand?.slug === product.brand?.slug),
    )
    .slice(0, 8);

  return {
    product,
    relatedProducts,
  };
}

export async function getCategoryBySlug(slug: string) {
  const data = await getStorefrontData();
  return data.categories.find((category) => category.slug === slug) ?? null;
}

export async function getBrandBySlug(slug: string) {
  const data = await getStorefrontData();
  return data.brands.find((brand) => brand.slug === slug) ?? null;
}

export function parseCatalogSearchParams(params: Record<string, string | string[] | undefined>) {
  const getOne = (key: string) => {
    const value = params[key];
    return Array.isArray(value) ? value[0] : value;
  };

  const numberValue = (key: string) => {
    const value = Number(getOne(key));
    return Number.isFinite(value) && value >= 0 ? value : undefined;
  };

  return {
    q: getOne("q") || undefined,
    category: getOne("category") || undefined,
    brand: getOne("brand") || undefined,
    min: numberValue("min"),
    max: numberValue("max"),
    availability:
      getOne("availability") === "in-stock" || getOne("availability") === "out-of-stock"
        ? (getOne("availability") as CatalogFilters["availability"])
        : "all",
    discount: getOne("discount") === "sale" ? "sale" : "all",
    sort: (getOne("sort") as CatalogFilters["sort"]) ?? "featured",
    page: numberValue("page"),
  } satisfies CatalogFilters;
}
