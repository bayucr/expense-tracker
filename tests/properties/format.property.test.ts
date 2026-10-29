import { describe, it, expect } from "vitest";
import * as fc from "fast-check";
import { toMinorUnits, fromMinorUnits } from "@/lib/format";

describe("Property 2: Minor unit arithmetic avoids floating-point error", () => {
  it("converts to minor units and back without precision drift for any 2-decimal money amount", () => {
    // Generate amounts with up to 2 decimal places
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 1_000_000_000 }).chain((cents) => {
          const amount = cents / 100;
          return fc.constant({ cents, amount });
        }),
        ({ cents, amount }) => {
          const minor = toMinorUnits(amount);
          expect(minor).toBe(cents);

          const recovered = fromMinorUnits(minor);
          expect(recovered).toBe(amount);
        }
      )
    );
  });

  it("addition in minor units avoids IEEE 754 floating point inaccuracies", () => {
    // Classic example: 0.10 + 0.20 = 0.30000000000000004 in raw float
    const rawSum = 0.1 + 0.2;
    expect(rawSum).not.toBe(0.3); // Proves float imperfection

    const minorSum = toMinorUnits(0.1) + toMinorUnits(0.2);
    expect(minorSum).toBe(30);
    expect(fromMinorUnits(minorSum)).toBe(0.3);

    // Property across random amounts
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 10_000_000 }),
        fc.integer({ min: 0, max: 10_000_000 }),
        (centsA, centsB) => {
          const amountA = centsA / 100;
          const amountB = centsB / 100;

          const minorA = toMinorUnits(amountA);
          const minorB = toMinorUnits(amountB);
          const totalMinor = minorA + minorB;

          expect(totalMinor).toBe(centsA + centsB);
          expect(fromMinorUnits(totalMinor)).toBe((centsA + centsB) / 100);
        }
      )
    );
  });
});
