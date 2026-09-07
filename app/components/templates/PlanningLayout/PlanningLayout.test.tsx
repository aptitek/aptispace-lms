import { describe, it, expect, afterEach } from "vitest";
import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import { ThemeProvider } from "@mui/material/styles";
import { appTheme } from "~/tokens/theme";
import { PlanningLayout } from "./PlanningLayout";

afterEach(cleanup);

describe("PlanningLayout Template", () => {
  it("exports component properly", () => {
    expect(PlanningLayout).toBeDefined();
    expect(typeof PlanningLayout).toBe("function");
  });

  it("renders with slotted sections", () => {
    render(
      <ThemeProvider theme={appTheme}>
        <PlanningLayout
          hero={<div data-testid="hero-slot">Hero Section</div>}
          calendar={<div data-testid="cal-slot">Calendar Section</div>}
          dialogs={<div data-testid="dialogs-slot">Dialogs Section</div>}
          feedback={<div data-testid="feedback-slot">Feedback Section</div>}
        />
      </ThemeProvider>,
    );

    expect(screen.getByTestId("hero-slot")).toBeDefined();
    expect(screen.getByText("Hero Section")).toBeDefined();
    expect(screen.getByTestId("cal-slot")).toBeDefined();
    expect(screen.getByText("Calendar Section")).toBeDefined();
    expect(screen.getByTestId("dialogs-slot")).toBeDefined();
    expect(screen.getByText("Dialogs Section")).toBeDefined();
    expect(screen.getByTestId("feedback-slot")).toBeDefined();
    expect(screen.getByText("Feedback Section")).toBeDefined();
  });
});
