"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { categorySchema, CategoryInput } from "@/lib/validations/category";
import { createCategory, updateCategory } from "@/actions/categories";
import { Category } from "@/types";
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
import { Loader2, AlertCircle } from "lucide-react";

interface CategoryFormProps {
  initialData?: Category | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const PRESET_COLORS = [
  "#ef4444", // red
  "#f97316", // orange
  "#eab308", // amber
  "#10b981", // emerald
  "#06b6d4", // cyan
  "#3b82f6", // blue
  "#8b5cf6", // violet
  "#ec4899", // pink
  "#64748b", // slate
];

export function CategoryForm({ initialData, onSuccess, onCancel }: CategoryFormProps) {
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [isPending, setIsPending] = React.useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CategoryInput>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: initialData?.name || "",
      type: initialData?.type || "expense",
      color: initialData?.color || "#10b981",
    },
  });

  const selectedType = watch("type");
  const selectedColor = watch("color");

  const onSubmit = async (data: CategoryInput) => {
    setIsPending(true);
    setServerError(null);

    try {
      const res = initialData
        ? await updateCategory(initialData.id, data)
        : await createCategory(data);

      if (!res.ok) {
        setServerError(res.error || "Gagal menyimpan kategori.");
        setIsPending(false);
        return;
      }

      setIsPending(false);
      onSuccess?.();
    } catch {
      setServerError("Terjadi kesalahan sistem.");
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

      <div className="space-y-2">
        <Label htmlFor="category-name">Nama Kategori</Label>
        <Input
          id="category-name"
          placeholder="Contoh: Makanan, Transportasi"
          disabled={isPending}
          {...register("name")}
        />
        {errors.name && <p className="text-xs text-rose-600">{errors.name.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="category-type">Tipe</Label>
        <Select
          disabled={isPending || !!initialData}
          value={selectedType}
          onValueChange={(val: "income" | "expense") => setValue("type", val)}
        >
          <SelectTrigger id="category-type">
            <SelectValue placeholder="Pilih tipe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="expense">Pengeluaran (Expense)</SelectItem>
            <SelectItem value="income">Pemasukan (Income)</SelectItem>
          </SelectContent>
        </Select>
        {errors.type && <p className="text-xs text-rose-600">{errors.type.message}</p>}
      </div>

      <div className="space-y-2">
        <Label>Warna Kategori</Label>
        <div className="flex flex-wrap gap-2 pt-1 items-center">
          {PRESET_COLORS.map((c) => (
            <button
              key={c}
              type="button"
              className={`h-9 w-9 rounded-full border-2 transition-transform ${
                selectedColor === c
                  ? "scale-110 border-slate-900 shadow-md dark:border-white"
                  : "border-transparent hover:scale-105"
              }`}
              style={{ backgroundColor: c }}
              onClick={() => setValue("color", c)}
              aria-label={`Pilih warna ${c}`}
            />
          ))}
          <Input
            type="color"
            value={selectedColor}
            onChange={(e) => setValue("color", e.target.value)}
            className="h-9 w-12 p-0 cursor-pointer border rounded-md"
            title="Pilih warna kustom"
          />
        </div>
        {errors.color && <p className="text-xs text-rose-600">{errors.color.message}</p>}
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
            "Perbarui Kategori"
          ) : (
            "Tambah Kategori"
          )}
        </Button>
      </div>
    </form>
  );
}
