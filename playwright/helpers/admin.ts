import { expect, type Page } from "@playwright/test";

export type AdminTab = "users" | "cohorts" | "mission-center" | "courses";

/**
 * Navigate to a specific tab within the Admin dashboard.
 */
export async function navigateToAdminTab(page: Page, tab: AdminTab) {
  // If not already on an admin route, navigate to /admin
  if (!page.url().includes("/admin")) {
    await page.goto(`/admin/${tab}`);
  } else {
    const tabSelector = page.getByTestId(`tab-${tab}`);
    if (await tabSelector.isVisible({ timeout: 2000 }).catch(() => false)) {
      await tabSelector.click();
    } else {
      await page.goto(`/admin/${tab}`);
    }
  }

  // Verify the corresponding tabpanel is visible
  if (tab === "users") {
    await expect(page.getByTestId("admin-tabpanel-users")).toBeVisible({
      timeout: 10_000,
    });
  } else if (tab === "cohorts") {
    await expect(page.getByTestId("admin-tabpanel-cohorts")).toBeVisible({
      timeout: 10_000,
    });
  }
}
