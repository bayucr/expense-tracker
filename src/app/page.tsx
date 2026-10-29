import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Wallet,
  ArrowRight,
  ShieldCheck,
  PieChart,
  Calendar,
  Sparkles,
  CheckCircle,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      {/* Navigation */}
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl text-emerald-600">
            <div className="p-2 rounded-xl bg-emerald-600 text-white shadow-sm">
              <Wallet className="h-5 w-5" />
            </div>
            <span>ExpenseTracker</span>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost">Masuk</Button>
            </Link>
            <Link href="/register">
              <Button>Mulai Gratis</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 text-xs font-semibold">
            <Sparkles className="h-3.5 w-3.5" />
            Mata Uang Rupiah (IDR) & Zona Waktu Asia/Jakarta
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
            Kelola Keuangan Pribadi{" "}
            <span className="text-emerald-600">Secara Tepat & Cerdas</span>
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            Catat pengeluaran dan pemasukan harian, pantau alokasi kategori, dan lihat
            ringkasan arus kas bulanan Anda tanpa risiko floating-point drift.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/register" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto gap-2">
                Daftar Akun Gratis
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/dashboard" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Buka Dashboard
              </Button>
            </Link>
          </div>
        </section>

        {/* Feature Highlights */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl border bg-card p-6 shadow-sm space-y-3">
              <div className="p-3 w-fit rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                <PieChart className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-lg">Analisis Kategori Visual</h3>
              <p className="text-sm text-muted-foreground">
                Ketahui persis ke mana uang Anda dialokasikan melalui persentase breakdown
                kategori pengeluaran setiap bulannya.
              </p>
            </div>

            <div className="rounded-2xl border bg-card p-6 shadow-sm space-y-3">
              <div className="p-3 w-fit rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                <Calendar className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-lg">Waktu Asia/Jakarta & IDR</h3>
              <p className="text-sm text-muted-foreground">
                Format Rupiah standar (Rp 1.500.000) dengan perhitungan sen minor-unit
                untuk akurasi presisi tanpa pembulatan liar.
              </p>
            </div>

            <div className="rounded-2xl border bg-card p-6 shadow-sm space-y-3">
              <div className="p-3 w-fit rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-lg">Aman & Terisolasi (RLS)</h3>
              <p className="text-sm text-muted-foreground">
                Keamanan tingkat database Postgres dengan Row Level Security (RLS)
                memastikan transaksi Anda hanya dapat diakses oleh Anda.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-6 text-center text-sm text-muted-foreground bg-card">
        <p>© 2026 Expense Tracker App. Dibuat dengan Next.js & Supabase.</p>
      </footer>
    </div>
  );
}
