"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import type { IconType } from "react-icons";
import {
  MdAdd,
  MdCloudUpload,
  MdEdit,
  MdInventory,
  MdSave,
  MdSend,
} from "react-icons/md";

import {
  adjustInventoryAction,
  createBrandAction,
  createCategoryAction,
  createBannerAction,
  createHomepageSectionAction,
  createProductAction,
  createVariantAction,
  rejectPaymentAction,
  updateOrderStatusAction,
  uploadProductImageAction,
} from "@/app/admin/actions";
import {
  adminButtonClass,
  adminInputClass,
} from "@/components/admin/AdminPrimitives";
import type { AdminActionState } from "@/types/admin";

const initialState: AdminActionState = { status: "idle", message: "" };
const panelClass = "grid gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm";

function Message({ state }: { state: AdminActionState }) {
  if (!state.message) return null;

  return (
    <p
      aria-live="polite"
      className={
        state.status === "success"
          ? "rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700"
          : "rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700"
      }
    >
      {state.message}
    </p>
  );
}

function SubmitButton({
  children,
  icon: Icon = MdSave,
  tone = "primary",
}: {
  children: React.ReactNode;
  icon?: IconType;
  tone?: "primary" | "danger";
}) {
  const { pending } = useFormStatus();
  const classes =
    tone === "danger"
      ? "inline-flex h-10 items-center justify-center gap-2 rounded-md border border-red-200 bg-white px-4 text-sm font-black text-red-700 transition hover:bg-red-50 active:scale-[0.98] disabled:cursor-wait disabled:opacity-60"
      : adminButtonClass;

  return (
    <button type="submit" disabled={pending} className={classes}>
      <Icon className={pending ? "size-5 animate-pulse" : "size-5"} aria-hidden="true" />
      {pending ? "Working..." : children}
    </button>
  );
}

function LabelText({ label, required }: { label: string; required?: boolean }) {
  return (
    <span>
      {label}
      {required ? <span className="ml-1 text-orange-600">*</span> : <span className="ml-1 font-medium text-slate-400">(optional)</span>}
    </span>
  );
}

function Input({
  name,
  label,
  type = "text",
  required = false,
  placeholder,
  min,
  step,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  min?: string;
  step?: string;
}) {
  return (
    <label className="grid gap-1.5 text-sm font-bold text-slate-700">
      <LabelText label={label} required={required} />
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        min={min}
        step={step}
        className={adminInputClass}
      />
    </label>
  );
}

function PanelHeading({ title, description }: { title: string; description?: string }) {
  return (
    <div>
      <h2 className="text-base font-black text-slate-950">{title}</h2>
      {description ? <p className="mt-1 text-sm leading-5 text-slate-500">{description}</p> : null}
    </div>
  );
}

export function ProductCreateForm({
  categories,
  brands,
}: {
  categories: { id: string; name: string }[];
  brands: { id: string; name: string }[];
}) {
  const [state, action] = useActionState(createProductAction, initialState);

  return (
    <form action={action} className={panelClass}>
      <PanelHeading title="Create product" description="Add the core product record before variants, images, and stock." />
      <Input name="name" label="Product name" required />
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-1.5 text-sm font-bold text-slate-700">
          <LabelText label="Category" />
          <select name="categoryId" className={adminInputClass}>
            <option value="">No category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
        </label>
        <label className="grid gap-1.5 text-sm font-bold text-slate-700">
          <LabelText label="Brand" />
          <select name="brandId" className={adminInputClass}>
            <option value="">No brand</option>
            {brands.map((brand) => (
              <option key={brand.id} value={brand.id}>{brand.name}</option>
            ))}
          </select>
        </label>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Input name="price" label="Regular price" type="number" required min="0" step="0.01" />
        <Input name="salePrice" label="Sale price" type="number" min="0" step="0.01" />
      </div>
      <Input name="badge" label="Badge" placeholder="New, Sale, Featured" />
      <label className="grid gap-1.5 text-sm font-bold text-slate-700">
        <LabelText label="Description" />
        <textarea name="description" rows={4} className={adminInputClass + " h-auto resize-y py-2.5"} />
      </label>
      <label className="flex items-center gap-3 text-sm font-bold text-slate-700">
        <input name="featured" type="checkbox" className="size-4 accent-blue-700" />
        Feature this product on the storefront
      </label>
      <Message state={state} />
      <SubmitButton icon={MdAdd}>Create product</SubmitButton>
    </form>
  );
}

export function CategoryCreateForm() {
  const [state, action] = useActionState(createCategoryAction, initialState);

  return (
    <form action={action} className={panelClass}>
      <PanelHeading title="Create category" description="Organize products into storefront collections." />
      <Input name="name" label="Category name" required />
      <Input name="description" label="Description" />
      <Message state={state} />
      <SubmitButton icon={MdAdd}>Create category</SubmitButton>
    </form>
  );
}

export function BrandCreateForm() {
  const [state, action] = useActionState(createBrandAction, initialState);

  return (
    <form action={action} className={panelClass}>
      <PanelHeading title="Create brand" description="Add a brand customers can browse and filter." />
      <Input name="name" label="Brand name" required />
      <Input name="description" label="Description" />
      <Message state={state} />
      <SubmitButton icon={MdAdd}>Create brand</SubmitButton>
    </form>
  );
}

export function ProductVariantForm({ productId }: { productId: string }) {
  const [state, action] = useActionState(createVariantAction, initialState);

  return (
    <form action={action} className="grid gap-3 rounded-md border border-slate-200 bg-slate-50 p-4">
      <input type="hidden" name="productId" value={productId} />
      <PanelHeading title="Add variant" description="Create an option with its own SKU and starting stock." />
      <div className="grid gap-3 sm:grid-cols-2">
        <Input name="name" label="Variant name" required />
        <Input name="sku" label="SKU" />
        <Input name="price" label="Price override" type="number" min="0" step="0.01" />
        <Input name="quantity" label="Starting stock" type="number" min="0" />
      </div>
      <Message state={state} />
      <SubmitButton icon={MdAdd}>Add variant</SubmitButton>
    </form>
  );
}

export function ProductImageUploadForm({ productId }: { productId: string }) {
  const [state, action] = useActionState(uploadProductImageAction, initialState);

  return (
    <form action={action} className="grid gap-3 rounded-md border border-slate-200 bg-slate-50 p-4">
      <input type="hidden" name="productId" value={productId} />
      <PanelHeading title="Upload image" description="JPG, PNG, or WebP product imagery." />
      <Input name="altText" label="Alternative text" />
      <label className="flex items-center gap-3 text-sm font-bold text-slate-700">
        <input name="isPrimary" type="checkbox" className="size-4 accent-blue-700" />
        Use as primary product image
      </label>
      <label className="grid gap-1.5 text-sm font-bold text-slate-700">
        <LabelText label="Image file" required />
        <input
          name="image"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 file:mr-3 file:rounded file:border-0 file:bg-blue-50 file:px-3 file:py-1.5 file:font-bold file:text-blue-700"
          required
        />
      </label>
      <Message state={state} />
      <SubmitButton icon={MdCloudUpload}>Upload image</SubmitButton>
    </form>
  );
}

export function InventoryAdjustForm({ inventoryId }: { inventoryId: string }) {
  const [state, action] = useActionState(adjustInventoryAction, initialState);

  return (
    <form action={action} className="grid gap-3 rounded-md border border-slate-200 bg-slate-50 p-4 sm:grid-cols-[140px_1fr_auto] sm:items-end">
      <input type="hidden" name="inventoryId" value={inventoryId} />
      <Input name="quantityDelta" label="Quantity change" type="number" required placeholder="+10 or -3" />
      <Input name="reason" label="Reason" placeholder="Restock, correction..." />
      <SubmitButton icon={MdInventory}>Adjust stock</SubmitButton>
      <div className="sm:col-span-3"><Message state={state} /></div>
    </form>
  );
}

export function OrderStatusForm({ orderId }: { orderId: string }) {
  const [state, action] = useActionState(updateOrderStatusAction, initialState);
  const statuses = ["awaiting_payment", "for_verification", "paid", "processing", "packed", "shipped", "completed", "cancelled", "refunded"];

  return (
    <form action={action} className="grid gap-3 rounded-md border border-slate-200 bg-slate-50 p-4">
      <input type="hidden" name="orderId" value={orderId} />
      <label className="grid gap-1.5 text-sm font-bold text-slate-700">
        <LabelText label="Order status" required />
        <select name="status" className={adminInputClass}>
          {statuses.map((status) => <option key={status} value={status}>{status.replaceAll("_", " ")}</option>)}
        </select>
      </label>
      <div className="grid gap-3 sm:grid-cols-2">
        <Input name="courier" label="Courier" />
        <Input name="trackingNumber" label="Tracking number" />
      </div>
      <Input name="note" label="Internal note" />
      <Message state={state} />
      <SubmitButton icon={MdEdit}>Update order</SubmitButton>
    </form>
  );
}

export function RejectPaymentForm({ proofId }: { proofId: string }) {
  const [state, action] = useActionState(rejectPaymentAction, initialState);

  return (
    <form action={action} className="grid gap-3 rounded-md border border-red-100 bg-red-50 p-4">
      <input type="hidden" name="proofId" value={proofId} />
      <Input name="reason" label="Rejection reason" required />
      <Message state={state} />
      <SubmitButton icon={MdSend} tone="danger">Reject payment</SubmitButton>
    </form>
  );
}

export function BannerCreateForm() {
  const [state, action] = useActionState(createBannerAction, initialState);

  return (
    <form action={action} className={panelClass}>
      <PanelHeading title="Create banner" description="Publish a promotional image and destination link." />
      <Input name="title" label="Title" required />
      <Input name="subtitle" label="Subtitle" />
      <Input name="imageUrl" label="Image URL" required />
      <Input name="href" label="Destination link" />
      <Input name="sortOrder" label="Sort order" type="number" min="0" />
      <label className="flex items-center gap-3 text-sm font-bold text-slate-700">
        <input name="isActive" type="checkbox" className="size-4 accent-blue-700" defaultChecked />
        Publish immediately
      </label>
      <Message state={state} />
      <SubmitButton icon={MdAdd}>Create banner</SubmitButton>
    </form>
  );
}

export function HomepageSectionCreateForm() {
  const [state, action] = useActionState(createHomepageSectionAction, initialState);

  return (
    <form action={action} className={panelClass}>
      <PanelHeading title="Create homepage section" description="Configure a dynamic storefront content row." />
      <Input name="title" label="Title" required />
      <Input name="sectionKey" label="Section key" />
      <Input name="source" label="Content source" />
      <Input name="label" label="Promotional label" />
      <Input name="sortOrder" label="Sort order" type="number" min="0" />
      <label className="flex items-center gap-3 text-sm font-bold text-slate-700">
        <input name="isVisible" type="checkbox" className="size-4 accent-blue-700" defaultChecked />
        Show this section
      </label>
      <Message state={state} />
      <SubmitButton icon={MdAdd}>Create section</SubmitButton>
    </form>
  );
}