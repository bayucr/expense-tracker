"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import {
  Wallet,
  LayoutDashboard,
  Receipt,
  FolderTree,
  LogOut,
  Menu,
  X,
  User as UserIcon,
} from "lucide-react";

interface DashboardNavProps {
  userEmail: string;
}

export function DashboardNav({ userEmail }: DashboardNavProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navItems = [
    {
      label: "Ringkasan",
      href: "/dashboard",
      icon: LayoutDashboard,
      active: pathname === "/dashboard",
    },
    {
      label: "Transaksi",
      href: "/dashboard/transactions",
      icon: Receipt,
      active: pathname.startsWith("/dashboard/transactions"),
    },
    {
      label: "Kategori",
      href: "/dashboard/categories",
      icon: FolderTree,
      active: pathname.startsWith("/dashboard/categories"),
    },
  ];

  return (
    <>
      {/* Top Mobile Bar */}
      <header className="lg:hidden sticky top-0 z-40 flex items-center justify-between h-16 px-4 border-b bg-card shadow-sm">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 font-bold text-lg text-emerald-600"
        >
          <div className="p-1.5 rounded-lg bg-emerald-600 text-white">
            <Wallet className="h-5 w-5" />
          </div>
          <span>ExpenseTracker</span>
        </Link>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "Tutup menu" : "Buka menu"}
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-16 z-30 bg-background/95 backdrop-blur-sm p-4 space-y-4 flex flex-col justify-between">
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-3 rounded-xl text-base font-medium transition-colors ${
                    item.active
                      ? "bg-emerald-50 text-emerald-700 font-semibold dark:bg-emerald-950/40 dark:text-emerald-300"
                      : "text-muted-foreground hover:bg-slate-100 dark:hover:bg-slate-900"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="pt-4 border-t space-y-3">
            <div className="flex items-center gap-2 px-3 text-sm text-muted-foreground">
              <UserIcon className="h-4 w-4" />
              <span className="truncate">{userEmail}</span>
            </div>
            <form action={signOut}>
              <Button
                type="submit"
                variant="outline"
                className="w-full flex items-center justify-center gap-2 text-rose-600 hover:text-rose-700 hover:bg-rose-50"
              >
                <LogOut className="h-4 w-4" />
                Keluar
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 border-r bg-card h-screen sticky top-0 p-5 justify-between">
        <div className="space-y-6">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 font-bold text-xl text-emerald-600 px-2"
          >
            <div className="p-2 rounded-xl bg-emerald-600 text-white shadow-sm">
              <Wallet className="h-5 w-5" />
            </div>
            <span>ExpenseTracker</span>
          </Link>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    item.active
                      ? "bg-emerald-50 text-emerald-700 font-semibold dark:bg-emerald-950/40 dark:text-emerald-300"
                      : "text-muted-foreground hover:bg-slate-100 hover:text-foreground dark:hover:bg-slate-900"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="pt-4 border-t space-y-3">
          <div className="flex items-center gap-2 px-3 text-xs text-muted-foreground">
            <UserIcon className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{userEmail}</span>
          </div>

          <form action={signOut}>
            <Button
              type="submit"
              variant="outline"
              className="w-full flex items-center justify-center gap-2 text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-200 dark:border-rose-900"
            >
              <LogOut className="h-4 w-4" />
              Keluar
            </Button>
          </form>
        </div>
      </aside>
    </>
  );
}
