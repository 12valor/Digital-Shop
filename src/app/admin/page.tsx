import Link from "next/link";

import { getAdminDashboardData } from "@/lib/admin-data";
import { formatPeso } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const data = await getAdminDashboardData();

  if (!data) return null;

  const metrics = [
    ["Total sales", formatPeso(data.totalSalesCents)],
    ["Pending payments", data.pendingPayments],
    ["Awaiting verification", data.ordersAwaitingVerification],
    ["Paid orders", data.paidOrders],
    ["Processing", data.processingOrders],
    ["Shipped", data.shippedOrders],
    ["Low stock", data.lowStockProducts],
    ["Out of stock", data.outOfStockProducts],
  ];

  return (
    <div className="grid gap-6">
      <div>
        <p className="text-sm font-black uppercase tracking-wide text-orange-300">Overview</p>
        <h1 className="mt-1 text-3xl font-black text-white">Admin dashboard</h1>
      </div>
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map(([label, metric]) => (
          <div key={label} className="border border-zinc-800 bg-zinc-900 p-4">
            <p className="text-xs font-black uppercase tracking-wide text-zinc-500">{label}</p>
            <p className="mt-2 text-2xl font-black text-white">{metric}</p>
          </div>
        ))}
      </section>
      <section className="grid gap-4 lg:grid-cols-2">
        <div className="border border-zinc-800 bg-zinc-900 p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-black text-white">Recent orders</h2>
            <Link href="/admin/orders" className="text-sm font-bold text-orange-300">Manage</Link>
          </div>
          <div className="grid gap-2 text-sm">
            {data.recentOrders.map((order) => (
              <div key={order.id} className="flex justify-between border-b border-zinc-800 pb-2">
                <span className="font-semibold text-zinc-300">{order.order_number}</span>
                <span className="text-zinc-400">{order.status}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="border border-zinc-800 bg-zinc-900 p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-black text-white">Recent payment submissions</h2>
            <Link href="/admin/payments" className="text-sm font-bold text-orange-300">Review</Link>
          </div>
          <div className="grid gap-2 text-sm">
            {data.recentPaymentSubmissions.map((proof) => (
              <div key={proof.id} className="flex justify-between border-b border-zinc-800 pb-2">
                <span className="font-semibold text-zinc-300">{proof.gcash_reference_number}</span>
                <span className="text-zinc-400">{proof.status}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
