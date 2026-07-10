import Link from "next/link";

import { formatPeso } from "@/lib/format";
import { getCustomerOrder } from "@/lib/orders";

export const dynamic = "force-dynamic";

export default async function AccountOrderPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const { orderNumber } = await params;
  const { order, items, proofs, history, notifications } = await getCustomerOrder(orderNumber);
  const latestRejectedProof = proofs.find((proof) => proof.status === "rejected");

  return (
    <div className="border border-zinc-200 bg-white p-6">
      <p className="text-sm font-black uppercase tracking-wide text-orange-700">Order</p>
      <h1 className="mt-1 text-2xl font-black text-zinc-950">{order.order_number}</h1>
      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        <div>
          <p className="text-xs font-black uppercase text-zinc-500">Order status</p>
          <p className="mt-1 font-bold text-zinc-950">{order.status}</p>
        </div>
        <div>
          <p className="text-xs font-black uppercase text-zinc-500">Payment status</p>
          <p className="mt-1 font-bold text-zinc-950">{order.payment_status}</p>
        </div>
        <div>
          <p className="text-xs font-black uppercase text-zinc-500">Total</p>
          <p className="mt-1 font-bold text-orange-600">{formatPeso(order.total_cents)}</p>
        </div>
      </div>
      <div className="mt-6 border-t border-zinc-200 pt-5">
        <h2 className="text-lg font-black text-zinc-950">Items</h2>
        <div className="mt-3 grid gap-2 text-sm">
          {items.map((item) => (
            <div key={item.id} className="flex justify-between gap-4">
              <span className="font-semibold text-zinc-700">
                {item.product_name} x {item.quantity}
              </span>
              <span className="font-black text-zinc-950">{formatPeso(item.subtotal_cents)}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-6 border-t border-zinc-200 pt-5">
        <h2 className="text-lg font-black text-zinc-950">Payment proof</h2>
        {proofs.length > 0 ? (
          <div className="mt-2 grid gap-2 text-sm">
            <p className="font-semibold text-emerald-700">
              Latest proof status: {proofs[0].status}
            </p>
            {latestRejectedProof?.review_notes ? (
              <p className="border border-red-200 bg-red-50 px-3 py-2 font-semibold text-red-700">
                Rejection reason: {latestRejectedProof.review_notes}
              </p>
            ) : null}
          </div>
        ) : (
          <Link
            href={`/checkout/payment/${order.order_number}`}
            className="mt-3 inline-flex h-10 items-center bg-orange-600 px-4 text-sm font-black text-white hover:bg-orange-700"
          >
            Submit payment proof
          </Link>
        )}
      </div>
      <div className="mt-6 border-t border-zinc-200 pt-5">
        <h2 className="text-lg font-black text-zinc-950">Status history</h2>
        <div className="mt-3 grid gap-2 text-sm">
          {history.map((entry) => (
            <div key={entry.id} className="border-b border-zinc-100 pb-2">
              <p className="font-semibold text-zinc-800">
                {entry.from_status ?? "created"} {"->"} {entry.to_status}
              </p>
              {entry.note ? <p className="text-zinc-600">{entry.note}</p> : null}
            </div>
          ))}
          {history.length === 0 ? <p className="text-zinc-600">No status updates yet.</p> : null}
        </div>
      </div>
      <div className="mt-6 border-t border-zinc-200 pt-5">
        <h2 className="text-lg font-black text-zinc-950">Notifications</h2>
        <div className="mt-3 grid gap-2 text-sm">
          {notifications.map((notification) => (
            <div key={notification.id} className="border-b border-zinc-100 pb-2">
              <p className="font-semibold text-zinc-800">{notification.title}</p>
              <p className="text-zinc-600">{notification.message}</p>
            </div>
          ))}
          {notifications.length === 0 ? <p className="text-zinc-600">No notifications yet.</p> : null}
        </div>
      </div>
    </div>
  );
}
