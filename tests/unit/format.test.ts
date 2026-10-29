import { describe, it, expect } from "vitest";
import { toMinorUnits, fromMinorUnits, formatCurrency } from "@/lib/format";

describe("Format unit tests", () => {
  it("toMinorUnits scales by 100 and rounds to integer", () => {
    expect(toMinorUnits(0)).toBe(0);
    expect(toMinorUnits(1500000)).toBe(150000000);
    expect(toMinorUnits(1234.56)).toBe(123456);
    expect(toMinorUnits(0.01)).toBe(1);
    expect(toMinorUnits(0.004)).toBe(0);
    expect(toMinorUnits(0.005)).toBe(1);
    expect(toMinorUnits(NaN)).toBe(0);
  });

  it("fromMinorUnits converts minor units to major units", () => {
    expect(fromMinorUnits(0)).toBe(0);
    expect(fromMinorUnits(150000000)).toBe(1500000);
    expect(fromMinorUnits(123456)).toBe(1234.56);
    expect(fromMinorUnits(1)).toBe(0.01);
    expect(fromMinorUnits(NaN)).toBe(0);
  });

  it("formatCurrency formats IDR without decimal sen by default for whole numbers", () => {
    const formatted = formatCurrency(500000).replace(/\u00A0/g, " ");
    expect(formatted).toBe("Rp 500.000");
  });

  it("formatCurrency handles zero and negative numbers safely", () => {
    expect(formatCurrency(0).replace(/\u00A0/g, " ")).toBe("Rp 0");
    const neg = formatCurrency(-50000).replace(/\u00A0/g, " ");
    expect(neg).toMatch(/-?Rp -?50\.000/);
  });
});
