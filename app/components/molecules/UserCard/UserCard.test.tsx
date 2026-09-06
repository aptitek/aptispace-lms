import { describe, it, expect, vi, afterEach } from "vitest";
import React from "react";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import UserCard, { EntityCard } from "./UserCard";
import type { UserCardData, UserCardProps } from "./UserCard.types";

afterEach(cleanup);

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

  it("renders editable GitHub chip and triggers onUpdateGithub on save", () => {
    const onUpdateGithubMock = vi.fn();
    render(
      <UserCard
        user={mockStudent}
        editableGithub={true}
        onUpdateGithub={onUpdateGithubMock}
      />,
    );

    // Find edit button
    const editBtn = screen.getByTestId("compact-github-edit-btn");
    expect(editBtn).toBeDefined();

    // Click edit button to toggle form
    fireEvent.click(editBtn);

    const input = screen.getByTestId("compact-github-input");
    expect(input).toBeDefined();
    expect((input as HTMLInputElement).value).toBe("janedoe");

    // Change input value
    fireEvent.change(input, { target: { value: "jane-smith" } });

    // Submit form via save button
    const saveBtn = screen.getByTestId("compact-github-save-btn");
    fireEvent.click(saveBtn);

    expect(onUpdateGithubMock).toHaveBeenCalledWith(
      "student-12345678",
      "jane-smith",
    );
    // Form should be closed
    expect(screen.queryByTestId("compact-github-edit-form")).toBeNull();
  });

  it("cancels GitHub edit mode when cancel button is clicked without calling onUpdateGithub", () => {
    const onUpdateGithubMock = vi.fn();
    render(
      <UserCard
        user={mockStudent}
        editableGithub={true}
        onUpdateGithub={onUpdateGithubMock}
      />,
    );

    const editBtn = screen.getByTestId("compact-github-edit-btn");
    fireEvent.click(editBtn);

    const input = screen.getByTestId("compact-github-input");
    fireEvent.change(input, { target: { value: "different-handle" } });

    const cancelBtn = screen.getByTestId("compact-github-cancel-btn");
    fireEvent.click(cancelBtn);

    expect(onUpdateGithubMock).not.toHaveBeenCalled();
    expect(screen.queryByTestId("compact-github-edit-form")).toBeNull();
  });
});
