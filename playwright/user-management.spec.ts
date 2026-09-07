import { test, expect } from "@playwright/test";
import { loginAsAdmin } from "./helpers/auth";
import { navigateToAdminTab } from "./helpers/admin";

test.describe("Admin User Management & Inspector", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
    await navigateToAdminTab(page, "users");
  });

  test("filters users by role and search query", async ({ page }) => {
    const userGrid = page.getByTestId("admin-user-grid");
    await expect(userGrid).toBeVisible();

    // 1. Filter by role
    const roleSelect = page.getByTestId("filter-role-select");
    await expect(roleSelect).toBeVisible();
    await roleSelect.click();

    // Select Instructor
    await page.getByRole("option", { name: /instructor/i }).click();

    // Check that Alex Mercer is displayed and student is hidden
    await expect(page.getByLabel(/^user card for alex mercer$/i)).toBeVisible();
    await expect(
      page.getByLabel(/^user card for elena rostova$/i),
    ).not.toBeVisible();

    // Reset role to All
    await roleSelect.click();
    await page.getByRole("option", { name: /all/i }).first().click();

    // 2. Search by text
    const searchInput = page
      .getByTestId("filter-search-input")
      .getByRole("textbox");
    await searchInput.fill("Elena");

    await expect(
      page.getByLabel(/^user card for elena rostova$/i).first(),
    ).toBeVisible();
    await expect(
      page.getByLabel(/^user card for alex mercer$/i).first(),
    ).not.toBeVisible();

    // Clear search
    await searchInput.clear();
    await expect(
      page.getByLabel(/^user card for alex mercer$/i).first(),
    ).toBeVisible();
  });

  test("opens UserInspector and edits GitHub username", async ({ page }) => {
    // Click on student card to open inspector
    const studentCard = page
      .getByLabel(/^user card for elena rostova$/i)
      .first();

    await expect(studentCard).toBeVisible({ timeout: 10_000 });
    await studentCard.click();

    // Inspector side panel opens
    const inspector = page.getByTestId("admin-student-inspector");
    await expect(inspector).toBeVisible();

    // Locate GitHub handle chip / edit button in inspector
    const newHandle = `elena-e2e-${Date.now().toString().slice(-4)}`;
    const editGithubBtn = inspector.getByTestId("compact-github-edit-btn");

    if (await editGithubBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await editGithubBtn.click();
    } else {
      // Click handle chip directly
      await inspector.getByTestId("compact-github-handle").click();
    }

    const githubInput = inspector.getByTestId("compact-github-input");
    await expect(githubInput).toBeVisible();
    await githubInput.fill(newHandle);

    // Save changes
    await inspector.getByTestId("compact-github-save-btn").click();

    // Verify chip shows updated handle
    await expect(inspector.getByTestId("compact-github-handle")).toContainText(
      newHandle,
    );
  });

  test("manages cohort assignments for a student in UserInspector", async ({
    page,
  }) => {
    // Select student
    const studentCard = page
      .getByLabel(/^user card for elena rostova$/i)
      .first();
    await studentCard.click();

    const inspector = page.getByTestId("admin-student-inspector");
    await expect(inspector).toBeVisible();

    // Check cohort assignment section
    const assignmentSection = inspector.getByTestId(
      "inspector-assignment-section",
    );
    await expect(assignmentSection).toBeVisible();

    // Verify student's assigned cohorts are visible
    const assignedChips = assignmentSection.getByTestId(
      /^assigned-cohort-chip-/,
    );
    await expect(assignedChips.first()).toBeVisible();

    // If an additional cohort is available to add, test adding it
    const cohortSelect = inspector.getByTestId("inspector-cohort-add-select");
    const isSelectDisabled = await cohortSelect.getAttribute("aria-disabled");
    if (isSelectDisabled !== "true") {
      await cohortSelect.click();
      const options = page.getByRole("option");
      if ((await options.count()) > 0) {
        await options.first().click();
        const addBtn = inspector.getByTestId("inspector-add-cohort-btn");
        await expect(addBtn).toBeEnabled();
        await addBtn.click();
      } else {
        // Close dropdown by pressing Escape
        await page.keyboard.press("Escape");
      }
    }
  });
});
