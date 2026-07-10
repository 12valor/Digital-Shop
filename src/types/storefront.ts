export type StorefrontCategory = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  imageUrl?: string | null;
};

export type StorefrontBrand = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  logoUrl?: string | null;
};

export type StorefrontImage = {
  id: string;
  url: string;
  alt: string;
  isPrimary: boolean;
};

export type StorefrontVariant = {
  id: string;
  name: string;
  sku: string | null;
  priceCents: number | null;
  salePriceCents: number | null;
  attributes: Record<string, string>;
  stock: number;
};

export type StorefrontProduct = {
  id: string;
  name: string;
  slug: string;
  description: string;
  specifications: Record<string, string>;
  keywords: string[];
  brand: StorefrontBrand | null;
  category: StorefrontCategory | null;
  priceCents: number;
  salePriceCents: number | null;
  badge: string | null;
  isFeatured: boolean;
  stock: number;
  images: StorefrontImage[];
  variants: StorefrontVariant[];
  createdAt: string;
};

export type CatalogFilters = {
  q?: string;
  category?: string;
  brand?: string;
  min?: number;
  max?: number;
  availability?: "all" | "in-stock" | "out-of-stock";
  discount?: "all" | "sale";
  sort?: "featured" | "latest" | "price-asc" | "price-desc" | "discount";
  page?: number;
};

export type CatalogResult = {
  products: StorefrontProduct[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  categories: StorefrontCategory[];
  brands: StorefrontBrand[];
};

export type HomepageBanner = {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  href: string;
};
