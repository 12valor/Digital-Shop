import { MdInventory2 } from "react-icons/md";

import { InventoryManagementView } from "@/components/admin/AdminDataViews";
import { AdminPageHeader } from "@/components/admin/AdminPrimitives";
import { getAdminInventoryData } from "@/lib/admin-data";

export const dynamic = "force-dynamic";

export default async function AdminInventoryPage() {
  const data = await getAdminInventoryData();
  if (!data) return null;

  return (
    <div className="grid gap-6">
      <AdminPageHeader
        eyebrow="Stock control"
        title="Inventory management"
        description="Monitor available quantities, low-stock thresholds, and recent stock movements."
        icon={MdInventory2}
      />
      <InventoryManagementView
        inventory={data.inventory}
        products={data.products}
        variants={data.variants}
        movements={data.movements}
      />
    </div>
  );
}