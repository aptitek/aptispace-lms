import { describe, it, expect, vi, afterEach } from "vitest";
import React from "react";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { ThemeProvider } from "@mui/material/styles";
import { I18nextProvider } from "react-i18next";
import i18n from "~/i18n";
import { appTheme } from "~/tokens/theme";
import LanguageSwitch, { MeridianSwitch } from "./LanguageSwitch";

describe("LanguageSwitch and MeridianSwitch components", () => {
  afterEach(() => {
    cleanup();
  });

  it("exports MeridianSwitch and LanguageSwitch components", () => {
    expect(MeridianSwitch).toBeDefined();
    expect(LanguageSwitch).toBeDefined();
    expect(MeridianSwitch.displayName).toBe("MeridianSwitch");
  });

  it("renders MeridianSwitch and triggers language switch on click", () => {
    const onLanguageChange = vi.fn();

    render(
      <I18nextProvider i18n={i18n}>
        <ThemeProvider theme={appTheme}>
          <MeridianSwitch
            language="en"
            onLanguageChange={onLanguageChange}
            data-testid="meridian-switch"
          />
        </ThemeProvider>
      </I18nextProvider>,
    );

    const switchBtn = screen.getByTestId("meridian-switch");
    expect(switchBtn).toBeDefined();
    expect(switchBtn.getAttribute("role")).toBe("switch");
    expect(switchBtn.getAttribute("data-lang")).toBe("en");
    expect(switchBtn.getAttribute("aria-checked")).toBe("false");

    fireEvent.click(switchBtn);
    expect(onLanguageChange).toHaveBeenCalledWith("fr");
  });

  it("respects disabled state", () => {
    const onLanguageChange = vi.fn();

    render(
      <I18nextProvider i18n={i18n}>
        <ThemeProvider theme={appTheme}>
          <MeridianSwitch
            language="en"
            disabled={true}
            onLanguageChange={onLanguageChange}
            data-testid="disabled-meridian-switch"
          />
        </ThemeProvider>
      </I18nextProvider>,
    );

    const switchBtn = screen.getByTestId("disabled-meridian-switch");
    expect(switchBtn.hasAttribute("disabled")).toBe(true);
    fireEvent.click(switchBtn);
    expect(onLanguageChange).not.toHaveBeenCalled();
  });

  it("renders LanguageSwitch connected to i18n", () => {
    render(
      <I18nextProvider i18n={i18n}>
        <ThemeProvider theme={appTheme}>
          <LanguageSwitch data-testid="app-language-switch" />
        </ThemeProvider>
      </I18nextProvider>,
    );

    const switchBtn = screen.getByTestId("app-language-switch");
    expect(switchBtn).toBeDefined();
    expect(switchBtn.getAttribute("role")).toBe("switch");
  });

  it("shows peeking airplane on hover", () => {
    render(
      <I18nextProvider i18n={i18n}>
        <ThemeProvider theme={appTheme}>
          <MeridianSwitch language="en" data-testid="meridian-hover-switch" />
        </ThemeProvider>
      </I18nextProvider>,
    );

    const switchBtn = screen.getByTestId("meridian-hover-switch");
    const airplane = screen.getByTestId("peeking-airplane");
    expect(airplane).toBeDefined();

    fireEvent.mouseEnter(switchBtn);
    expect(screen.getByTestId("peeking-airplane")).toBeDefined();

    fireEvent.mouseLeave(switchBtn);
    expect(screen.getByTestId("peeking-airplane")).toBeDefined();
  });

  it("toggles from fr back to en", () => {
    const onLanguageChange = vi.fn();

    render(
      <I18nextProvider i18n={i18n}>
        <ThemeProvider theme={appTheme}>
          <MeridianSwitch
            language="fr"
            onLanguageChange={onLanguageChange}
            data-testid="meridian-fr-switch"
          />
        </ThemeProvider>
      </I18nextProvider>,
    );

    const switchBtn = screen.getByTestId("meridian-fr-switch");
    expect(switchBtn.getAttribute("aria-checked")).toBe("true");

    fireEvent.click(switchBtn);
    expect(onLanguageChange).toHaveBeenCalledWith("en");
  });
});
