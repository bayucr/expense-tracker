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
import { deleteCategory } from "@/actions/categories";
import { Category } from "@/types";
import { Loader2, AlertTriangle } from "lucide-react";

interface DeleteCategoryDialogProps {
  category: Category | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function DeleteCategoryDialog({
  category,
  open,
  onOpenChange,
  onSuccess,
}: DeleteCategoryDialogProps) {
  const [isPending, setIsPending] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  if (!category) return null;

  const handleDelete = async () => {
    setIsPending(true);
    setError(null);

    try {
      const res = await deleteCategory(category.id);
      if (!res.ok) {
        setError(res.error || "Gagal menghapus kategori.");
        setIsPending(false);
        return;
      }

      setIsPending(false);
      onOpenChange(false);
      onSuccess?.();
    } catch {
      setError("Terjadi kesalahan sistem saat menghapus.");
      setIsPending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center gap-2 text-rose-600">
            <AlertTriangle className="h-5 w-5" />
            <DialogTitle>Hapus Kategori</DialogTitle>
          </div>
          <DialogDescription className="pt-2">
            Apakah Anda yakin ingin menghapus kategori{" "}
            <span className="font-semibold text-foreground">
              &quot;{category.name}&quot;
            </span>
            ? Transaksi yang menggunakan kategori ini akan diubah menjadi &quot;Tanpa
            Kategori&quot;.
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
              "Hapus"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
