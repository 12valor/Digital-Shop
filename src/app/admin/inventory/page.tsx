import { InventoryAdjustForm } from "@/components/admin/AdminForms";
import { getAdminInventoryData } from "@/lib/admin-data";

export const dynamic = "force-dynamic";

export default async function AdminInventoryPage() {
  const data = await getAdminInventoryData();

  if (!data) return null;

  const productName = (id: string) =>
    data.products.find((product) => product.id === id)?.name ?? "Unknown product";
  const variantName = (id: string | null) =>
    id ? data.variants.find((variant) => variant.id === id)?.name ?? "Variant" : "Default";

  return (
    <div className="grid gap-6">
      <div>
        <p className="text-sm font-black uppercase tracking-wide text-orange-300">Inventory</p>
        <h1 className="mt-1 text-3xl font-black text-white">Inventory management</h1>
      </div>
      <div className="grid gap-3">
        {data.inventory.map((item) => (
          <article key={item.id} className="grid gap-3 border border-zinc-800 bg-zinc-900 p-4">
            <div className="flex flex-wrap justify-between gap-3">
              <div>
                <h2 className="font-black text-white">{productName(item.product_id)}</h2>
                <p className="text-sm text-zinc-400">{variantName(item.variant_id)}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-black text-white">{item.quantity}</p>
                <p className="text-xs font-bold uppercase text-zinc-500">
                  Low at {item.low_stock_threshold}
                </p>
              </div>
            </div>
            <InventoryAdjustForm inventoryId={item.id} />
          </article>
        ))}
      </div>
      <div className="border border-zinc-800 bg-zinc-900 p-4">
        <h2 className="text-lg font-black text-white">Recent inventory history</h2>
        <div className="mt-3 grid gap-2 text-sm">
          {data.movements.map((movement) => (
            <div key={movement.id} className="flex justify-between border-b border-zinc-800 pb-2">
              <span className="font-semibold text-zinc-300">{productName(movement.product_id)}</span>
              <span className={movement.quantity_delta > 0 ? "text-emerald-300" : "text-red-300"}>
                {movement.quantity_delta}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
