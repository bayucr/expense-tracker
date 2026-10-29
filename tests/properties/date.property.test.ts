import { describe, it, expect } from "vitest";
import * as fc from "fast-check";
import { todayInJakarta, currentMonthInJakarta, monthRange } from "@/lib/date";

describe("Property 3: todayInJakarta returns correct Jakarta date", () => {
  it("always returns the exact UTC+7 date formatted as YYYY-MM-DD", () => {
    fc.assert(
      fc.property(
        fc.date({
          min: new Date("2000-01-01T00:00:00Z"),
          max: new Date("2050-12-31T23:59:59Z"),
        }),
        (date) => {
          const result = todayInJakarta(date);

          // Must strictly match YYYY-MM-DD
          expect(result).toMatch(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/);

          // Calculate manual UTC+7 date to verify accuracy
          const utcMs = date.getTime();
          const jakartaMs = utcMs + 7 * 60 * 60 * 1000;
          const jakartaDate = new Date(jakartaMs);

          const expectedYear = jakartaDate.getUTCFullYear();
          const expectedMonth = String(jakartaDate.getUTCMonth() + 1).padStart(2, "0");
          const expectedDay = String(jakartaDate.getUTCDate()).padStart(2, "0");
          const expectedFormatted = `${expectedYear}-${expectedMonth}-${expectedDay}`;

          expect(result).toBe(expectedFormatted);
        }
      )
    );
  });

  it("currentMonthInJakarta returns the year and month of todayInJakarta", () => {
    fc.assert(
      fc.property(
        fc.date({
          min: new Date("1970-01-01T00:00:00Z"),
          max: new Date("2099-12-31T23:59:59Z"),
        }),
        (date) => {
          const today = todayInJakarta(date);
          const month = currentMonthInJakarta(date);

          expect(month).toBe(today.slice(0, 7));
          expect(month).toMatch(/^\d{4}-(0[1-9]|1[0-2])$/);
        }
      )
    );
  });

  it("monthRange returns valid start and end dates encompassing the month", () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 2000, max: 2050 }),
        fc.integer({ min: 1, max: 12 }),
        (year, month) => {
          const ym = `${year}-${String(month).padStart(2, "0")}`;
          const { start, end } = monthRange(ym);

          expect(start).toBe(`${ym}-01`);
          expect(end.startsWith(ym)).toBe(true);
          const endDay = parseInt(end.slice(8, 10), 10);
          expect(endDay).toBeGreaterThanOrEqual(28);
          expect(endDay).toBeLessThanOrEqual(31);
        }
      )
    );
  });
});
