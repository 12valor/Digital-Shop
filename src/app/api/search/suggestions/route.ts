import { NextResponse, type NextRequest } from "next/server";

import { getStorefrontData } from "@/lib/storefront-data";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")?.trim().toLowerCase() ?? "";

  if (query.length < 2) {
    return NextResponse.json([]);
  }

  const { products, categories, brands } = await getStorefrontData();
  const productSuggestions = products
    .filter((product) =>
      [product.name, product.brand?.name, product.category?.name, ...product.keywords]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(query),
    )
    .slice(0, 4)
    .map((product) => ({
      label: product.name,
      href: `/product/${product.slug}`,
      type: "product",
    }));

  const categorySuggestions = categories
    .filter((category) => category.name.toLowerCase().includes(query))
    .slice(0, 2)
    .map((category) => ({
      label: category.name,
      href: `/category/${category.slug}`,
      type: "category",
    }));

  const brandSuggestions = brands
    .filter((brand) => brand.name.toLowerCase().includes(query))
    .slice(0, 2)
    .map((brand) => ({
      label: brand.name,
      href: `/brand/${brand.slug}`,
      type: "brand",
    }));

  return NextResponse.json([
    ...productSuggestions,
    ...categorySuggestions,
    ...brandSuggestions,
  ]);
}
