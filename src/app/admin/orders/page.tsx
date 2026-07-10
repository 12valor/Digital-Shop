import { OrderStatusForm } from "@/components/admin/AdminForms";
import { getAdminOrdersData } from "@/lib/admin-data";
import { formatPeso } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const data = await getAdminOrdersData();

  if (!data) return null;

  const customer = (id: string) =>
    data.profiles.find((profile) => profile.id === id)?.email ?? "Unknown customer";

  return (
    <div className="grid gap-6">
      <div>
        <p className="text-sm font-black uppercase tracking-wide text-orange-300">Orders</p>
        <h1 className="mt-1 text-3xl font-black text-white">Order management</h1>
      </div>
      <div className="grid gap-3">
        {data.orders.map((order) => (
          <article key={order.id} className="grid gap-4 border border-zinc-800 bg-zinc-900 p-4 lg:grid-cols-[1fr_320px]">
            <div>
              <div className="flex flex-wrap justify-between gap-3">
                <div>
                  <h2 className="font-black text-white">{order.order_number}</h2>
                  <p className="mt-1 text-sm text-zinc-400">{customer(order.user_id)}</p>
                </div>
                <div className="text-right">
                  <p className="font-black text-orange-300">{formatPeso(order.total_cents)}</p>
                  <p className="mt-1 text-xs uppercase text-zinc-500">{order.status} / {order.payment_status}</p>
                </div>
              </div>
              {order.internal_notes ? (
                <pre className="mt-4 whitespace-pre-wrap border border-zinc-800 bg-zinc-950 p-3 text-xs text-zinc-300">
                  {order.internal_notes}
                </pre>
              ) : null}
            </div>
            <OrderStatusForm orderId={order.id} />
          </article>
        ))}
      </div>
    </div>
  );
}
