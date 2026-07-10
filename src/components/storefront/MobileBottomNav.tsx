"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Categories", href: "/products" },
  { label: "Search", href: "/search" },
  { label: "Cart", href: "/cart" },
  { label: "Account", href: "/account" },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-zinc-200 bg-white md:hidden">
      {navItems.map((item) => {
        const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={
              active
                ? "px-1 py-2 text-center text-[11px] font-black text-orange-600"
                : "px-1 py-2 text-center text-[11px] font-bold text-zinc-600"
            }
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
