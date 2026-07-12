import {
  ArrowLeft,
  Check,
  Circle,
  Clock3,
  CreditCard,
  MapPin,
  Package,
  ReceiptText,
  Truck,
} from "lucide-react";
import Link from "next/link";

import { cancelUnpaidOrderAction } from "@/app/account/orders/actions";
import { OrderStatusBadge, formatStatus } from "@/components/account/OrderStatusBadge";
import { formatPeso } from "@/lib/format";
import { getCustomerOrder } from "@/lib/orders";
import type { Json } from "@/types/database";

export const dynamic = "force-dynamic";

const fulfillmentSteps = [
  { status: "paid", label: "Paid", icon: CreditCard },
  { status: "processing", label: "Processing", icon: Clock3 },
  { status: "packed", label: "Packed", icon: Package },
  { status: "shipped", label: "Shipped", icon: Truck },
  { status: "completed", label: "Completed", icon: Check },
] as const;

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-PH", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function jsonString(value: Json, key: string) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return "";
  const item = value[key];
  return typeof item === "string" ? item : "";
}

export default async function AccountOrderPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const { orderNumber } = await params;
  const { order, items, proofs, history, notifications } = await getCustomerOrder(orderNumber);
  const latestProof = proofs[0];
  const latestRejectedProof = proofs.find((proof) => proof.status === "rejected");
  const currentStep = fulfillmentSteps.findIndex((step) => step.status === order.status);
  const canSubmitProof =
    order.payment_status === "awaiting_payment" || order.payment_status === "rejected";
  const isStopped = ["cancelled", "refunded"].includes(order.status);

  const shipping = order.shipping_address;
  const addressLine = [
    jsonString(shipping, "streetAddress"),
    jsonString(shipping, "barangay"),
    jsonString(shipping, "city"),
    jsonString(shipping, "province"),
    jsonString(shipping, "region"),
    jsonString(shipping, "postalCode"),
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="grid gap-6">
      <div>
        <Link href="/account/orders" className="inline-flex items-center gap-2 text-sm font-black text-zinc-600 hover:text-orange-700">
          <ArrowLeft className="size-4" aria-hidden="true" /> Back to orders
        </Link>
      </div>

      <section className="border border-zinc-200 bg-white">
        <div className="border-b border-zinc-200 px-5 py-5 sm:px-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase text-orange-700">Order details</p>
              <h1 className="mt-1 text-2xl font-black sm:text-3xl">{order.order_number}</h1>
              <p className="mt-2 text-sm text-zinc-500">Placed {formatDate(order.created_at)}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <OrderStatusBadge status={order.status} />
              <OrderStatusBadge status={order.payment_status} />
            </div>
          </div>
        </div>

        {isStopped ? (
          <div className="border-b border-zinc-200 bg-zinc-50 px-5 py-4 text-sm font-bold text-zinc-700 sm:px-6">
            This order is {formatStatus(order.status).toLowerCase()}. Its fulfillment timeline is no longer active.
          </div>
        ) : (
          <div className="overflow-x-auto border-b border-zinc-200 px-5 py-6 sm:px-6">
            <ol className="grid min-w-150 grid-cols-5">
              {fulfillmentSteps.map((step, index) => {
                const complete = currentStep >= index;
                const Icon = step.icon;
                return (
                  <li key={step.status} className="relative text-center">
                    {index > 0 ? (
                      <span className={"absolute top-5 right-1/2 h-0.5 w-full " + (complete ? "bg-emerald-500" : "bg-zinc-200")} />
                    ) : null}
                    <span className={"relative z-10 mx-auto grid size-10 place-items-center border-2 " + (complete ? "border-emerald-500 bg-emerald-500 text-white" : "border-zinc-300 bg-white text-zinc-400")}>
                      <Icon className="size-4" aria-hidden="true" />
                    </span>
                    <span className={"mt-2 block text-xs font-black " + (complete ? "text-zinc-950" : "text-zinc-400")}>{step.label}</span>
                  </li>
                );
              })}
            </ol>
          </div>
        )}

        <div className="grid divide-y divide-zinc-200 lg:grid-cols-[minmax(0,1fr)_320px] lg:divide-x lg:divide-y-0">
          <div className="p-5 sm:p-6">
            <div className="flex items-center gap-2">
              <ReceiptText className="size-5 text-blue-900" aria-hidden="true" />
              <h2 className="text-lg font-black">Items ordered</h2>
            </div>
            <div className="mt-5 divide-y divide-zinc-200">
              {items.map((item) => (
                <div key={item.id} className="flex items-start justify-between gap-4 py-4 first:pt-0">
                  <div className="min-w-0">
                    <p className="font-black">{item.product_name}</p>
                    <p className="mt-1 text-sm text-zinc-500">
                      {item.variant_name ? item.variant_name + " · " : ""}Qty {item.quantity}
                    </p>
                    <p className="mt-1 text-xs text-zinc-500">{formatPeso(item.unit_price_cents)} each</p>
                  </div>
                  <p className="shrink-0 font-black">{formatPeso(item.subtotal_cents)}</p>
                </div>
              ))}
            </div>
          </div>

          <aside className="bg-zinc-50 p-5 sm:p-6">
            <h2 className="font-black">Order summary</h2>
            <dl className="mt-4 grid gap-3 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-zinc-600">Subtotal</dt>
                <dd className="font-bold">{formatPeso(order.subtotal_cents)}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-zinc-600">Shipping</dt>
                <dd className="font-bold">{formatPeso(order.shipping_cents)}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-zinc-600">Discount</dt>
                <dd className="font-bold text-emerald-700">-{formatPeso(order.discount_cents)}</dd>
              </div>
              <div className="flex justify-between gap-4 border-t border-zinc-300 pt-4 text-base">
                <dt className="font-black">Total</dt>
                <dd className="font-black text-orange-600">{formatPeso(order.total_cents)}</dd>
              </div>
            </dl>
          </aside>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="border border-zinc-200 bg-white p-5 sm:p-6">
          <div className="flex items-center gap-2">
            <MapPin className="size-5 text-orange-600" aria-hidden="true" />
            <h2 className="text-lg font-black">Delivery address</h2>
          </div>
          <div className="mt-4 text-sm leading-6">
            <p className="font-black">{jsonString(shipping, "fullName") || "Recipient"}</p>
            <p className="mt-1 text-zinc-600">{addressLine || "Address details unavailable."}</p>
            {jsonString(shipping, "mobileNumber") ? (
              <p className="mt-1 text-zinc-600">{jsonString(shipping, "mobileNumber")}</p>
            ) : null}
          </div>
          {order.customer_notes ? (
            <div className="mt-4 border-t border-zinc-100 pt-4">
              <p className="text-xs font-black uppercase text-zinc-500">Delivery notes</p>
              <p className="mt-1 text-sm text-zinc-600">{order.customer_notes}</p>
            </div>
          ) : null}
        </section>

        <section className="border border-zinc-200 bg-white p-5 sm:p-6">
          <div className="flex items-center gap-2">
            <CreditCard className="size-5 text-blue-900" aria-hidden="true" />
            <h2 className="text-lg font-black">GCash payment</h2>
          </div>
          <div className="mt-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm text-zinc-500">Payment status</p>
              <p className="mt-1 font-black">{formatStatus(order.payment_status)}</p>
            </div>
            {latestProof ? <OrderStatusBadge status={latestProof.status} /> : null}
          </div>
          {latestRejectedProof?.review_notes ? (
            <p className="mt-4 border border-red-200 bg-red-50 px-3 py-3 text-sm font-semibold text-red-800">
              Rejection reason: {latestRejectedProof.review_notes}
            </p>
          ) : null}
          {canSubmitProof ? (
            <Link
              href={"/checkout/payment/" + order.order_number}
              className="mt-5 inline-flex h-11 items-center justify-center bg-orange-600 px-5 text-sm font-black text-white hover:bg-orange-700"
            >
              {latestRejectedProof ? "Resubmit payment proof" : "Pay and submit proof"}
            </Link>
          ) : (
            <p className="mt-4 text-sm leading-6 text-zinc-600">
              Your payment proof is recorded. Updates will appear here after review.
            </p>
          )}
          {order.payment_status === "awaiting_payment" ? (
            <form action={cancelUnpaidOrderAction} className="mt-3">
              <input type="hidden" name="orderId" value={order.id} />
              <button className="h-10 text-sm font-bold text-red-700 hover:text-red-900" type="submit">
                Cancel this unpaid order
              </button>
            </form>
          ) : null}
        </section>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="border border-zinc-200 bg-white p-5 sm:p-6">
          <h2 className="text-lg font-black">Status history</h2>
          <div className="mt-5">
            {history.map((entry, index) => (
              <div key={entry.id} className="relative flex gap-4 pb-5 last:pb-0">
                {index < history.length - 1 ? <span className="absolute top-5 bottom-0 left-2 h-full w-px bg-zinc-200" /> : null}
                <Circle className="relative z-10 mt-1 size-4 shrink-0 fill-orange-500 text-orange-500" aria-hidden="true" />
                <div>
                  <p className="text-sm font-black">{formatStatus(entry.to_status)}</p>
                  <p className="mt-1 text-xs text-zinc-500">{formatDate(entry.created_at)}</p>
                  {entry.note ? <p className="mt-1 text-sm text-zinc-600">{entry.note}</p> : null}
                </div>
              </div>
            ))}
            {history.length === 0 ? <p className="text-sm text-zinc-600">No status updates yet.</p> : null}
          </div>
        </section>

        <section className="border border-zinc-200 bg-white p-5 sm:p-6">
          <h2 className="text-lg font-black">Order notifications</h2>
          <div className="mt-5 divide-y divide-zinc-200">
            {notifications.map((notification) => (
              <div key={notification.id} className="py-4 first:pt-0">
                <p className="text-sm font-black">{notification.title}</p>
                <p className="mt-1 text-sm leading-6 text-zinc-600">{notification.message}</p>
                <p className="mt-1 text-xs text-zinc-400">{formatDate(notification.created_at)}</p>
              </div>
            ))}
            {notifications.length === 0 ? <p className="text-sm text-zinc-600">No notifications yet.</p> : null}
          </div>
        </section>
      </div>
    </div>
  );
}