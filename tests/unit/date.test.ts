import { describe, it, expect } from "vitest";
import {
  todayInJakarta,
  currentMonthInJakarta,
  monthRange,
  formatDisplayDate,
  formatMonthLabel,
} from "@/lib/date";

describe("Date unit tests", () => {
  it("todayInJakarta returns YYYY-MM-DD for a specific UTC date", () => {
    // 2026-10-29 16:59:00 UTC = 2026-10-29 23:59:00 Jakarta
    const beforeMidnight = new Date("2026-10-29T16:59:00Z");
    expect(todayInJakarta(beforeMidnight)).toBe("2026-10-29");

    // 2026-10-29 17:01:00 UTC = 2026-10-30 00:01:00 Jakarta
    const afterMidnight = new Date("2026-10-29T17:01:00Z");
    expect(todayInJakarta(afterMidnight)).toBe("2026-10-30");
  });

  it("monthRange correctly calculates leap year February", () => {
    // 2024 is a leap year (29 days)
    const leap = monthRange("2024-02");
    expect(leap.start).toBe("2024-02-01");
    expect(leap.end).toBe("2024-02-29");

    // 2025 is not a leap year (28 days)
    const nonLeap = monthRange("2025-02");
    expect(nonLeap.start).toBe("2025-02-01");
    expect(nonLeap.end).toBe("2025-02-28");
  });

  it("monthRange handles 31-day and 30-day months", () => {
    const oct = monthRange("2026-10");
    expect(oct.start).toBe("2026-10-01");
    expect(oct.end).toBe("2026-10-31");

    const nov = monthRange("2026-11");
    expect(nov.start).toBe("2026-11-01");
    expect(nov.end).toBe("2026-11-30");
  });

  it("formatDisplayDate formats date in Indonesian locale", () => {
    const formatted = formatDisplayDate("2026-10-29");
    expect(formatted).toMatch(/29\s+Okt(ober)?\s+2026/);
  });

  it("formatMonthLabel formats month in Indonesian locale", () => {
    const formatted = formatMonthLabel("2026-10");
    expect(formatted.toLowerCase()).toContain("oktober 2026");
  });
});
