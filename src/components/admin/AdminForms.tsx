"use client";

import { useActionState } from "react";

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
import type { AdminActionState } from "@/types/admin";

const initialState: AdminActionState = { status: "idle", message: "" };

function Message({ state }: { state: AdminActionState }) {
  if (!state.message) {
    return null;
  }

  return (
    <p
      className={
        state.status === "success"
          ? "border border-emerald-800 bg-emerald-950 px-3 py-2 text-sm text-emerald-200"
          : "border border-red-800 bg-red-950 px-3 py-2 text-sm text-red-200"
      }
    >
      {state.message}
    </p>
  );
}

function Input({
  name,
  label,
  type = "text",
  required = false,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="grid gap-1 text-sm font-semibold text-zinc-200">
      {label}
      <input
        name={name}
        type={type}
        required={required}
        className="h-10 border border-zinc-700 bg-zinc-950 px-3 text-sm text-white outline-none focus:border-orange-400"
      />
    </label>
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
    <form action={action} className="grid gap-3 border border-zinc-800 bg-zinc-900 p-4">
      <h2 className="text-lg font-black text-white">Create product</h2>
      <Input name="name" label="Product name" required />
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="grid gap-1 text-sm font-semibold text-zinc-200">
          Category
          <select name="categoryId" className="h-10 border border-zinc-700 bg-zinc-950 px-3 text-sm text-white">
            <option value="">No category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
        </label>
        <label className="grid gap-1 text-sm font-semibold text-zinc-200">
          Brand
          <select name="brandId" className="h-10 border border-zinc-700 bg-zinc-950 px-3 text-sm text-white">
            <option value="">No brand</option>
            {brands.map((brand) => (
              <option key={brand.id} value={brand.id}>{brand.name}</option>
            ))}
          </select>
        </label>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Input name="price" label="Regular price" type="number" required />
        <Input name="salePrice" label="Sale price" type="number" />
      </div>
      <Input name="badge" label="Badge" />
      <label className="grid gap-1 text-sm font-semibold text-zinc-200">
        Description
        <textarea name="description" rows={3} className="border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white outline-none focus:border-orange-400" />
      </label>
      <label className="flex items-center gap-2 text-sm font-semibold text-zinc-200">
        <input name="featured" type="checkbox" className="size-4 accent-orange-500" />
        Featured product
      </label>
      <Message state={state} />
      <button className="h-10 bg-orange-600 px-4 text-sm font-black text-white hover:bg-orange-700">
        Create product
      </button>
    </form>
  );
}

export function CategoryCreateForm() {
  const [state, action] = useActionState(createCategoryAction, initialState);

  return (
    <form action={action} className="grid gap-3 border border-zinc-800 bg-zinc-900 p-4">
      <h2 className="text-lg font-black text-white">Create category</h2>
      <Input name="name" label="Category name" required />
      <Input name="description" label="Description" />
      <Message state={state} />
      <button className="h-10 bg-orange-600 px-4 text-sm font-black text-white">Create category</button>
    </form>
  );
}

export function BrandCreateForm() {
  const [state, action] = useActionState(createBrandAction, initialState);

  return (
    <form action={action} className="grid gap-3 border border-zinc-800 bg-zinc-900 p-4">
      <h2 className="text-lg font-black text-white">Create brand</h2>
      <Input name="name" label="Brand name" required />
      <Input name="description" label="Description" />
      <Message state={state} />
      <button className="h-10 bg-orange-600 px-4 text-sm font-black text-white">Create brand</button>
    </form>
  );
}

export function ProductVariantForm({ productId }: { productId: string }) {
  const [state, action] = useActionState(createVariantAction, initialState);

  return (
    <form action={action} className="grid gap-2">
      <input type="hidden" name="productId" value={productId} />
      <div className="grid gap-2 sm:grid-cols-2">
        <input name="name" className="h-9 border border-zinc-700 bg-zinc-950 px-2 text-sm text-white" placeholder="Variant name" required />
        <input name="sku" className="h-9 border border-zinc-700 bg-zinc-950 px-2 text-sm text-white" placeholder="SKU" />
        <input name="price" type="number" className="h-9 border border-zinc-700 bg-zinc-950 px-2 text-sm text-white" placeholder="Price override" />
        <input name="quantity" type="number" className="h-9 border border-zinc-700 bg-zinc-950 px-2 text-sm text-white" placeholder="Starting stock" />
      </div>
      <Message state={state} />
      <button className="h-9 bg-orange-600 px-3 text-sm font-black text-white">Add variant</button>
    </form>
  );
}

export function ProductImageUploadForm({ productId }: { productId: string }) {
  const [state, action] = useActionState(uploadProductImageAction, initialState);

  return (
    <form action={action} className="grid gap-2">
      <input type="hidden" name="productId" value={productId} />
      <input name="altText" className="h-9 border border-zinc-700 bg-zinc-950 px-2 text-sm text-white" placeholder="Alt text" />
      <label className="flex items-center gap-2 text-xs font-semibold text-zinc-300">
        <input name="isPrimary" type="checkbox" className="size-4 accent-orange-500" />
        Primary image
      </label>
      <input name="image" type="file" accept="image/jpeg,image/png,image/webp" className="border border-zinc-700 bg-zinc-950 px-2 py-2 text-sm text-white" required />
      <Message state={state} />
      <button className="h-9 bg-orange-600 px-3 text-sm font-black text-white">Upload image</button>
    </form>
  );
}

export function InventoryAdjustForm({ inventoryId }: { inventoryId: string }) {
  const [state, action] = useActionState(adjustInventoryAction, initialState);

  return (
    <form action={action} className="grid gap-2 sm:grid-cols-[100px_1fr_auto]">
      <input type="hidden" name="inventoryId" value={inventoryId} />
      <input name="quantityDelta" type="number" className="h-9 border border-zinc-700 bg-zinc-950 px-2 text-sm text-white" placeholder="+/- qty" required />
      <input name="reason" className="h-9 border border-zinc-700 bg-zinc-950 px-2 text-sm text-white" placeholder="Reason" />
      <button className="h-9 bg-orange-600 px-3 text-sm font-black text-white">Adjust</button>
      <div className="sm:col-span-3"><Message state={state} /></div>
    </form>
  );
}

export function OrderStatusForm({ orderId }: { orderId: string }) {
  const [state, action] = useActionState(updateOrderStatusAction, initialState);
  const statuses = ["awaiting_payment", "for_verification", "paid", "processing", "packed", "shipped", "completed", "cancelled", "refunded"];

  return (
    <form action={action} className="grid gap-2">
      <input type="hidden" name="orderId" value={orderId} />
      <select name="status" className="h-9 border border-zinc-700 bg-zinc-950 px-2 text-sm text-white">
        {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
      </select>
      <div className="grid gap-2 sm:grid-cols-2">
        <input name="courier" className="h-9 border border-zinc-700 bg-zinc-950 px-2 text-sm text-white" placeholder="Courier" />
        <input name="trackingNumber" className="h-9 border border-zinc-700 bg-zinc-950 px-2 text-sm text-white" placeholder="Tracking number" />
      </div>
      <input name="note" className="h-9 border border-zinc-700 bg-zinc-950 px-2 text-sm text-white" placeholder="Internal note" />
      <Message state={state} />
      <button className="h-9 bg-orange-600 px-3 text-sm font-black text-white">Update order</button>
    </form>
  );
}

export function RejectPaymentForm({ proofId }: { proofId: string }) {
  const [state, action] = useActionState(rejectPaymentAction, initialState);

  return (
    <form action={action} className="grid gap-2">
      <input type="hidden" name="proofId" value={proofId} />
      <input name="reason" className="h-9 border border-zinc-700 bg-zinc-950 px-2 text-sm text-white" placeholder="Rejection reason" required />
      <Message state={state} />
      <button className="h-9 border border-red-700 px-3 text-sm font-black text-red-200">Reject</button>
    </form>
  );
}

export function BannerCreateForm() {
  const [state, action] = useActionState(createBannerAction, initialState);

  return (
    <form action={action} className="grid gap-3 border border-zinc-800 bg-zinc-900 p-4">
      <h2 className="text-lg font-black text-white">Create banner</h2>
      <Input name="title" label="Title" required />
      <Input name="subtitle" label="Subtitle" />
      <Input name="imageUrl" label="Image URL" required />
      <Input name="href" label="Link" />
      <Input name="sortOrder" label="Sort order" type="number" />
      <label className="flex items-center gap-2 text-sm font-semibold text-zinc-200">
        <input name="isActive" type="checkbox" className="size-4 accent-orange-500" defaultChecked />
        Active
      </label>
      <Message state={state} />
      <button className="h-10 bg-orange-600 px-4 text-sm font-black text-white">Create banner</button>
    </form>
  );
}

export function HomepageSectionCreateForm() {
  const [state, action] = useActionState(createHomepageSectionAction, initialState);

  return (
    <form action={action} className="grid gap-3 border border-zinc-800 bg-zinc-900 p-4">
      <h2 className="text-lg font-black text-white">Create homepage section</h2>
      <Input name="title" label="Title" required />
      <Input name="sectionKey" label="Section key" />
      <Input name="source" label="Source" />
      <Input name="label" label="Label" />
      <Input name="sortOrder" label="Sort order" type="number" />
      <label className="flex items-center gap-2 text-sm font-semibold text-zinc-200">
        <input name="isVisible" type="checkbox" className="size-4 accent-orange-500" defaultChecked />
        Visible
      </label>
      <Message state={state} />
      <button className="h-10 bg-orange-600 px-4 text-sm font-black text-white">Create section</button>
    </form>
  );
}
