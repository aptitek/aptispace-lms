import { describe, it, expect, vi } from "vitest";
import React from "react";
import UserCard, { EntityCard } from "./UserCard";
import type { UserCardData, UserCardProps } from "./UserCard.types";

const mockStudent: UserCardData = {
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

describe("UserCard Molecule", () => {
  it("exports UserCard and EntityCard components properly", () => {
    expect(UserCard).toBeDefined();
    expect(typeof UserCard).toBe("object"); // forwardRef
    expect(UserCard.displayName).toBe("UserCard");
    expect(EntityCard).toBe(UserCard);
  });

  it("creates React element with appropriate props and user data", () => {
    const onImpersonateMock = vi.fn();
    const onDeleteMock = vi.fn();
    const element = React.createElement(UserCard, {
      user: mockStudent,
      variant: "elevation" as const,
      onImpersonate: onImpersonateMock,
      showImpersonate: true,
      onDelete: onDeleteMock,
      showDelete: true,
    });

    expect(element).toBeDefined();
    const props = element.props as UserCardProps;
    const target = props.user ?? props.entity;
    expect(target?.firstName).toBe("Jane");
    expect(target?.familyName).toBe("DOE");
    expect(target?.email).toBe("jane.doe@aptitek.io");
    expect(target?.role).toBe("student");
    expect(target?.githubUsername).toBe("janedoe");
    expect(target?.cohortStartYear).toBe("2026");
    expect(props.variant).toBe("elevation");
    expect(props.showImpersonate).toBe(true);
    expect(props.onImpersonate).toBe(onImpersonateMock);
    expect(props.showDelete).toBe(true);
    expect(props.onDelete).toBe(onDeleteMock);
  });

  it("supports backwards compatibility with entity prop", () => {
    const element = React.createElement(UserCard, {
      entity: mockStudent,
    });

    expect(element).toBeDefined();
    const props = element.props as UserCardProps;
    expect(props.entity?.firstName).toBe("Jane");
  });

  it("supports incomplete profile and custom school configuration", () => {
    const incompleteStudent: UserCardData = {
      ...mockStudent,
      isProfileComplete: false,
    };

    const element = React.createElement(UserCard, {
      user: incompleteStudent,
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

    const props = element.props as UserCardProps;
    const target = props.user ?? props.entity;
    expect(target?.isProfileComplete).toBe(false);
    expect(props.school?.name).toBe("Aptitek Tech");
    expect(props.cohort?.name).toBe("Cohort 2026 Alpha");
    expect(props.cohort?.startYear).toBe(2026);
  });

  it("handles instructor and admin users without requiring student cohort chips", () => {
    const instructor: UserCardData = {
      id: "inst-1",
      firstName: "Sarah",
      familyName: "CONNOR",
      email: "sarah.connor@aptitek.io",
      role: "instructor",
      isProfileComplete: true,
    };

    const admin: UserCardData = {
      id: "adm-1",
      firstName: "Ada",
      familyName: "LOVELACE",
      email: "ada.lovelace@aptitek.io",
      role: "admin",
      isProfileComplete: true,
    };

    const instElement = React.createElement(UserCard, { user: instructor });
    const admElement = React.createElement(UserCard, { user: admin });

    expect(instElement).toBeDefined();
    expect(admElement).toBeDefined();
    expect(instElement.props.user?.role).toBe("instructor");
    expect(admElement.props.user?.role).toBe("admin");
  });

  it("passes structured cohort data to SegmentedChip for students", () => {
    const studentWithStructuredCohort: UserCardData = {
      ...mockStudent,
      cohorts: [
        {
          id: "cohort-m1",
          name: "M1-IA-Dev",
          diploma: "M",
          year: 1,
          tags: ["IA", "Dev"],
        },
      ],
    };

    const element = React.createElement(UserCard, {
      user: studentWithStructuredCohort,
    });
    expect(element).toBeDefined();
    expect(element.props.user?.cohorts?.[0]?.diploma).toBe("M");
    expect(element.props.user?.cohorts?.[0]?.year).toBe(1);
    expect(element.props.user?.cohorts?.[0]?.tags).toEqual(["IA", "Dev"]);
  });
});
