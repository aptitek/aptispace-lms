import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ThemeProvider } from "@mui/material/styles";
import { appTheme } from "~/tokens/theme";
import Card, { DashedSkeletonCard } from "./index";

describe("Card Atom", () => {
  it("renders children in standard card", () => {
    render(
      <ThemeProvider theme={appTheme}>
        <Card data-testid="test-card">Hello Card</Card>
      </ThemeProvider>,
    );
    const el = screen.getByTestId("test-card");
    expect(el).toBeDefined();
    expect(el.textContent).toBe("Hello Card");
  });

  it("sets button role when isInteractive is true", () => {
    render(
      <ThemeProvider theme={appTheme}>
        <Card isInteractive data-testid="interactive-card">
          Click Me
        </Card>
      </ThemeProvider>,
    );
    const el = screen.getByTestId("interactive-card");
    expect(el.getAttribute("role")).toBe("button");
    expect(el.getAttribute("tabindex")).toBe("0");
  });

  it("renders DashedSkeletonCard", () => {
    render(
      <ThemeProvider theme={appTheme}>
        <DashedSkeletonCard data-testid="dashed-card">
          Dashed
        </DashedSkeletonCard>
      </ThemeProvider>,
    );
    const el = screen.getByTestId("dashed-card");
    expect(el).toBeDefined();
  });
});
