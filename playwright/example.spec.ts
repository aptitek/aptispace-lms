import { test, expect } from "@playwright/test";

test.describe("Smoke Test", () => {
  test("loads gateway login or home page", async ({ page }) => {
    await page.goto("/");
    // Either redirected to /login or lands on / or /planning
    await expect(page).toHaveURL(/\/(login|planning)?/);
  });
});
