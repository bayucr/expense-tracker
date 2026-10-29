import { describe, it, expect } from "vitest";
import * as fc from "fast-check";
import { formatCurrency } from "@/lib/format";

describe("Property 8: formatCurrency produces valid IDR format", () => {
  it("always formats monetary amounts starting with 'Rp' and valid Indonesian formatting", () => {
    fc.assert(
      fc.property(fc.integer({ min: 0, max: 1_000_000_000_000 }), (amount) => {
        const formatted = formatCurrency(amount);

        // Must start with Rp followed by space or non-breaking space
        expect(formatted).toMatch(/^Rp[\s\u00A0]/);

        // The numeric portion must use '.' for thousands grouping
        const numberPart = formatted.replace(/^Rp[\s\u00A0]/, "").trim();

        // Regex matching Indonesian integer currency: digits separated by dots
        expect(numberPart).toMatch(/^\d{1,3}(\.\d{3})*$/);
      })
    );
  });

  it("formats specific benchmark IDR values correctly", () => {
    // Benchmark from design spec: 1500000 -> Rp 1.500.000
    const sample = formatCurrency(1500000);
    // Replace non-breaking space with standard space for testing
    const normalized = sample.replace(/\u00A0/g, " ");
    expect(normalized).toBe("Rp 1.500.000");

    expect(formatCurrency(0).replace(/\u00A0/g, " ")).toBe("Rp 0");
    expect(formatCurrency(50000).replace(/\u00A0/g, " ")).toBe("Rp 50.000");
    expect(formatCurrency(1000000000).replace(/\u00A0/g, " ")).toBe("Rp 1.000.000.000");
  });

  it("handles non-finite and decimal numbers safely", () => {
    expect(formatCurrency(NaN)).toBe("Rp 0");
    expect(formatCurrency(Infinity)).toBe("Rp 0");

    const withDecimals = formatCurrency(1500000.5, { showDecimals: true });
    const normalizedDec = withDecimals.replace(/\u00A0/g, " ");
    // Indonesian decimal separator is comma ','
    expect(normalizedDec).toMatch(/^Rp 1\.500\.000,50?$/);
  });
});
