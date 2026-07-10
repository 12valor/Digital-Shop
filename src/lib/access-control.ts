import type { ProductStatus, UserRole } from "@/types/database";

export type Actor = {
  id: string;
  role: UserRole;
} | null;

export type ProductAccessInput = {
  status: ProductStatus;
};

export function isStaffRole(role: UserRole | null | undefined) {
  return role === "staff" || role === "administrator";
}

export function isAdministratorRole(role: UserRole | null | undefined) {
  return role === "administrator";
}

export function canAccessAdmin(actor: Actor) {
  return isStaffRole(actor?.role);
}

export function canReadPublicProduct(product: ProductAccessInput) {
  return product.status === "active";
}

export function canReadProduct(actor: Actor, product: ProductAccessInput) {
  return canReadPublicProduct(product) || canAccessAdmin(actor);
}

export function canModifyProduct(actor: Actor) {
  return isAdministratorRole(actor?.role);
}
