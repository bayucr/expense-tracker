import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Expense Tracker — Kelola Keuangan Anda",
  description:
    "Aplikasi pencatatan pengeluaran dan pemasukan finansial pribadi berbasis Next.js dan Supabase dengan mata uang Rupiah (IDR).",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
