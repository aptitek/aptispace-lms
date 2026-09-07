import { describe, it, expect, vi, afterEach } from "vitest";
import React from "react";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { ThemeProvider } from "@mui/material/styles";
import { I18nextProvider } from "react-i18next";
import i18n from "~/i18n";
import { appTheme } from "~/tokens/theme";
import UserGrid from "./UserGrid";
import type { UserCardData } from "~/components/molecules/UserCard/UserCard.types";

afterEach(cleanup);

const sampleStudents: UserCardData[] = [
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

const sampleInstructors: UserCardData[] = [
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

function renderWithProviders(ui: React.ReactElement) {
  return render(
    <I18nextProvider i18n={i18n}>
      <ThemeProvider theme={appTheme}>{ui}</ThemeProvider>
    </I18nextProvider>,
  );
}

describe("UserGrid Molecule", () => {
  it("exports UserGrid component properly", () => {
    expect(UserGrid).toBeDefined();
    expect(typeof UserGrid).toBe("function");
    expect(UserGrid.name).toBe("UserGrid");
  });

  it("renders students list and header title with count badge", () => {
    const onStudentClick = vi.fn();
    renderWithProviders(
      <UserGrid
        students={sampleStudents}
        title="Active Students"
        onStudentClick={onStudentClick}
      />,
    );

    expect(screen.getByTestId("user-grid-title")).toBeDefined();
    expect(screen.getByText("Active Students")).toBeDefined();
    expect(screen.getByText("Alice")).toBeDefined();
    expect(screen.getByText("Bob")).toBeDefined();
  });

  it("filters users when searching in the search bar", () => {
    renderWithProviders(
      <UserGrid
        students={sampleStudents}
        title="Searchable Directory"
        showSearch={true}
      />,
    );

    const searchInput = screen.getByTestId("user-grid-search");
    expect(searchInput).toBeDefined();

    // Filter to Alice
    fireEvent.change(searchInput, { target: { value: "Alice" } });
    expect(screen.getByText("Alice")).toBeDefined();
    expect(screen.queryByText("Bob")).toBeNull();

    // Clear search
    const clearBtn = screen.getByTestId("clear-search-btn");
    fireEvent.click(clearBtn);
    expect(screen.getByText("Bob")).toBeDefined();
  });

  it("shows empty state when no users match search", () => {
    renderWithProviders(
      <UserGrid
        students={sampleStudents}
        title="Students"
        showSearch={true}
        emptyMessage="No matching users found"
      />,
    );

    const searchInput = screen.getByTestId("user-grid-search");
    fireEvent.change(searchInput, { target: { value: "NonexistentPerson" } });

    expect(screen.getByTestId("user-grid-empty-state")).toBeDefined();
    expect(screen.getByText("No matching users found")).toBeDefined();
  });

  it("renders skeletons when isLoading is true", () => {
    renderWithProviders(
      <UserGrid students={[]} isLoading={true} skeletonCount={3} />,
    );

    expect(screen.getByTestId("grid-skeleton-loading-zone")).toBeDefined();
    expect(screen.getByTestId("sk-slot-1")).toBeDefined();
  });

  it("supports instructor userType and clicking user card", () => {
    const onStudentClick = vi.fn();
    renderWithProviders(
      <UserGrid
        students={sampleInstructors}
        userType="instructor"
        title="Instructors"
        onStudentClick={onStudentClick}
      />,
    );

    expect(screen.getByText("Sarah")).toBeDefined();
    const card = screen.getByTestId("user-card-inst-1");
    fireEvent.click(card);
    expect(onStudentClick).toHaveBeenCalledWith(sampleInstructors[0]);
  });

  it("supports hiding controls header via showHeader=false", () => {
    renderWithProviders(
      <UserGrid students={sampleStudents} showHeader={false} />,
    );

    expect(screen.queryByTestId("user-grid-title")).toBeNull();
    expect(screen.queryByTestId("user-count-badge")).toBeNull();
  });
});
