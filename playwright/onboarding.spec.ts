import { test, expect } from "@playwright/test";
import { loginAsStudent } from "./helpers/auth";

test.describe("Student Onboarding Flow", () => {
  test("renders ID-1 card and requirement dock with disabled FAB when fields are missing", async ({
    page,
    context,
  }) => {
    await context.clearCookies();
    await page.goto("/onboarding");

    // Verify requirements dock exists
    const validationFab = page.getByTestId("m3-validation-fab");
    await expect(validationFab).toBeVisible();
    await expect(validationFab).toBeDisabled();

    // Verify requirement pills exist
    await expect(page.getByText(/first name/i).first()).toBeVisible();
    await expect(page.getByText(/family name/i).first()).toBeVisible();
    await expect(page.getByText(/institutional email/i).first()).toBeVisible();
  });

  test("completes student profile, enables validation FAB, and submits successfully", async ({
    page,
  }) => {
    await loginAsStudent(page);
    await page.goto("/onboarding");

    const firstNameInput = page.getByLabel(/^first name/i);
    const familyNameInput = page.getByLabel(/^family name/i);
    const emailInput = page.getByLabel(/^email/i);
    const validationFab = page.getByTestId("m3-validation-fab");

    await expect(firstNameInput).toBeVisible();
    await expect(familyNameInput).toBeVisible();
    await expect(emailInput).toBeVisible();

    // Fill in student credentials
    await firstNameInput.fill("Elena");
    await familyNameInput.fill("Rostova");
    await emailInput.fill("elena.rostova@aptitek.io");

    // Verification that FAB becomes enabled once all requirements are satisfied
    await expect(validationFab).toBeEnabled({ timeout: 5000 });
    await expect(validationFab).toContainText(/complete & continue/i);

    // Allow any debounced draft sync (500ms) to settle before submitting
    await page.waitForTimeout(600);

    // Click submit and verify redirection
    await validationFab.click();

    // After completion, student is directed to the main app shell or planning
    await expect(page).toHaveURL(/(?:\/planning|\/$)/, { timeout: 15_000 });
  });
});
