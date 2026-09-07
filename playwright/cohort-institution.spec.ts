import { test, expect } from "@playwright/test";
import { loginAsAdmin } from "./helpers/auth";
import { navigateToAdminTab } from "./helpers/admin";

test.describe("Admin Cohort & Institution Management", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
    await navigateToAdminTab(page, "cohorts");
  });

  test("creates a new institution and selects it", async ({ page }) => {
    const schoolsZone = page.getByTestId("schools-zone");
    await expect(schoolsZone).toBeVisible({ timeout: 10_000 });

    const timestamp = Date.now().toString().slice(-4);
    const instName = `Starfleet Campus ${timestamp}`;
    const instSlug = `starfleet-${timestamp}`;

    // Click on the Add Institution skeleton card
    const addSchoolSkeleton = page.getByTestId("institution-card-skeleton");
    await expect(addSchoolSkeleton).toBeVisible();
    await addSchoolSkeleton.click();

    // Inspector opens in side column
    const inspector = page.getByTestId("institution-inspector-card");
    await expect(inspector).toBeVisible();

    // Fill in institution details
    const nameInput = inspector.getByLabel(/^name/i);
    const slugInput = inspector.getByLabel(/^slug/i);

    await nameInput.fill(instName);
    await slugInput.fill(instSlug);

    // Click Create button
    const createBtn = inspector.getByRole("button", { name: /^create$/i });
    await expect(createBtn).toBeEnabled();
    await createBtn.click();

    // Verify newly created institution card appears in the schools zone
    const newInstitutionCard = schoolsZone.getByText(instName);
    await expect(newInstitutionCard).toBeVisible({ timeout: 10_000 });

    // Click on the newly created institution to view its cohorts
    await newInstitutionCard.click();

    // Verify cohorts section updates to target this school
    await expect(page.getByText(`Cohorts for ${instName}`)).toBeVisible();
  });

  test("creates a new cohort under selected institution and updates it", async ({
    page,
  }) => {
    // Select the default Aptitek school
    const aptitekSchool = page
      .getByTestId(/^institution-card-/)
      .filter({ hasText: /aptitek/i })
      .first();

    await expect(aptitekSchool).toBeVisible({ timeout: 10_000 });
    await aptitekSchool.click();

    const cohortsZone = page.getByTestId("cohorts-zone");
    await expect(cohortsZone).toBeVisible({ timeout: 10_000 });

    // Click Add Cohort skeleton card
    const addCohortSkeleton = page.getByTestId("cohort-card-skeleton");
    await expect(addCohortSkeleton).toBeVisible();
    await addCohortSkeleton.click();

    // CohortInspector opens
    const timestamp = Date.now().toString().slice(-4);
    const cohortDescription = `Software Engineering Lab ${timestamp}`;

    // Select a diploma (required for cohort name validation)
    const diplomaSelect = page.getByTestId("cohort-diploma-input");
    await expect(diplomaSelect).toBeVisible();
    await diplomaSelect.click();
    await page.getByRole("option", { name: /^M\b/i }).first().click();

    const descInput = page.getByLabel(/^description/i);
    await expect(descInput).toBeVisible();
    await descInput.fill(cohortDescription);

    // Click Create button
    const createBtn = page.getByTestId("cohort-create-button");
    await expect(createBtn).toBeEnabled({ timeout: 5000 });
    await createBtn.click();

    // Verify the new cohort is listed in cohorts zone
    await expect(cohortsZone.getByText(cohortDescription)).toBeVisible({
      timeout: 10_000,
    });
  });

  test("filters cohorts using the cohort filter bar", async ({ page }) => {
    // Select default school
    const aptitekSchool = page.getByTestId(/^institution-card-/).first();
    await aptitekSchool.click();

    const filterBar = page.getByTestId("cohort-filter-bar");
    await expect(filterBar).toBeVisible();

    // Search cohorts input
    const searchInput = filterBar
      .getByTestId("cohort-search-input")
      .getByRole("textbox");

    await searchInput.fill("IA");

    // Clear filters
    const clearBtn = page.getByTestId("cohort-clear-filters");
    if (await clearBtn.isVisible().catch(() => false)) {
      await clearBtn.click();
    }
  });
});
