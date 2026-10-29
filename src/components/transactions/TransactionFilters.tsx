"use client";

import * as React from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Category } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { currentMonthInJakarta } from "@/lib/date";
import { Search, RotateCcw, ArrowUpDown } from "lucide-react";

interface TransactionFiltersProps {
  categories: Category[];
}

export function TransactionFilters({ categories }: TransactionFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentMonth = currentMonthInJakarta();
  const activeMonth = searchParams.get("month") || currentMonth;
  const activeType = searchParams.get("type") || "all";
  const activeCategoryId = searchParams.get("categoryId") || "all";
  const activeSearch = searchParams.get("search") || "";
  const activeSortField = searchParams.get("sortField") || "date";
  const activeSortOrder = searchParams.get("sortOrder") || "desc";

  const [searchInput, setSearchInput] = React.useState(activeSearch);

  // Sync state if url changes
  React.useEffect(() => {
    setSearchInput(activeSearch);
  }, [activeSearch]);

  const updateFilters = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());

    // Reset to page 1 whenever any filter changes
    params.set("page", "1");

    Object.entries(updates).forEach(([key, val]) => {
      if (val === null || val === "" || val === "all") {
        params.delete(key);
      } else {
        params.set(key, val);
      }
    });

    router.push(`${pathname}?${params.toString()}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({ search: searchInput.trim() });
  };

  const handleReset = () => {
    setSearchInput("");
    router.push(pathname);
  };

  return (
    <div className="rounded-xl border bg-card p-4 space-y-4 shadow-sm">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {/* Month Selector */}
        <div>
          <label className="text-xs font-semibold text-muted-foreground block mb-1">
            Bulan
          </label>
          <Input
            type="month"
            value={activeMonth}
            onChange={(e) => updateFilters({ month: e.target.value })}
            className="w-full"
          />
        </div>

        {/* Type Filter */}
        <div>
          <label className="text-xs font-semibold text-muted-foreground block mb-1">
            Tipe
          </label>
          <Select
            value={activeType}
            onValueChange={(val) => updateFilters({ type: val })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Semua Tipe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Tipe</SelectItem>
              <SelectItem value="expense">Hanya Pengeluaran</SelectItem>
              <SelectItem value="income">Hanya Pemasukan</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Category Filter */}
        <div>
          <label className="text-xs font-semibold text-muted-foreground block mb-1">
            Kategori
          </label>
          <Select
            value={activeCategoryId}
            onValueChange={(val) => updateFilters({ categoryId: val })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Semua Kategori" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Kategori</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: c.color }}
                    />
                    <span>{c.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Sort */}
        <div>
          <label className="text-xs font-semibold text-muted-foreground block mb-1">
            Urutkan
          </label>
          <Select
            value={`${activeSortField}_${activeSortOrder}`}
            onValueChange={(val) => {
              const [field, order] = val.split("_");
              updateFilters({ sortField: field, sortOrder: order });
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Urutkan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date_desc">Tanggal (Terbaru)</SelectItem>
              <SelectItem value="date_asc">Tanggal (Terlama)</SelectItem>
              <SelectItem value="amount_desc">Jumlah (Terbesar)</SelectItem>
              <SelectItem value="amount_asc">Jumlah (Terkecil)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Reset Filter Button */}
        <div className="flex items-end">
          <Button
            type="button"
            variant="outline"
            className="w-full flex items-center justify-center gap-2"
            onClick={handleReset}
          >
            <RotateCcw className="h-4 w-4" />
            Reset Filter
          </Button>
        </div>
      </div>

      {/* Search Input Bar */}
      <form onSubmit={handleSearchSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari deskripsi transaksi..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button type="submit" variant="secondary">
          Cari
        </Button>
      </form>
    </div>
  );
}
