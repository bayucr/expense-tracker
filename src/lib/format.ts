/**
 * Utility functions for currency and minor unit manipulation (IDR).
 * 1 IDR = 100 minor units (sen/cents) in numeric(14,2) representation.
 */

/**
 * Converts a major unit monetary amount (e.g. 1500000.50) to integer minor units (150000050).
 * Rounds to nearest integer to eliminate IEEE 754 precision issues.
 */
export function toMinorUnits(amount: number): number {
  if (!Number.isFinite(amount)) return 0;
  return Math.round(Math.round(amount * 10000) / 100);
}

/**
 * Converts integer minor units (e.g. 150000050) back to major unit amount (1500000.50).
 */
export function fromMinorUnits(minorUnits: number): number {
  if (!Number.isFinite(minorUnits)) return 0;
  return Math.round(minorUnits) / 100;
}

/**
 * Formats a monetary number into Indonesian Rupiah (IDR) using Intl.NumberFormat.
 * Example: 1500000 -> "Rp 1.500.000"
 */
export function formatCurrency(
  amount: number,
  options: { showDecimals?: boolean } = {}
): string {
  if (!Number.isFinite(amount)) {
    return "Rp 0";
  }

  const isInteger = Number.isInteger(amount);
  const fractionDigits = options.showDecimals ? 2 : isInteger ? 0 : 2;

  const formatted = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(amount);

  return formatted;
}
