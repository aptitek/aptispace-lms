import { test, expect } from "@playwright/test";
import { loginAsAdmin, loginAsStudent } from "./helpers/auth";
import { navigateToAdminTab } from "./helpers/admin";

test.describe("User Impersonation Flow", () => {
  test("allows authenticating directly as Student from DevImpersonator", async ({
    page,
  }) => {
    await loginAsStudent(page);

    // Sidebar should reflect student role
    await expect(page.getByTestId("app-shell-sidebar")).toBeVisible();
    await page.getByTestId("app-shell-sidebar").click();

    const roleBadge = page.getByTestId("sidebar-user-role-badge");
    await expect(roleBadge).toHaveText(/student/i);

    // Regular student should not have the Admin tab visible
    await expect(page.getByTestId("header-tab-admin")).not.toBeVisible();
  });

  test("admin can impersonate a student and return back to admin session", async ({
    page,
  }) => {
    // 1. Log in as Admin
    await loginAsAdmin(page);
    await navigateToAdminTab(page, "users");

    // 2. Locate a student card in the grid
    const userGrid = page.getByTestId("admin-user-grid");
    await expect(userGrid).toBeVisible();

    // Find student card with impersonate button
    const studentCard = page
      .getByLabel(/^user card for elena rostova$/i)
      .first();

    await expect(studentCard).toBeVisible({ timeout: 10_000 });

    const impersonateBtn = studentCard.getByTestId("compact-impersonate-btn");
    await expect(impersonateBtn).toBeVisible();
    await impersonateBtn.click();

    // 3. Verify navigation and impersonation state
    await expect(page).toHaveURL(/\/planning/);
    await page.waitForLoadState("domcontentloaded");

    const sidebar = page.getByTestId("app-shell-sidebar");
    await expect(sidebar).toBeVisible();
    const avatarTrigger = page.getByTestId("sidebar-avatar-trigger");
    await expect(avatarTrigger).toBeVisible();

    await sidebar.hover();
    await page.waitForTimeout(300);
    await avatarTrigger.hover();
    await page.waitForTimeout(300);

    // Student role badge should now be shown
    const roleBadge = page.getByTestId("sidebar-user-role-badge");
    await expect(roleBadge).toHaveText(/student/i);

    // The 'Return to Admin' button should be visible in the sidebar
    const returnAdminBtn = page.getByTestId("sidebar-return-admin-button");
    await expect(returnAdminBtn).toBeVisible({ timeout: 5000 });

    // 4. Return to Admin Account
    await returnAdminBtn.click();

    // Verify session reverts to Admin at /admin
    await expect(page).toHaveURL(/\/admin/);
    await page.waitForLoadState("domcontentloaded");

    await sidebar.hover();
    await page.waitForTimeout(300);
    await avatarTrigger.hover();
    await page.waitForTimeout(300);
    await expect(roleBadge).toHaveText(/admin/i);
    await expect(
      page.getByTestId("sidebar-return-admin-button"),
    ).not.toBeVisible();
  });
});
