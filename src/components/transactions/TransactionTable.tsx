"use client";

import * as React from "react";
import { Transaction, Category } from "@/types";
import { formatCurrency } from "@/lib/format";
import { formatDisplayDate } from "@/lib/date";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { TransactionForm } from "./TransactionForm";
import { DeleteTransactionDialog } from "./DeleteTransactionDialog";
import { Edit2, Trash2, ArrowUpRight, ArrowDownLeft, Receipt } from "lucide-react";
import { useRouter } from "next/navigation";

interface TransactionTableProps {
  transactions: Transaction[];
  categories: Category[];
}

export function TransactionTable({ transactions, categories }: TransactionTableProps) {
  const router = useRouter();
  const [editingTx, setEditingTx] = React.useState<Transaction | null>(null);
  const [deletingTx, setDeletingTx] = React.useState<Transaction | null>(null);

  const handleSuccess = () => {
    setEditingTx(null);
    setDeletingTx(null);
    router.refresh();
  };

  if (transactions.length === 0) {
    return (
      <div className="rounded-xl border bg-card p-12 text-center shadow-sm">
        <Receipt className="h-12 w-12 mx-auto text-muted-foreground/40 mb-3" />
        <h3 className="font-semibold text-lg text-foreground mb-1">
          Tidak Ada Transaksi Ditemukan
        </h3>
        <p className="text-sm text-muted-foreground max-w-sm mx-auto">
          Tidak ada catatan transaksi untuk kriteria pencarian ini. Coba ubah filter atau
          tambahkan transaksi baru.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop & Tablet Table View */}
      <div className="hidden md:block rounded-xl border bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-900 border-b text-muted-foreground">
              <tr>
                <th className="py-3.5 px-4 text-left font-medium">Tanggal</th>
                <th className="py-3.5 px-4 text-left font-medium">Kategori</th>
                <th className="py-3.5 px-4 text-left font-medium">Deskripsi</th>
                <th className="py-3.5 px-4 text-right font-medium">Jumlah (IDR)</th>
                <th className="py-3.5 px-4 text-center font-medium w-24">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {transactions.map((tx) => {
                const isIncome = tx.type === "income";
                return (
                  <tr
                    key={tx.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-900/40 transition-colors"
                  >
                    {/* Date */}
                    <td className="py-3.5 px-4 whitespace-nowrap font-medium text-slate-700 dark:text-slate-300">
                      {formatDisplayDate(tx.date)}
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {tx.category ? (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border bg-slate-50 dark:bg-slate-900 border-border">
                          <span
                            className="h-2 w-2 rounded-full shrink-0"
                            style={{ backgroundColor: tx.category.color }}
                          />
                          <span>{tx.category.name}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground italic">
                          Tanpa Kategori
                        </span>
                      )}
                    </td>

                    {/* Description */}
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400 max-w-xs truncate">
                      {tx.description || "-"}
                    </td>

                    {/* Amount */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap font-semibold">
                      <div
                        className={`inline-flex items-center gap-1 ${
                          isIncome ? "text-emerald-600" : "text-rose-600"
                        }`}
                      >
                        {isIncome ? (
                          <ArrowUpRight className="h-4 w-4 shrink-0" />
                        ) : (
                          <ArrowDownLeft className="h-4 w-4 shrink-0" />
                        )}
                        <span>
                          {isIncome ? "+" : "-"}
                          {formatCurrency(tx.amount)}
                        </span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setEditingTx(tx)}
                          title="Edit Transaksi"
                          className="h-9 w-9 text-muted-foreground hover:text-foreground"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeletingTx(tx)}
                          title="Hapus Transaksi"
                          className="h-9 w-9 text-muted-foreground hover:text-rose-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View (Optimized for 360px viewport) */}
      <div className="md:hidden space-y-3">
        {transactions.map((tx) => {
          const isIncome = tx.type === "income";
          return (
            <div
              key={tx.id}
              className="rounded-xl border bg-card p-4 shadow-sm space-y-2.5"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-xs text-muted-foreground">
                    {formatDisplayDate(tx.date)}
                  </div>
                  <div className="font-semibold text-base text-foreground mt-0.5">
                    {tx.description || (isIncome ? "Pemasukan" : "Pengeluaran")}
                  </div>
                </div>

                <div
                  className={`font-bold text-base whitespace-nowrap ${
                    isIncome ? "text-emerald-600" : "text-rose-600"
                  }`}
                >
                  {isIncome ? "+" : "-"}
                  {formatCurrency(tx.amount)}
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-border/60">
                <div>
                  {tx.category ? (
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border bg-slate-50 dark:bg-slate-900 border-border">
                      <span
                        className="h-2 w-2 rounded-full shrink-0"
                        style={{ backgroundColor: tx.category.color }}
                      />
                      <span>{tx.category.name}</span>
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground italic">
                      Tanpa Kategori
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditingTx(tx)}
                    className="h-11 px-3 text-xs text-muted-foreground hover:text-foreground"
                  >
                    <Edit2 className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDeletingTx(tx)}
                    className="h-11 px-3 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Hapus
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingTx} onOpenChange={(open) => !open && setEditingTx(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Transaksi</DialogTitle>
          </DialogHeader>
          {editingTx && (
            <TransactionForm
              categories={categories}
              initialData={editingTx}
              onSuccess={handleSuccess}
              onCancel={() => setEditingTx(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <DeleteTransactionDialog
        transaction={deletingTx}
        open={!!deletingTx}
        onOpenChange={(open) => !open && setDeletingTx(null)}
        onSuccess={handleSuccess}
      />
    </>
  );
}
