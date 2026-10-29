"use server";

import { createClient } from "@/lib/supabase/server";
import { transactionSchema, TransactionInput } from "@/lib/validations/transaction";
import { parseTransactionFilters } from "@/lib/validations/search-params";
import { monthRange } from "@/lib/date";
import { mapTransaction } from "@/lib/mappers";
import {
  Transaction,
  TransactionRow,
  ServerActionResult,
  TransactionFilterParams,
} from "@/types";
import { revalidatePath } from "next/cache";

export interface PaginatedTransactions {
  transactions: Transaction[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export async function getTransactions(
  rawFilters?: Record<string, unknown> | TransactionFilterParams
): Promise<ServerActionResult<PaginatedTransactions>> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, error: "Unauthorized" };
  }

  const filters = parseTransactionFilters(rawFilters as Record<string, unknown>);
  const { start, end } = monthRange(filters.month);

  let query = supabase
    .from("transactions")
    .select(
      `
      id,
      user_id,
      category_id,
      amount,
      type,
      date,
      description,
      created_at,
      categories (
        id,
        name,
        color,
        type
      )
    `,
      { count: "exact" }
    )
    .eq("user_id", user.id)
    .gte("date", start)
    .lte("date", end);

  if (filters.type !== "all") {
    query = query.eq("type", filters.type);
  }

  if (filters.categoryId !== "all") {
    query = query.eq("category_id", filters.categoryId);
  }

  if (filters.search) {
    query = query.ilike("description", `%${filters.search}%`);
  }

  // Sort and pagination
  const offset = (filters.page - 1) * filters.pageSize;
  query = query
    .order(filters.sortField, { ascending: filters.sortOrder === "asc" })
    .range(offset, offset + filters.pageSize - 1);

  const { data, count, error } = await query;

  if (error) {
    return { ok: false, error: error.message };
  }

  const transactions = (data as unknown as TransactionRow[]).map(mapTransaction);
  const totalCount = count || 0;
  const totalPages = Math.ceil(totalCount / filters.pageSize) || 1;

  return {
    ok: true,
    data: {
      transactions,
      totalCount,
      totalPages,
      currentPage: filters.page,
      pageSize: filters.pageSize,
    },
  };
}

export async function getAllTransactionsForMonth(
  month: string
): Promise<ServerActionResult<Transaction[]>> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, error: "Unauthorized" };
  }

  const { start, end } = monthRange(month);

  const { data, error } = await supabase
    .from("transactions")
    .select(
      `
      id,
      user_id,
      category_id,
      amount,
      type,
      date,
      description,
      created_at,
      categories (
        id,
        name,
        color,
        type
      )
    `
    )
    .eq("user_id", user.id)
    .gte("date", start)
    .lte("date", end)
    .order("date", { ascending: false });

  if (error) {
    return { ok: false, error: error.message };
  }

  const transactions = (data as unknown as TransactionRow[]).map(mapTransaction);
  return { ok: true, data: transactions };
}

export async function createTransaction(
  input: TransactionInput
): Promise<ServerActionResult<Transaction>> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, error: "Unauthorized" };
  }

  const parsed = transactionSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors: Record<string, string[]> = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0] as string;
      fieldErrors[field] = fieldErrors[field] || [];
      fieldErrors[field].push(issue.message);
    }
    return {
      ok: false,
      error: "Data transaksi tidak valid.",
      fieldErrors,
    };
  }

  // Security: verify category ownership if category_id is provided
  if (parsed.data.category_id) {
    const { data: category, error: catError } = await supabase
      .from("categories")
      .select("id, user_id, type")
      .eq("id", parsed.data.category_id)
      .eq("user_id", user.id)
      .maybeSingle();

    if (catError || !category) {
      return {
        ok: false,
        error: "Kategori tidak valid atau bukan milik Anda.",
      };
    }
  }

  const { data, error } = await supabase
    .from("transactions")
    .insert({
      user_id: user.id,
      category_id: parsed.data.category_id || null,
      amount: parsed.data.amount,
      type: parsed.data.type,
      date: parsed.data.date,
      description: parsed.data.description || null,
    })
    .select(
      `
      id,
      user_id,
      category_id,
      amount,
      type,
      date,
      description,
      created_at,
      categories (
        id,
        name,
        color,
        type
      )
    `
    )
    .single();

  if (error) {
    return { ok: false, error: error.message };
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/transactions");

  return { ok: true, data: mapTransaction(data as unknown as TransactionRow) };
}

export async function updateTransaction(
  id: string,
  input: TransactionInput
): Promise<ServerActionResult<Transaction>> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, error: "Unauthorized" };
  }

  const parsed = transactionSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Data transaksi tidak valid." };
  }

  // Security: verify category ownership if category_id is provided
  if (parsed.data.category_id) {
    const { data: category, error: catError } = await supabase
      .from("categories")
      .select("id, user_id, type")
      .eq("id", parsed.data.category_id)
      .eq("user_id", user.id)
      .maybeSingle();

    if (catError || !category) {
      return {
        ok: false,
        error: "Kategori tidak valid atau bukan milik Anda.",
      };
    }
  }

  const { data, error } = await supabase
    .from("transactions")
    .update({
      category_id: parsed.data.category_id || null,
      amount: parsed.data.amount,
      type: parsed.data.type,
      date: parsed.data.date,
      description: parsed.data.description || null,
    })
    .eq("id", id)
    .eq("user_id", user.id)
    .select(
      `
      id,
      user_id,
      category_id,
      amount,
      type,
      date,
      description,
      created_at,
      categories (
        id,
        name,
        color,
        type
      )
    `
    )
    .single();

  if (error) {
    return { ok: false, error: error.message };
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/transactions");

  return { ok: true, data: mapTransaction(data as unknown as TransactionRow) };
}

export async function deleteTransaction(id: string): Promise<ServerActionResult<void>> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, error: "Unauthorized" };
  }

  const { error } = await supabase
    .from("transactions")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    return { ok: false, error: error.message };
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/transactions");

  return { ok: true };
}
