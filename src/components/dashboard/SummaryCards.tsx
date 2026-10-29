import * as React from "react";
import { MonthlySummary } from "@/types";
import { formatCurrency } from "@/lib/format";
import { ArrowUpRight, ArrowDownLeft, Wallet, Scale } from "lucide-react";

interface SummaryCardsProps {
  summary: MonthlySummary;
}

export function SummaryCards({ summary }: SummaryCardsProps) {
  const isPositiveBalance = summary.balance_minor >= 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {/* Total Income */}
      <div className="rounded-2xl border bg-card p-6 shadow-sm relative overflow-hidden transition-all hover:shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">
            Total Pemasukan
          </span>
          <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
            <ArrowUpRight className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-4">
          <h4 className="text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
            {formatCurrency(summary.total_income)}
          </h4>
          <p className="text-xs text-muted-foreground mt-1">Bulan terpilih</p>
        </div>
      </div>

      {/* Total Expense */}
      <div className="rounded-2xl border bg-card p-6 shadow-sm relative overflow-hidden transition-all hover:shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">
            Total Pengeluaran
          </span>
          <div className="p-2.5 rounded-xl bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300">
            <ArrowDownLeft className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-4">
          <h4 className="text-2xl font-bold tracking-tight text-rose-600 dark:text-rose-400">
            {formatCurrency(summary.total_expense)}
          </h4>
          <p className="text-xs text-muted-foreground mt-1">Bulan terpilih</p>
        </div>
      </div>

      {/* Net Balance */}
      <div className="rounded-2xl border bg-card p-6 shadow-sm relative overflow-hidden transition-all hover:shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">
            Saldo Bersih (Net)
          </span>
          <div
            className={`p-2.5 rounded-xl ${
              isPositiveBalance
                ? "bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300"
                : "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300"
            }`}
          >
            {isPositiveBalance ? (
              <Wallet className="h-5 w-5" />
            ) : (
              <Scale className="h-5 w-5" />
            )}
          </div>
        </div>
        <div className="mt-4">
          <h4
            className={`text-2xl font-bold tracking-tight ${
              isPositiveBalance
                ? "text-blue-600 dark:text-blue-400"
                : "text-amber-600 dark:text-amber-400"
            }`}
          >
            {formatCurrency(summary.net_balance)}
          </h4>
          <p className="text-xs text-muted-foreground mt-1">
            {summary.transaction_count} transaksi dicatat
          </p>
        </div>
      </div>
    </div>
  );
}
