import { describe, it, expect } from "vitest";
import React from "react";
import ProfileCardCompact from "./ProfileCardCompact";
import type { CompactStudentData } from "./ProfileCardCompact.types";

const mockStudent: CompactStudentData = {
  id: "student-12345678",
  firstName: "Jane",
  familyName: "DOE",
  email: "jane.doe@aptitek.io",
  role: "student",
  githubUsername: "janedoe",
  isProfileComplete: true,
  cohortName: "Cohort 2026",
  cohortStartYear: "2026",
};

describe("ProfileCardCompact Molecule", () => {
  it("exports ProfileCardCompact component properly", () => {
    expect(ProfileCardCompact).toBeDefined();
    expect(typeof ProfileCardCompact).toBe("object"); // forwardRef
    expect(ProfileCardCompact.displayName).toBe("ProfileCardCompact");
  });

  it("creates React element with appropriate props and student data", () => {
    const element = React.createElement(ProfileCardCompact, {
      student: mockStudent,
      variant: "elevated",
    });

    expect(element).toBeDefined();
    expect(element.props.student.firstName).toBe("Jane");
    expect(element.props.student.familyName).toBe("DOE");
    expect(element.props.student.email).toBe("jane.doe@aptitek.io");
    expect(element.props.student.role).toBe("student");
    expect(element.props.student.githubUsername).toBe("janedoe");
    expect(element.props.student.cohortStartYear).toBe("2026");
    expect(element.props.variant).toBe("elevated");
  });

  it("supports incomplete profile and custom school configuration", () => {
    const incompleteStudent: CompactStudentData = {
      ...mockStudent,
      isProfileComplete: false,
    };

    const element = React.createElement(ProfileCardCompact, {
      student: incompleteStudent,
      school: {
        id: "school-aptitek",
        name: "Aptitek Tech",
        logoUrl: "/aptitek-logo.svg",
      },
      cohort: {
        id: "cohort-2026",
        name: "Cohort 2026 Alpha",
        startYear: 2026,
      },
    });

    expect(element.props.student.isProfileComplete).toBe(false);
    expect(element.props.school?.name).toBe("Aptitek Tech");
    expect(element.props.cohort?.name).toBe("Cohort 2026 Alpha");
    expect(element.props.cohort?.startYear).toBe(2026);
  });
});
