import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/actions/categories";
import {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from "@/actions/transactions";

// Mock Supabase Server Client returning null user (unauthenticated)
vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn().mockResolvedValue({
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: { user: null },
      }),
    },
  }),
}));

// Mock next/cache
vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

describe("Property 7: Unauthenticated Server Actions always return ok: false", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Category Actions", () => {
    it("getCategories returns ok: false with Unauthorized", async () => {
      const res = await getCategories();
      expect(res.ok).toBe(false);
      expect(res.error).toBe("Unauthorized");
    });

    it("createCategory returns ok: false with Unauthorized", async () => {
      const res = await createCategory({
        name: "Makanan",
        type: "expense",
        color: "#ef4444",
      });
      expect(res.ok).toBe(false);
      expect(res.error).toBe("Unauthorized");
    });

    it("updateCategory returns ok: false with Unauthorized", async () => {
      const res = await updateCategory("mock-id", {
        name: "Makanan Baru",
        type: "expense",
        color: "#ef4444",
      });
      expect(res.ok).toBe(false);
      expect(res.error).toBe("Unauthorized");
    });

    it("deleteCategory returns ok: false with Unauthorized", async () => {
      const res = await deleteCategory("mock-id");
      expect(res.ok).toBe(false);
      expect(res.error).toBe("Unauthorized");
    });
  });

  describe("Transaction Actions", () => {
    it("getTransactions returns ok: false with Unauthorized", async () => {
      const res = await getTransactions();
      expect(res.ok).toBe(false);
      expect(res.error).toBe("Unauthorized");
    });

    it("createTransaction returns ok: false with Unauthorized", async () => {
      const res = await createTransaction({
        amount: 50000,
        type: "expense",
        category_id: null,
        date: "2026-10-29",
        description: "Test unauth",
      });
      expect(res.ok).toBe(false);
      expect(res.error).toBe("Unauthorized");
    });

    it("updateTransaction returns ok: false with Unauthorized", async () => {
      const res = await updateTransaction("mock-tx-id", {
        amount: 75000,
        type: "expense",
        category_id: null,
        date: "2026-10-29",
        description: "Test unauth update",
      });
      expect(res.ok).toBe(false);
      expect(res.error).toBe("Unauthorized");
    });

    it("deleteTransaction returns ok: false with Unauthorized", async () => {
      const res = await deleteTransaction("mock-tx-id");
      expect(res.ok).toBe(false);
      expect(res.error).toBe("Unauthorized");
    });
  });
});
