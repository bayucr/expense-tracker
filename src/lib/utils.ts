import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines Tailwind class names cleanly with clsx and twMerge.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Validates and sanitizes redirect paths to prevent Open Redirect vulnerabilities.
 * Ensures the path is strictly relative and belongs to the current application.
 *
 * @param path The candidate redirect path.
 * @param fallback Default path if candidate is invalid (default: "/dashboard").
 * @returns A safe relative path.
 */
export function safeRedirectPath(
  path: string | null | undefined,
  fallback: string = "/dashboard"
): string {
  if (!path || typeof path !== "string") {
    return fallback;
  }

  const trimmed = path.trim();

  // Must not be empty, must start with a single '/'
  if (trimmed.length === 0 || !trimmed.startsWith("/")) {
    return fallback;
  }

  // Reject protocol-relative URLs (//) or backslash bypasses (/\\, \/)
  if (trimmed.startsWith("//") || trimmed.startsWith("/\\") || trimmed.includes("\\")) {
    return fallback;
  }

  // Reject control characters, newlines, carriage returns
  if (/[\u0000-\u001F\u007F]/.test(trimmed)) {
    return fallback;
  }

  try {
    // Parse against a dummy base to verify origin and scheme integrity
    const parsed = new URL(trimmed, "http://localhost");

    // Must strictly remain on the same dummy origin
    if (parsed.origin !== "http://localhost") {
      return fallback;
    }

    // Must be http/https on the dummy origin (blocks javascript:, data:, etc.)
    if (parsed.protocol !== "http:") {
      return fallback;
    }

    // Return the safe relative pathname + search + hash
    return `${parsed.pathname}${parsed.search}${parsed.hash}`;
  } catch {
    return fallback;
  }
}
