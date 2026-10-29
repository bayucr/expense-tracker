import { describe, it, expect } from "vitest";
import { loginSchema, registerSchema } from "@/lib/validations/auth";
import { transactionSchema } from "@/lib/validations/transaction";
import { categorySchema } from "@/lib/validations/category";

describe("Validation Schemas unit tests", () => {
  describe("Auth Schemas", () => {
    it("validates login schema properly", () => {
      const valid = loginSchema.safeParse({
        email: "user@example.com",
        password: "password123",
      });
      expect(valid.success).toBe(true);

      const invalidEmail = loginSchema.safeParse({
        email: "not-an-email",
        password: "password123",
      });
      expect(invalidEmail.success).toBe(false);

      const shortPassword = loginSchema.safeParse({
        email: "user@example.com",
        password: "123",
      });
      expect(shortPassword.success).toBe(false);
    });

    it("requires password confirmation to match", () => {
      const matching = registerSchema.safeParse({
        email: "user@example.com",
        password: "password123",
        confirmPassword: "password123",
      });
      expect(matching.success).toBe(true);

      const mismatch = registerSchema.safeParse({
        email: "user@example.com",
        password: "password123",
        confirmPassword: "differentPassword",
      });
      expect(mismatch.success).toBe(false);
    });
  });

  describe("Transaction Schema", () => {
    it("validates positive amount and decimal precision", () => {
      const valid = transactionSchema.safeParse({
        amount: "50000.50",
        type: "expense",
        category_id: null,
        date: "2026-10-29",
        description: "Makan Siang",
      });
      expect(valid.success).toBe(true);
      if (valid.success) {
        expect(valid.data.amount).toBe(50000.5);
      }

      // Negative amount rejected
      const negative = transactionSchema.safeParse({
        amount: -100,
        type: "expense",
        category_id: null,
        date: "2026-10-29",
      });
      expect(negative.success).toBe(false);

      // More than 2 decimal places rejected
      const tooManyDecimals = transactionSchema.safeParse({
        amount: 50.123,
        type: "expense",
        category_id: null,
        date: "2026-10-29",
      });
      expect(tooManyDecimals.success).toBe(false);
    });
  });

  describe("Category Schema", () => {
    it("trims whitespace and rejects blank names", () => {
      const blank = categorySchema.safeParse({
        name: "    ",
        type: "expense",
        color: "#ef4444",
      });
      expect(blank.success).toBe(false);

      const validPadded = categorySchema.safeParse({
        name: "  Gaji Bulanan  ",
        type: "income",
        color: "#10b981",
      });
      expect(validPadded.success).toBe(true);
      if (validPadded.success) {
        expect(validPadded.data.name).toBe("Gaji Bulanan");
      }
    });
  });
});
