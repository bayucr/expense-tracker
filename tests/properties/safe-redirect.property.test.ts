import { describe, it, expect } from "vitest";
import * as fc from "fast-check";
import { safeRedirectPath } from "@/lib/utils";

describe("Property 5: safeRedirectPath rejects unsafe paths", () => {
  const DEFAULT_FALLBACK = "/dashboard";

  it("rejects absolute URLs with external protocols (http, https, javascript, data)", () => {
    fc.assert(
      fc.property(
        fc.constantFrom("http://", "https://", "javascript:", "data:", "ftp://"),
        fc.webUrl(),
        (scheme, rest) => {
          const dangerousUrl = `${scheme}${rest}`;
          const safe = safeRedirectPath(dangerousUrl);
          expect(safe).toBe(DEFAULT_FALLBACK);
        }
      )
    );
  });

  it("rejects protocol-relative URLs starting with // or backslash bypasses", () => {
    fc.assert(
      fc.property(
        fc.constantFrom("//evil.com", "//google.com/test", "/\\evil.com", "\\\\evil.com"),
        (malicious) => {
          expect(safeRedirectPath(malicious)).toBe(DEFAULT_FALLBACK);
        }
      )
    );
  });

  it("rejects paths with backslashes anywhere in the path", () => {
    fc.assert(
      fc.property(
        fc.string().filter((s) => s.includes("\\")),
        (hasBackslash) => {
          expect(safeRedirectPath(`/${hasBackslash}`)).toBe(DEFAULT_FALLBACK);
        }
      )
    );
  });

  it("accepts valid internal relative paths", () => {
    const validPaths = [
      "/dashboard",
      "/dashboard/transactions",
      "/dashboard/categories",
      "/dashboard/transactions?page=2&month=2026-10",
      "/login",
      "/register",
      "/dashboard#summary",
    ];

    for (const path of validPaths) {
      expect(safeRedirectPath(path)).toBe(path);
    }
  });

  it("uses custom fallback if specified", () => {
    expect(safeRedirectPath("https://attacker.com", "/custom-fallback")).toBe(
      "/custom-fallback"
    );
    expect(safeRedirectPath(null, "/custom-fallback")).toBe("/custom-fallback");
  });
});
