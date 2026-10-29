import { describe, it, expect } from "vitest";
import * as fc from "fast-check";
import { categoryNameSchema, categorySchema } from "@/lib/validations/category";

describe("Property 6: Category name schema trims whitespace and enforces length", () => {
  it("trims whitespace and succeeds for names between 1 and 50 characters", () => {
    // Generate base string of length 1..50 (excluding solely whitespace)
    const validBaseString = fc
      .string({ minLength: 1, maxLength: 50 })
      .filter((s) => s.trim().length >= 1 && s.trim().length <= 50);

    // Add random whitespace around it
    const whitespace = fc.constantFrom(" ", "   ", "\t", "  \t ");

    fc.assert(
      fc.property(validBaseString, whitespace, whitespace, (base, leading, trailing) => {
        const padded = `${leading}${base}${trailing}`;
        const result = categoryNameSchema.safeParse(padded);

        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data).toBe(padded.trim());
          expect(result.data.length).toBeGreaterThanOrEqual(1);
          expect(result.data.length).toBeLessThanOrEqual(50);
        }
      })
    );
  });

  it("fails when string consists only of whitespace", () => {
    fc.assert(
      fc.property(
        fc.stringOf(fc.constantFrom(" ", "\t", "\n", "\r")),
        (whitespaceOnly) => {
          const result = categoryNameSchema.safeParse(whitespaceOnly);
          expect(result.success).toBe(false);
        }
      )
    );
  });

  it("fails when trimmed length exceeds 50 characters", () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 51, maxLength: 100 }).filter((s) => s.trim().length > 50),
        (longString) => {
          const result = categoryNameSchema.safeParse(longString);
          expect(result.success).toBe(false);
        }
      )
    );
  });

  it("validates full category object including type and hex color", () => {
    const validCategory = {
      name: "  Makanan Siang  ",
      type: "expense",
      color: "#ef4444",
    };

    const res = categorySchema.safeParse(validCategory);
    expect(res.success).toBe(true);
    if (res.success) {
      expect(res.data.name).toBe("Makanan Siang");
      expect(res.data.type).toBe("expense");
      expect(res.data.color).toBe("#ef4444");
    }
  });
});
