"use server";

import { createClient } from "@/lib/supabase/server";
import { categorySchema, CategoryInput } from "@/lib/validations/category";
import { Category, ServerActionResult } from "@/types";
import { revalidatePath } from "next/cache";

export async function getCategories(): Promise<ServerActionResult<Category[]>> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, error: "Unauthorized" };
  }

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("user_id", user.id)
    .order("name", { ascending: true });

  if (error) {
    return { ok: false, error: error.message };
  }

  return { ok: true, data: data as Category[] };
}

export async function createCategory(
  input: CategoryInput
): Promise<ServerActionResult<Category>> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, error: "Unauthorized" };
  }

  const parsed = categorySchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors: Record<string, string[]> = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0] as string;
      fieldErrors[field] = fieldErrors[field] || [];
      fieldErrors[field].push(issue.message);
    }
    return {
      ok: false,
      error: "Data kategori tidak valid.",
      fieldErrors,
    };
  }

  const { data, error } = await supabase
    .from("categories")
    .insert({
      user_id: user.id,
      name: parsed.data.name,
      type: parsed.data.type,
      color: parsed.data.color,
    })
    .select()
    .single();

  if (error) {
    if (error.code === "23505" || error.message.includes("unique")) {
      return {
        ok: false,
        error: `Kategori "${parsed.data.name}" sudah ada untuk tipe ${parsed.data.type === "income" ? "pemasukan" : "pengeluaran"}.`,
      };
    }
    return { ok: false, error: error.message };
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/categories");
  revalidatePath("/dashboard/transactions");

  return { ok: true, data: data as Category };
}

export async function updateCategory(
  id: string,
  input: CategoryInput
): Promise<ServerActionResult<Category>> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, error: "Unauthorized" };
  }

  const parsed = categorySchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Data kategori tidak valid.",
    };
  }

  const { data, error } = await supabase
    .from("categories")
    .update({
      name: parsed.data.name,
      type: parsed.data.type,
      color: parsed.data.color,
    })
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) {
    if (error.code === "23505" || error.message.includes("unique")) {
      return {
        ok: false,
        error: `Kategori "${parsed.data.name}" sudah ada untuk tipe ${parsed.data.type === "income" ? "pemasukan" : "pengeluaran"}.`,
      };
    }
    return { ok: false, error: error.message };
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/categories");
  revalidatePath("/dashboard/transactions");

  return { ok: true, data: data as Category };
}

export async function deleteCategory(id: string): Promise<ServerActionResult<void>> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, error: "Unauthorized" };
  }

  const { error } = await supabase
    .from("categories")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    return { ok: false, error: error.message };
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/categories");
  revalidatePath("/dashboard/transactions");

  return { ok: true };
}
