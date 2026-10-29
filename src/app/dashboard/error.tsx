"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RotateCcw } from "lucide-react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Dashboard error:", error);
  }, [error]);

  return (
    <div className="rounded-2xl border bg-card p-12 text-center shadow-sm max-w-lg mx-auto my-12 space-y-4">
      <div className="p-3 bg-rose-100 text-rose-600 rounded-2xl w-fit mx-auto">
        <AlertTriangle className="h-8 w-8" />
      </div>
      <h3 className="text-xl font-bold">Terjadi Kendala Memuat Data</h3>
      <p className="text-sm text-muted-foreground">
        {error.message || "Gagal memuat ringkasan keuangan. Silakan coba lagi."}
      </p>
      <div className="pt-2">
        <Button onClick={() => reset()} className="gap-2">
          <RotateCcw className="h-4 w-4" />
          Coba Lagi
        </Button>
      </div>
    </div>
  );
}
