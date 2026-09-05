import { describe, it, expect, vi, afterEach } from "vitest";
import React from "react";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { ThemeProvider } from "@mui/material/styles";
import { I18nextProvider } from "react-i18next";
import i18n from "~/i18n";
import { appTheme } from "~/tokens/theme";
import SchoolCard, { SchoolCardSkeleton } from "./SchoolCard";
import type { SchoolConfig } from "~/types/institution";

const mockSchool: SchoolConfig = {
  id: "sch-1",
  name: "Polytech School",
  slug: "polytech",
  type: "academic",
};

describe("SchoolCard Molecule", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders school name and student count badge", () => {
    const onClick = vi.fn();

    render(
      <I18nextProvider i18n={i18n}>
        <ThemeProvider theme={appTheme}>
          <SchoolCard school={mockSchool} studentCount={42} onClick={onClick} />
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
          <SchoolCard school={mockSchool} onClick={onClick} />
        </ThemeProvider>
      </I18nextProvider>,
    );

    const card = screen.getByRole("button");
    fireEvent.keyDown(card, { key: "Enter" });
    expect(onClick).toHaveBeenCalledWith(mockSchool);
  });

  it("renders SchoolCardSkeleton with ghost action button when interactive", () => {
    const onAdd = vi.fn();

    render(
      <I18nextProvider i18n={i18n}>
        <ThemeProvider theme={appTheme}>
          <SchoolCardSkeleton onClick={onAdd} />
        </ThemeProvider>
      </I18nextProvider>,
    );

    const fab = screen.getByTestId("school-ghost-fab");
    expect(fab).toBeDefined();
    fireEvent.click(fab);
    expect(onAdd).toHaveBeenCalled();
  });
});
