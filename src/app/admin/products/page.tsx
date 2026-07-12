import { MdStorefront } from "react-icons/md";

import { ProductManagementView } from "@/components/admin/AdminDataViews";
import { AdminPageHeader } from "@/components/admin/AdminPrimitives";
import { getAdminProductsData } from "@/lib/admin-data";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const data = await getAdminProductsData();
  if (!data) return null;

  return (
    <div className="grid gap-6">
      <AdminPageHeader
        eyebrow="Catalog"
        title="Product management"
        description="Create products and organize the catalog, variants, imagery, and archive state."
        icon={MdStorefront}
      />
      <ProductManagementView products={data.products} categories={data.categories} brands={data.brands} />
    </div>
  );
}