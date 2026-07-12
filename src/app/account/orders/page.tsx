import { ArrowRight, PackageSearch, Search, ShoppingBag } from "lucide-react";
import Link from "next/link";

import { cancelUnpaidOrderAction } from "@/app/account/orders/actions";
import { OrderStatusBadge } from "@/components/account/OrderStatusBadge";
import { formatPeso } from "@/lib/format";
import { getCustomerOrders } from "@/lib/orders";

export const dynamic = "force-dynamic";

const filters = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
] as const;

function matchesFilter(status: string, filter: string) {
  if (filter === "active") return !["completed", "cancelled", "refunded"].includes(status);
  if (filter === "completed") return status === "completed";
  if (filter === "cancelled") return ["cancelled", "refunded"].includes(status);
  return true;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-PH", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default async function AccountOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  const { orders } = await getCustomerOrders();
  const params = await searchParams;
  const selected = filters.some((item) => item.value === params.status) ? params.status! : "all";
  const query = params.q?.trim().toLowerCase() ?? "";
  const visibleOrders = orders.filter(
    (order) =>
      matchesFilter(order.status, selected) &&
      (!query || order.order_number.toLowerCase().includes(query)),
  );

  return (
    <div className="border border-zinc-200 bg-white">
      <div className="border-b border-zinc-200 px-5 py-5 sm:px-6">
        <p className="text-xs font-black uppercase text-orange-700">Purchase history</p>
        <h1 className="mt-1 text-2xl font-black sm:text-3xl">My orders</h1>
        <p className="mt-2 text-sm text-zinc-600">Track payments, fulfillment, and delivery progress in one place.</p>
      </div>

      <div className="border-b border-zinc-200 px-5 py-4 sm:px-6">
        <div className="flex gap-1 overflow-x-auto">
          {filters.map((filter) => {
            const href = filter.value === "all" ? "/account/orders" : "/account/orders?status=" + filter.value;
            return (
              <Link
                key={filter.value}
                href={href}
                className={
                  "shrink-0 border-b-2 px-4 py-2 text-sm font-black " +
                  (selected === filter.value
                    ? "border-orange-500 text-orange-700"
                    : "border-transparent text-zinc-500 hover:text-zinc-950")
                }
              >
                {filter.label}
              </Link>
            );
          })}
        </div>
        <form className="mt-4 flex max-w-md" action="/account/orders" method="get">
          {selected !== "all" ? <input type="hidden" name="status" value={selected} /> : null}
          <label className="relative flex-1">
            <span className="sr-only">Search by order number</span>
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-zinc-400" aria-hidden="true" />
            <input
              name="q"
              defaultValue={params.q}
              placeholder="Search order number"
              className="h-11 w-full border border-zinc-300 pr-3 pl-10 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
            />
          </label>
          <button className="h-11 bg-blue-900 px-5 text-sm font-black text-white hover:bg-blue-800" type="submit">Search</button>
        </form>
      </div>

      <div className="divide-y divide-zinc-200">
        {visibleOrders.map((order) => (
          <article key={order.id} className="p-5 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <Link href={"/account/orders/" + order.order_number} className="font-black text-blue-950 hover:text-orange-700">
                    {order.order_number}
                  </Link>
                  <OrderStatusBadge status={order.status} />
                </div>
                <p className="mt-2 text-xs text-zinc-500">Placed {formatDate(order.created_at)}</p>
              </div>
              <div className="sm:text-right">
                <p className="text-lg font-black text-orange-600">{formatPeso(order.total_cents)}</p>
                <p className="mt-1 text-xs font-bold text-zinc-500">Payment: {order.payment_status.replaceAll("_", " ")}</p>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-zinc-100 pt-4">
              <Link
                href={"/account/orders/" + order.order_number}
                className="inline-flex h-10 items-center gap-2 bg-blue-900 px-4 text-sm font-black text-white hover:bg-blue-800"
              >
                View details <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
              {order.payment_status === "awaiting_payment" ? (
                <Link href={"/checkout/payment/" + order.order_number} className="inline-flex h-10 items-center px-4 text-sm font-black text-orange-700 hover:bg-orange-50">
                  Complete payment
                </Link>
              ) : null}
              {order.payment_status === "awaiting_payment" ? (
                <form action={cancelUnpaidOrderAction} className="ml-auto">
                  <input type="hidden" name="orderId" value={order.id} />
                  <button className="h-10 px-3 text-sm font-bold text-red-700 hover:bg-red-50" type="submit">Cancel order</button>
                </form>
              ) : null}
            </div>
          </article>
        ))}
      </div>

      {visibleOrders.length === 0 ? (
        <div className="px-5 py-16 text-center sm:px-6">
          <PackageSearch className="mx-auto size-10 text-zinc-400" aria-hidden="true" />
          <h2 className="mt-4 text-lg font-black">No matching orders</h2>
          <p className="mt-2 text-sm text-zinc-600">Try another filter or begin a new order from the shop.</p>
          <Link href="/products" className="mt-5 inline-flex h-11 items-center gap-2 bg-orange-600 px-5 text-sm font-black text-white hover:bg-orange-700">
            <ShoppingBag className="size-4" aria-hidden="true" /> Browse products
          </Link>
        </div>
      ) : null}
    </div>
  );
}