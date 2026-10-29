"use client";

import * as React from "react";
import { Category } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CategoryForm } from "./CategoryForm";
import { DeleteCategoryDialog } from "./DeleteCategoryDialog";
import {
  Plus,
  Edit2,
  Trash2,
  FolderPlus,
  ArrowUpCircle,
  ArrowDownCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface CategoryListProps {
  categories: Category[];
}

export function CategoryList({ categories }: CategoryListProps) {
  const router = useRouter();
  const [createDialogOpen, setCreateDialogOpen] = React.useState(false);
  const [editingCategory, setEditingCategory] = React.useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = React.useState<Category | null>(null);

  const incomeCategories = categories.filter((c) => c.type === "income");
  const expenseCategories = categories.filter((c) => c.type === "expense");

  const handleSuccess = () => {
    setCreateDialogOpen(false);
    setEditingCategory(null);
    setDeletingCategory(null);
    router.refresh();
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Daftar Kategori</h2>
          <p className="text-sm text-muted-foreground">
            Kelola kategori untuk mengelompokkan transaksi pemasukan dan pengeluaran
          </p>
        </div>

        <Button
          onClick={() => setCreateDialogOpen(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Tambah Kategori
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Expense Categories */}
        <div className="rounded-xl border bg-card p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b pb-3">
            <div className="flex items-center gap-2">
              <ArrowDownCircle className="h-5 w-5 text-rose-500" />
              <h3 className="font-semibold text-lg">Kategori Pengeluaran</h3>
            </div>
            <Badge variant="expense">{expenseCategories.length}</Badge>
          </div>

          {expenseCategories.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground space-y-2">
              <FolderPlus className="h-8 w-8 mx-auto opacity-40" />
              <p className="text-sm">Belum ada kategori pengeluaran.</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {expenseCategories.map((cat) => (
                <div
                  key={cat.id}
                  className="flex items-center justify-between py-3 group hover:bg-slate-50 dark:hover:bg-slate-900/50 px-2 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="h-4 w-4 rounded-full shrink-0 shadow-sm"
                      style={{ backgroundColor: cat.color }}
                    />
                    <span className="font-medium text-sm">{cat.name}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setEditingCategory(cat)}
                      title="Edit Kategori"
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeletingCategory(cat)}
                      title="Hapus Kategori"
                      className="text-muted-foreground hover:text-rose-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Income Categories */}
        <div className="rounded-xl border bg-card p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b pb-3">
            <div className="flex items-center gap-2">
              <ArrowUpCircle className="h-5 w-5 text-emerald-500" />
              <h3 className="font-semibold text-lg">Kategori Pemasukan</h3>
            </div>
            <Badge variant="income">{incomeCategories.length}</Badge>
          </div>

          {incomeCategories.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground space-y-2">
              <FolderPlus className="h-8 w-8 mx-auto opacity-40" />
              <p className="text-sm">Belum ada kategori pemasukan.</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {incomeCategories.map((cat) => (
                <div
                  key={cat.id}
                  className="flex items-center justify-between py-3 group hover:bg-slate-50 dark:hover:bg-slate-900/50 px-2 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="h-4 w-4 rounded-full shrink-0 shadow-sm"
                      style={{ backgroundColor: cat.color }}
                    />
                    <span className="font-medium text-sm">{cat.name}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setEditingCategory(cat)}
                      title="Edit Kategori"
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeletingCategory(cat)}
                      title="Hapus Kategori"
                      className="text-muted-foreground hover:text-rose-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tambah Kategori Baru</DialogTitle>
          </DialogHeader>
          <CategoryForm
            onSuccess={handleSuccess}
            onCancel={() => setCreateDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog
        open={!!editingCategory}
        onOpenChange={(open) => !open && setEditingCategory(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Perbarui Kategori</DialogTitle>
          </DialogHeader>
          {editingCategory && (
            <CategoryForm
              initialData={editingCategory}
              onSuccess={handleSuccess}
              onCancel={() => setEditingCategory(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <DeleteCategoryDialog
        category={deletingCategory}
        open={!!deletingCategory}
        onOpenChange={(open) => !open && setDeletingCategory(null)}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
