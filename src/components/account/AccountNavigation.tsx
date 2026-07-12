"use client";

import {
  ArrowLeft,
  LayoutDashboard,
  MapPin,
  Package,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { label: "Overview", href: "/account", icon: LayoutDashboard, exact: true },
  { label: "My orders", href: "/account/orders", icon: Package },
  { label: "Addresses", href: "/account#addresses", icon: MapPin, exact: true },
  { label: "Security", href: "/account#security", icon: ShieldCheck, exact: true },
];

export function AccountNavigation() {
  const pathname = usePathname();

  return (
    <nav aria-label="Account navigation" className="flex gap-1 overflow-x-auto md:grid md:gap-1">
      {links.map(({ label, href, icon: Icon, exact }) => {
        const path = href.split("#")[0];
        const active = exact ? pathname === path && !href.includes("#") : pathname.startsWith(path);

        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={`flex h-11 shrink-0 items-center gap-3 border-l-4 px-3 text-sm font-bold transition md:w-full ${
              active
                ? "border-orange-500 bg-orange-50 text-orange-800"
                : "border-transparent text-zinc-600 hover:bg-zinc-50 hover:text-zinc-950"
            }`}
          >
            <Icon className="size-4" aria-hidden="true" />
            {label}
          </Link>
        );
      })}
      <Link
        href="/"
        className="flex h-11 shrink-0 items-center gap-3 border-l-4 border-transparent px-3 text-sm font-bold text-zinc-600 transition hover:bg-zinc-50 hover:text-zinc-950 md:mt-3 md:w-full md:border-t md:border-l-0 md:pt-3"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Back to shop
      </Link>
    </nav>
  );
}
