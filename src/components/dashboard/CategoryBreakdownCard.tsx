import * as React from "react";
import { CategoryBreakdown } from "@/types";
import { formatCurrency } from "@/lib/format";
import { PieChart } from "lucide-react";

interface CategoryBreakdownCardProps {
  breakdown: CategoryBreakdown[];
}

export function CategoryBreakdownCard({ breakdown }: CategoryBreakdownCardProps) {
  const expenseBreakdown = breakdown.filter((b) => b.type === "expense");

  return (
    <div className="rounded-2xl border bg-card p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b pb-3">
        <div className="flex items-center gap-2">
          <PieChart className="h-5 w-5 text-emerald-600" />
          <h3 className="font-semibold text-lg">Alokasi Pengeluaran</h3>
        </div>
        <span className="text-xs text-muted-foreground font-medium">
          {expenseBreakdown.length} Kategori
        </span>
      </div>

      {expenseBreakdown.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <p className="text-sm">Belum ada pengeluaran di bulan ini.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {expenseBreakdown.map((item) => (
            <div
              key={`${item.type}_${item.category_id || "uncat"}`}
              className="space-y-1.5"
            >
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span
                    className="h-3 w-3 rounded-full shrink-0"
                    style={{ backgroundColor: item.category_color }}
                  />
                  <span className="font-medium text-slate-800 dark:text-slate-200">
                    {item.category_name}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">
                    {formatCurrency(item.total_amount)}
                  </span>
                  <span className="text-xs text-muted-foreground w-12 text-right">
                    {item.percentage}%
                  </span>
                </div>
              </div>

              {/* Visual Progress Bar */}
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.min(item.percentage, 100)}%`,
                    backgroundColor: item.category_color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
