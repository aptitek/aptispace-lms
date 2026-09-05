import { describe, it, expect, vi, afterEach } from "vitest";
import React from "react";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { ThemeProvider } from "@mui/material/styles";
import { I18nextProvider } from "react-i18next";
import i18n from "~/i18n";
import { appTheme } from "~/tokens/theme";
import LanguageToggle, { MeridianToggle } from "./LanguageToggle";

describe("LanguageToggle and MeridianToggle components", () => {
  afterEach(() => {
    cleanup();
  });

  it("exports MeridianToggle and LanguageToggle components", () => {
    expect(MeridianToggle).toBeDefined();
    expect(LanguageToggle).toBeDefined();
    expect(MeridianToggle.displayName).toBe("MeridianToggle");
  });

  it("renders MeridianToggle and triggers language switch on click", () => {
    const onLanguageChange = vi.fn();

    render(
      <I18nextProvider i18n={i18n}>
        <ThemeProvider theme={appTheme}>
          <MeridianToggle
            language="en"
            onLanguageChange={onLanguageChange}
            data-testid="meridian-toggle"
          />
        </ThemeProvider>
      </I18nextProvider>,
    );

    const toggleBtn = screen.getByTestId("meridian-toggle");
    expect(toggleBtn).toBeDefined();
    expect(toggleBtn.getAttribute("role")).toBe("button");
    expect(toggleBtn.getAttribute("data-lang")).toBe("en");

    fireEvent.click(toggleBtn);
    expect(onLanguageChange).toHaveBeenCalledWith("fr");
  });

  it("respects disabled state", () => {
    const onLanguageChange = vi.fn();

    render(
      <I18nextProvider i18n={i18n}>
        <ThemeProvider theme={appTheme}>
          <MeridianToggle
            language="en"
            disabled={true}
            onLanguageChange={onLanguageChange}
            data-testid="disabled-meridian-toggle"
          />
        </ThemeProvider>
      </I18nextProvider>,
    );

    const toggleBtn = screen.getByTestId("disabled-meridian-toggle");
    expect(toggleBtn.hasAttribute("disabled")).toBe(true);
    fireEvent.click(toggleBtn);
    expect(onLanguageChange).not.toHaveBeenCalled();
  });
});
