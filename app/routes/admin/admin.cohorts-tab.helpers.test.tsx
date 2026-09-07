// @vitest-environment happy-dom
import { describe, it, expect } from "vitest";
import React from "react";
import { render, screen } from "@testing-library/react";
import { ThemeProvider } from "@mui/material/styles";
import { I18nextProvider } from "react-i18next";
import i18n from "~/i18n";
import { appTheme } from "~/tokens/theme";
import {
  matchesCohortDateRange,
  matchesCohortSearch,
  matchesCohortDiploma,
  matchesCohortYear,
  matchesCohortTag,
  extractCohortFilterAttributes,
  matchesCohortFilter,
  isCohortCardSelected,
  renderDiplomaFilterChip,
  renderSpecialtyFilterChip,
} from "./admin.cohorts-tab.helpers";
import type { CohortWithInstitution } from "~/components/organisms/StudentInspector/StudentInspector.types";

function renderWithTheme(ui: React.ReactElement) {
  return render(
    <I18nextProvider i18n={i18n}>
      <ThemeProvider theme={appTheme}>{ui}</ThemeProvider>
    </I18nextProvider>,
  );
}

describe("admin.cohorts-tab.helpers", () => {
  const t = i18n.t.bind(i18n);

  describe("renderDiplomaFilterChip", () => {
    it("renders All Diplomas chip for 'all'", () => {
      renderWithTheme(renderDiplomaFilterChip("all", t));
      expect(screen.getByText("All Diplomas")).toBeDefined();
    });

    it("renders segmented chip with diploma code and label for specific diploma", () => {
      renderWithTheme(renderDiplomaFilterChip("B", t));
      expect(screen.getByText("B")).toBeDefined();
      expect(screen.getByText("Bachelor")).toBeDefined();
    });

    it("renders master diploma chip correctly", () => {
      renderWithTheme(renderDiplomaFilterChip("M", t));
      expect(screen.getByText("M")).toBeDefined();
      expect(screen.getByText("Master")).toBeDefined();
    });
  });

  describe("renderSpecialtyFilterChip", () => {
    it("renders All Specialties chip for 'all'", () => {
      renderWithTheme(renderSpecialtyFilterChip("all", t));
      expect(screen.getByText("All Specialties")).toBeDefined();
    });

    it("renders tag and localized name for AI", () => {
      renderWithTheme(renderSpecialtyFilterChip("AI", t));
      expect(screen.getByText("AI")).toBeDefined();
      expect(screen.getByText("Artificial Intelligence")).toBeDefined();
    });

    it("renders single segment when tag matches localized name", () => {
      renderWithTheme(renderSpecialtyFilterChip("Security", t));
      expect(screen.getByText("Security")).toBeDefined();
    });
  });

  describe("filter match helpers", () => {
    const sampleCohort: CohortWithInstitution = {
      id: "c-1",
      name: "M1-IA-Dev",
      description: "Master 1 AI and Software Development",
      startDate: "2026-09-01",
      institutionId: "school-1",
    };

    it("matches cohort date range properly", () => {
      expect(matchesCohortDateRange("2026-09-01", 2025, 2027)).toBe(true);
      expect(matchesCohortDateRange("2026-09-01", 2027, null)).toBe(false);
      expect(matchesCohortDateRange("2026-09-01", null, 2025)).toBe(false);
      expect(matchesCohortDateRange(null, 2025, 2027)).toBe(false);
      expect(matchesCohortDateRange("2026-09-01", null, null)).toBe(true);
    });

    it("matches cohort search on name, description, or tag", () => {
      expect(matchesCohortSearch(sampleCohort, ["IA", "Dev"], "master")).toBe(
        true,
      );
      expect(matchesCohortSearch(sampleCohort, ["IA", "Dev"], "dev")).toBe(
        true,
      );
      expect(matchesCohortSearch(sampleCohort, ["IA", "Dev"], "cyber")).toBe(
        false,
      );
    });

    it("matches cohort diploma", () => {
      expect(matchesCohortDiploma("M", "all")).toBe(true);
      expect(matchesCohortDiploma("M", "m")).toBe(true);
      expect(matchesCohortDiploma("M", "b")).toBe(false);
    });

    it("matches cohort year", () => {
      expect(matchesCohortYear(1, "all")).toBe(true);
      expect(matchesCohortYear(1, 1)).toBe(true);
      expect(matchesCohortYear(1, 2)).toBe(false);
    });

    it("matches cohort tag", () => {
      expect(matchesCohortTag(["IA", "Dev"], "all")).toBe(true);
      expect(matchesCohortTag(["IA", "Dev"], "ia")).toBe(true);
      expect(matchesCohortTag(["IA", "Dev"], "cyber")).toBe(false);
    });

    it("extracts cohort filter attributes from name when explicit fields are absent", () => {
      const attrs = extractCohortFilterAttributes(sampleCohort);
      expect(attrs.diploma).toBe("M");
      expect(attrs.year).toBe(1);
      expect(attrs.tags).toEqual(["IA", "Dev"]);
    });

    it("combines all criteria in matchesCohortFilter", () => {
      expect(
        matchesCohortFilter(sampleCohort, {
          cohortStartYearMin: 2025,
          cohortStartYearMax: 2027,
          cohortDiplomaFilter: "M",
          cohortYearFilter: 1,
          cohortTagFilter: "Dev",
          cohortSearchQuery: "master",
        }),
      ).toBe(true);

      expect(
        matchesCohortFilter(sampleCohort, {
          cohortStartYearMin: 2025,
          cohortStartYearMax: 2027,
          cohortDiplomaFilter: "B",
          cohortYearFilter: 1,
          cohortTagFilter: "Dev",
          cohortSearchQuery: "master",
        }),
      ).toBe(false);
    });

    it("evaluates isCohortCardSelected by id or name", () => {
      expect(isCohortCardSelected(sampleCohort, { ...sampleCohort })).toBe(
        true,
      );
      expect(isCohortCardSelected(sampleCohort, null)).toBe(false);
    });
  });
});
