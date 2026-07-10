"use server";

import { revalidatePath } from "next/cache";
import { randomUUID } from "node:crypto";
import { z } from "zod";

import { requireAdminArea, requireRole } from "@/lib/auth";
import { getSupabaseServiceClient } from "@/lib/supabase/service";
import type { AdminActionState, AdminOrderStatus } from "@/types/admin";

const ok = (message: string): AdminActionState => ({ status: "success", message });
const fail = (message: string): AdminActionState => ({ status: "error", message });

function value(formData: FormData, key: string) {
  const item = formData.get(key);
  return typeof item === "string" ? item.trim() : "";
}

function cents(input: string) {
  const number = Number(input);
  return Number.isFinite(number) ? Math.round(number * 100) : 0;
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

async function notifyUser({
  userId,
  orderId,
  type,
  title,
  message,
}: {
  userId: string;
  orderId?: string | null;
  type: string;
  title: string;
  message: string;
}) {
  const service = getSupabaseServiceClient();
  await service.from("notifications").insert({
    user_id: userId,
    order_id: orderId ?? null,
    type,
    title,
    message,
  });
}

const productSchema = z.object({
  name: z.string().min(2),
  categoryId: z.string().uuid().optional().or(z.literal("")),
  brandId: z.string().uuid().optional().or(z.literal("")),
  price: z.string().min(1),
  salePrice: z.string().optional(),
  badge: z.string().optional(),
  description: z.string().optional(),
  featured: z.string().optional(),
});

export async function createProductAction(
  _state: AdminActionState,
  formData: FormData,
) {
  const admin = await requireRole(["administrator"], "/admin/products");
  const parsed = productSchema.safeParse({
    name: value(formData, "name"),
    categoryId: value(formData, "categoryId"),
    brandId: value(formData, "brandId"),
    price: value(formData, "price"),
    salePrice: value(formData, "salePrice"),
    badge: value(formData, "badge"),
    description: value(formData, "description"),
    featured: value(formData, "featured"),
  });

  if (!parsed.success) {
    return fail(parsed.error.issues[0]?.message ?? "Check product details.");
  }

  const service = getSupabaseServiceClient();
  const priceCents = cents(parsed.data.price);
  const salePriceCents = parsed.data.salePrice ? cents(parsed.data.salePrice) : null;

  if (priceCents <= 0) {
    return fail("Product price must be greater than zero.");
  }

  const { data: product, error } = await service
    .from("products")
    .insert({
      name: parsed.data.name,
      slug: slugify(parsed.data.name),
      category_id: parsed.data.categoryId || null,
      brand_id: parsed.data.brandId || null,
      price_cents: priceCents,
      sale_price_cents: salePriceCents,
      badge: parsed.data.badge || null,
      description: parsed.data.description || null,
      is_featured: parsed.data.featured === "on",
      status: "active",
    })
    .select("id,name")
    .single();

  if (error || !product) {
    return fail(error?.message ?? "Could not create product.");
  }

  await service.from("inventory").insert({
    product_id: product.id,
    quantity: 0,
    low_stock_threshold: 5,
  });
  await service.from("audit_logs").insert({
    actor_id: admin.id,
    action: "product.created",
    entity_type: "products",
    entity_id: product.id,
    metadata: { name: product.name },
  });

  revalidatePath("/admin/products");
  revalidatePath("/");
  return ok("Product created.");
}

export async function archiveProductAction(formData: FormData) {
  const admin = await requireRole(["administrator"], "/admin/products");
  const productId = value(formData, "productId");
  const service = getSupabaseServiceClient();
  await service.from("products").update({ status: "archived" }).eq("id", productId);
  await service.from("audit_logs").insert({
    actor_id: admin.id,
    action: "product.archived",
    entity_type: "products",
    entity_id: productId,
  });
  revalidatePath("/admin/products");
}

export async function createCategoryAction(
  _state: AdminActionState,
  formData: FormData,
) {
  await requireRole(["administrator"], "/admin/products");
  const name = value(formData, "name");

  if (!name) {
    return fail("Category name is required.");
  }

  const service = getSupabaseServiceClient();
  const { error } = await service.from("categories").insert({
    name,
    slug: slugify(name),
    description: value(formData, "description") || null,
    is_active: true,
  });

  if (error) return fail(error.message);
  revalidatePath("/admin/products");
  return ok("Category created.");
}

export async function createBrandAction(
  _state: AdminActionState,
  formData: FormData,
) {
  await requireRole(["administrator"], "/admin/products");
  const name = value(formData, "name");

  if (!name) {
    return fail("Brand name is required.");
  }

  const service = getSupabaseServiceClient();
  const { error } = await service.from("brands").insert({
    name,
    slug: slugify(name),
    description: value(formData, "description") || null,
    is_active: true,
  });

  if (error) return fail(error.message);
  revalidatePath("/admin/products");
  return ok("Brand created.");
}

export async function createVariantAction(
  _state: AdminActionState,
  formData: FormData,
) {
  await requireRole(["administrator"], "/admin/products");
  const productId = value(formData, "productId");
  const name = value(formData, "name");

  if (!productId || !name) {
    return fail("Variant name is required.");
  }

  const service = getSupabaseServiceClient();
  const { data: variant, error } = await service
    .from("product_variants")
    .insert({
      product_id: productId,
      name,
      sku: value(formData, "sku") || null,
      price_cents: value(formData, "price") ? cents(value(formData, "price")) : null,
      sale_price_cents: value(formData, "salePrice") ? cents(value(formData, "salePrice")) : null,
      is_active: true,
    })
    .select("id,product_id")
    .single();

  if (error || !variant) return fail(error?.message ?? "Could not create variant.");

  await service.from("inventory").insert({
    product_id: variant.product_id,
    variant_id: variant.id,
    quantity: Number(value(formData, "quantity")) || 0,
    low_stock_threshold: Number(value(formData, "lowStockThreshold")) || 5,
  });
  revalidatePath("/admin/products");
  return ok("Variant created.");
}

export async function uploadProductImageAction(
  _state: AdminActionState,
  formData: FormData,
) {
  await requireRole(["administrator"], "/admin/products");
  const productId = value(formData, "productId");
  const altText = value(formData, "altText");
  const file = formData.get("image");

  if (!productId || !(file instanceof File) || file.size <= 0) {
    return fail("Select a product image.");
  }

  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
    return fail("Product image must be JPG, PNG, or WebP.");
  }

  const extension = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
  const storagePath = `${productId}/${randomUUID()}.${extension}`;
  const service = getSupabaseServiceClient();
  const { error: uploadError } = await service.storage
    .from("product-images")
    .upload(storagePath, file, { contentType: file.type, upsert: false });

  if (uploadError) return fail(uploadError.message);

  const { data: publicUrl } = service.storage.from("product-images").getPublicUrl(storagePath);
  const { error } = await service.from("product_images").insert({
    product_id: productId,
    storage_path: publicUrl.publicUrl,
    alt_text: altText,
    is_primary: value(formData, "isPrimary") === "on",
  });

  if (error) return fail(error.message);
  revalidatePath("/admin/products");
  revalidatePath("/");
  return ok("Product image uploaded.");
}

export async function adjustInventoryAction(
  _state: AdminActionState,
  formData: FormData,
) {
  const actor = await requireAdminArea("/admin/inventory");
  const inventoryId = value(formData, "inventoryId");
  const delta = Number(value(formData, "quantityDelta"));
  const reason = value(formData, "reason");

  if (!Number.isInteger(delta) || delta === 0) {
    return fail("Enter a non-zero whole-number stock adjustment.");
  }

  const service = getSupabaseServiceClient();
  const { data: item, error } = await service
    .from("inventory")
    .select("*")
    .eq("id", inventoryId)
    .single();

  if (error || !item) {
    return fail("Inventory item was not found.");
  }

  const nextQuantity = item.quantity + delta;

  if (nextQuantity < 0) {
    return fail("Inventory cannot become negative.");
  }

  await service.from("inventory").update({ quantity: nextQuantity }).eq("id", inventoryId);
  await service.from("inventory_movements").insert({
    inventory_id: item.id,
    product_id: item.product_id,
    variant_id: item.variant_id,
    actor_id: actor.id,
    movement_type: delta > 0 ? "add" : "deduct",
    quantity_delta: delta,
    previous_quantity: item.quantity,
    new_quantity: nextQuantity,
    reason: reason || null,
  });
  await service.from("audit_logs").insert({
    actor_id: actor.id,
    action: "inventory.adjusted",
    entity_type: "inventory",
    entity_id: item.id,
    metadata: { delta, previousQuantity: item.quantity, newQuantity: nextQuantity },
  });

  revalidatePath("/admin/inventory");
  return ok("Inventory updated.");
}

export async function updateOrderStatusAction(
  _state: AdminActionState,
  formData: FormData,
) {
  const actor = await requireAdminArea("/admin/orders");
  const orderId = value(formData, "orderId");
  const nextStatus = value(formData, "status") as AdminOrderStatus;
  const note = value(formData, "note");
  const courier = value(formData, "courier");
  const trackingNumber = value(formData, "trackingNumber");
  const service = getSupabaseServiceClient();
  const { data: order } = await service.from("orders").select("*").eq("id", orderId).single();

  if (!order) {
    return fail("Order was not found.");
  }

  const nextInternalNotes = [order.internal_notes, courier && `Courier: ${courier}`, trackingNumber && `Tracking: ${trackingNumber}`, note]
    .filter(Boolean)
    .join("\n");

  await service.from("orders").update({ status: nextStatus, internal_notes: nextInternalNotes || null }).eq("id", orderId);
  await service.from("order_status_history").insert({
    order_id: order.id,
    actor_id: actor.id,
    from_status: order.status,
    to_status: nextStatus,
    from_payment_status: order.payment_status,
    to_payment_status: order.payment_status,
    note: note || null,
  });
  await notifyUser({
    userId: order.user_id,
    orderId: order.id,
    type: `order.${nextStatus}`,
    title: "Order status updated",
    message: `Order ${order.order_number} is now ${nextStatus}.`,
  });

  revalidatePath("/admin/orders");
  return ok("Order updated.");
}

async function decrementInventoryForOrder(orderId: string, actorId: string) {
  const service = getSupabaseServiceClient();
  const { data: existing } = await service
    .from("audit_logs")
    .select("id")
    .eq("action", "inventory.decremented_for_order")
    .eq("entity_id", orderId)
    .maybeSingle();

  if (existing) {
    return;
  }

  const { data: items } = await service.from("order_items").select("*").eq("order_id", orderId);

  for (const item of items ?? []) {
    if (!item.product_id) {
      continue;
    }

    const query = service.from("inventory").select("*").eq("product_id", item.product_id);
    const { data: inventory } = item.variant_id
      ? await query.eq("variant_id", item.variant_id).single()
      : await query.is("variant_id", null).single();

    if (!inventory) {
      continue;
    }

    const nextQuantity = Math.max(0, inventory.quantity - item.quantity);
    await service.from("inventory").update({ quantity: nextQuantity }).eq("id", inventory.id);
    await service.from("inventory_movements").insert({
      inventory_id: inventory.id,
      product_id: inventory.product_id,
      variant_id: inventory.variant_id,
      actor_id: actorId,
      movement_type: "order_fulfillment",
      quantity_delta: -item.quantity,
      previous_quantity: inventory.quantity,
      new_quantity: nextQuantity,
      order_id: orderId,
      reason: "Payment approved",
    });
  }

  await service.from("audit_logs").insert({
    actor_id: actorId,
    action: "inventory.decremented_for_order",
    entity_type: "orders",
    entity_id: orderId,
  });
}

export async function approvePaymentAction(formData: FormData) {
  const actor = await requireAdminArea("/admin/payments");
  const proofId = value(formData, "proofId");
  const service = getSupabaseServiceClient();
  const { data: proof } = await service.from("payment_proofs").select("*").eq("id", proofId).single();

  if (!proof) {
    return;
  }

  const { data: order } = await service.from("orders").select("*").eq("id", proof.order_id).single();

  if (!order || order.payment_status === "paid") {
    return;
  }

  await service
    .from("payment_proofs")
    .update({ status: "paid", reviewed_by: actor.id, reviewed_at: new Date().toISOString() })
    .eq("id", proof.id);
  await service
    .from("orders")
    .update({ payment_status: "paid", status: "processing", paid_at: new Date().toISOString() })
    .eq("id", order.id);
  await decrementInventoryForOrder(order.id, actor.id);
  await service.from("order_status_history").insert({
    order_id: order.id,
    actor_id: actor.id,
    from_status: order.status,
    to_status: "processing",
    from_payment_status: order.payment_status,
    to_payment_status: "paid",
    note: "Payment approved",
  });
  await service.from("audit_logs").insert({
    actor_id: actor.id,
    action: "payment.approved",
    entity_type: "orders",
    entity_id: order.id,
  });
  await notifyUser({
    userId: order.user_id,
    orderId: order.id,
    type: "payment.approved",
    title: "Payment approved",
    message: `Payment for ${order.order_number} was approved. Your order is now processing.`,
  });

  revalidatePath("/admin/payments");
  revalidatePath("/admin/orders");
}

export async function rejectPaymentAction(
  _state: AdminActionState,
  formData: FormData,
) {
  const actor = await requireAdminArea("/admin/payments");
  const proofId = value(formData, "proofId");
  const reason = value(formData, "reason");

  if (!reason) {
    return fail("A rejection reason is required.");
  }

  const service = getSupabaseServiceClient();
  const { data: proof } = await service.from("payment_proofs").select("*").eq("id", proofId).single();

  if (!proof) {
    return fail("Payment proof was not found.");
  }

  const { data: order } = await service.from("orders").select("*").eq("id", proof.order_id).single();

  await service
    .from("payment_proofs")
    .update({ status: "rejected", review_notes: reason, reviewed_by: actor.id, reviewed_at: new Date().toISOString() })
    .eq("id", proof.id);

  if (order) {
    await service.from("orders").update({ payment_status: "rejected" }).eq("id", order.id);
    await notifyUser({
      userId: order.user_id,
      orderId: order.id,
      type: "payment.rejected",
      title: "Payment proof rejected",
      message: reason,
    });
  }

  revalidatePath("/admin/payments");
  return ok("Payment rejected.");
}

export async function requestResubmissionAction(formData: FormData) {
  const actor = await requireAdminArea("/admin/payments");
  const proofId = value(formData, "proofId");
  const service = getSupabaseServiceClient();
  const { data: proof } = await service.from("payment_proofs").select("*").eq("id", proofId).single();

  if (!proof) {
    return;
  }

  const { data: order } = await service.from("orders").select("*").eq("id", proof.order_id).single();
  await service
    .from("payment_proofs")
    .update({ status: "rejected", review_notes: "Please submit a clearer or corrected receipt.", reviewed_by: actor.id, reviewed_at: new Date().toISOString() })
    .eq("id", proof.id);

  if (order) {
    await service.from("orders").update({ payment_status: "rejected" }).eq("id", order.id);
    await notifyUser({
      userId: order.user_id,
      orderId: order.id,
      type: "payment.resubmission_requested",
      title: "Payment proof needs resubmission",
      message: `Please resubmit proof for order ${order.order_number}.`,
    });
  }

  revalidatePath("/admin/payments");
}

export async function createBannerAction(
  _state: AdminActionState,
  formData: FormData,
) {
  await requireRole(["administrator"], "/admin/homepage");
  const service = getSupabaseServiceClient();
  const title = value(formData, "title");
  const imageUrl = value(formData, "imageUrl");

  if (!title || !imageUrl) {
    return fail("Banner title and image URL are required.");
  }

  const { error } = await service.from("homepage_banners").insert({
    title,
    subtitle: value(formData, "subtitle") || null,
    image_url: imageUrl,
    href: value(formData, "href") || "/products",
    sort_order: Number(value(formData, "sortOrder")) || 0,
    is_active: value(formData, "isActive") === "on",
  });

  if (error) {
    return fail(error.message);
  }

  revalidatePath("/admin/homepage");
  revalidatePath("/");
  return ok("Banner created.");
}

export async function createHomepageSectionAction(
  _state: AdminActionState,
  formData: FormData,
) {
  await requireRole(["administrator"], "/admin/homepage");
  const title = value(formData, "title");
  const sectionKey = slugify(value(formData, "sectionKey") || title);

  if (!title || !sectionKey) {
    return fail("Section title and key are required.");
  }

  const service = getSupabaseServiceClient();
  const { error } = await service.from("homepage_sections").insert({
    title,
    section_key: sectionKey,
    config: {
      source: value(formData, "source") || "manual",
      label: value(formData, "label") || null,
    },
    sort_order: Number(value(formData, "sortOrder")) || 0,
    is_visible: value(formData, "isVisible") === "on",
  });

  if (error) {
    return fail(error.message);
  }

  revalidatePath("/admin/homepage");
  revalidatePath("/");
  return ok("Homepage section created.");
}
