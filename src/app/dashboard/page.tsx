import { getAllTransactionsForMonth } from "@/actions/transactions";
import { getCategories } from "@/actions/categories";
import { computeSummary } from "@/lib/summary";
import { currentMonthInJakarta } from "@/lib/date";
import { SummaryCards } from "@/components/dashboard/SummaryCards";
import { MonthSelector } from "@/components/dashboard/MonthSelector";
import { CategoryBreakdownCard } from "@/components/dashboard/CategoryBreakdownCard";
import { RecentTransactionsWidget } from "@/components/dashboard/RecentTransactionsWidget";
import { CreateTransactionButton } from "@/components/transactions/CreateTransactionButton";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ringkasan Finansial — Expense Tracker",
  description: "Ringkasan dan analitik pengeluaran bulanan",
};

interface DashboardPageProps {
  searchParams: Record<string, string | string[] | undefined>;
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const currentMonth = currentMonthInJakarta();
  const rawMonth = searchParams.month;
  const month =
    typeof rawMonth === "string" && /^\d{4}-(0[1-9]|1[0-2])$/.test(rawMonth)
      ? rawMonth
      : currentMonth;

  const [txResult, catResult] = await Promise.all([
    getAllTransactionsForMonth(month),
    getCategories(),
  ]);

  const transactions = txResult.ok && txResult.data ? txResult.data : [];
  const categories = catResult.ok && catResult.data ? catResult.data : [];
  const summary = computeSummary(transactions, month);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Ringkasan Keuangan
          </h2>
          <p className="text-sm text-muted-foreground">
            Pantau arus kas, alokasi kategori, dan saldo bersih Anda
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <MonthSelector currentMonth={month} />
          <CreateTransactionButton categories={categories} />
        </div>
      </div>

      {/* Summary KPI Cards */}
      <SummaryCards summary={summary} />

      {/* Analytics & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CategoryBreakdownCard breakdown={summary.breakdown} />
        <RecentTransactionsWidget transactions={transactions} />
      </div>
    </div>
  );
}
