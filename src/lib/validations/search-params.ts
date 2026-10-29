import { TransactionFilterParams } from "@/types";
import { currentMonthInJakarta } from "@/lib/date";

/**
 * Safely extracts a string from a search param map or Record.
 */
function getParamString(
  params: Record<string, unknown> | URLSearchParams | null | undefined,
  key: string
): string | undefined {
  if (!params) return undefined;
  if (params instanceof URLSearchParams) {
    const val = params.get(key);
    return val !== null ? val : undefined;
  }
  const val = (params as Record<string, unknown>)[key];
  if (typeof val === "string") return val;
  if (typeof val === "number") return String(val);
  return undefined;
}

/**
 * Parses and sanitizes URL search parameters for transaction queries.
 * Always guarantees safe fallback defaults on invalid, malicious, or missing inputs.
 */
export function parseTransactionFilters(
  rawParams: Record<string, unknown> | URLSearchParams | null | undefined
): Required<TransactionFilterParams> {
  const currentMonth = currentMonthInJakarta();

  const rawMonth = getParamString(rawParams, "month");
  const month =
    rawMonth && /^\d{4}-(0[1-9]|1[0-2])$/.test(rawMonth.trim())
      ? rawMonth.trim()
      : currentMonth;

  const rawType = getParamString(rawParams, "type");
  const type: "income" | "expense" | "all" =
    rawType === "income" || rawType === "expense" ? rawType : "all";

  const rawCategory = getParamString(rawParams, "categoryId");
  const categoryId =
    rawCategory && rawCategory.trim() !== "" && rawCategory.trim() !== "all"
      ? rawCategory.trim()
      : "all";

  const rawSearch = getParamString(rawParams, "search");
  const search = typeof rawSearch === "string" ? rawSearch.trim().slice(0, 100) : "";

  const rawSortField = getParamString(rawParams, "sortField");
  const sortField: "date" | "amount" = rawSortField === "amount" ? "amount" : "date";

  const rawSortOrder = getParamString(rawParams, "sortOrder");
  const sortOrder: "asc" | "desc" = rawSortOrder === "asc" ? "asc" : "desc";

  const rawPage = getParamString(rawParams, "page");
  const parsedPage = rawPage ? parseInt(rawPage, 10) : 1;
  const page = Number.isInteger(parsedPage) && parsedPage >= 1 ? parsedPage : 1;

  const rawPageSize = getParamString(rawParams, "pageSize");
  const parsedPageSize = rawPageSize ? parseInt(rawPageSize, 10) : 20;
  const pageSize =
    Number.isInteger(parsedPageSize) && parsedPageSize >= 1 && parsedPageSize <= 100
      ? parsedPageSize
      : 20;

  return {
    month,
    type,
    categoryId,
    search,
    sortField,
    sortOrder,
    page,
    pageSize,
  };
}
