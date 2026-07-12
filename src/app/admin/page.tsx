import Link from "next/link";
import type { IconType } from "react-icons";
import {
  MdAttachMoney,
  MdDashboard,
  MdHourglassTop,
  MdInventory,
  MdLocalShipping,
  MdPaid,
  MdPayments,
  MdReceiptLong,
  MdTaskAlt,
  MdWarningAmber,
} from "react-icons/md";

import {
  AdminEmptyState,
  AdminPageHeader,
  AdminSection,
  AdminStatusBadge,
} from "@/components/admin/AdminPrimitives";
import { getAdminDashboardData } from "@/lib/admin-data";
import { formatPeso } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const data = await getAdminDashboardData();
  if (!data) return null;

  const primaryMetrics: Array<{ label: string; value: string | number; helper: string; icon: IconType; tone: string }> = [
    { label: "Total sales", value: formatPeso(data.totalSalesCents), helper: "Paid order revenue", icon: MdAttachMoney, tone: "bg-emerald-50 text-emerald-700" },
    { label: "Pending payments", value: data.pendingPayments, helper: "Waiting for customer payment", icon: MdHourglassTop, tone: "bg-orange-50 text-orange-700" },
    { label: "Awaiting verification", value: data.ordersAwaitingVerification, helper: "Proofs needing review", icon: MdPayments, tone: "bg-amber-50 text-amber-700" },
    { label: "Paid orders", value: data.paidOrders, helper: "Payments successfully approved", icon: MdPaid, tone: "bg-blue-50 text-blue-700" },
  ];

  const operations: Array<{ label: string; value: number; icon: IconType; warning?: boolean }> = [
    { label: "Processing", value: data.processingOrders, icon: MdTaskAlt },
    { label: "Shipped", value: data.shippedOrders, icon: MdLocalShipping },
    { label: "Low stock", value: data.lowStockProducts, icon: MdWarningAmber, warning: data.lowStockProducts > 0 },
    { label: "Out of stock", value: data.outOfStockProducts, icon: MdInventory, warning: data.outOfStockProducts > 0 },
  ];

  return (
    <div className="grid gap-6">
      <AdminPageHeader
        eyebrow="Overview"
        title="Admin dashboard"
        description="Monitor sales, payment reviews, fulfillment, and stock health."
        icon={MdDashboard}
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {primaryMetrics.map(({ label, value, helper, icon: Icon, tone }) => (
          <article key={label} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase text-slate-500">{label}</p>
                <p className="mt-3 text-2xl font-black text-slate-950">{value}</p>
              </div>
              <span className={"grid size-10 place-items-center rounded-lg " + tone}>
                <Icon className="size-5" aria-hidden="true" />
              </span>
            </div>
            <p className="mt-3 text-xs text-slate-500">{helper}</p>
          </article>
        ))}
      </section>

      <section className="grid overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm sm:grid-cols-2 xl:grid-cols-4">
        {operations.map(({ label, value, icon: Icon, warning }) => (
          <div key={label} className="flex items-center gap-3 border-b border-slate-200 px-4 py-4 last:border-b-0 sm:[&:nth-child(odd)]:border-r xl:border-r xl:border-b-0 xl:last:border-r-0">
            <span className={"grid size-9 place-items-center rounded-md " + (warning ? "bg-red-50 text-red-700" : "bg-slate-100 text-slate-600")}>
              <Icon className="size-5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-xl font-black text-slate-950">{value}</p>
              <p className="text-xs font-bold text-slate-500">{label}</p>
            </div>
          </div>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <AdminSection
          title="Recent orders"
          description="Latest customer orders and fulfillment state."
          action={<Link href="/admin/orders" className="text-sm font-black text-blue-700 hover:text-orange-600">Manage orders</Link>}
        >
          {data.recentOrders.length > 0 ? (
            <div className="divide-y divide-slate-200">
              {data.recentOrders.slice(0, 6).map((order) => (
                <div key={order.id} className="flex items-center justify-between gap-4 px-4 py-3 sm:px-5">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-black text-slate-950">{order.order_number}</p>
                    <p className="mt-1 text-xs text-slate-500">{formatPeso(order.total_cents)}</p>
                  </div>
                  <AdminStatusBadge status={order.status} />
                </div>
              ))}
            </div>
          ) : <AdminEmptyState title="No recent orders" description="New customer orders will appear here." icon={MdReceiptLong} />}
        </AdminSection>

        <AdminSection
          title="Recent payment submissions"
          description="Latest GCash proofs waiting in the workflow."
          action={<Link href="/admin/payments" className="text-sm font-black text-blue-700 hover:text-orange-600">Review payments</Link>}
        >
          {data.recentPaymentSubmissions.length > 0 ? (
            <div className="divide-y divide-slate-200">
              {data.recentPaymentSubmissions.slice(0, 6).map((proof) => (
                <div key={proof.id} className="flex items-center justify-between gap-4 px-4 py-3 sm:px-5">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-black text-slate-950">{proof.gcash_reference_number}</p>
                    <p className="mt-1 text-xs text-slate-500">{formatPeso(proof.amount_paid_cents)}</p>
                  </div>
                  <AdminStatusBadge status={proof.status} />
                </div>
              ))}
            </div>
          ) : <AdminEmptyState title="No payment submissions" description="Submitted payment proofs will appear here." icon={MdPayments} />}
        </AdminSection>
      </section>
    </div>
  );
}
