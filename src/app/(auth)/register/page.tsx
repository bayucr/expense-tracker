import { RegisterForm } from "@/components/auth/RegisterForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Daftar — Expense Tracker",
  description: "Buat akun baru di Expense Tracker",
};

export default function RegisterPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Buat Akun Baru</h1>
        <p className="text-sm text-muted-foreground">
          Mulai lacak keuangan Anda dengan mudah hari ini
        </p>
      </div>

      <RegisterForm />
    </div>
  );
}
