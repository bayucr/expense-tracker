import { z } from "zod";

/**
 * Validates category name: trims leading/trailing whitespace and enforces 1-50 chars length.
 */
export const categoryNameSchema = z
  .string({
    required_error: "Nama kategori wajib diisi",
  })
  .transform((val) => (typeof val === "string" ? val.trim() : ""))
  .pipe(
    z
      .string()
      .min(1, "Nama kategori wajib diisi")
      .max(50, "Nama kategori maksimal 50 karakter")
  );

export const categorySchema = z.object({
  name: categoryNameSchema,
  type: z.enum(["income", "expense"], {
    required_error: "Tipe kategori harus dipilih ('income' atau 'expense')",
  }),
  color: z
    .string()
    .regex(
      /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
      "Format warna harus berupa kode hex valid (misal #10b981)"
    )
    .default("#64748b"),
});

export type CategoryInput = z.infer<typeof categorySchema>;
