"use client";

import { AnimatePresence, MotionConfig, motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { IconType } from "react-icons";
import {
  MdChevronLeft,
  MdChevronRight,
  MdClose,
  MdDashboard,
  MdHomeWork,
  MdInventory2,
  MdLogout,
  MdMenu,
  MdOpenInNew,
  MdPayments,
  MdReceiptLong,
  MdStorefront,
  MdViewCarousel,
} from "react-icons/md";

import { signOutAction } from "@/app/auth/actions";
import { BrandLogo } from "@/components/shared/BrandLogo";
import type { UserRole } from "@/types/database";

export type AdminNavItem = {
  label: string;
  href: string;
  icon: IconType;
  exact?: boolean;
};

const navigation: AdminNavItem[] = [
  { label: "Overview", href: "/admin", icon: MdDashboard, exact: true },
  { label: "Products", href: "/admin/products", icon: MdStorefront },
  { label: "Inventory", href: "/admin/inventory", icon: MdInventory2 },
  { label: "Payments", href: "/admin/payments", icon: MdPayments },
  { label: "Orders", href: "/admin/orders", icon: MdReceiptLong },
  { label: "Homepage", href: "/admin/homepage", icon: MdViewCarousel },
];

function initials(email: string) {
  return email.slice(0, 2).toUpperCase();
}

function NavigationLinks({
  collapsed,
  pathname,
  onNavigate,
}: {
  collapsed: boolean;
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <nav aria-label="Admin navigation" className="grid gap-1 px-2">
      {navigation.map(({ label, href, icon: Icon, exact }) => {
        const active = exact ? pathname === href : pathname.startsWith(href);

        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            title={collapsed ? label : undefined}
            className={`relative flex h-11 items-center gap-3 overflow-hidden rounded-md px-3 text-sm font-bold transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${
              active
                ? "bg-blue-50 text-blue-800"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
            }`}
          >
            {active ? (
              <motion.span
                layoutId="admin-active-nav"
                className="absolute inset-y-2 left-0 w-1 rounded-r bg-orange-500"
                transition={{ duration: 0.18 }}
              />
            ) : null}
            <Icon className="size-5 shrink-0" aria-hidden="true" />
            <span className={`whitespace-nowrap transition-opacity duration-150 ${collapsed ? "md:opacity-0" : "opacity-100"}`}>
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

export function AdminShell({
  email,
  role,
  children,
}: {
  email: string;
  role: UserRole;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setCollapsed(window.localStorage.getItem("admin-sidebar-collapsed") === "true");
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  function toggleCollapsed() {
    setCollapsed((current) => {
      const next = !current;
      window.localStorage.setItem("admin-sidebar-collapsed", String(next));
      return next;
    });
  }

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-[#f6f8fb] text-slate-950">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white">
        <div className="flex h-16 items-center gap-3 px-4 lg:px-6">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="grid size-10 place-items-center rounded-md text-slate-600 transition hover:bg-slate-100 hover:text-slate-950 focus-visible:outline-2 focus-visible:outline-blue-600 md:hidden"
            aria-label="Open admin navigation"
          >
            <MdMenu className="size-6" aria-hidden="true" />
          </button>
          <BrandLogo />
          <span className="hidden h-6 w-px bg-slate-200 sm:block" />
          <span className="hidden text-sm font-bold text-slate-500 sm:block">Admin workspace</span>

          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            <Link
              href="/"
              target="_blank"
              className="inline-flex h-10 items-center gap-2 rounded-md px-3 text-sm font-bold text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
            >
              <MdOpenInNew className="size-5" aria-hidden="true" />
              <span className="hidden lg:inline">View storefront</span>
            </Link>
            <div className="hidden min-w-0 items-center gap-3 border-l border-slate-200 pl-3 sm:flex">
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-blue-100 text-xs font-black text-blue-800">
                {initials(email)}
              </span>
              <div className="hidden min-w-0 xl:block">
                <p className="max-w-52 truncate text-xs font-bold text-slate-900">{email}</p>
                <p className="mt-0.5 text-[10px] font-bold uppercase text-slate-500">{role}</p>
              </div>
            </div>
            <form action={signOutAction}>
              <button
                type="submit"
                title="Sign out"
                className="grid size-10 place-items-center rounded-md text-slate-500 transition hover:bg-red-50 hover:text-red-700 focus-visible:outline-2 focus-visible:outline-red-600"
              >
                <MdLogout className="size-5" aria-hidden="true" />
                <span className="sr-only">Sign out</span>
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-4rem)]">
        <motion.aside
          initial={false}
          animate={{ width: collapsed ? 76 : 264 }}
          transition={{ duration: reduceMotion ? 0 : 0.2, ease: "easeOut" }}
          className="sticky top-16 hidden h-[calc(100vh-4rem)] shrink-0 border-r border-slate-200 bg-white py-4 md:flex md:flex-col"
        >
          <NavigationLinks collapsed={collapsed} pathname={pathname} />
          <div className="mt-auto px-2">
            <Link
              href="/"
              title={collapsed ? "Storefront" : undefined}
              className="flex h-11 items-center gap-3 overflow-hidden rounded-md px-3 text-sm font-bold text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
            >
              <MdHomeWork className="size-5 shrink-0" aria-hidden="true" />
              <span className={`whitespace-nowrap transition-opacity ${collapsed ? "opacity-0" : "opacity-100"}`}>
                Storefront
              </span>
            </Link>
            <button
              type="button"
              onClick={toggleCollapsed}
              className="mt-2 flex h-10 w-full items-center justify-center rounded-md border border-slate-200 text-slate-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-800 focus-visible:outline-2 focus-visible:outline-blue-600"
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? <MdChevronRight className="size-5" /> : <MdChevronLeft className="size-5" />}
            </button>
          </div>
        </motion.aside>

        <main className="min-w-0 flex-1">
          <motion.div
            key={pathname}
            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.18, ease: "easeOut" }}
            className="mx-auto w-full max-w-[1600px] px-4 py-5 sm:px-6 sm:py-7 lg:px-8 lg:py-8"
          >
            {children}
          </motion.div>
        </main>
      </div>

      <AnimatePresence>
        {mobileOpen ? (
          <>
            <motion.button
              type="button"
              aria-label="Close admin navigation"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.18 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-50 bg-slate-950/40 md:hidden"
            />
            <motion.aside
              initial={reduceMotion ? false : { x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ duration: reduceMotion ? 0 : 0.2, ease: "easeOut" }}
              className="fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col bg-white py-4 shadow-2xl md:hidden"
            >
              <div className="mb-5 flex items-center justify-between px-4">
                <BrandLogo />
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="grid size-10 place-items-center rounded-md text-slate-600 hover:bg-slate-100"
                  aria-label="Close admin navigation"
                >
                  <MdClose className="size-6" aria-hidden="true" />
                </button>
              </div>
              <NavigationLinks collapsed={false} pathname={pathname} onNavigate={() => setMobileOpen(false)} />
              <div className="mt-auto border-t border-slate-200 px-4 pt-4">
                <p className="truncate text-sm font-bold text-slate-900">{email}</p>
                <p className="mt-1 text-xs font-bold uppercase text-slate-500">{role}</p>
              </div>
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>
      </div>
    </MotionConfig>
  );
}
