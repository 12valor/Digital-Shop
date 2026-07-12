"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireAuth } from "@/lib/auth";
import { getSupabaseServiceClient } from "@/lib/supabase/service";

export type AccountActionState = {
  status: "idle" | "success" | "error";
  message: string;
};

const profileSchema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name.").max(80),
  phone: z
    .string()
    .trim()
    .regex(/^[0-9+() -]{7,20}$/, "Enter a valid mobile number."),
});

const addressSchema = z.object({
  label: z.string().trim().min(2, "Enter an address label.").max(30),
  fullName: z.string().trim().min(2, "Enter the recipient name.").max(80),
  mobileNumber: z.string().trim().regex(/^[0-9+() -]{7,20}$/, "Enter a valid mobile number."),
  region: z.string().trim().min(2, "Enter the region.").max(80),
  province: z.string().trim().min(2, "Enter the province.").max(80),
  city: z.string().trim().min(2, "Enter the city or municipality.").max(80),
  barangay: z.string().trim().min(2, "Enter the barangay.").max(80),
  postalCode: z.string().trim().min(3, "Enter the postal code.").max(12),
  streetAddress: z.string().trim().min(5, "Enter the complete address.").max(240),
  deliveryNotes: z.string().trim().max(300),
  isDefault: z.boolean(),
});

function value(formData: FormData, key: string) {
  const item = formData.get(key);
  return typeof item === "string" ? item : "";
}

function result(status: AccountActionState["status"], message: string): AccountActionState {
  return { status, message };
}

export async function updateProfileAction(
  _previousState: AccountActionState,
  formData: FormData,
) {
  const profile = await requireAuth("/account");
  const parsed = profileSchema.safeParse({
    fullName: value(formData, "fullName"),
    phone: value(formData, "phone"),
  });

  if (!parsed.success) {
    return result("error", parsed.error.issues[0]?.message ?? "Check your profile details.");
  }

  const service = getSupabaseServiceClient();
  const { error } = await service
    .from("profiles")
    .update({ full_name: parsed.data.fullName, phone: parsed.data.phone })
    .eq("id", profile.id);

  if (error) {
    return result("error", "Your profile could not be updated. Please try again.");
  }

  revalidatePath("/account", "layout");
  return result("success", "Profile details updated.");
}

export async function createAddressAction(
  _previousState: AccountActionState,
  formData: FormData,
) {
  const profile = await requireAuth("/account");
  const parsed = addressSchema.safeParse({
    label: value(formData, "label"),
    fullName: value(formData, "fullName"),
    mobileNumber: value(formData, "mobileNumber"),
    region: value(formData, "region"),
    province: value(formData, "province"),
    city: value(formData, "city"),
    barangay: value(formData, "barangay"),
    postalCode: value(formData, "postalCode"),
    streetAddress: value(formData, "streetAddress"),
    deliveryNotes: value(formData, "deliveryNotes"),
    isDefault: formData.get("isDefault") === "on",
  });

  if (!parsed.success) {
    return result("error", parsed.error.issues[0]?.message ?? "Check the address details.");
  }

  const service = getSupabaseServiceClient();
  const { count } = await service
    .from("addresses")
    .select("id", { count: "exact", head: true })
    .eq("user_id", profile.id);

  if ((count ?? 0) >= 10) {
    return result("error", "You can save up to 10 delivery addresses.");
  }

  const { data: address, error } = await service
    .from("addresses")
    .insert({
      user_id: profile.id,
      label: parsed.data.label,
      full_name: parsed.data.fullName,
      mobile_number: parsed.data.mobileNumber,
      region: parsed.data.region,
      province: parsed.data.province,
      city: parsed.data.city,
      barangay: parsed.data.barangay,
      postal_code: parsed.data.postalCode,
      street_address: parsed.data.streetAddress,
      delivery_notes: parsed.data.deliveryNotes || null,
      is_default: false,
    })
    .select("id")
    .single();

  if (error || !address) {
    return result("error", "The address could not be saved. Please try again.");
  }

  if (parsed.data.isDefault || (count ?? 0) === 0) {
    await service
      .from("addresses")
      .update({ is_default: false })
      .eq("user_id", profile.id)
      .neq("id", address.id);
    await service
      .from("addresses")
      .update({ is_default: true })
      .eq("id", address.id)
      .eq("user_id", profile.id);
  }

  revalidatePath("/account");
  return result("success", "Delivery address saved.");
}

async function getOwnedAddress(addressId: string, userId: string) {
  const service = getSupabaseServiceClient();
  const { data } = await service
    .from("addresses")
    .select("id,is_default")
    .eq("id", addressId)
    .eq("user_id", userId)
    .single();
  return data;
}

export async function setDefaultAddressAction(formData: FormData) {
  const profile = await requireAuth("/account");
  const addressId = value(formData, "addressId");
  const address = await getOwnedAddress(addressId, profile.id);

  if (!address || address.is_default) return;

  const service = getSupabaseServiceClient();
  await service.from("addresses").update({ is_default: false }).eq("user_id", profile.id);
  await service
    .from("addresses")
    .update({ is_default: true })
    .eq("id", address.id)
    .eq("user_id", profile.id);
  revalidatePath("/account");
}

export async function deleteAddressAction(formData: FormData) {
  const profile = await requireAuth("/account");
  const addressId = value(formData, "addressId");
  const address = await getOwnedAddress(addressId, profile.id);

  if (!address) return;

  const service = getSupabaseServiceClient();
  await service.from("addresses").delete().eq("id", address.id).eq("user_id", profile.id);

  if (address.is_default) {
    const { data: replacement } = await service
      .from("addresses")
      .select("id")
      .eq("user_id", profile.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (replacement) {
      await service.from("addresses").update({ is_default: true }).eq("id", replacement.id);
    }
  }

  revalidatePath("/account");
}
