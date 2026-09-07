import { describe, it, expect, vi, afterEach } from "vitest";
import React from "react";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { ThemeProvider } from "@mui/material/styles";
import { I18nextProvider } from "react-i18next";
import i18n from "~/i18n";
import { appTheme } from "~/tokens/theme";
import SchoolCardSkeleton from "./SchoolCardSkeleton";

describe("SchoolCardSkeleton Molecule", () => {
  afterEach(() => {
    cleanup();
  });

  it("exports SchoolCardSkeleton component properly", () => {
    expect(SchoolCardSkeleton).toBeDefined();
    expect(typeof SchoolCardSkeleton).toBe("function");
    expect(SchoolCardSkeleton.name).toBe("SchoolCardSkeleton");
  });

  it("renders loading shimmer skeleton by default when not ghost", () => {
    render(
      <I18nextProvider i18n={i18n}>
        <ThemeProvider theme={appTheme}>
          <SchoolCardSkeleton testId="school-skeleton-loading" />
        </ThemeProvider>
      </I18nextProvider>,
    );

    const skeletonCard = screen.getByTestId("school-skeleton-loading");
    expect(skeletonCard).toBeDefined();
    expect(skeletonCard.getAttribute("role")).toBe("presentation");
    expect(skeletonCard.getAttribute("aria-hidden")).toBe("true");
    expect(screen.queryByTestId("school-ghost-fab")).toBeNull();
  });

  it("renders interactive ghost button when variant='ghost' and onClick is provided", () => {
    const onAdd = vi.fn();
    render(
      <I18nextProvider i18n={i18n}>
        <ThemeProvider theme={appTheme}>
          <SchoolCardSkeleton
            variant="ghost"
            onClick={onAdd}
            tooltipTitle="Add New School"
            testId="school-skeleton-ghost"
          />
        </ThemeProvider>
      </I18nextProvider>,
    );

    const skeletonCard = screen.getByTestId("school-skeleton-ghost");
    expect(skeletonCard).toBeDefined();
    expect(skeletonCard.getAttribute("role")).toBe("button");
    expect(skeletonCard.getAttribute("aria-label")).toBe("Add New School");

    const fab = screen.getByTestId("school-ghost-fab");
    expect(fab).toBeDefined();

    // Trigger click on container
    fireEvent.click(skeletonCard);
    expect(onAdd).toHaveBeenCalledTimes(1);

    // Trigger keydown Enter
    fireEvent.keyDown(skeletonCard, { key: "Enter" });
    expect(onAdd).toHaveBeenCalledTimes(2);
  });

  it("renders static placeholder variant without ghost controls", () => {
    render(
      <I18nextProvider i18n={i18n}>
        <ThemeProvider theme={appTheme}>
          <SchoolCardSkeleton
            variant="static"
            animated={false}
            testId="school-skeleton-static"
          />
        </ThemeProvider>
      </I18nextProvider>,
    );

    const skeletonCard = screen.getByTestId("school-skeleton-static");
    expect(skeletonCard).toBeDefined();
    expect(screen.queryByTestId("school-ghost-fab")).toBeNull();
  });
});
