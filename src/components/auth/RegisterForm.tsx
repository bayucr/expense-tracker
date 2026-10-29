"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterInput } from "@/lib/validations/auth";
import { register as registerAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export function RegisterForm() {
  const router = useRouter();
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);
  const [isPending, setIsPending] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RegisterInput) => {
    setIsPending(true);
    setServerError(null);
    setSuccessMessage(null);

    try {
      const res = await registerAction(data);
      if (!res.ok) {
        setServerError(res.error || "Pendaftaran gagal. Silakan coba lagi.");
        setIsPending(false);
        return;
      }

      setSuccessMessage(
        "Pendaftaran berhasil! Silakan periksa email Anda untuk verifikasi atau langsung login jika konfirmasi email dinonaktifkan."
      );
      setTimeout(() => {
        router.push("/dashboard");
        router.refresh();
      }, 1500);
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

      {successMessage && (
        <div
          role="status"
          className="flex items-center gap-2 rounded-md bg-emerald-50 p-3 text-sm text-emerald-700 border border-emerald-200"
        >
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{successMessage}</span>
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
        <Label htmlFor="password">Kata Sandi</Label>
        <Input
          id="password"
          type="password"
          placeholder="Minimal 6 karakter"
          autoComplete="new-password"
          disabled={isPending}
          {...register("password")}
        />
        {errors.password && (
          <p className="text-xs text-rose-600">{errors.password.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Konfirmasi Kata Sandi</Label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="Ulangi kata sandi"
          autoComplete="new-password"
          disabled={isPending}
          {...register("confirmPassword")}
        />
        {errors.confirmPassword && (
          <p className="text-xs text-rose-600">{errors.confirmPassword.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Mendaftar...
          </>
        ) : (
          "Daftar Akun"
        )}
      </Button>

      <p className="text-center text-sm text-muted-foreground mt-4">
        Sudah memiliki akun?{" "}
        <Link href="/login" className="font-medium text-emerald-600 hover:underline">
          Masuk di sini
        </Link>
      </p>
    </form>
  );
}
