import type { Database } from "@/types/database";

export type AdminOrderStatus = Database["public"]["Tables"]["orders"]["Row"]["status"];
export type AdminPaymentStatus = Database["public"]["Tables"]["orders"]["Row"]["payment_status"];

export type AdminActionState = {
  status: "idle" | "error" | "success";
  message: string;
};
