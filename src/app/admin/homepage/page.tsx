import { MdViewCarousel } from "react-icons/md";

import { HomepageManagementView } from "@/components/admin/AdminDataViews";
import { AdminPageHeader } from "@/components/admin/AdminPrimitives";
import { getAdminHomepageData } from "@/lib/admin-data";

export const dynamic = "force-dynamic";

export default async function AdminHomepagePage() {
  const data = await getAdminHomepageData();
  if (!data) return null;

  return (
    <div className="grid gap-6">
      <AdminPageHeader
        eyebrow="Storefront content"
        title="Homepage management"
        description="Control promotional banners and the ordered content sections shown to customers."
        icon={MdViewCarousel}
      />
      <HomepageManagementView banners={data.banners} sections={data.sections} />
    </div>
  );
}