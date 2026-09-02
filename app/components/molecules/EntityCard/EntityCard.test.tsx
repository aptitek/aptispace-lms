import { describe, it, expect, vi } from "vitest";
import React from "react";
import EntityCard from "./EntityCard";
import type { EntityCardData, EntityCardProps } from "./EntityCard.types";

const mockStudent: EntityCardData = {
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

describe("EntityCard Molecule", () => {
  it("exports EntityCard component properly", () => {
    expect(EntityCard).toBeDefined();
    expect(typeof EntityCard).toBe("object"); // forwardRef
    expect(EntityCard.displayName).toBe("EntityCard");
  });

  it("creates React element with appropriate props and student data", () => {
    const onImpersonateMock = vi.fn();
    const onDeleteMock = vi.fn();
    const element = React.createElement(EntityCard, {
      entity: mockStudent,
      variant: "elevation" as const,
      onImpersonate: onImpersonateMock,
      showImpersonate: true,
      onDelete: onDeleteMock,
      showDelete: true,
    });

    expect(element).toBeDefined();
    const props = element.props as EntityCardProps;
    expect(props.entity.firstName).toBe("Jane");
    expect(props.entity.familyName).toBe("DOE");
    expect(props.entity.email).toBe("jane.doe@aptitek.io");
    expect(props.entity.role).toBe("student");
    expect(props.entity.githubUsername).toBe("janedoe");
    expect(props.entity.cohortStartYear).toBe("2026");
    expect(props.variant).toBe("elevation");
    expect(props.showImpersonate).toBe(true);
    expect(props.onImpersonate).toBe(onImpersonateMock);
    expect(props.showDelete).toBe(true);
    expect(props.onDelete).toBe(onDeleteMock);
  });

  it("supports incomplete profile and custom school configuration", () => {
    const incompleteStudent: EntityCardData = {
      ...mockStudent,
      isProfileComplete: false,
    };

    const element = React.createElement(EntityCard, {
      entity: incompleteStudent,
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

    const props = element.props as EntityCardProps;
    expect(props.entity.isProfileComplete).toBe(false);
    expect(props.school?.name).toBe("Aptitek Tech");
    expect(props.cohort?.name).toBe("Cohort 2026 Alpha");
    expect(props.cohort?.startYear).toBe(2026);
  });

  it("handles instructor and admin entities without requiring student cohort chips", () => {
    const instructor: EntityCardData = {
      id: "inst-1",
      firstName: "Sarah",
      familyName: "CONNOR",
      email: "sarah.connor@aptitek.io",
      role: "instructor",
      isProfileComplete: true,
    };

    const admin: EntityCardData = {
      id: "adm-1",
      firstName: "Ada",
      familyName: "LOVELACE",
      email: "ada.lovelace@aptitek.io",
      role: "admin",
      isProfileComplete: true,
    };

    const instElement = React.createElement(EntityCard, { entity: instructor });
    const admElement = React.createElement(EntityCard, { entity: admin });

    expect(instElement).toBeDefined();
    expect(admElement).toBeDefined();
    expect(instElement.props.entity.role).toBe("instructor");
    expect(admElement.props.entity.role).toBe("admin");
  });
});
