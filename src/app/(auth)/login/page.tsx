import { LoginForm } from "@/components/auth/LoginForm";
import { Suspense } from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Masuk — Expense Tracker",
  description: "Masuk ke akun Expense Tracker Anda",
};

export default function LoginPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Selamat Datang</h1>
        <p className="text-sm text-muted-foreground">
          Masukkan email dan kata sandi untuk mengakses akun Anda
        </p>
      </div>

      <Suspense
        fallback={
          <div className="h-48 animate-pulse bg-slate-100 dark:bg-slate-800 rounded-lg" />
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}
