import { MdPayments } from "react-icons/md";

import { PaymentManagementView } from "@/components/admin/AdminDataViews";
import { AdminPageHeader } from "@/components/admin/AdminPrimitives";
import { getAdminPaymentsData } from "@/lib/admin-data";

export const dynamic = "force-dynamic";

export default async function AdminPaymentsPage() {
  const data = await getAdminPaymentsData();
  if (!data) return null;

  return (
    <div className="grid gap-6">
      <AdminPageHeader
        eyebrow="Verification queue"
        title="Payment verification"
        description="Compare submitted GCash proofs with trusted order totals before making a decision."
        icon={MdPayments}
      />
      <PaymentManagementView
        proofs={data.proofs}
        orders={data.orders}
        profiles={data.profiles}
        proofUrls={data.proofUrls}
      />
    </div>
  );
}