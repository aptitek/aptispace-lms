import { test, expect } from "@playwright/test";
import { loginAsAdmin } from "./helpers/auth";

test("language switch toggles language to french and persists across reloads", async ({
  page,
}) => {
  await loginAsAdmin(page);
  await page.waitForLoadState("networkidle");

  const langToggle = page.getByTestId("sidebar-language-toggle");
  await expect(langToggle).toBeVisible();

  // Initial state should be English
  await expect(langToggle).toHaveAttribute("data-lang", "en");

  // Click toggle to switch to French
  await langToggle.click();

  // Verify UI reflects French immediately
  await expect(langToggle).toHaveAttribute("data-lang", "fr");
  await expect(langToggle).toHaveAttribute("aria-checked", "true");
  const htmlLangFr = await page.evaluate(() => document.documentElement.lang);
  expect(htmlLangFr).toBe("fr");

  const storedLangFr = await page.evaluate(() =>
    localStorage.getItem("aptispace_language"),
  );
  expect(storedLangFr).toBe("fr");

  // Reload page to verify persistence
  await page.reload();
  await page.waitForLoadState("networkidle");

  const langToggleAfterReload = page.getByTestId("sidebar-language-toggle");
  await expect(langToggleAfterReload).toBeVisible();
  await expect(langToggleAfterReload).toHaveAttribute("data-lang", "fr");
  await expect(langToggleAfterReload).toHaveAttribute("aria-checked", "true");

  const htmlLangAfterReload = await page.evaluate(
    () => document.documentElement.lang,
  );
  expect(htmlLangAfterReload).toBe("fr");

  // Click toggle to switch back to English
  await langToggleAfterReload.click();
  await expect(langToggleAfterReload).toHaveAttribute("data-lang", "en");
  await expect(langToggleAfterReload).toHaveAttribute("aria-checked", "false");

  const htmlLangEn = await page.evaluate(() => document.documentElement.lang);
  expect(htmlLangEn).toBe("en");
  const storedLangEn = await page.evaluate(() =>
    localStorage.getItem("aptispace_language"),
  );
  expect(storedLangEn).toBe("en");
});
