import { hasSupabasePublicEnv } from "@/lib/env";
import { getSupabaseServiceClient } from "@/lib/supabase/service";

export async function getAdminDashboardData() {
  if (!hasSupabasePublicEnv()) {
    return null;
  }

  const service = getSupabaseServiceClient();
  const [orders, products, inventory, proofs] = await Promise.all([
    service.from("orders").select("*").order("created_at", { ascending: false }).limit(8),
    service.from("products").select("*").order("created_at", { ascending: false }).limit(8),
    service.from("inventory").select("*"),
    service.from("payment_proofs").select("*").order("created_at", { ascending: false }).limit(8),
  ]);

  const orderRows = orders.data ?? [];
  const inventoryRows = inventory.data ?? [];
  const proofRows = proofs.data ?? [];

  return {
    totalSalesCents: orderRows
      .filter((order) => order.payment_status === "paid")
      .reduce((total, order) => total + order.total_cents, 0),
    pendingPayments: orderRows.filter((order) => order.payment_status === "awaiting_payment").length,
    ordersAwaitingVerification: orderRows.filter(
      (order) => order.payment_status === "proof_submitted" || order.payment_status === "under_review",
    ).length,
    paidOrders: orderRows.filter((order) => order.payment_status === "paid").length,
    processingOrders: orderRows.filter((order) => order.status === "processing").length,
    shippedOrders: orderRows.filter((order) => order.status === "shipped").length,
    lowStockProducts: inventoryRows.filter(
      (item) => item.quantity > 0 && item.quantity <= item.low_stock_threshold,
    ).length,
    outOfStockProducts: inventoryRows.filter((item) => item.quantity <= 0).length,
    recentOrders: orderRows,
    recentPaymentSubmissions: proofRows,
    recentProducts: products.data ?? [],
  };
}

export async function getAdminProductsData() {
  if (!hasSupabasePublicEnv()) {
    return null;
  }

  const service = getSupabaseServiceClient();
  const [products, categories, brands] = await Promise.all([
    service.from("products").select("*").order("created_at", { ascending: false }),
    service.from("categories").select("*").order("name"),
    service.from("brands").select("*").order("name"),
  ]);

  return {
    products: products.data ?? [],
    categories: categories.data ?? [],
    brands: brands.data ?? [],
  };
}

export async function getAdminInventoryData() {
  if (!hasSupabasePublicEnv()) {
    return null;
  }

  const service = getSupabaseServiceClient();
  const [inventory, products, variants, movements] = await Promise.all([
    service.from("inventory").select("*").order("updated_at", { ascending: false }),
    service.from("products").select("id,name,slug").order("name"),
    service.from("product_variants").select("id,product_id,name,sku").order("name"),
    service.from("inventory_movements").select("*").order("created_at", { ascending: false }).limit(20),
  ]);

  return {
    inventory: inventory.data ?? [],
    products: products.data ?? [],
    variants: variants.data ?? [],
    movements: movements.data ?? [],
  };
}

export async function getAdminOrdersData() {
  if (!hasSupabasePublicEnv()) {
    return null;
  }

  const service = getSupabaseServiceClient();
  const [orders, profiles] = await Promise.all([
    service.from("orders").select("*").order("created_at", { ascending: false }).limit(50),
    service.from("profiles").select("id,email,full_name"),
  ]);

  return {
    orders: orders.data ?? [],
    profiles: profiles.data ?? [],
  };
}

export async function getAdminPaymentsData() {
  if (!hasSupabasePublicEnv()) {
    return null;
  }

  const service = getSupabaseServiceClient();
  const [proofs, orders, profiles] = await Promise.all([
    service.from("payment_proofs").select("*").order("created_at", { ascending: false }).limit(50),
    service.from("orders").select("*").order("created_at", { ascending: false }).limit(100),
    service.from("profiles").select("id,email,full_name"),
  ]);
  const proofUrls: Record<string, string> = {};

  for (const proof of proofs.data ?? []) {
    const { data } = await service.storage
      .from("payment-proofs")
      .createSignedUrl(proof.storage_path, 600);

    if (data?.signedUrl) {
      proofUrls[proof.id] = data.signedUrl;
    }
  }

  return {
    proofs: proofs.data ?? [],
    orders: orders.data ?? [],
    profiles: profiles.data ?? [],
    proofUrls,
  };
}

export async function getAdminHomepageData() {
  if (!hasSupabasePublicEnv()) {
    return null;
  }

  const service = getSupabaseServiceClient();
  const [banners, sections, products, categories] = await Promise.all([
    service.from("homepage_banners").select("*").order("sort_order"),
    service.from("homepage_sections").select("*").order("sort_order"),
    service.from("products").select("id,name,slug").eq("status", "active").order("name"),
    service.from("categories").select("id,name,slug").eq("is_active", true).order("name"),
  ]);

  return {
    banners: banners.data ?? [],
    sections: sections.data ?? [],
    products: products.data ?? [],
    categories: categories.data ?? [],
  };
}
