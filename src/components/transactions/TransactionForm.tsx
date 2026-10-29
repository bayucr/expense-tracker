"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { transactionSchema, TransactionInput } from "@/lib/validations/transaction";
import { createTransaction, updateTransaction } from "@/actions/transactions";
import { Category, Transaction } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { todayInJakarta } from "@/lib/date";
import { Loader2, AlertCircle } from "lucide-react";

interface TransactionFormProps {
  categories: Category[];
  initialData?: Transaction | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function TransactionForm({
  categories,
  initialData,
  onSuccess,
  onCancel,
}: TransactionFormProps) {
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [isPending, setIsPending] = React.useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TransactionInput>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      amount: initialData?.amount || ("" as unknown as number),
      type: initialData?.type || "expense",
      category_id: initialData?.category_id || null,
      date: initialData?.date || todayInJakarta(),
      description: initialData?.description || "",
    },
  });

  const selectedType = watch("type");
  const selectedCategoryId = watch("category_id");

  // Filter categories to only show those that match selected type
  const availableCategories = React.useMemo(() => {
    return categories.filter((c) => c.type === selectedType);
  }, [categories, selectedType]);

  const onSubmit = async (data: TransactionInput) => {
    setIsPending(true);
    setServerError(null);

    try {
      const res = initialData
        ? await updateTransaction(initialData.id, data)
        : await createTransaction(data);

      if (!res.ok) {
        setServerError(res.error || "Gagal menyimpan transaksi.");
        setIsPending(false);
        return;
      }

      setIsPending(false);
      onSuccess?.();
    } catch {
      setServerError("Terjadi kesalahan sistem saat menyimpan transaksi.");
      setIsPending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {serverError && (
        <div
          role="alert"
          className="flex items-center gap-2 rounded-md bg-rose-50 p-3 text-sm text-rose-700 border border-rose-200"
        >
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{serverError}</span>
        </div>
      )}

      {/* Type Selector (Income vs Expense) */}
      <div className="space-y-2">
        <Label>Tipe Transaksi</Label>
        <div className="grid grid-cols-2 gap-2">
          <Button
            type="button"
            variant={selectedType === "expense" ? "destructive" : "outline"}
            className={selectedType === "expense" ? "border-rose-600" : ""}
            onClick={() => {
              setValue("type", "expense");
              setValue("category_id", null);
            }}
          >
            Pengeluaran (Expense)
          </Button>
          <Button
            type="button"
            variant={selectedType === "income" ? "default" : "outline"}
            onClick={() => {
              setValue("type", "income");
              setValue("category_id", null);
            }}
          >
            Pemasukan (Income)
          </Button>
        </div>
        {errors.type && <p className="text-xs text-rose-600">{errors.type.message}</p>}
      </div>

      {/* Amount Input */}
      <div className="space-y-2">
        <Label htmlFor="amount">Jumlah (IDR / Rupiah)</Label>
        <div className="relative">
          <span className="absolute left-3 top-3 text-sm font-semibold text-muted-foreground">
            Rp
          </span>
          <Input
            id="amount"
            type="number"
            step="any"
            min="1"
            placeholder="50000"
            className="pl-11"
            disabled={isPending}
            {...register("amount")}
          />
        </div>
        {errors.amount && (
          <p className="text-xs text-rose-600">{errors.amount.message}</p>
        )}
      </div>

      {/* Category Dropdown */}
      <div className="space-y-2">
        <Label htmlFor="category_id">Kategori</Label>
        <Select
          disabled={isPending}
          value={selectedCategoryId || "none"}
          onValueChange={(val) => {
            setValue("category_id", val === "none" ? null : val);
          }}
        >
          <SelectTrigger id="category_id">
            <SelectValue placeholder="Pilih Kategori (Opsional)" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Tanpa Kategori</SelectItem>
            {availableCategories.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                <div className="flex items-center gap-2">
                  <span
                    className="h-3 w-3 rounded-full shrink-0"
                    style={{ backgroundColor: c.color }}
                  />
                  <span>{c.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.category_id && (
          <p className="text-xs text-rose-600">{errors.category_id.message}</p>
        )}
      </div>

      {/* Date Input */}
      <div className="space-y-2">
        <Label htmlFor="date">Tanggal</Label>
        <Input id="date" type="date" disabled={isPending} {...register("date")} />
        {errors.date && <p className="text-xs text-rose-600">{errors.date.message}</p>}
      </div>

      {/* Description Input */}
      <div className="space-y-2">
        <Label htmlFor="description">Deskripsi / Catatan (Opsional)</Label>
        <Input
          id="description"
          placeholder="Makan siang bersama tim, belanja mingguan, dsb."
          disabled={isPending}
          {...register("description")}
        />
        {errors.description && (
          <p className="text-xs text-rose-600">{errors.description.message}</p>
        )}
      </div>

      <div className="flex justify-end gap-2 pt-4">
        {onCancel && (
          <Button type="button" variant="outline" disabled={isPending} onClick={onCancel}>
            Batal
          </Button>
        )}
        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Menyimpan...
            </>
          ) : initialData ? (
            "Perbarui Transaksi"
          ) : (
            "Simpan Transaksi"
          )}
        </Button>
      </div>
    </form>
  );
}
