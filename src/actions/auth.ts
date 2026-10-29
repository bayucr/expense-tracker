"use server";

import { createClient } from "@/lib/supabase/server";
import {
  loginSchema,
  registerSchema,
  LoginInput,
  RegisterInput,
} from "@/lib/validations/auth";
import { ServerActionResult } from "@/types";
import { redirect } from "next/navigation";

export async function login(
  input: LoginInput
): Promise<ServerActionResult<{ email: string }>> {
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors: Record<string, string[]> = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0] as string;
      fieldErrors[field] = fieldErrors[field] || [];
      fieldErrors[field].push(issue.message);
    }
    return {
      ok: false,
      error: "Input tidak valid. Periksa kembali data Anda.",
      fieldErrors,
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    return {
      ok: false,
      error:
        error.message === "Invalid login credentials"
          ? "Email atau kata sandi salah."
          : error.message,
    };
  }

  return {
    ok: true,
    data: {
      email: data.user?.email || parsed.data.email,
    },
  };
}

export async function register(
  input: RegisterInput
): Promise<ServerActionResult<{ email: string }>> {
  const parsed = registerSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors: Record<string, string[]> = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0] as string;
      fieldErrors[field] = fieldErrors[field] || [];
      fieldErrors[field].push(issue.message);
    }
    return {
      ok: false,
      error: "Input tidak valid. Periksa kembali data Anda.",
      fieldErrors,
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    return {
      ok: false,
      error: error.message,
    };
  }

  return {
    ok: true,
    data: {
      email: data.user?.email || parsed.data.email,
    },
  };
}

export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function getCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}
