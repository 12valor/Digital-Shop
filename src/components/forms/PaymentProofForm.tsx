"use client";

import Image from "next/image";
import { useActionState } from "react";

import {
  submitPaymentProofAction,
  type CheckoutActionState,
} from "@/app/checkout/actions";
import { formatPeso } from "@/lib/format";
import { GCASH_PAYMENT } from "@/lib/gcash";

const initialState: CheckoutActionState = {
  status: "idle",
  message: "",
};

export function PaymentProofForm({
  orderNumber,
  totalCents,
}: {
  orderNumber: string;
  totalCents: number;
}) {
  const [state, formAction] = useActionState(submitPaymentProofAction, initialState);

  return (
    <form action={formAction} className="grid gap-4 border border-zinc-200 bg-white p-4">
      <input type="hidden" name="orderNumber" value={orderNumber} />
      <h2 className="text-xl font-black text-zinc-950">Submit payment proof</h2>
      <section className="border border-blue-200 bg-blue-50 p-3 lg:hidden">
        <p className="text-xs font-black uppercase tracking-wide text-blue-700">Pay with GCash first</p>
        <h3 className="mt-1 text-lg font-black text-zinc-950">Scan the QR code</h3>
        <p className="mt-1 text-sm font-semibold leading-6 text-zinc-600">
          Send exactly {formatPeso(totalCents)}, then complete the fields below.
        </p>
        <div className="mx-auto mt-4 max-w-sm overflow-hidden border border-zinc-200 bg-white">
          <Image
            src={GCASH_PAYMENT.qrPath}
            alt="GCash QR code for Digital Shop payment"
            width={1079}
            height={2048}
            sizes="calc(100vw - 64px)"
            className="h-auto w-full"
            priority
          />
        </div>
        <a
          href={GCASH_PAYMENT.qrPath}
          download
          className="mt-3 flex h-10 items-center justify-center border border-blue-600 bg-white text-sm font-black text-blue-700 hover:bg-blue-100"
        >
          Save GCash QR
        </a>
        <p className="mt-3 text-xs font-semibold leading-5 text-zinc-600">
          If possible, include order number {orderNumber} in the payment note.
        </p>
      </section>
      <label className="grid gap-1 text-sm font-bold text-zinc-800">
        GCash sender name
        <input name="senderName" required className="h-11 border border-zinc-300 px-3" />
      </label>
      <label className="grid gap-1 text-sm font-bold text-zinc-800">
        Sender mobile number
        <input name="senderMobileNumber" required className="h-11 border border-zinc-300 px-3" />
      </label>
      <label className="grid gap-1 text-sm font-bold text-zinc-800">
        Amount paid
        <input name="amountPaid" type="number" min="1" step="0.01" required className="h-11 border border-zinc-300 px-3" />
      </label>
      <label className="grid gap-1 text-sm font-bold text-zinc-800">
        Transaction reference number
        <input name="referenceNumber" required className="h-11 border border-zinc-300 px-3" />
      </label>
      <label className="grid gap-1 text-sm font-bold text-zinc-800">
        Payment date and time
        <input name="paidAt" type="datetime-local" required className="h-11 border border-zinc-300 px-3" />
      </label>
      <label className="grid gap-1 text-sm font-bold text-zinc-800">
        Receipt screenshot or PDF
        <input name="receipt" type="file" accept=".jpg,.jpeg,.png,.pdf,image/jpeg,image/png,application/pdf" required className="border border-zinc-300 px-3 py-2 text-sm" />
      </label>
      {state.message ? (
        <p className="border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">
          {state.message}
        </p>
      ) : null}
      <button
        type="submit"
        className="h-11 bg-orange-600 px-4 text-sm font-black text-white hover:bg-orange-700"
      >
        Upload proof for review
      </button>
    </form>
  );
}
