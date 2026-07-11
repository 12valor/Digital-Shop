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

    await expect(
      page.getByRole("banner").getByRole("link", { name: "Digital Shop home" }),
    ).toBeVisible();

    if ((page.viewportSize()?.width ?? 0) < 768) {
      await expect(page.locator("#mobile-header-search")).toBeVisible();
      await page.getByRole("button", { name: "Open menu" }).click();
      await expect(page.locator("#mobile-storefront-menu")).toBeVisible();
    } else {
      await expect(page.locator("#site-search")).toBeVisible();
    }

    await expect(page.getByRole("link", { name: /Cart/i }).first()).toBeVisible();
    await expect(page.getByRole("contentinfo")).toBeVisible();
    await expect(page.getByRole("navigation", { name: "Shop links" })).toBeVisible();
    expect(consoleErrors).toEqual([]);
  });

  test("catalog cards stay compact beside filters", async ({ page }) => {
    await page.goto("/category/game-credits");

    const cards = page.locator("main article");
    const cardCount = await cards.count();
    expect(cardCount).toBeGreaterThan(0);
    await expect(cards.nth(0)).toBeVisible();

    if ((page.viewportSize()?.width ?? 0) >= 768) {
      const filters = await page.locator("main form").boundingBox();
      const firstCard = await cards.nth(0).boundingBox();
      const secondCard = cardCount > 1 ? await cards.nth(1).boundingBox() : null;

      expect(filters).not.toBeNull();
      expect(firstCard).not.toBeNull();
      expect(firstCard!.height).toBeLessThan(filters!.height);

      if (secondCard) {
        expect(Math.abs(firstCard!.height - secondCard.height)).toBeLessThanOrEqual(1);
      }
    }

    await expect(page.getByRole("contentinfo")).toBeVisible();
    await expect(page.getByText("Manual GCash payment", { exact: true })).toBeVisible();
  });

  test("reset page requires a verified recovery session", async ({ page }) => {
    await page.goto("/auth/reset-password");

    await expect(page.getByRole("heading", { name: "Reset link required" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Request a new reset link" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Update password" })).toHaveCount(0);
  });

  test("admin route enforces setup or authentication guard", async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on("console", (message) => {
      if (message.type() === "error") {
        consoleErrors.push(message.text());
      }
    });

    await page.goto("/admin");

    const signInHeading = page.getByRole("heading", { name: "Sign in" });
    const setupGuard = page.getByText("SUPABASE SETUP REQUIRED");
    await expect(signInHeading.or(setupGuard)).toBeVisible();

    if (await signInHeading.isVisible()) {
      expect(new URL(page.url()).searchParams.get("next")).toBe("/admin");
    } else {
      await expect(page.getByRole("link", { name: "Back to storefront" })).toBeVisible();
    }

    expect(consoleErrors).toEqual([]);
  });
});
