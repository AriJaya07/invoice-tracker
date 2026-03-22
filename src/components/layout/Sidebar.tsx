"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Users,
  Settings,
  CreditCard,
  TrendingUp,
  ChevronLeft,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import type { LucideIcon } from "lucide-react";
import { useUser } from "@/hooks/useUser";
import { cn } from "@/lib/cn";

const menuItems: { icon: LucideIcon; label: string; href: string }[] = [
  { icon: LayoutDashboard, label: "Overview", href: "/dashboard" },
  { icon: FileText, label: "Invoices", href: "/dashboard/invoices" },
  { icon: Users, label: "Clients", href: "/dashboard/clients" },
  { icon: TrendingUp, label: "Income", href: "/dashboard/income" },
  { icon: CreditCard, label: "Subscription", href: "/dashboard/subscription" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
];

function DashboardNav({
  pathname,
  isCollapsed,
  mobileOpen,
  onNavigate,
}: {
  pathname: string;
  isCollapsed: boolean;
  mobileOpen: boolean;
  onNavigate?: () => void;
}) {
  return (
    <nav className="flex-1 space-y-1 px-3 py-2" aria-label="Dashboard">
      {menuItems.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            title={isCollapsed && !mobileOpen ? item.label : undefined}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              isActive
                ? "bg-blue-50 text-blue-800"
                : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
            )}
          >
            <Icon
              className={cn(
                "h-5 w-5 shrink-0",
                isActive ? "text-blue-700" : "text-zinc-400"
              )}
              aria-hidden
            />
            {(!isCollapsed || mobileOpen) && <span>{item.label}</span>}
          </Link>
        );
      })}
    </nav>
  );
}

export const Sidebar = () => {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { signOut, user } = useUser();

  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

  const closeMobile = () => setMobileOpen(false);

  return (
    <>
      <header className="fixed left-0 right-0 top-0 z-40 flex h-14 items-center justify-between border-b border-zinc-200 bg-white/95 px-4 backdrop-blur-md md:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-zinc-700 transition-colors hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
          aria-expanded={mobileOpen}
          aria-controls="dashboard-sidebar"
          aria-label="Open navigation menu"
        >
          <Menu className="h-6 w-6" />
        </button>
        <span className="font-semibold tracking-tight text-zinc-900">
          Invoice<span className="text-blue-600">Flow</span>
        </span>
        <span className="w-10" aria-hidden />
      </header>

      {mobileOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-zinc-900/50 backdrop-blur-sm md:hidden"
          aria-label="Close menu"
          onClick={closeMobile}
        />
      ) : null}

      <aside
        id="dashboard-sidebar"
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex h-full flex-col border-r border-zinc-200 bg-white transition-transform duration-200 ease-out md:sticky md:top-0 md:z-0 md:h-screen md:translate-x-0",
          isCollapsed ? "md:w-20" : "md:w-64",
          mobileOpen
            ? "w-64 max-w-[85vw] translate-x-0 shadow-xl"
            : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="flex items-center justify-between p-4 md:p-6">
          {!isCollapsed && (
            <span className="text-lg font-bold tracking-tight text-zinc-900">
              Invoice<span className="text-blue-600">Flow</span>
            </span>
          )}
          <div className="ml-auto flex items-center gap-1">
            <button
              type="button"
              onClick={closeMobile}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-zinc-600 hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 md:hidden"
              aria-label="Close navigation menu"
            >
              <X className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden rounded-lg p-2 text-zinc-600 transition-colors hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 md:inline-flex"
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <ChevronLeft
                className={cn(
                  "h-5 w-5 transition-transform",
                  isCollapsed && "rotate-180"
                )}
              />
            </button>
          </div>
        </div>

        <DashboardNav
          pathname={pathname}
          isCollapsed={isCollapsed}
          mobileOpen={mobileOpen}
          onNavigate={closeMobile}
        />

        <div className="mt-auto border-t border-zinc-100 p-4">
          {!isCollapsed && user && (
            <div className="mb-4 flex items-center gap-3 rounded-lg bg-zinc-50 px-3 py-2">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-800">
                {user.name?.[0] || user.email?.[0]?.toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-zinc-900">
                  {user.name || "User"}
                </p>
                <p className="truncate text-xs text-zinc-500">{user.email}</p>
              </div>
            </div>
          )}
          <button
            type="button"
            onClick={() => signOut()}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-red-700 transition-colors hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2"
          >
            <LogOut className="h-5 w-5 shrink-0" aria-hidden />
            {(!isCollapsed || mobileOpen) && <span>Sign Out</span>}
          </button>
        </div>
      </aside>
    </>
  );
};
