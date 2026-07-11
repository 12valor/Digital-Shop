import type {
  HomepageBanner,
  StorefrontBrand,
  StorefrontCategory,
} from "@/types/storefront";

export const demoCategories: StorefrontCategory[] = [
  {
    id: "cat-load",
    name: "Mobile Load",
    slug: "mobile-load",
    description: "Fast prepaid load and data promos.",
    imageUrl: "/product-art/mobile-load.svg",
  },
  {
    id: "cat-game",
    name: "Game Credits",
    slug: "game-credits",
    description: "Top-ups for popular games.",
    imageUrl: "/product-art/game-credits.svg",
  },
  {
    id: "cat-voucher",
    name: "Gift Vouchers",
    slug: "gift-vouchers",
    description: "Digital codes for gifting and shopping.",
    imageUrl: "/product-art/gift-voucher.svg",
  },
  {
    id: "cat-accessories",
    name: "Accessories",
    slug: "accessories",
    description: "Everyday tech add-ons.",
    imageUrl: "/product-art/accessories.svg",
  },
];

export const demoBrands: StorefrontBrand[] = [
  { id: "brand-globe", name: "Globe", slug: "globe", logoUrl: null },
  { id: "brand-smart", name: "Smart", slug: "smart", logoUrl: null },
  { id: "brand-garena", name: "Garena", slug: "garena", logoUrl: null },
  { id: "brand-play", name: "PlayPass", slug: "playpass", logoUrl: null },
  { id: "brand-tech", name: "TechMate", slug: "techmate", logoUrl: null },
];

export const demoBanners: HomepageBanner[] = [
  {
    id: "banner-main",
    title: "Digital deals delivered fast",
    subtitle: "Browse load, game credits, vouchers, and accessories in one storefront.",
    imageUrl: "/images/digital-marketplace-hero.png",
    href: "/products",
  },
  {
    id: "banner-games",
    title: "Game credits ready",
    subtitle: "Top-up codes and wallet credits for your next match.",
    imageUrl: "/product-art/game-credits.svg",
    href: "/category/game-credits",
  },
];
