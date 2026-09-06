import { describe, it, expect, vi, afterEach } from "vitest";
import React from "react";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { ThemeProvider } from "@mui/material/styles";
import { I18nextProvider } from "react-i18next";
import i18n from "~/i18n";
import { appTheme } from "~/tokens/theme";
import { ThemeModeProvider } from "~/utils/themeContext";
import ThemeSwitch, { ZenithSwitch } from "./ThemeSwitch";

describe("ThemeSwitch and ZenithSwitch components", () => {
  afterEach(() => {
    cleanup();
  });

  it("exports ZenithSwitch and ThemeSwitch components", () => {
    expect(ZenithSwitch).toBeDefined();
    expect(ThemeSwitch).toBeDefined();
    expect(ZenithSwitch.displayName).toBe("ZenithSwitch");
  });

  it("renders ZenithSwitch and handles click toggling", () => {
    const onToggle = vi.fn();
    const onChangeMode = vi.fn();

    render(
      <I18nextProvider i18n={i18n}>
        <ThemeProvider theme={appTheme}>
          <ZenithSwitch
            checked={false}
            onToggle={onToggle}
            onChangeMode={onChangeMode}
            data-testid="zenith-switch"
          />
        </ThemeProvider>
      </I18nextProvider>,
    );

    const switchBtn = screen.getByTestId("zenith-switch");
    expect(switchBtn).toBeDefined();
    expect(switchBtn.getAttribute("role")).toBe("switch");
    expect(switchBtn.getAttribute("aria-checked")).toBe("false");

    fireEvent.click(switchBtn);
    expect(onToggle).toHaveBeenCalledWith(true);
    expect(onChangeMode).toHaveBeenCalledWith("dark");
  });

  it("respects disabled state", () => {
    const onToggle = vi.fn();

    render(
      <I18nextProvider i18n={i18n}>
        <ThemeProvider theme={appTheme}>
          <ZenithSwitch
            checked={true}
            disabled={true}
            onToggle={onToggle}
            data-testid="disabled-switch"
          />
        </ThemeProvider>
      </I18nextProvider>,
    );

    const switchBtn = screen.getByTestId("disabled-switch");
    expect(switchBtn.hasAttribute("disabled")).toBe(true);
    fireEvent.click(switchBtn);
    expect(onToggle).not.toHaveBeenCalled();
  });

  it("renders ThemeSwitch connected to ThemeModeProvider", () => {
    render(
      <I18nextProvider i18n={i18n}>
        <ThemeModeProvider>
          <ThemeProvider theme={appTheme}>
            <ThemeSwitch data-testid="app-theme-switch" />
          </ThemeProvider>
        </ThemeModeProvider>
      </I18nextProvider>,
    );

    const switchBtn = screen.getByTestId("app-theme-switch");
    expect(switchBtn).toBeDefined();
    expect(switchBtn.getAttribute("role")).toBe("switch");
  });

  it("renders peeking sun on hover when in dark mode", () => {
    render(
      <I18nextProvider i18n={i18n}>
        <ThemeProvider theme={appTheme}>
          <ZenithSwitch checked={true} data-testid="dark-zenith-switch" />
        </ThemeProvider>
      </I18nextProvider>,
    );

    const switchBtn = screen.getByTestId("dark-zenith-switch");
    expect(screen.queryByTestId("peeking-sun-preview")).toBeNull();

    fireEvent.mouseEnter(switchBtn);
    expect(screen.getByTestId("peeking-sun-preview")).toBeDefined();

    fireEvent.mouseLeave(switchBtn);
    expect(screen.queryByTestId("peeking-sun-preview")).toBeNull();
  });

  it("renders peeking moon on hover when in light mode", () => {
    render(
      <I18nextProvider i18n={i18n}>
        <ThemeProvider theme={appTheme}>
          <ZenithSwitch checked={false} data-testid="light-zenith-switch" />
        </ThemeProvider>
      </I18nextProvider>,
    );

    const switchBtn = screen.getByTestId("light-zenith-switch");
    expect(screen.queryByTestId("peeking-moon-preview")).toBeNull();

    fireEvent.mouseEnter(switchBtn);
    expect(screen.getByTestId("peeking-moon-preview")).toBeDefined();

    fireEvent.mouseLeave(switchBtn);
    expect(screen.queryByTestId("peeking-moon-preview")).toBeNull();
  });
});
