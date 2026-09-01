import { describe, it, expect } from "vitest";
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

describe("StudentGrid Molecule", () => {
  it("exports StudentGrid component properly", () => {
    expect(StudentGrid).toBeDefined();
    expect(typeof StudentGrid).toBe("function");
    expect(StudentGrid.name).toBe("StudentGrid");
  });

  it("creates React element with students list and configuration props", () => {
    const onStudentClick = () => {};
    const element = React.createElement(StudentGrid, {
      students: sampleStudents,
      columns: 3,
      gap: 4,
      onStudentClick,
      title: "Active Students",
    });

    expect(element).toBeDefined();
    expect(element.props.students).toHaveLength(2);
    expect(element.props.columns).toBe(3);
    expect(element.props.gap).toBe(4);
    expect(element.props.title).toBe("Active Students");
    expect(typeof element.props.onStudentClick).toBe("function");
  });
});
