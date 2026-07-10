import { notFound } from "next/navigation";

import { requireAuth } from "@/lib/auth";
import { getSupabaseServiceClient } from "@/lib/supabase/service";

export async function getCustomerOrder(orderNumber: string) {
  const profile = await requireAuth(`/checkout/payment/${orderNumber}`);
  const service = getSupabaseServiceClient();
  const { data: order, error } = await service
    .from("orders")
    .select("*")
    .eq("order_number", orderNumber)
    .eq("user_id", profile.id)
    .single();

  if (error || !order) {
    notFound();
  }

  const { data: items } = await service
    .from("order_items")
    .select("*")
    .eq("order_id", order.id)
    .order("created_at");

  const { data: proofs } = await service
    .from("payment_proofs")
    .select("*")
    .eq("order_id", order.id)
    .order("created_at", { ascending: false });
  const { data: history } = await service
    .from("order_status_history")
    .select("*")
    .eq("order_id", order.id)
    .order("created_at", { ascending: false });
  const { data: notifications } = await service
    .from("notifications")
    .select("*")
    .eq("order_id", order.id)
    .order("created_at", { ascending: false });

  return {
    profile,
    order,
    items: items ?? [],
    proofs: proofs ?? [],
    history: history ?? [],
    notifications: notifications ?? [],
  };
}

export async function getCustomerOrders() {
  const profile = await requireAuth("/account/orders");
  const service = getSupabaseServiceClient();
  const { data: orders } = await service
    .from("orders")
    .select("*")
    .eq("user_id", profile.id)
    .order("created_at", { ascending: false });

  return {
    profile,
    orders: orders ?? [],
  };
}
