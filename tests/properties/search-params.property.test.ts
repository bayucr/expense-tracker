import { describe, it, expect } from "vitest";
import * as fc from "fast-check";
import { parseTransactionFilters } from "@/lib/validations/search-params";

describe("Property 4: Search param parser always returns safe defaults", () => {
  it("never throws and always returns valid, safe defaults for any random dictionary input", () => {
    fc.assert(
      fc.property(
        fc.dictionary(
          fc.string({ maxLength: 20 }),
          fc.oneof(
            fc.string(),
            fc.integer(),
            fc.double(),
            fc.boolean(),
            fc.constant(null),
            fc.constant(undefined)
          )
        ),
        (raw) => {
          const parsed = parseTransactionFilters(raw);

          // Page invariants
          expect(Number.isInteger(parsed.page)).toBe(true);
          expect(parsed.page).toBeGreaterThanOrEqual(1);

          // PageSize invariants
          expect(Number.isInteger(parsed.pageSize)).toBe(true);
          expect(parsed.pageSize).toBeGreaterThanOrEqual(1);
          expect(parsed.pageSize).toBeLessThanOrEqual(100);

          // Month invariants
          expect(parsed.month).toMatch(/^\d{4}-(0[1-9]|1[0-2])$/);

          // Type invariants
          expect(["all", "income", "expense"]).toContain(parsed.type);

          // CategoryId invariants
          expect(typeof parsed.categoryId).toBe("string");

          // Sort invariants
          expect(["date", "amount"]).toContain(parsed.sortField);
          expect(["asc", "desc"]).toContain(parsed.sortOrder);

          // Search string invariants
          expect(typeof parsed.search).toBe("string");
        }
      )
    );
  });

  it("handles null and undefined gracefully", () => {
    const fromNull = parseTransactionFilters(null);
    expect(fromNull.page).toBe(1);
    expect(fromNull.pageSize).toBe(20);
    expect(fromNull.type).toBe("all");

    const fromUndefined = parseTransactionFilters(undefined);
    expect(fromUndefined.page).toBe(1);
    expect(fromUndefined.pageSize).toBe(20);
    expect(fromUndefined.type).toBe("all");
  });
});
