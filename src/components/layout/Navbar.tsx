"use client";

import Link from "next/link";
import { useState } from "react";
import { useUser } from "@/hooks/useUser";
import { Button } from "@/components/ui/Button";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/cn";

export const Navbar = () => {
  const { isAuthenticated, signOut } = useUser();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-zinc-200/80 bg-white/90 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-zinc-700 hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 md:hidden"
              aria-expanded={mobileOpen}
              aria-controls="site-nav-mobile"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              onClick={() => setMobileOpen((o) => !o)}
            >
              {mobileOpen ? (
                <X className="h-6 w-6" aria-hidden />
              ) : (
                <Menu className="h-6 w-6" aria-hidden />
              )}
            </button>
            <Link href="/" className="flex min-w-0 items-center gap-2">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white shadow-sm">
                IF
              </div>
              <span className="truncate text-lg font-bold tracking-tight text-zinc-900">
                Invoice<span className="text-blue-600">Flow</span>
              </span>
            </Link>
          </div>

          <div className="hidden items-center gap-8 md:flex">
            <Link
              href="/pricing"
              className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900"
            >
              Pricing
            </Link>
            <Link
              href="/#features"
              className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900"
            >
              Features
            </Link>
          </div>

          <div className="hidden items-center gap-3 md:flex">
            {isAuthenticated ? (
              <>
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm">
                    Dashboard
                  </Button>
                </Link>
                <Button variant="outline" size="sm" onClick={() => signOut()}>
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Log in
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">Get Started</Button>
                </Link>
              </>
            )}
          </div>
        </div>

        <div
          id="site-nav-mobile"
          className={cn(
            "border-t border-zinc-100 pb-4 pt-2 md:hidden",
            mobileOpen ? "block" : "hidden"
          )}
        >
          <div className="flex flex-col gap-1">
            <Link
              href="/pricing"
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
              onClick={() => setMobileOpen(false)}
            >
              Pricing
            </Link>
            <Link
              href="/#features"
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
              onClick={() => setMobileOpen(false)}
            >
              Features
            </Link>
            <div className="mt-2 flex flex-col gap-2 border-t border-zinc-100 pt-3">
              {isAuthenticated ? (
                <>
                  <Link href="/dashboard" onClick={() => setMobileOpen(false)}>
                    <Button variant="outline" className="w-full" size="sm">
                      Dashboard
                    </Button>
                  </Link>
                  <Button
                    className="w-full"
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setMobileOpen(false);
                      signOut();
                    }}
                  >
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setMobileOpen(false)}>
                    <Button variant="outline" className="w-full" size="sm">
                      Log in
                    </Button>
                  </Link>
                  <Link href="/register" onClick={() => setMobileOpen(false)}>
                    <Button className="w-full" size="sm">
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
