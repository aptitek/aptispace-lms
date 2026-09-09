import { describe, it, expect, vi, afterEach } from "vitest";
import React from "react";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { ThemeProvider } from "@mui/material/styles";
import { I18nextProvider } from "react-i18next";
import i18n from "~/i18n";
import { appTheme } from "~/tokens/theme";
import { ThemeModeProvider } from "~/utils/themeContext";
import FancySwitch, {
  ZenithSwitch,
  ThemeSwitch,
  MeridianSwitch,
  LanguageSwitch,
  ClockFormatSwitch,
} from "./index";

describe("FancySwitch Component Suite", () => {
  afterEach(() => {
    cleanup();
  });

  describe("Base FancySwitch Engine", () => {
    it("renders with proper role and aria attributes", () => {
      const onChange = vi.fn();
      render(
        <ThemeProvider theme={appTheme}>
          <FancySwitch
            checked={false}
            onChange={onChange}
            ariaLabel="Test Switch"
            thumbContent={() => <span data-testid="test-thumb">T</span>}
            data-testid="fancy-unit-switch"
          />
        </ThemeProvider>,
      );

      const switchBtn = screen.getByTestId("fancy-unit-switch");
      expect(switchBtn).toBeDefined();
      expect(switchBtn.getAttribute("role")).toBe("switch");
      expect(switchBtn.getAttribute("aria-checked")).toBe("false");
      expect(switchBtn.getAttribute("aria-label")).toBe("Test Switch");
      expect(screen.getByTestId("test-thumb")).toBeDefined();

      fireEvent.click(switchBtn);
      expect(onChange).toHaveBeenCalledWith(true);
    });

    it("handles keyboard Enter and Space activation", () => {
      const onChange = vi.fn();
      render(
        <ThemeProvider theme={appTheme}>
          <FancySwitch
            checked={true}
            onChange={onChange}
            ariaLabel="Keyboard Switch"
            thumbContent={() => <span>K</span>}
            data-testid="keyboard-switch"
          />
        </ThemeProvider>,
      );

      const switchBtn = screen.getByTestId("keyboard-switch");
      fireEvent.keyDown(switchBtn, { key: " " });
      expect(onChange).toHaveBeenCalledWith(false);

      fireEvent.keyDown(switchBtn, { key: "Enter" });
      expect(onChange).toHaveBeenCalledTimes(2);
    });

    it("does not trigger when disabled", () => {
      const onChange = vi.fn();
      render(
        <ThemeProvider theme={appTheme}>
          <FancySwitch
            checked={false}
            disabled={true}
            onChange={onChange}
            ariaLabel="Disabled Switch"
            tooltipTitle="Disabled feature"
            thumbContent={() => <span>D</span>}
            data-testid="disabled-switch"
          />
        </ThemeProvider>,
      );

      const switchBtn = screen.getByTestId("disabled-switch");
      expect(switchBtn.hasAttribute("disabled")).toBe(true);
      fireEvent.click(switchBtn);
      expect(onChange).not.toHaveBeenCalled();
    });

    it("renders custom peeking element and decorations", () => {
      render(
        <ThemeProvider theme={appTheme}>
          <FancySwitch
            checked={false}
            ariaLabel="Decorated Switch"
            peekingElement={(state) =>
              state.isHovered ? (
                <span data-testid="peeking-icon">Peeking</span>
              ) : null
            }
            backgroundDecorations={() => (
              <span data-testid="bg-decor">Background</span>
            )}
            thumbContent={() => <span>Icon</span>}
            data-testid="decorated-switch"
          />
        </ThemeProvider>,
      );

      expect(screen.getByTestId("bg-decor")).toBeDefined();
      expect(screen.queryByTestId("peeking-icon")).toBeNull();

      const switchBtn = screen.getByTestId("decorated-switch");
      fireEvent.mouseEnter(switchBtn);
      expect(screen.getByTestId("peeking-icon")).toBeDefined();

      fireEvent.mouseLeave(switchBtn);
      expect(screen.queryByTestId("peeking-icon")).toBeNull();
    });
  });

  describe("Theme & ZenithSwitch", () => {
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

    it("respects disabled state in ZenithSwitch", () => {
      const onToggle = vi.fn();

      render(
        <I18nextProvider i18n={i18n}>
          <ThemeProvider theme={appTheme}>
            <ZenithSwitch
              checked={true}
              disabled={true}
              onToggle={onToggle}
              data-testid="disabled-zenith-switch"
            />
          </ThemeProvider>
        </I18nextProvider>,
      );

      const switchBtn = screen.getByTestId("disabled-zenith-switch");
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

  describe("Language & MeridianSwitch", () => {
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

    it("respects disabled state in MeridianSwitch", () => {
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

  describe("ClockFormatSwitch", () => {
    it("renders with 12h format and digital clock on inactive side", () => {
      const onChangeFormat = vi.fn();
      render(
        <I18nextProvider i18n={i18n}>
          <ThemeProvider theme={appTheme}>
            <ClockFormatSwitch
              format="12h"
              onChangeFormat={onChangeFormat}
              data-testid="unit-clock-switch"
            />
          </ThemeProvider>
        </I18nextProvider>,
      );

      const switchBtn = screen.getByTestId("unit-clock-switch");
      expect(switchBtn).toBeDefined();
      expect(switchBtn.getAttribute("role")).toBe("switch");
      expect(switchBtn.getAttribute("data-format")).toBe("12h");
      expect(switchBtn.getAttribute("aria-checked")).toBe("false");
      expect(screen.getByText("12")).toBeDefined();

      // Inactive side shows digital clock
      expect(screen.getByTestId("inactive-digital-slot")).toBeDefined();
      expect(screen.getByTestId("digital-colon")).toBeDefined();

      fireEvent.click(switchBtn);
      expect(onChangeFormat).toHaveBeenCalledWith("24h");
    });

    it("renders with 24h format when configured", () => {
      const onChangeFormat = vi.fn();
      render(
        <I18nextProvider i18n={i18n}>
          <ThemeProvider theme={appTheme}>
            <ClockFormatSwitch
              format="24h"
              onChangeFormat={onChangeFormat}
              data-testid="unit-clock-switch-24"
            />
          </ThemeProvider>
        </I18nextProvider>,
      );

      const switchBtn = screen.getByTestId("unit-clock-switch-24");
      expect(switchBtn.getAttribute("data-format")).toBe("24h");
      expect(switchBtn.getAttribute("aria-checked")).toBe("true");
      expect(screen.getByText("24")).toBeDefined();

      fireEvent.click(switchBtn);
      expect(onChangeFormat).toHaveBeenCalledWith("12h");
    });

    it("renders blinking colon on hover", () => {
      render(
        <I18nextProvider i18n={i18n}>
          <ThemeProvider theme={appTheme}>
            <ClockFormatSwitch format="12h" data-testid="hover-clock-switch" />
          </ThemeProvider>
        </I18nextProvider>,
      );

      const switchBtn = screen.getByTestId("hover-clock-switch");
      const colon = screen.getByTestId("digital-colon");
      expect(colon).toBeDefined();

      fireEvent.mouseEnter(switchBtn);
      expect(screen.getByTestId("digital-colon")).toBeDefined();

      fireEvent.mouseLeave(switchBtn);
      expect(screen.getByTestId("digital-colon")).toBeDefined();
    });

    it("triggers transit clock during toggle action", () => {
      render(
        <I18nextProvider i18n={i18n}>
          <ThemeProvider theme={appTheme}>
            <ClockFormatSwitch format="12h" data-testid="transit-switch" />
          </ThemeProvider>
        </I18nextProvider>,
      );

      const switchBtn = screen.getByTestId("transit-switch");
      fireEvent.click(switchBtn);

      // During transit, the transit clock is rendered in the thumb
      expect(screen.getByTestId("transit-clock")).toBeDefined();
    });

    it("does not toggle when disabled", () => {
      const onChangeFormat = vi.fn();
      render(
        <I18nextProvider i18n={i18n}>
          <ThemeProvider theme={appTheme}>
            <ClockFormatSwitch
              disabled={true}
              format="12h"
              onChangeFormat={onChangeFormat}
              data-testid="disabled-clock-switch"
            />
          </ThemeProvider>
        </I18nextProvider>,
      );

      const switchBtn = screen.getByTestId("disabled-clock-switch");
      expect(switchBtn.hasAttribute("disabled")).toBe(true);

      fireEvent.click(switchBtn);
    });
  });
});
