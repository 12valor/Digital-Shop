import Link from "next/link";

import { cancelUnpaidOrderAction } from "@/app/account/orders/actions";
import { formatPeso } from "@/lib/format";
import { getCustomerOrders } from "@/lib/orders";

export const dynamic = "force-dynamic";

export default async function AccountOrdersPage() {
  const { orders } = await getCustomerOrders();

  return (
    <div className="border border-zinc-200 bg-white p-6">
      <p className="text-sm font-black uppercase tracking-wide text-orange-700">Orders</p>
      <h1 className="mt-1 text-2xl font-black text-zinc-950">Order tracking</h1>
      <div className="mt-6 grid gap-3">
        {orders.map((order) => (
          <article key={order.id} className="grid gap-3 border border-zinc-200 p-4 md:grid-cols-[1fr_auto]">
            <div>
              <Link href={`/account/orders/${order.order_number}`} className="font-black text-zinc-950 hover:text-orange-700">
                {order.order_number}
              </Link>
              <p className="mt-1 text-sm text-zinc-600">
                {order.status} / {order.payment_status}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 md:justify-end">
              <p className="font-black text-orange-600">{formatPeso(order.total_cents)}</p>
              {order.payment_status === "awaiting_payment" ? (
                <form action={cancelUnpaidOrderAction}>
                  <input type="hidden" name="orderId" value={order.id} />
                  <button className="text-sm font-bold text-red-600">Cancel unpaid order</button>
                </form>
              ) : null}
            </div>
          </article>
        ))}
        {orders.length === 0 ? (
          <p className="text-sm text-zinc-600">No orders yet.</p>
        ) : null}
      </div>
    </div>
  );
}
