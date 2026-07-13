import Image from "next/image";
import Link from "next/link";

import { PaymentProofForm } from "@/components/forms/PaymentProofForm";
import { ClearCartOnMount } from "@/components/storefront/ClearCartOnMount";
import { formatPeso } from "@/lib/format";
import { GCASH_PAYMENT } from "@/lib/gcash";
import { getCustomerOrder } from "@/lib/orders";

export const dynamic = "force-dynamic";

export default async function PaymentPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const { orderNumber } = await params;
  const { order, items } = await getCustomerOrder(orderNumber);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <ClearCartOnMount />
      <div className="mb-6">
        <p className="text-sm font-black uppercase tracking-wide text-orange-700">
          Awaiting payment
        </p>
        <h1 className="text-3xl font-black text-zinc-950">{order.order_number}</h1>
        <p className="mt-2 text-sm font-semibold text-zinc-600">
          Pay the exact amount and submit proof. Uploading a receipt does not automatically mark the order as paid.
        </p>
      </div>
      <div className="grid gap-5 lg:grid-cols-[1fr_420px]">
        <section className="grid gap-5">
          <div className="border border-zinc-200 bg-white p-4">
            <h2 className="text-xl font-black text-zinc-950">Order summary</h2>
            <div className="mt-4 grid gap-3 text-sm">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between gap-4">
                  <span className="font-semibold text-zinc-700">
                    {item.product_name} x {item.quantity}
                  </span>
                  <span className="font-black text-zinc-950">
                    {formatPeso(item.subtotal_cents)}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 grid gap-2 border-t border-zinc-200 pt-4 text-sm">
              <div className="flex justify-between">
                <span>Product subtotal</span>
                <span className="font-bold">{formatPeso(order.subtotal_cents)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping fee</span>
                <span className="font-bold">{formatPeso(order.shipping_cents)}</span>
              </div>
              <div className="flex justify-between">
                <span>Discounts</span>
                <span className="font-bold">{formatPeso(order.discount_cents)}</span>
              </div>
              <div className="flex justify-between text-lg font-black text-orange-600">
                <span>Exact final amount</span>
                <span>{formatPeso(order.total_cents)}</span>
              </div>
            </div>
          </div>
          <PaymentProofForm
            orderNumber={order.order_number}
            totalCents={order.total_cents}
          />
        </section>
        <aside className="h-fit border border-zinc-200 bg-white p-4">
          <h2 className="text-xl font-black text-zinc-950">Manual GCash payment</h2>
          <div className="relative mt-4 aspect-square overflow-hidden border border-zinc-200 bg-white">
            <Image
              src={GCASH_PAYMENT.qrPath}
              alt="Static GCash QR code"
              fill
              sizes="420px"
              className="object-contain"
              priority
            />
          </div>
          <a
            href={GCASH_PAYMENT.qrPath}
            download
            className="mt-3 flex h-10 items-center justify-center border border-orange-600 text-sm font-black text-orange-700 hover:bg-orange-50"
          >
            Save QR
          </a>
          <dl className="mt-4 grid gap-3 text-sm">
            <div>
              <dt className="font-black text-zinc-950">GCash account name</dt>
              <dd className="mt-1 text-zinc-700">{GCASH_PAYMENT.accountName}</dd>
            </div>
            <div>
              <dt className="font-black text-zinc-950">GCash number</dt>
              <dd className="mt-1 text-zinc-700">{GCASH_PAYMENT.maskedNumber}</dd>
            </div>
            <div>
              <dt className="font-black text-zinc-950">Instructions</dt>
              <dd className="mt-1 leading-6 text-zinc-700">
                Send exactly {formatPeso(order.total_cents)} and include order number {order.order_number} in your note if possible.
              </dd>
            </div>
          </dl>
          <Link
            href={`/account/orders/${order.order_number}`}
            className="mt-4 block text-sm font-bold text-zinc-700 hover:text-orange-700"
          >
            View order status
          </Link>
        </aside>
      </div>
    </div>
  );
}
