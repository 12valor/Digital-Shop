import { MdReceiptLong } from "react-icons/md";

import { OrderManagementView } from "@/components/admin/AdminDataViews";
import { AdminPageHeader } from "@/components/admin/AdminPrimitives";
import { getAdminOrdersData } from "@/lib/admin-data";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const data = await getAdminOrdersData();
  if (!data) return null;

  return (
    <div className="grid gap-6">
      <AdminPageHeader
        eyebrow="Fulfillment"
        title="Order management"
        description="Track customer orders, fulfillment status, courier details, and internal notes."
        icon={MdReceiptLong}
      />
      <OrderManagementView orders={data.orders} profiles={data.profiles} />
    </div>
  );
}