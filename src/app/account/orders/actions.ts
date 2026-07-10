"use server";

import { revalidatePath } from "next/cache";

import { requireAuth } from "@/lib/auth";
import { getSupabaseServiceClient } from "@/lib/supabase/service";

export async function cancelUnpaidOrderAction(formData: FormData) {
  const profile = await requireAuth("/account/orders");
  const orderId = String(formData.get("orderId") ?? "");
  const service = getSupabaseServiceClient();
  const { data: order } = await service
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .eq("user_id", profile.id)
    .single();

  if (!order || order.payment_status !== "awaiting_payment") {
    return;
  }

  await service
    .from("orders")
    .update({ status: "cancelled", payment_status: "expired" })
    .eq("id", order.id);
  await service.from("order_status_history").insert({
    order_id: order.id,
    actor_id: profile.id,
    from_status: order.status,
    to_status: "cancelled",
    from_payment_status: order.payment_status,
    to_payment_status: "expired",
    note: "Customer cancelled unpaid order.",
  });
  await service.from("notifications").insert({
    user_id: profile.id,
    order_id: order.id,
    type: "order.cancelled",
    title: "Order cancelled",
    message: `Order ${order.order_number} was cancelled.`,
  });

  revalidatePath("/account/orders");
  revalidatePath(`/account/orders/${order.order_number}`);
}
