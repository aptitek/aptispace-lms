import { describe, it, expect, vi, afterEach } from "vitest";
import React from "react";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { ThemeProvider } from "@mui/material/styles";
import { I18nextProvider } from "react-i18next";
import i18n from "~/i18n";
import { appTheme } from "~/tokens/theme";
import InstitutionCard, { InstitutionCardSkeleton } from "./InstitutionCard";
import type { SchoolConfig } from "~/types/institution";

const mockSchool: SchoolConfig = {
  id: "sch-1",
  name: "Polytech School",
  slug: "polytech",
  type: "academic",
};

describe("InstitutionCard Molecule", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders school name and student count badge", () => {
    const onClick = vi.fn();

    render(
      <I18nextProvider i18n={i18n}>
        <ThemeProvider theme={appTheme}>
          <InstitutionCard
            school={mockSchool}
            studentCount={42}
            onClick={onClick}
          />
        </ThemeProvider>
      </I18nextProvider>,
    );

    expect(screen.getByText("Polytech School")).toBeDefined();
    expect(screen.getByText("42")).toBeDefined();

    const card = screen.getByRole("button");
    fireEvent.click(card);
    expect(onClick).toHaveBeenCalledWith(mockSchool);
  });

  it("handles keyboard Enter to trigger click", () => {
    const onClick = vi.fn();

    render(
      <I18nextProvider i18n={i18n}>
        <ThemeProvider theme={appTheme}>
          <InstitutionCard school={mockSchool} onClick={onClick} />
        </ThemeProvider>
      </I18nextProvider>,
    );

    const card = screen.getByRole("button");
    fireEvent.keyDown(card, { key: "Enter" });
    expect(onClick).toHaveBeenCalledWith(mockSchool);
  });

  it("renders InstitutionCardSkeleton with ghost action button when interactive", () => {
    const onAdd = vi.fn();

    render(
      <I18nextProvider i18n={i18n}>
        <ThemeProvider theme={appTheme}>
          <InstitutionCardSkeleton onClick={onAdd} />
        </ThemeProvider>
      </I18nextProvider>,
    );

    const fab = screen.getByTestId("institution-ghost-fab");
    expect(fab).toBeDefined();
    fireEvent.click(fab);
    expect(onAdd).toHaveBeenCalled();
  });

  it("renders delete button when onDelete is provided", () => {
    const onDelete = vi.fn();

    render(
      <I18nextProvider i18n={i18n}>
        <ThemeProvider theme={appTheme}>
          <InstitutionCard school={mockSchool} onDelete={onDelete} />
        </ThemeProvider>
      </I18nextProvider>,
    );

    const deleteBtn = screen.getByTestId(
      `institution-delete-btn-${mockSchool.id}`,
    );
    expect(deleteBtn).toBeDefined();
  });
});
