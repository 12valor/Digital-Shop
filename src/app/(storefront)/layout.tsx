import { StorefrontFooter } from "@/components/storefront/StorefrontFooter";
import { StorefrontHeader } from "@/components/storefront/StorefrontHeader";
import { MobileBottomNav } from "@/components/storefront/MobileBottomNav";
import { getStorefrontData } from "@/lib/storefront-data";

export default async function StorefrontLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { categories } = await getStorefrontData();

  return (
    <div className="flex min-h-screen flex-col pb-14 md:pb-0">
      <StorefrontHeader categories={categories} />
      <main className="flex-1">{children}</main>
      <StorefrontFooter categories={categories} />
      <MobileBottomNav />
    </div>
  );
}
