import { expect, test } from "@playwright/test";

test.describe("phase 5 smoke coverage", () => {
  test("storefront loads with key marketplace navigation", async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on("console", (message) => {
      if (message.type() === "error") {
        consoleErrors.push(message.text());
      }
    });

    await page.goto("/");

    await expect(page.getByRole("link", { name: "Digital Shop" })).toBeVisible();

    if ((page.viewportSize()?.width ?? 0) < 768) {
      await page.getByRole("button", { name: "Open menu" }).click();
      await expect(page.locator("#mobile-site-search")).toBeVisible();
    } else {
      await expect(page.locator("#site-search")).toBeVisible();
    }

    await expect(page.getByRole("link", { name: /Cart/i }).first()).toBeVisible();
    expect(consoleErrors).toEqual([]);
  });

  test("admin route shows setup guard when Supabase env is missing", async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on("console", (message) => {
      if (message.type() === "error") {
        consoleErrors.push(message.text());
      }
    });

    await page.goto("/admin");

    await expect(page.getByText("SUPABASE SETUP REQUIRED")).toBeVisible();
    await expect(page.getByRole("link", { name: "Back to storefront" })).toBeVisible();
    expect(consoleErrors).toEqual([]);
  });
});
