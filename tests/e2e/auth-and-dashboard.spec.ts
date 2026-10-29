import { test, expect } from "@playwright/test";

test.describe("Expense Tracker End-to-End Tests", () => {
  test("Landing page loads and displays core elements and CTAs", async ({ page }) => {
    await page.goto("/");

    // Verify main brand heading
    await expect(page.locator("h1")).toContainText("Kelola Keuangan Pribadi");

    // Verify CTAs
    const startFreeBtn = page.getByRole("link", { name: "Mulai Gratis" });
    await expect(startFreeBtn).toBeVisible();

    const openDashboardBtn = page.getByRole("link", { name: "Buka Dashboard" });
    await expect(openDashboardBtn).toBeVisible();
  });

  test("Unauthenticated user accessing /dashboard is redirected to /login", async ({
    page,
  }) => {
    await page.goto("/dashboard");

    // Must be redirected to login with redirectTo parameter
    await expect(page).toHaveURL(/\/login\?redirectTo=/);
    await expect(page.locator("h1")).toContainText("Selamat Datang");
    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(page.getByLabel("Kata Sandi")).toBeVisible();
  });

  test("Login form validates empty email and password", async ({ page }) => {
    await page.goto("/login");

    // Submit empty form
    await page.getByRole("button", { name: "Masuk" }).click();

    // Verify validation messages appear
    await expect(page.getByText("Email wajib diisi")).toBeVisible();
    await expect(page.getByText("Kata sandi minimal 6 karakter")).toBeVisible();
  });

  test("Registration form verifies password confirmation match", async ({ page }) => {
    await page.goto("/register");

    await page.getByLabel("Email").fill("testuser@example.com");
    await page.getByLabel("Kata Sandi").fill("password123");
    await page.getByLabel("Konfirmasi Kata Sandi").fill("differentPassword");

    await page.getByRole("button", { name: "Daftar Akun" }).click();

    await expect(page.getByText("Konfirmasi kata sandi tidak cocok")).toBeVisible();
  });
});
