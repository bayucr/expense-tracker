import { describe, it, expect } from "vitest";
import * as fc from "fast-check";
import { computeSummary } from "@/lib/summary";
import { Transaction, TransactionType } from "@/types";
import { toMinorUnits } from "@/lib/format";

describe("Property 1: Summary totals and balance invariant", () => {
  it("always preserves net_balance = total_income - total_expense across arbitrary transactions", () => {
    // Generate valid transactions with positive amounts matching numeric(14,2)
    const transactionArbitrary = fc.record({
      id: fc.uuid(),
      user_id: fc.uuid(),
      category_id: fc.option(fc.uuid(), { nil: null }),
      amount: fc
        .double({ min: 0.01, max: 1_000_000_000, noNaN: true })
        .map((n) => Math.round(n * 100) / 100),
      type: fc.constantFrom<TransactionType>("income", "expense"),
      date: fc.constant("2026-10-15"),
      description: fc.option(fc.string({ maxLength: 50 }), { nil: null }),
      created_at: fc.constant("2026-10-15T00:00:00Z"),
      category: fc.option(
        fc.record({
          id: fc.uuid(),
          name: fc.string({ minLength: 1, maxLength: 20 }),
          color: fc.constant("#10b981"),
          type: fc.constantFrom<TransactionType>("income", "expense"),
        }),
        { nil: null }
      ),
    }) as fc.Arbitrary<Transaction>;

    fc.assert(
      fc.property(fc.array(transactionArbitrary), (transactions) => {
        const summary = computeSummary(transactions, "2026-10");

        // Balance minor invariant
        expect(summary.balance_minor).toBe(summary.income_minor - summary.expense_minor);

        // Major units balance invariant (within minor unit precision)
        const expectedBalance =
          Math.round((summary.total_income - summary.total_expense) * 100) / 100;
        expect(summary.net_balance).toBe(expectedBalance);

        // Transaction count invariant
        expect(summary.transaction_count).toBe(transactions.length);

        // Totals must be non-negative
        expect(summary.total_income).toBeGreaterThanOrEqual(0);
        expect(summary.total_expense).toBeGreaterThanOrEqual(0);

        // Income minor units match sum of individual transactions
        const expectedIncomeMinor = transactions
          .filter((t) => t.type === "income")
          .reduce((acc, t) => acc + toMinorUnits(t.amount), 0);
        expect(summary.income_minor).toBe(expectedIncomeMinor);

        // Expense minor units match sum of individual transactions
        const expectedExpenseMinor = transactions
          .filter((t) => t.type === "expense")
          .reduce((acc, t) => acc + toMinorUnits(t.amount), 0);
        expect(summary.expense_minor).toBe(expectedExpenseMinor);
      })
    );
  });
});
