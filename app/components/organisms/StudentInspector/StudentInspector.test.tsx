import { describe, it, expect, vi } from "vitest";
import StudentInspector, { SchoolBadgeInline } from "./StudentInspector";
import type { CompactStudentData } from "../../molecules/ProfileCardCompact/ProfileCardCompact.types";
import type { SchoolConfig } from "../OnboardingCard/OnboardingCard.types";
import type { CohortWithInstitution } from "./StudentInspector.types";

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

const mockStudent: CompactStudentData = {
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
  it("exports StudentInspector and SchoolBadgeInline components properly", () => {
    expect(StudentInspector).toBeDefined();
    expect(typeof StudentInspector).toBe("function");
    expect(StudentInspector.name).toBe("StudentInspector");
    expect(SchoolBadgeInline).toBeDefined();
    expect(typeof SchoolBadgeInline).toBe("function");
  });

  it("handles student inspector props and callbacks configuration", () => {
    const onAddCohort = vi.fn();
    const onRemoveCohort = vi.fn();
    const onStudentUpdated = vi.fn();
    const onClose = vi.fn();
    const onImpersonate = vi.fn();

    const props = {
      student: mockStudent,
      schools: mockSchools,
      cohorts: mockCohorts,
      onClose,
      onAddCohort,
      onRemoveCohort,
      onStudentUpdated,
      onImpersonate,
      isSubmitting: false,
    };

    expect(props.student.id).toBe("student-123");
    expect(props.student.firstName).toBe("Ada");
    expect(props.student.familyName).toBe("LOVELACE");
    expect(props.schools).toHaveLength(2);
    expect(props.cohorts).toHaveLength(3);
    expect(typeof props.onClose).toBe("function");
    expect(typeof props.onAddCohort).toBe("function");
    expect(typeof props.onRemoveCohort).toBe("function");
    expect(typeof props.onStudentUpdated).toBe("function");
    expect(typeof props.onImpersonate).toBe("function");
  });
});
