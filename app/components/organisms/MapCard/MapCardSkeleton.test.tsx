import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ThemeProvider, createTheme } from "@mui/material/styles";

import { MapCard } from "./MapCard";
import { MapCardSkeleton } from "./MapCardSkeleton";
import "~/i18n";

vi.mock("react-map-gl/maplibre", () => ({
  __esModule: true,
  default: () => <div data-testid="maplibre-gl-map" />,
  Marker: ({ children }: { children?: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

const theme = createTheme();

describe("MapCardSkeleton component", () => {
  it("renders skeleton placeholder with accessible attributes and structural slots", () => {
    render(
      <ThemeProvider theme={theme}>
        <MapCardSkeleton
          testId="custom-card-skeleton"
          size="large"
          orientation="vertical"
        />
      </ThemeProvider>,
    );

    const skeleton = screen.getByTestId("custom-card-skeleton");
    expect(skeleton.getAttribute("role")).toBe("progressbar");
    expect(skeleton.getAttribute("aria-busy")).toBe("true");
    expect(skeleton.getAttribute("aria-label")).toBe(
      "MapCard loading placeholder",
    );
    expect(screen.getByTestId("map-card-skeleton-map")).toBeDefined();
    expect(screen.getByTestId("map-card-skeleton-footer")).toBeDefined();
  });
});

describe("MapCard Loading & WebGL Fallback states", () => {
  it("renders MapCardSkeleton when isLoading is true", () => {
    render(
      <ThemeProvider theme={theme}>
        <MapCard isLoading={true} address="123 Rue de Paris" testId="my-card" />
      </ThemeProvider>,
    );

    expect(screen.getByTestId("my-card-skeleton")).toBeDefined();
    expect(screen.queryByTestId("folding-paper-canvas")).toBeNull();
  });

  it("renders clean 2D fallback map view without notice badge or coordinate card when disableWebGL is true", () => {
    render(
      <ThemeProvider theme={theme}>
        <MapCard
          address="123 Rue de Paris"
          disableWebGL={true}
          testId="my-card"
        />
      </ThemeProvider>,
    );

    expect(screen.getByTestId("map-fallback")).toBeDefined();
    expect(screen.getByTestId("map-fallback-pin")).toBeDefined();
    expect(screen.getByTestId("map-fallback-compass")).toBeDefined();
    expect(screen.queryByTestId("map-fallback-status")).toBeNull();
    expect(screen.queryByTestId("map-fallback-footer")).toBeNull();
  });

  it("renders custom fallback node when provided and disableWebGL is true", () => {
    render(
      <ThemeProvider theme={theme}>
        <MapCard
          address="123 Rue de Paris"
          disableWebGL={true}
          fallback={<div data-testid="custom-org-fallback">Fallback View</div>}
        />
      </ThemeProvider>,
    );

    expect(screen.getByTestId("custom-org-fallback")).toBeDefined();
    expect(screen.getByText("Fallback View")).toBeDefined();
  });
});
