import { describe, it, expect, vi, afterEach } from "vitest";
import React from "react";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { ThemeProvider } from "@mui/material/styles";
import { I18nextProvider } from "react-i18next";
import i18n from "~/i18n";
import { appTheme } from "~/tokens/theme";
import { AttendanceSwitch } from "./index";

describe("AttendanceSwitch Component", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders in-person mode with map pin by default", () => {
    const onChangeMode = vi.fn();
    render(
      <I18nextProvider i18n={i18n}>
        <ThemeProvider theme={appTheme}>
          <AttendanceSwitch
            mode="in-person"
            onChangeMode={onChangeMode}
            data-testid="unit-attendance-switch"
          />
        </ThemeProvider>
      </I18nextProvider>,
    );

    const switchBtn = screen.getByTestId("unit-attendance-switch");
    expect(switchBtn).toBeDefined();
    expect(switchBtn.getAttribute("role")).toBe("switch");
    expect(switchBtn.getAttribute("data-mode")).toBe("in-person");
    expect(switchBtn.getAttribute("aria-checked")).toBe("true");
    expect(screen.getByTestId("map-pin-glyph")).toBeDefined();

    fireEvent.click(switchBtn);
    expect(onChangeMode).toHaveBeenCalledWith("remote");
  });

  it("renders remote mode with laptop glyph", () => {
    const onChangeMode = vi.fn();
    render(
      <I18nextProvider i18n={i18n}>
        <ThemeProvider theme={appTheme}>
          <AttendanceSwitch
            mode="remote"
            onChangeMode={onChangeMode}
            data-testid="remote-attendance-switch"
          />
        </ThemeProvider>
      </I18nextProvider>,
    );

    const switchBtn = screen.getByTestId("remote-attendance-switch");
    expect(switchBtn.getAttribute("data-mode")).toBe("remote");
    expect(switchBtn.getAttribute("aria-checked")).toBe("false");
    expect(screen.getByTestId("remote-laptop-glyph")).toBeDefined();

    fireEvent.click(switchBtn);
    expect(onChangeMode).toHaveBeenCalledWith("in-person");
  });

  it("shows peeking pedestrian from under circle on hover", () => {
    render(
      <I18nextProvider i18n={i18n}>
        <ThemeProvider theme={appTheme}>
          <AttendanceSwitch
            mode="remote"
            data-testid="hover-attendance-switch"
          />
        </ThemeProvider>
      </I18nextProvider>,
    );

    const switchBtn = screen.getByTestId("hover-attendance-switch");
    const pedestrian = screen.getByTestId("peeking-pedestrian");
    expect(pedestrian).toBeDefined();

    fireEvent.mouseEnter(switchBtn);
    expect(screen.getByTestId("peeking-pedestrian")).toBeDefined();

    fireEvent.mouseLeave(switchBtn);
    expect(screen.getByTestId("peeking-pedestrian")).toBeDefined();
  });

  it("renders holographic house and school icons and highlights them on hover", () => {
    render(
      <I18nextProvider i18n={i18n}>
        <ThemeProvider theme={appTheme}>
          <AttendanceSwitch
            mode="in-person"
            data-testid="holo-attendance-switch"
          />
        </ThemeProvider>
      </I18nextProvider>,
    );

    const switchBtn = screen.getByTestId("holo-attendance-switch");
    const houseIcon = screen.getByTestId("holo-house-icon");
    const schoolIcon = screen.getByTestId("holo-school-icon");

    expect(houseIcon).toBeDefined();
    expect(schoolIcon).toBeDefined();

    fireEvent.mouseEnter(switchBtn);
    expect(screen.getByTestId("holo-house-icon")).toBeDefined();
    expect(screen.getByTestId("holo-school-icon")).toBeDefined();

    fireEvent.mouseLeave(switchBtn);
    expect(screen.getByTestId("holo-house-icon")).toBeDefined();
    expect(screen.getByTestId("holo-school-icon")).toBeDefined();
  });

  it("does not toggle when disabled", () => {
    const onChangeMode = vi.fn();
    render(
      <I18nextProvider i18n={i18n}>
        <ThemeProvider theme={appTheme}>
          <AttendanceSwitch
            disabled={true}
            mode="in-person"
            onChangeMode={onChangeMode}
            data-testid="disabled-attendance-switch"
          />
        </ThemeProvider>
      </I18nextProvider>,
    );

    const switchBtn = screen.getByTestId("disabled-attendance-switch");
    expect(switchBtn.hasAttribute("disabled")).toBe(true);

    fireEvent.click(switchBtn);
    expect(onChangeMode).not.toHaveBeenCalled();
  });
});
