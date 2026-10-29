import { getTransactions } from "@/actions/transactions";
import { getCategories } from "@/actions/categories";
import { TransactionTable } from "@/components/transactions/TransactionTable";
import { TransactionFilters } from "@/components/transactions/TransactionFilters";
import { Pagination } from "@/components/transactions/Pagination";
import { CreateTransactionButton } from "@/components/transactions/CreateTransactionButton";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Transaksi — Expense Tracker",
  description: "Kelola riwayat pemasukan dan pengeluaran",
};

interface TransactionsPageProps {
  searchParams: Record<string, string | string[] | undefined>;
}

export default async function TransactionsPage({ searchParams }: TransactionsPageProps) {
  // Extract search params safely
  const resolvedSearchParams: Record<string, unknown> = {};
  for (const [key, val] of Object.entries(searchParams)) {
    if (typeof val === "string") {
      resolvedSearchParams[key] = val;
    } else if (Array.isArray(val) && val[0]) {
      resolvedSearchParams[key] = val[0];
    }
  }

  const [txResult, catResult] = await Promise.all([
    getTransactions(resolvedSearchParams),
    getCategories(),
  ]);

  const categories = catResult.ok && catResult.data ? catResult.data : [];
  const paginatedData =
    txResult.ok && txResult.data
      ? txResult.data
      : {
          transactions: [],
          totalCount: 0,
          totalPages: 1,
          currentPage: 1,
          pageSize: 20,
        };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Riwayat Transaksi</h2>
          <p className="text-sm text-muted-foreground">
            Catat, saring, dan telusuri semua arus kas Anda
          </p>
        </div>

        <CreateTransactionButton categories={categories} />
      </div>

      <TransactionFilters categories={categories} />

      <TransactionTable
        transactions={paginatedData.transactions}
        categories={categories}
      />

      <Pagination
        currentPage={paginatedData.currentPage}
        totalPages={paginatedData.totalPages}
        totalCount={paginatedData.totalCount}
        pageSize={paginatedData.pageSize}
      />
    </div>
  );
}
