export type TransactionType = "income" | "expense";

export interface Category {
  id: string;
  user_id: string;
  name: string;
  type: TransactionType;
  color: string;
  created_at: string;
}

export interface TransactionRow {
  id: string;
  user_id: string;
  category_id: string | null;
  amount: number | string;
  type: TransactionType;
  date: string;
  description: string | null;
  created_at: string;
  categories?: {
    id: string;
    name: string;
    color: string;
    type: TransactionType;
  } | null;
}

export interface Transaction {
  id: string;
  user_id: string;
  category_id: string | null;
  amount: number;
  type: TransactionType;
  date: string;
  description: string | null;
  created_at: string;
  category?: {
    id: string;
    name: string;
    color: string;
    type: TransactionType;
  } | null;
}

export interface CategoryBreakdown {
  category_id: string | null;
  category_name: string;
  category_color: string;
  type: TransactionType;
  total_amount: number;
  minor_amount: number;
  percentage: number;
  transaction_count: number;
}

export interface MonthlySummary {
  month: string;
  total_income: number;
  total_expense: number;
  net_balance: number;
  income_minor: number;
  expense_minor: number;
  balance_minor: number;
  transaction_count: number;
  breakdown: CategoryBreakdown[];
}

export interface ServerActionResult<T = void> {
  ok: boolean;
  data?: T;
  error?: string;
  fieldErrors?: Record<string, string[]>;
}

export interface TransactionFilterParams {
  month?: string;
  type?: TransactionType | "all";
  categoryId?: string | "all";
  search?: string;
  sortField?: "date" | "amount";
  sortOrder?: "asc" | "desc";
  page?: number;
  pageSize?: number;
}
