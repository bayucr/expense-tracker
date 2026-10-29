import { Transaction, TransactionRow } from "@/types";

/**
 * Maps a database transaction row to the domain Transaction model.
 * Performs numeric amount conversion (string/numeric -> number) once at the boundary.
 */
export function mapTransaction(row: TransactionRow): Transaction {
  const numericAmount =
    typeof row.amount === "number" ? row.amount : parseFloat(row.amount as string) || 0;

  return {
    id: row.id,
    user_id: row.user_id,
    category_id: row.category_id,
    amount: Math.round(numericAmount * 100) / 100,
    type: row.type,
    date: row.date,
    description: row.description,
    created_at: row.created_at,
    category: row.categories
      ? {
          id: row.categories.id,
          name: row.categories.name,
          color: row.categories.color,
          type: row.categories.type,
        }
      : null,
  };
}
