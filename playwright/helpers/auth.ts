import { expect, type Page } from "@playwright/test";

/**
 * Common authentication helpers for E2E tests in AptiSpace LMS.
 */

export const PERSONA_EMAILS = {
  admin: /admin@aptitek\.io|sarah connor/i,
  instructor: /instructor@aptitek\.io|alex\.mercer@aptitek\.io|alex mercer/i,
  student: /student@aptitek\.io|cadet\.elena@aptitek\.io|elena rostova/i,
};

/**
 * Log in via the DevImpersonator tool on the Gateway /login page.
 */
export async function loginAs(
  page: Page,
  role: "admin" | "instructor" | "student" = "admin",
) {
  await page.goto("/login");
  await expect(page.getByTestId("dev-impersonator")).toBeVisible({
    timeout: 10_000,
  });

  const impersonateButtonName = {
    admin: /impersonate sarah connor/i,
    instructor: /impersonate alex mercer/i,
    student: /impersonate elena rostova/i,
  }[role];

  // Locate the account card or impersonate button matching the target persona
  const impersonateBtn = page
    .getByTestId("dev-impersonator")
    .getByRole("button", { name: impersonateButtonName })
    .or(
      page
        .getByTestId("dev-impersonator")
        .locator("button, [role='button'], [role='option']")
        .filter({ hasText: PERSONA_EMAILS[role] }),
    )
    .first();

  await expect(impersonateBtn).toBeVisible({ timeout: 10_000 });
  await impersonateBtn.click();

  // Verify successful authentication and wait for protected application shell
  await expect(page).not.toHaveURL(/\/login/, { timeout: 15_000 });
  await expect(page.getByTestId("app-shell-root")).toBeVisible({
    timeout: 15_000,
  });
  await expect(page.getByTestId("app-shell-sidebar")).toBeVisible({
    timeout: 15_000,
  });
  await expect(page.getByTestId("app-shell-main")).toBeVisible({
    timeout: 15_000,
  });
  await expect(page.getByTestId("sidebar-avatar-trigger")).toBeVisible({
    timeout: 15_000,
  });
  await page.waitForLoadState("domcontentloaded");
}

export async function loginAsAdmin(page: Page) {
  return loginAs(page, "admin");
}

export async function loginAsInstructor(page: Page) {
  return loginAs(page, "instructor");
}

export async function loginAsStudent(page: Page) {
  return loginAs(page, "student");
}

/**
 * Sign out from the authenticated session using the Sidebar user actions.
 */
export async function logout(page: Page) {
  const sidebar = page.getByTestId("app-shell-sidebar");
  await expect(sidebar).toBeVisible();

  const avatarTrigger = page.getByTestId("sidebar-avatar-trigger");
  await expect(avatarTrigger).toBeVisible();

  await sidebar.hover();
  await page.waitForTimeout(300);
  await avatarTrigger.hover();
  await page.waitForTimeout(300);

  const logoutBtn = page.getByTestId("sidebar-logout-button");
  await expect(logoutBtn).toBeVisible({ timeout: 5000 });
  await logoutBtn.click();

  // Redirection to /login
  await expect(page).toHaveURL(/\/login/, { timeout: 10_000 });
}
