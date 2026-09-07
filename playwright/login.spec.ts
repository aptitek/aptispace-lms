import { test, expect } from "@playwright/test";
import { loginAsAdmin, logout } from "./helpers/auth";

test.describe("Authentication & Gateway Login Flow", () => {
  test("displays gateway login card and dev impersonation tools", async ({
    page,
  }) => {
    await page.goto("/login");

    // Login card container exists
    const loginCard = page.locator("main, form, div").filter({
      hasText: "Continue with GitHub",
    });
    await expect(loginCard.first()).toBeVisible();

    // DevImpersonator is present in dev mode
    const devImpersonator = page.getByTestId("dev-impersonator");
    await expect(devImpersonator).toBeVisible();

    // Verify quick-create section exists
    await expect(page.getByTestId("create-role-select")).toBeVisible();
    await expect(page.getByTestId("create-user-btn")).toBeVisible();
  });

  test("authenticates as Admin and loads protected application shell", async ({
    page,
  }) => {
    await loginAsAdmin(page);

    // Verify application shell is mounted
    await expect(page.getByTestId("app-shell-root")).toBeVisible();
    await expect(page.getByTestId("app-shell-sidebar")).toBeVisible();

    // Expand sidebar to verify admin identity details
    await page.getByTestId("app-shell-sidebar").click();
    const userRole = page.getByTestId("sidebar-user-role-badge");
    await expect(userRole).toHaveText(/admin/i);

    // Verify Admin tab is present in navigation
    await expect(page.getByTestId("header-tab-admin")).toBeVisible();
  });

  test("signs out and redirects back to login gateway", async ({ page }) => {
    await loginAsAdmin(page);

    // Trigger logout
    await logout(page);

    // Verify redirected to login and protected route requires re-auth
    await expect(page).toHaveURL(/\/login/);
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/login/);
  });

  test("redirects unauthenticated direct requests to /login", async ({
    page,
  }) => {
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/login/);

    await page.goto("/planning");
    await expect(page).toHaveURL(/\/login/);
  });
});
