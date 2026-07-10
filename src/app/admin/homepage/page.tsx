import {
  BannerCreateForm,
  HomepageSectionCreateForm,
} from "@/components/admin/AdminForms";
import { getAdminHomepageData } from "@/lib/admin-data";

export const dynamic = "force-dynamic";

export default async function AdminHomepagePage() {
  const data = await getAdminHomepageData();

  if (!data) return null;

  return (
    <div className="grid gap-6">
      <div>
        <p className="text-sm font-black uppercase tracking-wide text-orange-300">Homepage</p>
        <h1 className="mt-1 text-3xl font-black text-white">Content management</h1>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <BannerCreateForm />
        <HomepageSectionCreateForm />
      </div>
      <section className="grid gap-4 lg:grid-cols-2">
        <div className="border border-zinc-800 bg-zinc-900 p-4">
          <h2 className="text-lg font-black text-white">Banners</h2>
          <div className="mt-3 grid gap-2 text-sm">
            {data.banners.map((banner) => (
              <div key={banner.id} className="border-b border-zinc-800 pb-2">
                <p className="font-semibold text-zinc-200">{banner.title}</p>
                <p className="text-zinc-500">{banner.is_active ? "Active" : "Hidden"} / order {banner.sort_order}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="border border-zinc-800 bg-zinc-900 p-4">
          <h2 className="text-lg font-black text-white">Sections</h2>
          <div className="mt-3 grid gap-2 text-sm">
            {data.sections.map((section) => (
              <div key={section.id} className="border-b border-zinc-800 pb-2">
                <p className="font-semibold text-zinc-200">{section.title}</p>
                <p className="text-zinc-500">{section.is_visible ? "Visible" : "Hidden"} / {section.section_key}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
