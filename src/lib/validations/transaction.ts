import { z } from "zod";

/**
 * Validates transaction inputs.
 * Ensures amount is positive and matches numeric(14,2) limits.
 */
export const transactionSchema = z.object({
  amount: z.coerce
    .number({
      required_error: "Jumlah transaksi wajib diisi",
      invalid_type_error: "Jumlah transaksi harus berupa angka valid",
    })
    .positive("Jumlah transaksi harus lebih besar dari 0")
    .max(999999999999.99, "Jumlah melebihi batas maksimum yang diperbolehkan")
    .refine(
      (val) => {
        // Enforce max 2 decimal places
        const parts = val.toString().split(".");
        return parts.length === 1 || parts[1].length <= 2;
      },
      { message: "Jumlah transaksi maksimal memiliki 2 angka desimal" }
    ),
  type: z.enum(["income", "expense"], {
    required_error: "Tipe transaksi harus 'income' atau 'expense'",
  }),
  category_id: z
    .string()
    .uuid("ID Kategori tidak valid")
    .nullable()
    .optional()
    .or(z.literal("").transform(() => null)),
  date: z
    .string({ required_error: "Tanggal transaksi wajib diisi" })
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal harus YYYY-MM-DD"),
  description: z
    .string()
    .max(255, "Deskripsi maksimal 255 karakter")
    .optional()
    .nullable()
    .transform((val) => (val && val.trim().length > 0 ? val.trim() : null)),
});

export type TransactionInput = z.infer<typeof transactionSchema>;
