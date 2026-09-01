import { describe, it, expect, vi } from "vitest";
import React from "react";
import StudentGrid from "./StudentGrid";
import type { CompactStudentData } from "../ProfileCardCompact/ProfileCardCompact.types";

const sampleStudents: CompactStudentData[] = [
  {
    id: "s1",
    firstName: "Alice",
    familyName: "MARTIN",
    email: "alice.martin@aptitek.io",
    role: "student",
    githubUsername: "amartin",
    cohortName: "Cohort 2026",
    isProfileComplete: true,
  },
  {
    id: "s2",
    firstName: "Bob",
    familyName: "BERNARD",
    email: "bob.bernard@aptitek.io",
    role: "student",
    githubUsername: "bbernard",
    cohortName: "Cohort 2026",
    isProfileComplete: false,
  },
];

const sampleInstructors: CompactStudentData[] = [
  {
    id: "inst-1",
    firstName: "Sarah",
    familyName: "CONNOR",
    email: "sarah.connor@aptitek.io",
    role: "instructor",
    githubUsername: "sconnor",
    cohortName: "Cohort 2026",
    isProfileComplete: true,
  },
];

describe("StudentGrid Molecule", () => {
  it("exports StudentGrid component properly", () => {
    expect(StudentGrid).toBeDefined();
    expect(typeof StudentGrid).toBe("function");
    expect(StudentGrid.name).toBe("StudentGrid");
  });

  it("creates React element with students list and configuration props", () => {
    const onStudentClick = vi.fn();
    const onImpersonate = vi.fn();
    const onDelete = vi.fn();
    const element = React.createElement(StudentGrid, {
      students: sampleStudents,
      columns: 3,
      gap: 4,
      onStudentClick,
      onImpersonate,
      showImpersonate: true,
      onDelete,
      showDelete: true,
      title: "Active Students",
    });

    expect(element).toBeDefined();
    expect(element.props.students).toHaveLength(2);
    expect(element.props.columns).toBe(3);
    expect(element.props.gap).toBe(4);
    expect(element.props.title).toBe("Active Students");
    expect(element.props.showImpersonate).toBe(true);
    expect(element.props.showDelete).toBe(true);
    expect(typeof element.props.onStudentClick).toBe("function");
    expect(typeof element.props.onImpersonate).toBe("function");
    expect(typeof element.props.onDelete).toBe("function");
  });

  it("supports instructor userType and customized search placeholder and empty state props", () => {
    const element = React.createElement(StudentGrid, {
      students: sampleInstructors,
      userType: "instructor",
      title: "Registered Instructors",
      searchPlaceholder: "Search instructors...",
      emptyMessage: "No instructors available",
      emptyPlaceholderCount: 4,
      lazy: true,
      pageSize: 3,
    });

    expect(element.props.userType).toBe("instructor");
    expect(element.props.title).toBe("Registered Instructors");
    expect(element.props.searchPlaceholder).toBe("Search instructors...");
    expect(element.props.emptyMessage).toBe("No instructors available");
    expect(element.props.emptyPlaceholderCount).toBe(4);
    expect(element.props.lazy).toBe(true);
    expect(element.props.pageSize).toBe(3);
  });

  it("supports skeleton loading state configuration", () => {
    const element = React.createElement(StudentGrid, {
      students: [],
      isLoading: true,
      skeletonCount: 6,
    });

    expect(element.props.isLoading).toBe(true);
    expect(element.props.skeletonCount).toBe(6);
  });
});
