"use client";

import { Check, LoaderCircle, Plus } from "lucide-react";
import { useActionState } from "react";

import {
  type AccountActionState,
  createAddressAction,
  updateProfileAction,
} from "@/app/account/actions";

const initialState: AccountActionState = { status: "idle", message: "" };
const inputClass =
  "h-11 w-full border border-zinc-300 bg-white px-3 text-sm text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-100";

function Message({ state }: { state: AccountActionState }) {
  if (!state.message) return null;
  return (
    <p
      aria-live="polite"
      className={`border px-3 py-2 text-sm font-semibold ${
        state.status === "success"
          ? "border-emerald-200 bg-emerald-50 text-emerald-800"
          : "border-red-200 bg-red-50 text-red-800"
      }`}
    >
      {state.message}
    </p>
  );
}

function Field({
  label,
  name,
  defaultValue,
  autoComplete,
  type = "text",
  className = "",
}: {
  label: string;
  name: string;
  defaultValue?: string;
  autoComplete?: string;
  type?: string;
  className?: string;
}) {
  return (
    <label className={`grid gap-2 text-sm font-bold text-zinc-800 ${className}`}>
      {label}
      <input
        className={inputClass}
        name={name}
        type={type}
        defaultValue={defaultValue}
        autoComplete={autoComplete}
        required
      />
    </label>
  );
}

export function ProfileForm({
  fullName,
  phone,
  email,
}: {
  fullName: string;
  phone: string;
  email: string;
}) {
  const [state, formAction, pending] = useActionState(updateProfileAction, initialState);

  return (
    <form action={formAction} className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Full name" name="fullName" defaultValue={fullName} autoComplete="name" />
        <Field label="Mobile number" name="phone" defaultValue={phone} autoComplete="tel" />
      </div>
      <label className="grid gap-2 text-sm font-bold text-zinc-800">
        Email address
        <input className={`${inputClass} bg-zinc-100 text-zinc-500`} value={email} disabled />
        <span className="text-xs font-medium text-zinc-500">Your verified sign-in email cannot be changed here.</span>
      </label>
      <Message state={state} />
      <button
        type="submit"
        disabled={pending}
        className="inline-flex h-11 w-fit items-center justify-center gap-2 bg-blue-900 px-5 text-sm font-black text-white transition hover:bg-blue-800 disabled:cursor-wait disabled:opacity-60"
      >
        {pending ? <LoaderCircle className="size-4 animate-spin" aria-hidden="true" /> : <Check className="size-4" aria-hidden="true" />}
        {pending ? "Saving" : "Save profile"}
      </button>
    </form>
  );
}

export function AddressForm({ defaultName = "", defaultPhone = "" }: { defaultName?: string; defaultPhone?: string }) {
  const [state, formAction, pending] = useActionState(createAddressAction, initialState);

  return (
    <details className="border border-zinc-200 bg-zinc-50" open={state.status === "error"}>
      <summary className="flex min-h-12 cursor-pointer list-none items-center gap-2 px-4 text-sm font-black text-blue-900 marker:hidden">
        <Plus className="size-4" aria-hidden="true" /> Add a delivery address
      </summary>
      <form action={formAction} className="grid gap-4 border-t border-zinc-200 bg-white p-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Address label" name="label" autoComplete="off" />
          <Field label="Recipient name" name="fullName" defaultValue={defaultName} autoComplete="name" />
          <Field label="Mobile number" name="mobileNumber" defaultValue={defaultPhone} autoComplete="tel" />
          <Field label="Region" name="region" autoComplete="address-level1" />
          <Field label="Province" name="province" autoComplete="address-level1" />
          <Field label="City or municipality" name="city" autoComplete="address-level2" />
          <Field label="Barangay" name="barangay" autoComplete="address-level3" />
          <Field label="Postal code" name="postalCode" autoComplete="postal-code" />
          <Field label="Complete address" name="streetAddress" autoComplete="street-address" className="sm:col-span-2" />
          <label className="grid gap-2 text-sm font-bold text-zinc-800 sm:col-span-2">
            Delivery notes <span className="font-medium text-zinc-500">(optional)</span>
            <textarea className={`${inputClass} min-h-24 py-3`} name="deliveryNotes" />
          </label>
        </div>
        <label className="flex items-center gap-3 text-sm font-semibold text-zinc-700">
          <input type="checkbox" name="isDefault" className="size-4 accent-orange-600" />
          Use as my default delivery address
        </label>
        <Message state={state} />
        <button
          type="submit"
          disabled={pending}
          className="inline-flex h-11 w-fit items-center justify-center gap-2 bg-orange-600 px-5 text-sm font-black text-white transition hover:bg-orange-700 disabled:cursor-wait disabled:opacity-60"
        >
          {pending ? <LoaderCircle className="size-4 animate-spin" aria-hidden="true" /> : <Plus className="size-4" aria-hidden="true" />}
          {pending ? "Saving" : "Save address"}
        </button>
      </form>
    </details>
  );
}
