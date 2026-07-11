"use client";

import { Grid2X2, Home, Search, ShoppingCart, UserRound } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Home", href: "/", icon: Home },
  { label: "Categories", href: "/products", icon: Grid2X2 },
  { label: "Search", href: "/search", icon: Search },
  { label: "Cart", href: "/cart", icon: ShoppingCart },
  { label: "Account", href: "/account", icon: UserRound },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-zinc-200 bg-white md:hidden">
      {navItems.map((item) => {
        const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={
              active
                ? "flex min-h-14 flex-col items-center justify-center gap-1 px-1 py-1 text-center text-[10px] font-black text-orange-600"
                : "flex min-h-14 flex-col items-center justify-center gap-1 px-1 py-1 text-center text-[10px] font-bold text-zinc-600"
            }
          >
            <Icon className="size-5" aria-hidden="true" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
