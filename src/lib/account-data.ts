import { requireAuth } from "@/lib/auth";
import { getSupabaseServiceClient } from "@/lib/supabase/service";

export async function getAccountOverview() {
  const profile = await requireAuth("/account");
  const service = getSupabaseServiceClient();
  const [addressesResult, ordersResult, notificationsResult] = await Promise.all([
    service
      .from("addresses")
      .select("*")
      .eq("user_id", profile.id)
      .order("is_default", { ascending: false })
      .order("created_at", { ascending: false }),
    service
      .from("orders")
      .select("*")
      .eq("user_id", profile.id)
      .order("created_at", { ascending: false }),
    service
      .from("notifications")
      .select("*")
      .eq("user_id", profile.id)
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  const orders = ordersResult.data ?? [];

  return {
    profile,
    addresses: addressesResult.data ?? [],
    orders,
    notifications: notificationsResult.data ?? [],
    stats: {
      totalOrders: orders.length,
      activeOrders: orders.filter((order) =>
        ["paid", "processing", "packed", "shipped"].includes(order.status),
      ).length,
      awaitingPayment: orders.filter((order) => order.payment_status === "awaiting_payment").length,
    },
  };
}
