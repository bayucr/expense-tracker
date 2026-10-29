import { getCategories } from "@/actions/categories";
import { CategoryList } from "@/components/categories/CategoryList";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kategori — Expense Tracker",
  description: "Kelola kategori transaksi",
};

export default async function CategoriesPage() {
  const result = await getCategories();
  const categories = result.ok && result.data ? result.data : [];

  return (
    <div className="space-y-6">
      <CategoryList categories={categories} />
    </div>
  );
}
