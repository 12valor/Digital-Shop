"use server";

import { randomUUID } from "node:crypto";

import * as Sentry from "@sentry/nextjs";
import { redirect } from "next/navigation";
import { z } from "zod";

import { validateCheckoutCart } from "@/lib/checkout-validation";
import { consumeRateLimit } from "@/lib/rate-limit";
import { getStorefrontData } from "@/lib/storefront-data";
import { getSupabaseServiceClient } from "@/lib/supabase/service";
import { requireAuth } from "@/lib/auth";
import type { CheckoutCartItemInput } from "@/types/checkout";

export type CheckoutActionState = {
  status: "idle" | "error";
  message: string;
};

const checkoutSchema = z.object({
  cart: z.string().min(2),
  fullName: z.string().trim().min(2),
  email: z.string().trim().email(),
  mobileNumber: z.string().trim().min(8),
  region: z.string().trim().min(2),
  province: z.string().trim().min(2),
  city: z.string().trim().min(2),
  barangay: z.string().trim().min(2),
  postalCode: z.string().trim().min(3),
  streetAddress: z.string().trim().min(5),
  deliveryNotes: z.string().trim().optional(),
  shippingOption: z.string().trim().min(2),
  saveAddress: z.string().optional(),
});

const proofSchema = z.object({
  orderNumber: z.string().trim().min(8),
  senderName: z.string().trim().min(2),
  senderMobileNumber: z.string().trim().min(8),
  amountPaid: z.coerce.number().positive(),
  referenceNumber: z.string().trim().min(6),
  paidAt: z.string().trim().min(8),
});

const allowedProofTypes = new Set([
  "image/jpeg",
  "image/png",
  "application/pdf",
]);
const maxProofBytes = 5 * 1024 * 1024;

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function errorState(message: string): CheckoutActionState {
  return { status: "error", message };
}

function captureCheckoutError(error: unknown, tag: string) {
  Sentry.captureException(error, {
    tags: {
      area: "checkout",
      operation: tag,
    },
  });
}

function parseCart(value: string): CheckoutCartItemInput[] {
  const parsed = JSON.parse(value) as unknown;

  if (!Array.isArray(parsed)) {
    throw new Error("Cart data is invalid.");
  }

  return parsed.map((item) => {
    if (!item || typeof item !== "object") {
      throw new Error("Cart data is invalid.");
    }

    const record = item as Record<string, unknown>;

    return {
      productId: String(record.productId ?? ""),
      variantId: record.variantId ? String(record.variantId) : null,
      quantity: Number(record.quantity),
    };
  });
}

export async function createOrderAction(
  _previousState: CheckoutActionState,
  formData: FormData,
) {
  const profile = await requireAuth("/checkout");
  const parsed = checkoutSchema.safeParse({
    cart: getString(formData, "cart"),
    fullName: getString(formData, "fullName"),
    email: getString(formData, "email"),
    mobileNumber: getString(formData, "mobileNumber"),
    region: getString(formData, "region"),
    province: getString(formData, "province"),
    city: getString(formData, "city"),
    barangay: getString(formData, "barangay"),
    postalCode: getString(formData, "postalCode"),
    streetAddress: getString(formData, "streetAddress"),
    deliveryNotes: getString(formData, "deliveryNotes"),
    shippingOption: getString(formData, "shippingOption"),
    saveAddress: getString(formData, "saveAddress"),
  });

  if (!parsed.success) {
    return errorState(parsed.error.issues[0]?.message ?? "Check your checkout details.");
  }

  let paymentPath = "";

  try {
    const cartItems = parseCart(parsed.data.cart);
    const { products } = await getStorefrontData();
    const checkout = validateCheckoutCart(products, cartItems);
    const service = getSupabaseServiceClient();
    const { data: orderNumber, error: orderNumberError } = await service.rpc(
      "generate_order_number",
    );

    if (orderNumberError || !orderNumber) {
      throw new Error(orderNumberError?.message ?? "Could not generate order number.");
    }

    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    const { data: order, error: orderError } = await service
      .from("orders")
      .insert({
        user_id: profile.id,
        order_number: orderNumber,
        status: "awaiting_payment",
        payment_status: "awaiting_payment",
        subtotal_cents: checkout.subtotalCents,
        discount_cents: checkout.discountCents,
        shipping_cents: checkout.shippingCents,
        total_cents: checkout.totalCents,
        expires_at: expiresAt,
        customer_notes: parsed.data.deliveryNotes ?? null,
        shipping_address: {
          fullName: parsed.data.fullName,
          email: parsed.data.email,
          mobileNumber: parsed.data.mobileNumber,
          region: parsed.data.region,
          province: parsed.data.province,
          city: parsed.data.city,
          barangay: parsed.data.barangay,
          postalCode: parsed.data.postalCode,
          streetAddress: parsed.data.streetAddress,
          deliveryNotes: parsed.data.deliveryNotes ?? null,
          shippingOption: parsed.data.shippingOption,
        },
      })
      .select("id,order_number")
      .single();

    if (orderError || !order) {
      throw new Error(orderError?.message ?? "Could not create order.");
    }

    const { error: itemsError } = await service.from("order_items").insert(
      checkout.items.map((item) => ({
        order_id: order.id,
        product_id: item.productId,
        variant_id: item.variantId,
        product_name: item.productName,
        variant_name: item.variantName,
        sku: item.sku,
        quantity: item.quantity,
        unit_price_cents: item.unitPriceCents,
        subtotal_cents: item.subtotalCents,
        snapshot: item.snapshot,
      })),
    );

    if (itemsError) {
      throw new Error(itemsError.message);
    }

    if (parsed.data.saveAddress === "on") {
      await service.from("addresses").insert({
        user_id: profile.id,
        label: "Checkout address",
        full_name: parsed.data.fullName,
        mobile_number: parsed.data.mobileNumber,
        region: parsed.data.region,
        province: parsed.data.province,
        city: parsed.data.city,
        barangay: parsed.data.barangay,
        postal_code: parsed.data.postalCode,
        street_address: parsed.data.streetAddress,
        delivery_notes: parsed.data.deliveryNotes ?? null,
      });
    }

    await service.from("audit_logs").insert({
      actor_id: profile.id,
      action: "order.created",
      entity_type: "orders",
      entity_id: order.id,
      metadata: {
        orderNumber: order.order_number,
        totalCents: checkout.totalCents,
      },
    });

    paymentPath = `/checkout/payment/${order.order_number}`;
  } catch (error) {
    captureCheckoutError(error, "create_order");
    return errorState(error instanceof Error ? error.message : "Checkout failed.");
  }

  redirect(paymentPath);
}

export async function submitPaymentProofAction(
  _previousState: CheckoutActionState,
  formData: FormData,
) {
  const profile = await requireAuth("/account");
  const parsed = proofSchema.safeParse({
    orderNumber: getString(formData, "orderNumber"),
    senderName: getString(formData, "senderName"),
    senderMobileNumber: getString(formData, "senderMobileNumber"),
    amountPaid: getString(formData, "amountPaid"),
    referenceNumber: getString(formData, "referenceNumber"),
    paidAt: getString(formData, "paidAt"),
  });

  if (!parsed.success) {
    return errorState(parsed.error.issues[0]?.message ?? "Check your payment proof details.");
  }

  const proofLimit = consumeRateLimit(`payment-proof:${profile.id}`, {
    limit: 5,
    windowMs: 60 * 60 * 1000,
  });

  if (!proofLimit.allowed) {
    return errorState("Too many proof uploads. Wait before trying again.");
  }

  const file = formData.get("receipt");

  if (!(file instanceof File) || file.size <= 0) {
    return errorState("Upload a receipt file.");
  }

  if (!allowedProofTypes.has(file.type)) {
    return errorState("Receipt must be JPG, PNG, or PDF.");
  }

  if (file.size > maxProofBytes) {
    return errorState("Receipt must be 5 MB or smaller.");
  }

  const service = getSupabaseServiceClient();
  const { data: order, error: orderError } = await service
    .from("orders")
    .select("id,user_id,total_cents,order_number")
    .eq("order_number", parsed.data.orderNumber)
    .eq("user_id", profile.id)
    .single();

  if (orderError || !order) {
    return errorState("Order was not found for this account.");
  }

  const { data: existingReference } = await service
    .from("payment_proofs")
    .select("id")
    .eq("gcash_reference_number", parsed.data.referenceNumber)
    .maybeSingle();

  if (existingReference) {
    await service.from("audit_logs").insert({
      actor_id: profile.id,
      action: "payment_proof.duplicate_reference",
      entity_type: "orders",
      entity_id: order.id,
      metadata: {
        orderNumber: order.order_number,
        referenceNumber: parsed.data.referenceNumber,
      },
    });

    return errorState("That GCash reference number was already submitted.");
  }

  const extension =
    file.type === "application/pdf" ? "pdf" : file.type === "image/png" ? "png" : "jpg";
  const storagePath = `${profile.id}/${order.id}/${randomUUID()}.${extension}`;
  const { error: uploadError } = await service.storage
    .from("payment-proofs")
    .upload(storagePath, file, {
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) {
    captureCheckoutError(uploadError, "payment_proof_upload");
    return errorState("Receipt upload failed. Try again with a valid file.");
  }

  const { error: proofError } = await service.from("payment_proofs").insert({
    order_id: order.id,
    user_id: profile.id,
    sender_name: parsed.data.senderName,
    sender_mobile_number: parsed.data.senderMobileNumber,
    amount_paid_cents: Math.round(parsed.data.amountPaid * 100),
    gcash_reference_number: parsed.data.referenceNumber,
    paid_at: new Date(parsed.data.paidAt).toISOString(),
    storage_path: storagePath,
    mime_type: file.type,
    file_size_bytes: file.size,
    status: "proof_submitted",
  });

  if (proofError) {
    captureCheckoutError(proofError, "payment_proof_insert");
    return errorState("Payment proof could not be saved. Try again later.");
  }

  await service
    .from("orders")
    .update({
      payment_status: "proof_submitted",
      status: "for_verification",
    })
    .eq("id", order.id);

  await service.from("audit_logs").insert({
    actor_id: profile.id,
    action: "payment_proof.submitted",
    entity_type: "orders",
    entity_id: order.id,
    metadata: {
      orderNumber: order.order_number,
      referenceNumber: parsed.data.referenceNumber,
    },
  });

  redirect(`/account/orders/${order.order_number}`);
}
