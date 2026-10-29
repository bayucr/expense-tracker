"use client";

import * as React from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { formatMonthLabel } from "@/lib/date";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";

interface MonthSelectorProps {
  currentMonth: string; // YYYY-MM
}

export function MonthSelector({ currentMonth }: MonthSelectorProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const changeMonth = (delta: number) => {
    const [yearStr, monthStr] = currentMonth.split("-");
    let year = parseInt(yearStr, 10);
    let month = parseInt(monthStr, 10) + delta;

    if (month > 12) {
      year += 1;
      month = 1;
    } else if (month < 1) {
      year -= 1;
      month = 12;
    }

    const nextMonth = `${year}-${String(month).padStart(2, "0")}`;
    const params = new URLSearchParams(searchParams.toString());
    params.set("month", nextMonth);
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("month", e.target.value);
      router.push(`${pathname}?${params.toString()}`);
    }
  };

  return (
    <div className="flex items-center gap-2 bg-card border rounded-xl p-1.5 shadow-sm">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => changeMonth(-1)}
        className="h-9 w-9 text-muted-foreground hover:text-foreground"
        title="Bulan sebelumnya"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <div className="relative flex items-center px-2">
        <Calendar className="h-4 w-4 mr-2 text-emerald-600 shrink-0" />
        <span className="font-semibold text-sm whitespace-nowrap min-w-[130px] text-center">
          {formatMonthLabel(currentMonth)}
        </span>
        <input
          type="month"
          value={currentMonth}
          onChange={handleDateChange}
          aria-label="Pilih bulan"
          className="absolute inset-0 opacity-0 cursor-pointer w-full"
        />
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => changeMonth(1)}
        className="h-9 w-9 text-muted-foreground hover:text-foreground"
        title="Bulan berikutnya"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
