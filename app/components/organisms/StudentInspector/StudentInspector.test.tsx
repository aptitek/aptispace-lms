import { describe, it, expect, vi, afterEach } from "vitest";
import React from "react";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { ThemeProvider } from "@mui/material/styles";
import { I18nextProvider } from "react-i18next";
import i18n from "~/i18n";
import { appTheme } from "~/tokens/theme";
import StudentInspector from "./StudentInspector";
import {
  SchoolBadgeInline,
  InspectorAccountSection,
} from "./StudentInspector.components";
import {
  InspectorImpersonateButton,
  InspectorDeleteButton,
} from "./StudentInspector.actions";
import type { UserCardData } from "../../molecules/UserCard/UserCard.types";
import type { SchoolConfig } from "../../../types/institution";
import type { CohortWithInstitution } from "./StudentInspector.types";

afterEach(cleanup);

function renderWithProviders(ui: React.ReactElement) {
  return render(
    <I18nextProvider i18n={i18n}>
      <ThemeProvider theme={appTheme}>{ui}</ThemeProvider>
    </I18nextProvider>,
  );
}

const mockSchools: SchoolConfig[] = [
  {
    id: "school-1",
    name: "Aptitek Institute",
    slug: "aptitek",
    logoUrl: "/aptitek-logo.svg",
  },
  {
    id: "school-2",
    name: "École Polytechnique",
    slug: "polytechnique",
    logoUrl: "/polytechnique.svg",
  },
];

const mockCohorts: CohortWithInstitution[] = [
  {
    id: "cohort-1",
    name: "Cohort 2026 Alpha",
    institutionId: "school-1",
    startDate: "2026-09-01",
  },
  {
    id: "cohort-2",
    name: "Cohort 2025 Alumni",
    institutionId: "school-1",
    startDate: "2025-09-01",
  },
  {
    id: "cohort-3",
    name: "Polytechnique 2026",
    institutionId: "school-2",
    startDate: "2026-10-01",
  },
];

const mockStudent: UserCardData = {
  id: "student-123",
  firstName: "Ada",
  familyName: "LOVELACE",
  email: "ada.lovelace@aptitek.io",
  role: "student",
  institutionId: "school-1",
  cohortId: "cohort-1",
  cohortName: "Cohort 2026 Alpha",
  cohorts: [
    {
      id: "cohort-1",
      name: "Cohort 2026 Alpha",
      startDate: "2026-09-01",
      startYear: "2026",
    },
  ],
  githubUsername: "adalovelace",
};

describe("StudentInspector Organism", () => {
  it("exports StudentInspector and subcomponents properly", () => {
    expect(StudentInspector).toBeDefined();
    expect(typeof StudentInspector).toBe("function");
    expect(SchoolBadgeInline).toBeDefined();
    expect(InspectorAccountSection).toBeDefined();
    expect(InspectorImpersonateButton).toBeDefined();
    expect(InspectorDeleteButton).toBeDefined();
  });

  it("renders StudentInspector with student data and close button", () => {
    const onClose = vi.fn();
    const onAddCohort = vi.fn();
    const onRemoveCohort = vi.fn();

    renderWithProviders(
      <StudentInspector
        student={mockStudent}
        schools={mockSchools}
        cohorts={mockCohorts}
        onClose={onClose}
        onAddCohort={onAddCohort}
        onRemoveCohort={onRemoveCohort}
      />,
    );

    expect(screen.getByTestId("inspector-user-card")).toBeDefined();
    expect(screen.getByText("Ada")).toBeDefined();
    expect(screen.getByText("LOVELACE")).toBeDefined();

    // Close button
    const closeBtn = screen.getByTestId("inspector-close-btn");
    fireEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("renders InspectorAccountSection and updates GitHub username on Enter", () => {
    const onUpdateGithub = vi.fn();

    renderWithProviders(
      <InspectorAccountSection
        targetStudent={mockStudent}
        onUpdateGithub={onUpdateGithub}
      />,
    );

    expect(screen.getByText("Ada LOVELACE")).toBeDefined();
    const input = screen.getByDisplayValue("adalovelace");
    fireEvent.change(input, { target: { value: "ada-new" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(onUpdateGithub).toHaveBeenCalledWith("student-123", "ada-new");
  });

  it("renders InspectorImpersonateButton and handles click", () => {
    const onImpersonate = vi.fn();

    renderWithProviders(
      <InspectorImpersonateButton
        targetStudent={mockStudent}
        onImpersonate={onImpersonate}
      />,
    );

    const btn = screen.getByTestId("inspector-impersonate-btn-standalone");
    fireEvent.click(btn);
    expect(onImpersonate).toHaveBeenCalledWith(mockStudent);
  });

  it("renders InspectorDeleteButton", () => {
    const onDelete = vi.fn();

    renderWithProviders(
      <InspectorDeleteButton targetStudent={mockStudent} onDelete={onDelete} />,
    );

    expect(screen.getByTestId("inspector-delete-btn-standalone")).toBeDefined();
  });

  it("renders SchoolBadgeInline with school config and fallback", () => {
    const { unmount } = renderWithProviders(
      <SchoolBadgeInline school={mockSchools[0]} testId="school-badge-1" />,
    );
    expect(screen.getByTestId("school-badge-1-logo")).toBeDefined();
    unmount();

    renderWithProviders(
      <SchoolBadgeInline schoolName="Custom Academy" testId="school-badge-2" />,
    );
    expect(screen.getByText("Custom Academy")).toBeDefined();
  });
});
