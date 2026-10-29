import { describe, it, expect } from "vitest";
import { mapTransaction } from "@/lib/mappers";
import { TransactionRow } from "@/types";

describe("mapTransaction unit tests", () => {
  it("maps Postgres numeric string to JavaScript number", () => {
    const row: TransactionRow = {
      id: "tx-1",
      user_id: "user-1",
      category_id: "cat-1",
      amount: "1500000.50",
      type: "expense",
      date: "2026-10-29",
      description: "Belanja Bulanan",
      created_at: "2026-10-29T10:00:00Z",
      categories: {
        id: "cat-1",
        name: "Belanja",
        color: "#eab308",
        type: "expense",
      },
    };

    const mapped = mapTransaction(row);

    expect(typeof mapped.amount).toBe("number");
    expect(mapped.amount).toBe(1500000.5);
    expect(mapped.id).toBe("tx-1");
    expect(mapped.category?.name).toBe("Belanja");
  });

  it("handles null categories and missing descriptions gracefully", () => {
    const row: TransactionRow = {
      id: "tx-2",
      user_id: "user-1",
      category_id: null,
      amount: 25000,
      type: "expense",
      date: "2026-10-29",
      description: null,
      created_at: "2026-10-29T11:00:00Z",
    };

    const mapped = mapTransaction(row);

    expect(mapped.amount).toBe(25000);
    expect(mapped.category).toBeNull();
    expect(mapped.description).toBeNull();
  });
});
