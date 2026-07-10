"use client";

import { useActionState, useMemo } from "react";

import {
  createOrderAction,
  type CheckoutActionState,
} from "@/app/checkout/actions";
import { formatPeso } from "@/lib/format";
import { useCartStore } from "@/stores/cart-store";

const initialState: CheckoutActionState = {
  status: "idle",
  message: "",
};

function Field({
  label,
  name,
  type = "text",
  autoComplete,
  required = true,
  defaultValue,
}: {
  label: string;
  name: string;
  type?: string;
  autoComplete?: string;
  required?: boolean;
  defaultValue?: string;
}) {
  return (
    <label className="grid gap-1 text-sm font-bold text-zinc-800">
      {label}
      <input
        name={name}
        type={type}
        autoComplete={autoComplete}
        required={required}
        defaultValue={defaultValue}
        className="h-11 border border-zinc-300 px-3 text-sm font-medium outline-none focus:border-orange-500"
      />
    </label>
  );
}

export function CheckoutForm({ email }: { email: string }) {
  const [state, formAction] = useActionState(createOrderAction, initialState);
  const items = useCartStore((store) => store.items);
  const subtotal = useCartStore((store) => store.getSubtotalCents());
  const cartPayload = useMemo(
    () =>
      JSON.stringify(
        items.map((item) => ({
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.quantity,
        })),
      ),
    [items],
  );

  if (items.length === 0) {
    return (
      <div className="border border-zinc-200 bg-white p-6">
        <p className="text-sm font-semibold text-zinc-700">
          Your cart is empty. Add a product before checkout.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="grid gap-5 lg:grid-cols-[1fr_340px]">
      <input type="hidden" name="cart" value={cartPayload} />
      <section className="grid gap-4 border border-zinc-200 bg-white p-4">
        <h2 className="text-xl font-black text-zinc-950">Delivery details</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Full name" name="fullName" autoComplete="name" />
          <Field
            label="Email address"
            name="email"
            type="email"
            autoComplete="email"
            defaultValue={email}
          />
          <Field label="Mobile number" name="mobileNumber" autoComplete="tel" />
          <label className="grid gap-1 text-sm font-bold text-zinc-800">
            Shipping option
            <select
              name="shippingOption"
              defaultValue="standard"
              className="h-11 border border-zinc-300 bg-white px-3 text-sm font-medium outline-none focus:border-orange-500"
            >
              <option value="standard">Standard delivery</option>
              <option value="digital">Digital fulfillment</option>
            </select>
          </label>
          <Field label="Region" name="region" />
          <Field label="Province" name="province" />
          <Field label="City or municipality" name="city" />
          <Field label="Barangay" name="barangay" />
          <Field label="Postal code" name="postalCode" />
          <Field label="Complete address" name="streetAddress" />
        </div>
        <label className="grid gap-1 text-sm font-bold text-zinc-800">
          Delivery notes
          <textarea
            name="deliveryNotes"
            rows={4}
            className="border border-zinc-300 px-3 py-2 text-sm font-medium outline-none focus:border-orange-500"
          />
        </label>
        <label className="flex items-center gap-2 text-sm font-bold text-zinc-800">
          <input name="saveAddress" type="checkbox" className="size-4 accent-orange-600" />
          Save this address to my account
        </label>
      </section>
      <aside className="h-fit border border-zinc-200 bg-white p-4">
        <h2 className="text-xl font-black text-zinc-950">Order summary</h2>
        <div className="mt-4 grid gap-3 text-sm">
          {items.map((item) => (
            <div key={`${item.productId}:${item.variantId}`} className="flex justify-between gap-4">
              <span className="font-semibold text-zinc-700">
                {item.name} x {item.quantity}
              </span>
              <span className="font-black text-zinc-950">
                {formatPeso(item.unitPriceCents * item.quantity)}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-4 border-t border-zinc-200 pt-4">
          <div className="flex justify-between text-sm font-bold text-zinc-700">
            <span>Cart subtotal</span>
            <span>{formatPeso(subtotal)}</span>
          </div>
          <p className="mt-2 text-xs font-semibold text-zinc-500">
            Final total is recalculated on the server before the order is saved.
          </p>
        </div>
        {state.message ? (
          <p className="mt-4 border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">
            {state.message}
          </p>
        ) : null}
        <button
          type="submit"
          className="mt-4 h-11 w-full bg-orange-600 px-4 text-sm font-black text-white hover:bg-orange-700"
        >
          Create pending order
        </button>
      </aside>
    </form>
  );
}
