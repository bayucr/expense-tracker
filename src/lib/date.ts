/**
 * Date utilities with Asia/Jakarta (UTC+7) timezone support.
 */

const JAKARTA_TZ = "Asia/Jakarta";

/**
 * Returns the current date in Asia/Jakarta timezone formatted as YYYY-MM-DD.
 */
export function todayInJakarta(referenceDate: Date = new Date()): string {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: JAKARTA_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  return formatter.format(referenceDate);
}

/**
 * Returns the current year and month in Asia/Jakarta timezone formatted as YYYY-MM.
 */
export function currentMonthInJakarta(referenceDate: Date = new Date()): string {
  const today = todayInJakarta(referenceDate);
  const parts = today.split("-");
  return `${parts[0]}-${parts[1]}`;
}

/**
 * Computes start and end dates (YYYY-MM-DD) for a given YYYY-MM string.
 * Falls back to current month if invalid input is provided.
 */
export function monthRange(yearMonth: string): { start: string; end: string } {
  const match = /^(\d{4})-(0[1-9]|1[0-2])$/.exec((yearMonth || "").trim());
  if (!match) {
    const fallbackMonth = currentMonthInJakarta();
    const [yearStr, monthStr] = fallbackMonth.split("-");
    const year = parseInt(yearStr, 10);
    const month = parseInt(monthStr, 10);
    const lastDay = new Date(year, month, 0).getDate();
    return {
      start: `${fallbackMonth}-01`,
      end: `${fallbackMonth}-${String(lastDay).padStart(2, "0")}`,
    };
  }

  const year = parseInt(match[1], 10);
  const month = parseInt(match[2], 10);
  const lastDay = new Date(year, month, 0).getDate();
  const padMonth = String(month).padStart(2, "0");
  const padDay = String(lastDay).padStart(2, "0");

  return {
    start: `${year}-${padMonth}-01`,
    end: `${year}-${padMonth}-${padDay}`,
  };
}

/**
 * Formats a date string (YYYY-MM-DD) for human-friendly display in Indonesian locale.
 * Example: "2026-10-29" -> "29 Okt 2026"
 */
export function formatDisplayDate(dateStr: string): string {
  if (!dateStr) return "";
  const [year, month, day] = dateStr.split("-").map(Number);
  if (!year || !month || !day) return dateStr;
  const d = new Date(year, month - 1, day);
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(d);
}

/**
 * Formats a year-month string (YYYY-MM) for header display in Indonesian locale.
 * Example: "2026-10" -> "Oktober 2026"
 */
export function formatMonthLabel(yearMonth: string): string {
  const [year, month] = (yearMonth || "").split("-").map(Number);
  if (!year || !month) return yearMonth;
  const d = new Date(year, month - 1, 1);
  return new Intl.DateTimeFormat("id-ID", {
    month: "long",
    year: "numeric",
  }).format(d);
}
