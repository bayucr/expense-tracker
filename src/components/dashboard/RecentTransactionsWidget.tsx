import * as React from "react";
import { Transaction } from "@/types";
import { formatCurrency } from "@/lib/format";
import { formatDisplayDate } from "@/lib/date";
import Link from "next/link";
import { ArrowUpRight, ArrowDownLeft, ArrowRight, Receipt } from "lucide-react";

interface RecentTransactionsWidgetProps {
  transactions: Transaction[];
}

export function RecentTransactionsWidget({
  transactions,
}: RecentTransactionsWidgetProps) {
  const recent = transactions.slice(0, 5);

  return (
    <div className="rounded-2xl border bg-card p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b pb-3">
        <div className="flex items-center gap-2">
          <Receipt className="h-5 w-5 text-emerald-600" />
          <h3 className="font-semibold text-lg">Transaksi Terbaru</h3>
        </div>
        <Link
          href="/dashboard/transactions"
          className="text-xs font-medium text-emerald-600 hover:underline flex items-center gap-1"
        >
          Lihat Semua
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {recent.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <p className="text-sm">Belum ada transaksi di bulan ini.</p>
        </div>
      ) : (
        <div className="divide-y divide-border">
          {recent.map((tx) => {
            const isIncome = tx.type === "income";
            return (
              <div
                key={tx.id}
                className="flex items-center justify-between py-3 hover:bg-slate-50 dark:hover:bg-slate-900/40 px-2 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-xl shrink-0 ${
                      isIncome
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
                        : "bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300"
                    }`}
                  >
                    {isIncome ? (
                      <ArrowUpRight className="h-4 w-4" />
                    ) : (
                      <ArrowDownLeft className="h-4 w-4" />
                    )}
                  </div>

                  <div>
                    <p className="font-medium text-sm text-foreground">
                      {tx.description || (isIncome ? "Pemasukan" : "Pengeluaran")}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{formatDisplayDate(tx.date)}</span>
                      {tx.category && (
                        <>
                          <span>•</span>
                          <span>{tx.category.name}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div
                  className={`font-semibold text-sm whitespace-nowrap ${
                    isIncome ? "text-emerald-600" : "text-rose-600"
                  }`}
                >
                  {isIncome ? "+" : "-"}
                  {formatCurrency(tx.amount)}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
