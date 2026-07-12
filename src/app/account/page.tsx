import {
  Bell,
  ChevronRight,
  Clock3,
  KeyRound,
  MapPin,
  PackageCheck,
  ReceiptText,
  ShieldAlert,
  ShoppingBag,
  Trash2,
} from "lucide-react";
import Link from "next/link";

import {
  deleteAddressAction,
  setDefaultAddressAction,
} from "@/app/account/actions";
import { AddressForm, ProfileForm } from "@/components/account/AccountForms";
import { getAccountOverview } from "@/lib/account-data";
import { formatPeso } from "@/lib/format";

export const dynamic = "force-dynamic";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { profile, addresses, orders, notifications, stats } = await getAccountOverview();
  const params = await searchParams;
  const recentOrders = orders.slice(0, 3);

  return (
    <div className="grid gap-6">
      <section className="overflow-hidden border border-zinc-200 bg-white">
        <div className="border-b border-zinc-200 px-5 py-5 sm:px-6">
          <p className="text-xs font-black uppercase text-orange-700">Account overview</p>
          <div className="mt-1 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h1 className="text-2xl font-black sm:text-3xl">
                Welcome back, {profile.full_name?.split(" ")[0] || "shopper"}
              </h1>
              <p className="mt-1 text-sm text-zinc-600">
                Member since {formatDate(profile.created_at)}
              </p>
            </div>
            <Link
              href="/products"
              className="inline-flex h-10 items-center gap-2 bg-orange-600 px-4 text-sm font-black text-white hover:bg-orange-700"
            >
              <ShoppingBag className="size-4" aria-hidden="true" /> Shop products
            </Link>
          </div>
        </div>

        {params.error === "unauthorized" ? (
          <div className="m-5 flex gap-3 border border-red-200 bg-red-50 p-4 text-sm text-red-800 sm:m-6">
            <ShieldAlert className="size-5 shrink-0" aria-hidden="true" />
            <p>Your account does not have permission to access that area.</p>
          </div>
        ) : null}

        <div className="grid divide-y divide-zinc-200 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {[
            { label: "All orders", value: stats.totalOrders, icon: ReceiptText },
            { label: "In progress", value: stats.activeOrders, icon: PackageCheck },
            { label: "Awaiting payment", value: stats.awaitingPayment, icon: Clock3 },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="flex items-center gap-4 px-5 py-5 sm:px-6">
              <span className="grid size-10 place-items-center bg-blue-50 text-blue-900">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <div>
                <p className="text-2xl font-black">{value}</p>
                <p className="text-xs font-bold text-zinc-500">{label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="border border-zinc-200 bg-white p-5 sm:p-6">
        <div className="mb-5">
          <p className="text-xs font-black uppercase text-orange-700">Personal details</p>
          <h2 className="mt-1 text-xl font-black">Profile information</h2>
        </div>
        <ProfileForm
          fullName={profile.full_name ?? ""}
          phone={profile.phone ?? ""}
          email={profile.email}
        />
      </section>

      <section id="addresses" className="scroll-mt-6 border border-zinc-200 bg-white p-5 sm:p-6">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase text-orange-700">Delivery</p>
            <h2 className="mt-1 text-xl font-black">Saved addresses</h2>
            <p className="mt-1 text-sm text-zinc-600">Choose a default address for faster checkout.</p>
          </div>
          <span className="text-sm font-black text-zinc-500">{addresses.length}/10</span>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          {addresses.map((address) => (
            <article key={address.id} className="border border-zinc-200 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2">
                  <MapPin className="size-4 shrink-0 text-orange-600" aria-hidden="true" />
                  <h3 className="truncate font-black">{address.label}</h3>
                </div>
                {address.is_default ? (
                  <span className="shrink-0 bg-emerald-50 px-2 py-1 text-[11px] font-black text-emerald-800">
                    Default
                  </span>
                ) : null}
              </div>
              <p className="mt-4 text-sm font-bold">{address.full_name}</p>
              <p className="mt-1 text-sm leading-6 text-zinc-600">
                {address.street_address}, {address.barangay}, {address.city}, {address.province}, {address.region} {address.postal_code}
              </p>
              <p className="mt-1 text-sm text-zinc-600">{address.mobile_number}</p>
              <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-zinc-100 pt-3">
                {!address.is_default ? (
                  <form action={setDefaultAddressAction}>
                    <input type="hidden" name="addressId" value={address.id} />
                    <button className="text-xs font-black text-blue-800 hover:text-blue-950" type="submit">
                      Set as default
                    </button>
                  </form>
                ) : null}
                <form action={deleteAddressAction} className="ml-auto">
                  <input type="hidden" name="addressId" value={address.id} />
                  <button className="inline-flex items-center gap-1 text-xs font-black text-red-700 hover:text-red-900" type="submit">
                    <Trash2 className="size-3.5" aria-hidden="true" /> Delete
                  </button>
                </form>
              </div>
            </article>
          ))}
        </div>

        {addresses.length === 0 ? (
          <div className="mb-4 border border-dashed border-zinc-300 bg-zinc-50 px-5 py-8 text-center">
            <MapPin className="mx-auto size-7 text-zinc-400" aria-hidden="true" />
            <p className="mt-3 font-black">No saved addresses</p>
            <p className="mt-1 text-sm text-zinc-600">Add one now or save an address during checkout.</p>
          </div>
        ) : null}
        <AddressForm defaultName={profile.full_name ?? ""} defaultPhone={profile.phone ?? ""} />
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="border border-zinc-200 bg-white p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase text-orange-700">Purchases</p>
              <h2 className="mt-1 text-xl font-black">Recent orders</h2>
            </div>
            <Link href="/account/orders" className="inline-flex items-center text-sm font-black text-blue-800 hover:text-orange-700">
              View all <ChevronRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
          <div className="mt-5 divide-y divide-zinc-200">
            {recentOrders.map((order) => (
              <Link key={order.id} href={"/account/orders/" + order.order_number} className="flex items-center justify-between gap-4 py-4 first:pt-0 hover:text-orange-700">
                <div className="min-w-0">
                  <p className="truncate text-sm font-black">{order.order_number}</p>
                  <p className="mt-1 text-xs text-zinc-500">{formatDate(order.created_at)}</p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-sm font-black">{formatPeso(order.total_cents)}</p>
                  <p className="mt-1 text-xs text-zinc-500">{order.status.replaceAll("_", " ")}</p>
                </div>
              </Link>
            ))}
            {recentOrders.length === 0 ? (
              <div className="py-8 text-center">
                <ShoppingBag className="mx-auto size-7 text-zinc-400" aria-hidden="true" />
                <p className="mt-3 font-black">No orders yet</p>
                <Link href="/products" className="mt-2 inline-block text-sm font-black text-orange-700">Start shopping</Link>
              </div>
            ) : null}
          </div>
        </section>

        <section className="border border-zinc-200 bg-white p-5 sm:p-6">
          <div>
            <p className="text-xs font-black uppercase text-orange-700">Updates</p>
            <h2 className="mt-1 text-xl font-black">Recent notifications</h2>
          </div>
          <div className="mt-5 divide-y divide-zinc-200">
            {notifications.map((notification) => (
              <div key={notification.id} className="flex gap-3 py-4 first:pt-0">
                <Bell className="mt-0.5 size-4 shrink-0 text-blue-800" aria-hidden="true" />
                <div>
                  <p className="text-sm font-black">{notification.title}</p>
                  <p className="mt-1 text-sm leading-5 text-zinc-600">{notification.message}</p>
                </div>
              </div>
            ))}
            {notifications.length === 0 ? (
              <div className="py-8 text-center">
                <Bell className="mx-auto size-7 text-zinc-400" aria-hidden="true" />
                <p className="mt-3 font-black">You are all caught up</p>
                <p className="mt-1 text-sm text-zinc-600">Order and payment updates will appear here.</p>
              </div>
            ) : null}
          </div>
        </section>
      </div>

      <section id="security" className="scroll-mt-6 border border-zinc-200 bg-blue-950 p-5 text-white sm:p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-4">
            <span className="grid size-11 shrink-0 place-items-center bg-blue-800 text-orange-400">
              <KeyRound className="size-5" aria-hidden="true" />
            </span>
            <div>
              <h2 className="font-black">Password and account security</h2>
              <p className="mt-1 max-w-xl text-sm leading-6 text-blue-200">
                Send a secure reset link to your verified email whenever you need to change your password.
              </p>
            </div>
          </div>
          <Link href="/auth/forgot-password" className="inline-flex h-10 shrink-0 items-center justify-center bg-white px-4 text-sm font-black text-blue-950 hover:bg-orange-50">
            Reset password
          </Link>
        </div>
      </section>
    </div>
  );
}