import { Transaction, MonthlySummary, CategoryBreakdown, TransactionType } from "@/types";
import { toMinorUnits, fromMinorUnits } from "./format";
import { currentMonthInJakarta } from "./date";

/**
 * Computes monthly financial summary strictly using integer minor unit arithmetic.
 * Ensures the invariant: net_balance = total_income - total_expense.
 */
export function computeSummary(
  transactions: Transaction[],
  month: string = currentMonthInJakarta()
): MonthlySummary {
  let income_minor = 0;
  let expense_minor = 0;

  // Track breakdown by category
  const breakdownMap = new Map<
    string,
    {
      category_id: string | null;
      category_name: string;
      category_color: string;
      type: TransactionType;
      minor_amount: number;
      transaction_count: number;
    }
  >();

  for (const t of transactions) {
    const minor = toMinorUnits(t.amount);
    if (t.type === "income") {
      income_minor += minor;
    } else {
      expense_minor += minor;
    }

    const catKey = `${t.type}_${t.category_id || "uncategorized"}`;
    const existing = breakdownMap.get(catKey);
    const categoryName = t.category?.name || "Tanpa Kategori";
    const categoryColor =
      t.category?.color || (t.type === "income" ? "#10b981" : "#94a3b8");

    if (existing) {
      existing.minor_amount += minor;
      existing.transaction_count += 1;
    } else {
      breakdownMap.set(catKey, {
        category_id: t.category_id,
        category_name: categoryName,
        category_color: categoryColor,
        type: t.type,
        minor_amount: minor,
        transaction_count: 1,
      });
    }
  }

  const balance_minor = income_minor - expense_minor;

  const total_income = fromMinorUnits(income_minor);
  const total_expense = fromMinorUnits(expense_minor);
  const net_balance = fromMinorUnits(balance_minor);

  const breakdown: CategoryBreakdown[] = Array.from(breakdownMap.values())
    .map((item) => {
      const typeTotalMinor = item.type === "expense" ? expense_minor : income_minor;
      const percentage =
        typeTotalMinor > 0
          ? Math.round((item.minor_amount / typeTotalMinor) * 1000) / 10
          : 0;

      return {
        category_id: item.category_id,
        category_name: item.category_name,
        category_color: item.category_color,
        type: item.type,
        total_amount: fromMinorUnits(item.minor_amount),
        minor_amount: item.minor_amount,
        percentage,
        transaction_count: item.transaction_count,
      };
    })
    .sort((a, b) => b.minor_amount - a.minor_amount);

  return {
    month,
    total_income,
    total_expense,
    net_balance,
    income_minor,
    expense_minor,
    balance_minor,
    transaction_count: transactions.length,
    breakdown,
  };
}
