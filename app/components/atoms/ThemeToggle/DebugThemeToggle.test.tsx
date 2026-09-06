import { describe, it, expect, afterEach } from "vitest";
import React from "react";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { ThemeProvider } from "@mui/material/styles";
import { appTheme } from "~/tokens/theme";
import { ThemeModeProvider } from "~/utils/themeContext";
import DebugThemeToggle from "./DebugThemeToggle";

describe("DebugThemeToggle MD3 Switch", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders when forceShow is true and toggles debug theme", () => {
    render(
      <ThemeModeProvider>
        <ThemeProvider theme={appTheme}>
          <DebugThemeToggle forceShow={true} data-testid="debug-toggle" />
        </ThemeProvider>
      </ThemeModeProvider>,
    );

    const switchEl = screen.getByTestId("debug-toggle");
    expect(switchEl).toBeDefined();
    expect(switchEl.getAttribute("role")).toBe("switch");
    expect(switchEl.getAttribute("aria-checked")).toBe("false");

    fireEvent.click(switchEl);
    expect(switchEl.getAttribute("aria-checked")).toBe("true");

    fireEvent.click(switchEl);
    expect(switchEl.getAttribute("aria-checked")).toBe("false");
  });
});
