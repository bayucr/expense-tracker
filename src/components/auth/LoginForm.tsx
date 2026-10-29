"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginInput } from "@/lib/validations/auth";
import { login } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter, useSearchParams } from "next/navigation";
import { safeRedirectPath } from "@/lib/utils";
import { Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo");
  const urlError = searchParams.get("error");

  const [serverError, setServerError] = React.useState<string | null>(urlError);
  const [isPending, setIsPending] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginInput) => {
    setIsPending(true);
    setServerError(null);

    try {
      const res = await login(data);
      if (!res.ok) {
        setServerError(res.error || "Gagal masuk. Silakan coba lagi.");
        setIsPending(false);
        return;
      }

      const destination = safeRedirectPath(redirectTo, "/dashboard");
      router.push(destination);
      router.refresh();
    } catch {
      setServerError("Terjadi kesalahan jaringan atau server.");
      setIsPending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {serverError && (
        <div
          role="alert"
          className="flex items-center gap-2 rounded-md bg-rose-50 p-3 text-sm text-rose-700 border border-rose-200"
        >
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{serverError}</span>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="nama@email.com"
          autoComplete="email"
          disabled={isPending}
          {...register("email")}
        />
        {errors.email && <p className="text-xs text-rose-600">{errors.email.message}</p>}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Kata Sandi</Label>
        </div>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          autoComplete="current-password"
          disabled={isPending}
          {...register("password")}
        />
        {errors.password && (
          <p className="text-xs text-rose-600">{errors.password.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Memproses...
          </>
        ) : (
          "Masuk"
        )}
      </Button>

      <p className="text-center text-sm text-muted-foreground mt-4">
        Belum punya akun?{" "}
        <Link href="/register" className="font-medium text-emerald-600 hover:underline">
          Daftar sekarang
        </Link>
      </p>
    </form>
  );
}
