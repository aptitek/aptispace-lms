import { describe, it, expect, vi, afterEach } from "vitest";
import React from "react";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { ThemeProvider } from "@mui/material/styles";
import { I18nextProvider } from "react-i18next";
import i18n from "~/i18n";
import { appTheme } from "~/tokens/theme";
import InstitutionCardSkeleton from "./InstitutionCardSkeleton";

describe("InstitutionCardSkeleton Molecule", () => {
  afterEach(() => {
    cleanup();
  });

  it("exports InstitutionCardSkeleton component properly", () => {
    expect(InstitutionCardSkeleton).toBeDefined();
    expect(typeof InstitutionCardSkeleton).toBe("function");
    expect(InstitutionCardSkeleton.name).toBe("InstitutionCardSkeleton");
  });

  it("renders loading shimmer skeleton by default when not ghost", () => {
    render(
      <I18nextProvider i18n={i18n}>
        <ThemeProvider theme={appTheme}>
          <InstitutionCardSkeleton testId="institution-skeleton-loading" />
        </ThemeProvider>
      </I18nextProvider>,
    );

    const skeletonCard = screen.getByTestId("institution-skeleton-loading");
    expect(skeletonCard).toBeDefined();
    expect(skeletonCard.getAttribute("role")).toBe("presentation");
    expect(skeletonCard.getAttribute("aria-hidden")).toBe("true");
    expect(screen.queryByTestId("institution-ghost-fab")).toBeNull();
  });

  it("renders interactive ghost button when variant='ghost' and onClick is provided", () => {
    const onAdd = vi.fn();
    render(
      <I18nextProvider i18n={i18n}>
        <ThemeProvider theme={appTheme}>
          <InstitutionCardSkeleton
            variant="ghost"
            onClick={onAdd}
            tooltipTitle="Add New Institution"
            testId="institution-skeleton-ghost"
          />
        </ThemeProvider>
      </I18nextProvider>,
    );

    const skeletonCard = screen.getByTestId("institution-skeleton-ghost");
    expect(skeletonCard).toBeDefined();
    expect(skeletonCard.getAttribute("role")).toBe("button");
    expect(skeletonCard.getAttribute("aria-label")).toBe("Add New Institution");

    const fab = screen.getByTestId("institution-ghost-fab");
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
          <InstitutionCardSkeleton
            variant="static"
            animated={false}
            testId="institution-skeleton-static"
          />
        </ThemeProvider>
      </I18nextProvider>,
    );

    const skeletonCard = screen.getByTestId("institution-skeleton-static");
    expect(skeletonCard).toBeDefined();
    expect(screen.queryByTestId("institution-ghost-fab")).toBeNull();
  });
});
