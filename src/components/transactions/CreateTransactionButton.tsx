"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { TransactionForm } from "./TransactionForm";
import { Category } from "@/types";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

interface CreateTransactionButtonProps {
  categories: Category[];
}

export function CreateTransactionButton({ categories }: CreateTransactionButtonProps) {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();

  const handleSuccess = () => {
    setOpen(false);
    router.refresh();
  };

  return (
    <>
      <Button onClick={() => setOpen(true)} className="flex items-center gap-2">
        <Plus className="h-4 w-4" />
        Tambah Transaksi
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Catat Transaksi Baru</DialogTitle>
          </DialogHeader>
          <TransactionForm
            categories={categories}
            onSuccess={handleSuccess}
            onCancel={() => setOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
