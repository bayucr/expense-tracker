"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { deleteTransaction } from "@/actions/transactions";
import { Transaction } from "@/types";
import { formatCurrency } from "@/lib/format";
import { formatDisplayDate } from "@/lib/date";
import { Loader2, AlertTriangle } from "lucide-react";

interface DeleteTransactionDialogProps {
  transaction: Transaction | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function DeleteTransactionDialog({
  transaction,
  open,
  onOpenChange,
  onSuccess,
}: DeleteTransactionDialogProps) {
  const [isPending, setIsPending] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  if (!transaction) return null;

  const handleDelete = async () => {
    setIsPending(true);
    setError(null);

    try {
      const res = await deleteTransaction(transaction.id);
      if (!res.ok) {
        setError(res.error || "Gagal menghapus transaksi.");
        setIsPending(false);
        return;
      }

      setIsPending(false);
      onOpenChange(false);
      onSuccess?.();
    } catch {
      setError("Terjadi kesalahan sistem saat menghapus transaksi.");
      setIsPending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center gap-2 text-rose-600">
            <AlertTriangle className="h-5 w-5" />
            <DialogTitle>Hapus Transaksi</DialogTitle>
          </div>
          <DialogDescription className="pt-2">
            Apakah Anda yakin ingin menghapus transaksi sebesar{" "}
            <span className="font-semibold text-foreground">
              {formatCurrency(transaction.amount)}
            </span>{" "}
            ({formatDisplayDate(transaction.date)})? Tindakan ini tidak dapat dibatalkan.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <p className="text-sm text-rose-600 bg-rose-50 p-2 rounded-md">{error}</p>
        )}

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            disabled={isPending}
            onClick={() => onOpenChange(false)}
          >
            Batal
          </Button>
          <Button
            type="button"
            variant="destructive"
            disabled={isPending}
            onClick={handleDelete}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Menghapus...
              </>
            ) : (
              "Hapus Transaksi"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
