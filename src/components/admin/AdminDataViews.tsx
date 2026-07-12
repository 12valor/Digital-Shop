"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useMemo, useState } from "react";
import {
  MdAdd,
  MdClose,
  MdContentCopy,
  MdExpandMore,
  MdFilterList,
  MdImage,
  MdInventory,
  MdOpenInNew,
  MdPayments,
  MdReceiptLong,
  MdSearch,
  MdTune,
} from "react-icons/md";

import {
  BannerCreateForm,
  BrandCreateForm,
  CategoryCreateForm,
  HomepageSectionCreateForm,
  InventoryAdjustForm,
  OrderStatusForm,
  ProductCreateForm,
  ProductImageUploadForm,
  ProductVariantForm,
  RejectPaymentForm,
} from "@/components/admin/AdminForms";
import {
  AdminEmptyState,
  AdminSection,
  AdminStatusBadge,
  adminButtonClass,
  adminInputClass,
  formatAdminStatus,
} from "@/components/admin/AdminPrimitives";
import {
  ApprovePaymentButton,
  ArchiveProductButton,
  RequestResubmissionButton,
} from "@/components/admin/AdminOperations";
import { formatPeso } from "@/lib/format";
import type { Database } from "@/types/database";

type Product = Database["public"]["Tables"]["products"]["Row"];
type Category = Database["public"]["Tables"]["categories"]["Row"];
type Brand = Database["public"]["Tables"]["brands"]["Row"];
type Inventory = Database["public"]["Tables"]["inventory"]["Row"];
type Movement = Database["public"]["Tables"]["inventory_movements"]["Row"];
type Order = Database["public"]["Tables"]["orders"]["Row"];
type Proof = Database["public"]["Tables"]["payment_proofs"]["Row"];
type Banner = Database["public"]["Tables"]["homepage_banners"]["Row"];
type HomepageSection = Database["public"]["Tables"]["homepage_sections"]["Row"];
type ProfileSummary = Pick<Database["public"]["Tables"]["profiles"]["Row"], "id" | "email" | "full_name">;
type ProductSummary = Pick<Product, "id" | "name" | "slug">;
type VariantSummary = Pick<Database["public"]["Tables"]["product_variants"]["Row"], "id" | "product_id" | "name" | "sku">;

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-PH", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function SearchFilters({
  query,
  onQuery,
  selects,
}: {
  query: string;
  onQuery: (value: string) => void;
  selects: Array<{
    label: string;
    value: string;
    options: Array<{ label: string; value: string }>;
    onChange: (value: string) => void;
  }>;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-3 shadow-sm sm:flex-row sm:items-center">
      <label className="relative min-w-0 flex-1">
        <span className="sr-only">Search</span>
        <MdSearch className="pointer-events-none absolute top-1/2 left-3 size-5 -translate-y-1/2 text-slate-400" aria-hidden="true" />
        <input
          value={query}
          onChange={(event) => onQuery(event.target.value)}
          placeholder="Search records"
          className={adminInputClass + " pl-10"}
        />
      </label>
      <div className="flex flex-wrap items-center gap-2">
        <MdFilterList className="size-5 text-slate-400" aria-hidden="true" />
        {selects.map((select) => (
          <label key={select.label} className="min-w-36 flex-1 sm:flex-none">
            <span className="sr-only">{select.label}</span>
            <select
              aria-label={select.label}
              value={select.value}
              onChange={(event) => select.onChange(event.target.value)}
              className={adminInputClass}
            >
              {select.options.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </label>
        ))}
      </div>
    </div>
  );
}

function SidePanel({
  open,
  title,
  description,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  description: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.button
            type="button"
            aria-label="Close panel"
            onClick={onClose}
            className="fixed inset-0 z-50 bg-slate-950/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.18 }}
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-labelledby="admin-panel-title"
            initial={reduceMotion ? false : { x: 520 }}
            animate={{ x: 0 }}
            exit={{ x: 520 }}
            transition={{ duration: reduceMotion ? 0 : 0.2, ease: "easeOut" }}
            className="fixed inset-y-0 right-0 z-[60] w-full max-w-xl overflow-y-auto border-l border-slate-200 bg-[#f6f8fb] shadow-2xl"
          >
            <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-slate-200 bg-white px-5 py-4">
              <div>
                <h2 id="admin-panel-title" className="text-lg font-black text-slate-950">{title}</h2>
                <p className="mt-1 text-sm text-slate-500">{description}</p>
              </div>
              <button type="button" onClick={onClose} aria-label="Close panel" className="grid size-10 shrink-0 place-items-center rounded-md text-slate-500 hover:bg-slate-100">
                <MdClose className="size-6" aria-hidden="true" />
              </button>
            </div>
            <div className="p-4 sm:p-5">{children}</div>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}

function CountLabel({ count, noun }: { count: number; noun: string }) {
  return <p className="text-sm font-semibold text-slate-500">{count} {count === 1 ? noun : noun + "s"}</p>;
}

export function ProductManagementView({
  products,
  categories,
  brands,
}: {
  products: Product[];
  categories: Category[];
  brands: Brand[];
}) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [createOpen, setCreateOpen] = useState(false);
  const [createTab, setCreateTab] = useState<"product" | "category" | "brand">("product");
  const [managedId, setManagedId] = useState<string | null>(null);
  const reduceMotion = useReducedMotion();

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return products.filter((product) => {
      const matchesText = !normalized || [product.name, product.slug, product.badge].filter(Boolean).join(" ").toLowerCase().includes(normalized);
      return matchesText && (status === "all" || product.status === status);
    });
  }, [products, query, status]);

  const managed = products.find((product) => product.id === managedId);

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <CountLabel count={filtered.length} noun="product" />
        <button type="button" onClick={() => setCreateOpen(true)} className={adminButtonClass}>
          <MdAdd className="size-5" aria-hidden="true" /> Add catalog record
        </button>
      </div>
      <SearchFilters
        query={query}
        onQuery={setQuery}
        selects={[{
          label: "Product status",
          value: status,
          onChange: setStatus,
          options: [
            { label: "All statuses", value: "all" },
            { label: "Active", value: "active" },
            { label: "Draft", value: "draft" },
            { label: "Archived", value: "archived" },
          ],
        }]}
      />

      <AdminSection title="Product catalog" description="Manage storefront products, variants, images, and archive state.">
        {filtered.length > 0 ? (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="bg-slate-50 text-xs font-black uppercase text-slate-500">
                  <tr>
                    <th className="px-5 py-3">Product</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Price</th>
                    <th className="px-4 py-3">Badge</th>
                    <th className="px-5 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filtered.map((product) => (
                    <tr key={product.id} className="transition duration-200 hover:bg-blue-50/40">
                      <td className="px-5 py-4">
                        <p className="font-black text-slate-950">{product.name}</p>
                        <p className="mt-1 text-xs text-slate-500">{product.slug}</p>
                      </td>
                      <td className="px-4 py-4"><AdminStatusBadge status={product.status} /></td>
                      <td className="px-4 py-4 font-bold text-slate-800">{formatPeso(product.sale_price_cents ?? product.price_cents)}</td>
                      <td className="px-4 py-4 text-slate-600">{product.badge ?? "None"}</td>
                      <td className="px-5 py-4 text-right">
                        <button type="button" onClick={() => setManagedId(managedId === product.id ? null : product.id)} className="inline-flex h-9 items-center gap-1 rounded-md px-3 text-sm font-black text-blue-700 hover:bg-blue-50">
                          <MdTune className="size-5" aria-hidden="true" /> Manage
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="divide-y divide-slate-200 md:hidden">
              {filtered.map((product) => (
                <article key={product.id} className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="truncate font-black text-slate-950">{product.name}</h3>
                      <p className="mt-1 truncate text-xs text-slate-500">{product.slug}</p>
                    </div>
                    <AdminStatusBadge status={product.status} />
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <p className="font-black text-slate-900">{formatPeso(product.sale_price_cents ?? product.price_cents)}</p>
                    <button type="button" onClick={() => setManagedId(managedId === product.id ? null : product.id)} className="inline-flex h-9 items-center gap-1 rounded-md px-3 text-sm font-black text-blue-700 hover:bg-blue-50">
                      <MdTune className="size-5" /> Manage
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </>
        ) : (
          <AdminEmptyState title="No products found" description="Adjust the search or status filter, or create a new product." icon={MdSearch} />
        )}
      </AdminSection>

      <AnimatePresence>
        {managed ? (
          <motion.section
            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: reduceMotion ? 0 : 0.18 }}
            className="rounded-lg border border-blue-200 bg-white p-4 shadow-sm sm:p-5"
          >
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase text-blue-700">Managing product</p>
                <h2 className="mt-1 text-lg font-black text-slate-950">{managed.name}</h2>
              </div>
              <button type="button" onClick={() => setManagedId(null)} className="grid size-9 place-items-center rounded-md text-slate-500 hover:bg-slate-100" aria-label="Close product management">
                <MdClose className="size-5" />
              </button>
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              <ProductVariantForm productId={managed.id} />
              <ProductImageUploadForm productId={managed.id} />
            </div>
            {managed.status !== "archived" ? <div className="mt-4"><ArchiveProductButton productId={managed.id} /></div> : null}
          </motion.section>
        ) : null}
      </AnimatePresence>

      <SidePanel open={createOpen} title="Add catalog record" description="Create a product, category, or brand." onClose={() => setCreateOpen(false)}>
        <div className="mb-4 grid grid-cols-3 rounded-lg border border-slate-200 bg-white p-1">
          {(["product", "category", "brand"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setCreateTab(tab)}
              className={"h-10 rounded-md text-sm font-black capitalize transition " + (createTab === tab ? "bg-blue-700 text-white" : "text-slate-600 hover:bg-slate-100")}
            >
              {tab}
            </button>
          ))}
        </div>
        {createTab === "product" ? <ProductCreateForm categories={categories} brands={brands} /> : null}
        {createTab === "category" ? <CategoryCreateForm /> : null}
        {createTab === "brand" ? <BrandCreateForm /> : null}
      </SidePanel>
    </div>
  );
}

export function InventoryManagementView({
  inventory,
  products,
  variants,
  movements,
}: {
  inventory: Inventory[];
  products: ProductSummary[];
  variants: VariantSummary[];
  movements: Movement[];
}) {
  const [query, setQuery] = useState("");
  const [stockState, setStockState] = useState("all");
  const [activeId, setActiveId] = useState<string | null>(null);
  const productNames = useMemo(() => new Map(products.map((product) => [product.id, product.name])), [products]);
  const variantNames = useMemo(() => new Map(variants.map((variant) => [variant.id, variant.name])), [variants]);
  const productName = (id: string) => productNames.get(id) ?? "Unknown product";
  const variantName = (id: string | null) => id ? variantNames.get(id) ?? "Variant" : "Default stock";

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return inventory.filter((item) => {
      const searchable = ((productNames.get(item.product_id) ?? "Unknown product") + " " + (item.variant_id ? variantNames.get(item.variant_id) ?? "Variant" : "Default stock")).toLowerCase();
      const state = item.quantity <= 0 ? "out" : item.quantity <= item.low_stock_threshold ? "low" : "available";
      return (!normalized || searchable.includes(normalized)) && (stockState === "all" || state === stockState);
    });
  }, [inventory, productNames, query, stockState, variantNames]);

  const stockStatus = (item: Inventory) => item.quantity <= 0 ? "out_of_stock" : item.quantity <= item.low_stock_threshold ? "low_stock" : "active";
  const active = inventory.find((item) => item.id === activeId);

  return (
    <div className="grid gap-4">
      <SearchFilters
        query={query}
        onQuery={setQuery}
        selects={[{
          label: "Stock status",
          value: stockState,
          onChange: setStockState,
          options: [
            { label: "All stock states", value: "all" },
            { label: "Available", value: "available" },
            { label: "Low stock", value: "low" },
            { label: "Out of stock", value: "out" },
          ],
        }]}
      />
      <AdminSection title="Current inventory" description="Available stock by product and variant.">
        {filtered.length > 0 ? (
          <div className="divide-y divide-slate-200">
            {filtered.map((item) => (
              <article key={item.id} className="grid gap-4 p-4 transition hover:bg-blue-50/30 sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:items-center sm:px-5">
                <div className="min-w-0">
                  <h3 className="truncate font-black text-slate-950">{productName(item.product_id)}</h3>
                  <p className="mt-1 text-sm text-slate-500">{variantName(item.variant_id)}</p>
                </div>
                <div className="flex items-center gap-3 sm:justify-end">
                  <div className="text-right">
                    <p className="text-xl font-black text-slate-950">{item.quantity}</p>
                    <p className="text-[11px] font-bold text-slate-500">Low at {item.low_stock_threshold}</p>
                  </div>
                  <AdminStatusBadge status={stockStatus(item)} />
                </div>
                <button type="button" onClick={() => setActiveId(activeId === item.id ? null : item.id)} className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-slate-200 px-3 text-sm font-black text-blue-700 hover:bg-blue-50">
                  <MdInventory className="size-5" /> Adjust
                </button>
              </article>
            ))}
          </div>
        ) : <AdminEmptyState title="No inventory found" description="Adjust the search or stock-state filter." icon={MdInventory} />}
      </AdminSection>

      <AnimatePresence>
        {active ? (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <InventoryAdjustForm inventoryId={active.id} />
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AdminSection title="Recent inventory activity" description="Latest stock additions, deductions, and corrections.">
        {movements.length > 0 ? (
          <div className="divide-y divide-slate-200">
            {movements.map((movement) => (
              <div key={movement.id} className="flex items-center justify-between gap-4 px-4 py-3 text-sm sm:px-5">
                <div>
                  <p className="font-bold text-slate-900">{productName(movement.product_id)}</p>
                  <p className="mt-1 text-xs text-slate-500">{movement.reason ?? formatAdminStatus(movement.movement_type)}</p>
                </div>
                <span className={"font-black " + (movement.quantity_delta > 0 ? "text-emerald-700" : "text-red-700")}>
                  {movement.quantity_delta > 0 ? "+" : ""}{movement.quantity_delta}
                </span>
              </div>
            ))}
          </div>
        ) : <AdminEmptyState title="No inventory activity" description="Stock adjustments will be recorded here." icon={MdInventory} />}
      </AdminSection>
    </div>
  );
}

export function PaymentManagementView({
  proofs,
  orders,
  profiles,
  proofUrls,
}: {
  proofs: Proof[];
  orders: Order[];
  profiles: ProfileSummary[];
  proofUrls: Record<string, string>;
}) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const customerEmails = useMemo(() => new Map(profiles.map((profile) => [profile.id, profile.email])), [profiles]);
  const ordersById = useMemo(() => new Map(orders.map((order) => [order.id, order])), [orders]);
  const customer = (id: string) => customerEmails.get(id) ?? "Unknown customer";
  const orderFor = (id: string) => ordersById.get(id);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return proofs.filter((proof) => {
      const order = ordersById.get(proof.order_id);
      const searchable = [proof.gcash_reference_number, proof.sender_name, customerEmails.get(proof.user_id) ?? "Unknown customer", order?.order_number].filter(Boolean).join(" ").toLowerCase();
      return (!normalized || searchable.includes(normalized)) && (status === "all" || proof.status === status);
    });
  }, [customerEmails, ordersById, proofs, query, status]);

  return (
    <div className="grid gap-4">
      <SearchFilters
        query={query}
        onQuery={setQuery}
        selects={[{
          label: "Payment status",
          value: status,
          onChange: setStatus,
          options: [
            { label: "All statuses", value: "all" },
            { label: "Proof submitted", value: "proof_submitted" },
            { label: "Under review", value: "under_review" },
            { label: "Paid", value: "paid" },
            { label: "Rejected", value: "rejected" },
          ],
        }]}
      />
      <CountLabel count={filtered.length} noun="payment submission" />
      {filtered.length > 0 ? (
        <div className="grid gap-4">
          {filtered.map((proof) => {
            const order = orderFor(proof.order_id);
            return (
              <article key={proof.id} className="rounded-lg border border-slate-200 bg-white shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-200 px-4 py-4 sm:px-5">
                  <div>
                    <p className="text-xs font-black uppercase text-orange-600">Payment review</p>
                    <h2 className="mt-1 font-black text-slate-950">{order?.order_number ?? "Unknown order"}</h2>
                    <p className="mt-1 text-xs text-slate-500">Submitted {formatDate(proof.created_at)}</p>
                  </div>
                  <AdminStatusBadge status={proof.status} />
                </div>
                <div className="grid lg:grid-cols-[minmax(0,1fr)_340px]">
                  <div className="grid gap-x-6 gap-y-4 p-4 text-sm sm:grid-cols-2 sm:p-5">
                    {[
                      ["Customer", customer(proof.user_id)],
                      ["Sender", proof.sender_name],
                      ["Expected amount", order ? formatPeso(order.total_cents) : "Unavailable"],
                      ["Submitted amount", formatPeso(proof.amount_paid_cents)],
                      ["GCash reference", proof.gcash_reference_number],
                      ["Sender mobile", proof.sender_mobile_number],
                    ].map(([label, value]) => (
                      <div key={label}>
                        <p className="text-xs font-bold text-slate-500">{label}</p>
                        <p className="mt-1 break-words font-black text-slate-900">{value}</p>
                      </div>
                    ))}
                    {proofUrls[proof.id] ? (
                      <a href={proofUrls[proof.id]} target="_blank" rel="noreferrer" className="inline-flex h-10 w-fit items-center gap-2 rounded-md bg-blue-50 px-3 font-black text-blue-700 hover:bg-blue-100 sm:col-span-2">
                        <MdOpenInNew className="size-5" /> Open receipt
                      </a>
                    ) : (
                      <p className="break-all text-xs text-slate-500 sm:col-span-2">Receipt path: {proof.storage_path}</p>
                    )}
                  </div>
                  <div className="grid content-start gap-3 border-t border-slate-200 bg-slate-50 p-4 sm:p-5 lg:border-t-0 lg:border-l">
                    <p className="text-xs font-black uppercase text-slate-500">Review decision</p>
                    <ApprovePaymentButton proofId={proof.id} />
                    <RequestResubmissionButton proofId={proof.id} />
                    <RejectPaymentForm proofId={proof.id} />
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : <AdminEmptyState title="No payment submissions found" description="Adjust the search or payment-status filter." icon={MdPayments} />}
    </div>
  );
}

export function OrderManagementView({
  orders,
  profiles,
}: {
  orders: Order[];
  profiles: ProfileSummary[];
}) {
  const [query, setQuery] = useState("");
  const [orderStatus, setOrderStatus] = useState("all");
  const [paymentStatus, setPaymentStatus] = useState("all");
  const [activeId, setActiveId] = useState<string | null>(null);
  const customerEmails = useMemo(() => new Map(profiles.map((profile) => [profile.id, profile.email])), [profiles]);
  const customer = (id: string) => customerEmails.get(id) ?? "Unknown customer";

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return orders.filter((order) => {
      const searchable = (order.order_number + " " + (customerEmails.get(order.user_id) ?? "Unknown customer")).toLowerCase();
      return (!normalized || searchable.includes(normalized)) &&
        (orderStatus === "all" || order.status === orderStatus) &&
        (paymentStatus === "all" || order.payment_status === paymentStatus);
    });
  }, [customerEmails, orders, query, orderStatus, paymentStatus]);

  return (
    <div className="grid gap-4">
      <SearchFilters
        query={query}
        onQuery={setQuery}
        selects={[
          {
            label: "Order status",
            value: orderStatus,
            onChange: setOrderStatus,
            options: [
              { label: "All order states", value: "all" },
              ...["awaiting_payment", "for_verification", "paid", "processing", "packed", "shipped", "completed", "cancelled", "refunded"].map((value) => ({ label: formatAdminStatus(value), value })),
            ],
          },
          {
            label: "Payment status",
            value: paymentStatus,
            onChange: setPaymentStatus,
            options: [
              { label: "All payment states", value: "all" },
              ...["awaiting_payment", "proof_submitted", "under_review", "paid", "rejected", "expired", "refunded"].map((value) => ({ label: formatAdminStatus(value), value })),
            ],
          },
        ]}
      />
      <CountLabel count={filtered.length} noun="order" />
      {filtered.length > 0 ? (
        <div className="grid gap-3">
          {filtered.map((order) => (
            <article key={order.id} className="rounded-lg border border-slate-200 bg-white shadow-sm">
              <div className="grid gap-4 p-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:p-5">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-black text-slate-950">{order.order_number}</h2>
                    <AdminStatusBadge status={order.status} />
                    <AdminStatusBadge status={order.payment_status} />
                  </div>
                  <p className="mt-2 truncate text-sm text-slate-500">{customer(order.user_id)}</p>
                  <p className="mt-1 text-xs text-slate-400">{formatDate(order.created_at)}</p>
                </div>
                <div className="flex items-center justify-between gap-4 sm:justify-end">
                  <p className="text-lg font-black text-orange-600">{formatPeso(order.total_cents)}</p>
                  <button type="button" onClick={() => setActiveId(activeId === order.id ? null : order.id)} className="inline-flex h-10 items-center gap-2 rounded-md border border-slate-200 px-3 text-sm font-black text-blue-700 hover:bg-blue-50">
                    <MdTune className="size-5" /> Manage
                    <MdExpandMore className={"size-5 transition-transform " + (activeId === order.id ? "rotate-180" : "")} />
                  </button>
                </div>
              </div>
              <AnimatePresence>
                {activeId === order.id ? (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden border-t border-slate-200">
                    <div className="grid gap-4 bg-slate-50 p-4 sm:p-5 lg:grid-cols-[minmax(0,1fr)_360px]">
                      <div>
                        <p className="text-xs font-black uppercase text-slate-500">Internal notes</p>
                        {order.internal_notes ? (
                          <pre className="mt-2 whitespace-pre-wrap rounded-md border border-slate-200 bg-white p-3 font-sans text-sm leading-6 text-slate-600">{order.internal_notes}</pre>
                        ) : <p className="mt-2 text-sm text-slate-500">No internal notes recorded.</p>}
                      </div>
                      <OrderStatusForm orderId={order.id} />
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </article>
          ))}
        </div>
      ) : <AdminEmptyState title="No orders found" description="Adjust the search, order, or payment filters." icon={MdReceiptLong} />}
    </div>
  );
}

export function HomepageManagementView({
  banners,
  sections,
}: {
  banners: Banner[];
  sections: HomepageSection[];
}) {
  const [tab, setTab] = useState<"banners" | "sections">("banners");
  const [createOpen, setCreateOpen] = useState(false);
  const records = tab === "banners" ? banners : sections;

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex rounded-lg border border-slate-200 bg-white p-1 shadow-sm">
          <button type="button" onClick={() => setTab("banners")} className={"inline-flex h-10 items-center gap-2 rounded-md px-4 text-sm font-black transition " + (tab === "banners" ? "bg-blue-700 text-white" : "text-slate-600 hover:bg-slate-100")}>
            <MdImage className="size-5" /> Banners
          </button>
          <button type="button" onClick={() => setTab("sections")} className={"inline-flex h-10 items-center gap-2 rounded-md px-4 text-sm font-black transition " + (tab === "sections" ? "bg-blue-700 text-white" : "text-slate-600 hover:bg-slate-100")}>
            <MdContentCopy className="size-5" /> Sections
          </button>
        </div>
        <button type="button" onClick={() => setCreateOpen(true)} className={adminButtonClass}>
          <MdAdd className="size-5" /> Add {tab === "banners" ? "banner" : "section"}
        </button>
      </div>

      <AdminSection
        title={tab === "banners" ? "Homepage banners" : "Homepage sections"}
        description={tab === "banners" ? "Promotional artwork shown in the storefront hero." : "Ordered dynamic content rows shown on the homepage."}
      >
        {records.length > 0 ? (
          <div className="divide-y divide-slate-200">
            {tab === "banners"
              ? banners.map((banner) => (
                  <div key={banner.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-5">
                    <div>
                      <p className="font-black text-slate-950">{banner.title}</p>
                      <p className="mt-1 text-xs text-slate-500">Display order {banner.sort_order}</p>
                    </div>
                    <AdminStatusBadge status={banner.is_active ? "visible" : "hidden"} />
                  </div>
                ))
              : sections.map((section) => (
                  <div key={section.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-5">
                    <div>
                      <p className="font-black text-slate-950">{section.title}</p>
                      <p className="mt-1 text-xs text-slate-500">{section.section_key} · display order {section.sort_order}</p>
                    </div>
                    <AdminStatusBadge status={section.is_visible ? "visible" : "hidden"} />
                  </div>
                ))}
          </div>
        ) : (
          <AdminEmptyState
            title={tab === "banners" ? "No banners yet" : "No homepage sections yet"}
            description={"Create the first " + (tab === "banners" ? "banner" : "section") + " to manage storefront content."}
            icon={tab === "banners" ? MdImage : MdContentCopy}
          />
        )}
      </AdminSection>

      <SidePanel
        open={createOpen}
        title={tab === "banners" ? "Create banner" : "Create homepage section"}
        description="Configure the content and storefront visibility."
        onClose={() => setCreateOpen(false)}
      >
        {tab === "banners" ? <BannerCreateForm /> : <HomepageSectionCreateForm />}
      </SidePanel>
    </div>
  );
}