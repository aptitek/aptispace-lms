import { describe, it, expect, afterEach } from "vitest";
import React, { createRef } from "react";
import { render, screen, cleanup } from "@testing-library/react";
import { ThemeProvider } from "@mui/material/styles";
import { I18nextProvider } from "react-i18next";
import i18n from "~/i18n";
import { appTheme } from "~/tokens/theme";
import UserGridSkeleton from "./UserGridSkeleton";

function renderWithProviders(ui: React.ReactElement) {
  return render(
    <I18nextProvider i18n={i18n}>
      <ThemeProvider theme={appTheme}>{ui}</ThemeProvider>
    </I18nextProvider>,
  );
}

describe("UserGridSkeleton Organism", () => {
  afterEach(cleanup);

  it("exports UserGridSkeleton component properly", () => {
    expect(UserGridSkeleton).toBeDefined();
    expect(typeof UserGridSkeleton).toBe("function");
    expect(UserGridSkeleton.name).toBe("UserGridSkeleton");
  });

  it("renders full grid skeleton with header and cards by default", () => {
    renderWithProviders(
      <UserGridSkeleton count={4} testId="full-grid-skeleton" />,
    );

    expect(screen.getByTestId("full-grid-skeleton")).toBeDefined();
    expect(screen.getByTestId("grid-skeleton-header")).toBeDefined();
    expect(screen.getByTestId("skeleton-count-badge")).toBeDefined();
    expect(screen.getByTestId("grid-skeleton-loading-zone")).toBeDefined();
    expect(screen.getByTestId("sk-slot-1")).toBeDefined();
    expect(screen.getByTestId("sk-slot-4")).toBeDefined();
    expect(screen.queryByTestId("sk-slot-5")).toBeNull();
  });

  it("supports hiding the header skeleton via showHeader=false", () => {
    renderWithProviders(
      <UserGridSkeleton
        count={3}
        showHeader={false}
        testId="headerless-skeleton"
      />,
    );

    expect(screen.getByTestId("headerless-skeleton")).toBeDefined();
    expect(screen.queryByTestId("grid-skeleton-header")).toBeNull();
    expect(screen.getByTestId("sk-slot-1")).toBeDefined();
    expect(screen.getByTestId("sk-slot-3")).toBeDefined();
  });

  it("supports hiding search field in header via showSearch=false", () => {
    renderWithProviders(
      <UserGridSkeleton count={2} showHeader={true} showSearch={false} />,
    );

    expect(screen.getByTestId("grid-skeleton-header")).toBeDefined();
    expect(screen.getByTestId("skeleton-count-badge")).toBeDefined();
  });

  it("renders lazy loading sentinel zone when isLazy is true", () => {
    const sentinelRef = createRef<HTMLDivElement>();
    renderWithProviders(
      <UserGridSkeleton
        isLazy={true}
        count={2}
        sentinelRef={sentinelRef}
        testId="lazy-zone"
      />,
    );

    expect(screen.getByTestId("lazy-zone")).toBeDefined();
    expect(screen.getByTestId("lazy-loading-sentinel")).toBeDefined();
    expect(screen.getByTestId("lazy-sk-slot-1")).toBeDefined();
    expect(screen.getByTestId("lazy-sk-slot-2")).toBeDefined();
    // Headers should not be rendered in lazy mode
    expect(screen.queryByTestId("grid-skeleton-header")).toBeNull();
  });

  it("renders static variant without animation", () => {
    renderWithProviders(
      <UserGridSkeleton
        variant="static"
        animated={false}
        count={2}
        testId="static-grid-skeleton"
      />,
    );

    expect(screen.getByTestId("static-grid-skeleton")).toBeDefined();
    expect(screen.getByTestId("sk-slot-1")).toBeDefined();
  });

  it("has appropriate accessibility attributes", () => {
    renderWithProviders(
      <UserGridSkeleton count={2} testId="a11y-grid-skeleton" />,
    );

    const container = screen.getByTestId("a11y-grid-skeleton");
    expect(container.getAttribute("role")).toBe("presentation");
    expect(container.getAttribute("aria-hidden")).toBe("true");
  });
});
