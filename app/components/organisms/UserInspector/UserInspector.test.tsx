import { describe, it, expect, vi, afterEach } from "vitest";
import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import UserInspector, { SchoolBadgeInline } from "./UserInspector";
import type { UserCardData } from "../../molecules/UserCard/UserCard.types";
import type { SchoolConfig } from "../../../types/institution";
import type { CohortWithInstitution } from "./UserInspector.types";

afterEach(cleanup);

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

describe("UserInspector Organism", () => {
  it("exports UserInspector and SchoolBadgeInline properly", () => {
    expect(UserInspector).toBeDefined();
    expect(typeof UserInspector).toBe("function");
    expect(UserInspector.name).toBe("UserInspector");
    expect(SchoolBadgeInline).toBeDefined();
    expect(typeof SchoolBadgeInline).toBe("function");
  });

  it("renders user inspector with UserCard, inspector header, and cohort assignments", () => {
    const onClose = vi.fn();
    const onUpdateGithub = vi.fn();

    render(
      <UserInspector
        user={mockStudent}
        schools={mockSchools}
        cohorts={mockCohorts}
        onClose={onClose}
        onUpdateGithub={onUpdateGithub}
      />,
    );

    // Inspector header close button should exist
    expect(screen.getByTestId("inspector-close-btn")).toBeDefined();

    // UserCard should be rendered inside inspector
    expect(screen.getByTestId("inspector-user-card")).toBeDefined();
    expect(screen.getByText("Ada")).toBeDefined();
    expect(screen.getByText("LOVELACE")).toBeDefined();

    // Editable github button inside UserCard
    expect(screen.getByTestId("compact-github-edit-btn")).toBeDefined();

    // Cohorts section
    expect(screen.getByTestId("inspector-cohort-chips")).toBeDefined();
  });

  it("handles backwards-compatible student prop and entity inspection", () => {
    const onClose = vi.fn();
    render(
      <UserInspector
        student={mockStudent}
        schools={mockSchools}
        cohorts={mockCohorts}
        onClose={onClose}
      />,
    );

    expect(screen.getByTestId("inspector-user-card")).toBeDefined();
  });
});
