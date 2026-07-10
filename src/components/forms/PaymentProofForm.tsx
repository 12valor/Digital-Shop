"use client";

import { useActionState } from "react";

import {
  submitPaymentProofAction,
  type CheckoutActionState,
} from "@/app/checkout/actions";

const initialState: CheckoutActionState = {
  status: "idle",
  message: "",
};

export function PaymentProofForm({ orderNumber }: { orderNumber: string }) {
  const [state, formAction] = useActionState(submitPaymentProofAction, initialState);

  return (
    <form action={formAction} className="grid gap-4 border border-zinc-200 bg-white p-4">
      <input type="hidden" name="orderNumber" value={orderNumber} />
      <h2 className="text-xl font-black text-zinc-950">Submit payment proof</h2>
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
