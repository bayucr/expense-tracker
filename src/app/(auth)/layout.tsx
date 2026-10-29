import React from "react";
import Link from "next/link";
import { Wallet } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-2xl font-bold text-emerald-600 hover:opacity-90 transition-opacity"
          >
            <div className="p-2 rounded-xl bg-emerald-600 text-white shadow-md">
              <Wallet className="h-6 w-6" />
            </div>
            <span>ExpenseTracker</span>
          </Link>
          <p className="text-sm text-muted-foreground mt-2">
            Kelola pengeluaran & pemasukan dengan rapi dan akurat
          </p>
        </div>

        <div className="bg-card rounded-2xl shadow-xl border border-border p-6 sm:p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
