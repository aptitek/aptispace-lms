import { describe, it, expect, vi, afterEach } from "vitest";
import React from "react";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { ThemeProvider } from "@mui/material/styles";
import { I18nextProvider } from "react-i18next";
import i18n from "~/i18n";
import { appTheme } from "~/tokens/theme";
import CohortCardSkeleton from "./CohortCardSkeleton";

describe("CohortCardSkeleton Molecule", () => {
  afterEach(() => {
    cleanup();
  });

  it("exports CohortCardSkeleton component properly", () => {
    expect(CohortCardSkeleton).toBeDefined();
    expect(typeof CohortCardSkeleton).toBe("function");
    expect(CohortCardSkeleton.name).toBe("CohortCardSkeleton");
  });

  it("renders loading shimmer skeleton by default when not ghost", () => {
    render(
      <I18nextProvider i18n={i18n}>
        <ThemeProvider theme={appTheme}>
          <CohortCardSkeleton testId="cohort-skeleton-loading" />
        </ThemeProvider>
      </I18nextProvider>,
    );

    const skeletonCard = screen.getByTestId("cohort-skeleton-loading");
    expect(skeletonCard).toBeDefined();
    expect(skeletonCard.getAttribute("role")).toBe("presentation");
    expect(skeletonCard.getAttribute("aria-hidden")).toBe("true");
    expect(screen.queryByTestId("cohort-ghost-fab")).toBeNull();
  });

  it("renders interactive ghost button when variant='ghost' and onClick is provided", () => {
    const onAdd = vi.fn();
    render(
      <I18nextProvider i18n={i18n}>
        <ThemeProvider theme={appTheme}>
          <CohortCardSkeleton
            variant="ghost"
            onClick={onAdd}
            tooltipTitle="Add New Cohort"
            testId="cohort-skeleton-ghost"
          />
        </ThemeProvider>
      </I18nextProvider>,
    );

    const skeletonCard = screen.getByTestId("cohort-skeleton-ghost");
    expect(skeletonCard).toBeDefined();
    expect(skeletonCard.getAttribute("role")).toBe("button");
    expect(skeletonCard.getAttribute("aria-label")).toBe("Add New Cohort");

    const fab = screen.getByTestId("cohort-ghost-fab");
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
          <CohortCardSkeleton
            variant="static"
            animated={false}
            testId="cohort-skeleton-static"
          />
        </ThemeProvider>
      </I18nextProvider>,
    );

    const skeletonCard = screen.getByTestId("cohort-skeleton-static");
    expect(skeletonCard).toBeDefined();
    expect(screen.queryByTestId("cohort-ghost-fab")).toBeNull();
  });
});
