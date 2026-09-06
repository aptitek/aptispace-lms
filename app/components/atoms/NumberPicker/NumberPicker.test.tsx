import { describe, it, expect, vi, afterEach } from "vitest";
import React from "react";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { ThemeProvider } from "@mui/material/styles";
import { I18nextProvider } from "react-i18next";
import i18n from "~/i18n";
import { appTheme } from "~/tokens/theme";
import NumberPicker from "./NumberPicker";

describe("NumberPicker Atom", () => {
  afterEach(() => {
    cleanup();
  });

  describe("Single Mode", () => {
    it("renders with label, placeholder and step buttons", () => {
      const handleChange = vi.fn();
      render(
        <I18nextProvider i18n={i18n}>
          <ThemeProvider theme={appTheme}>
            <NumberPicker
              label="Year"
              value={1}
              onChange={handleChange}
              testId="year-picker"
            />
          </ThemeProvider>
        </I18nextProvider>,
      );

      expect(screen.getByTestId("year-picker")).toBeDefined();
      const incBtn = screen.getByTestId("year-picker-increment");
      const decBtn = screen.getByTestId("year-picker-decrement");
      expect(incBtn).toBeDefined();
      expect(decBtn).toBeDefined();

      fireEvent.click(incBtn);
      expect(handleChange).toHaveBeenCalledWith(2);

      fireEvent.click(decBtn);
      expect(handleChange).toHaveBeenCalledWith(0);
    });

    it("handles direct text change", () => {
      const handleChange = vi.fn();
      render(
        <I18nextProvider i18n={i18n}>
          <ThemeProvider theme={appTheme}>
            <NumberPicker
              label="Year"
              value={2}
              onChange={handleChange}
              testId="year-picker"
            />
          </ThemeProvider>
        </I18nextProvider>,
      );

      const input = screen.getByTestId("year-picker").querySelector("input");
      expect(input).not.toBeNull();
      fireEvent.change(input as HTMLInputElement, { target: { value: "5" } });
      expect(handleChange).toHaveBeenCalledWith(5);
    });
  });

  describe("Range Mode (MD3 Unified Variant)", () => {
    it("renders min/max inputs, icon, and clear button when value set", () => {
      const handleMinChange = vi.fn();
      const handleMaxChange = vi.fn();

      render(
        <I18nextProvider i18n={i18n}>
          <ThemeProvider theme={appTheme}>
            <NumberPicker
              mode="range"
              minValue={2020}
              maxValue={2026}
              onMinChange={handleMinChange}
              onMaxChange={handleMaxChange}
              testId="range-test"
            />
          </ThemeProvider>
        </I18nextProvider>,
      );

      expect(screen.getByTestId("range-test")).toBeDefined();
      expect(screen.getByTestId("range-icon")).toBeDefined();
      const clearBtn = screen.getByTestId("range-test-clear-button");
      expect(clearBtn).toBeDefined();

      fireEvent.click(clearBtn);
      expect(handleMinChange).toHaveBeenCalledWith(null);
      expect(handleMaxChange).toHaveBeenCalledWith(null);
    });

    it("triggers onMinChange and onMaxChange on user typing", () => {
      const handleMinChange = vi.fn();
      const handleMaxChange = vi.fn();

      render(
        <I18nextProvider i18n={i18n}>
          <ThemeProvider theme={appTheme}>
            <NumberPicker
              mode="range"
              minValue={2022}
              maxValue={2025}
              onMinChange={handleMinChange}
              onMaxChange={handleMaxChange}
              testId="range-test"
            />
          </ThemeProvider>
        </I18nextProvider>,
      );

      const fromInput = screen.getByTestId("range-test-from");
      const toInput = screen.getByTestId("range-test-to");

      fireEvent.change(fromInput, { target: { value: "2023" } });
      expect(handleMinChange).toHaveBeenCalledWith(2023);

      fireEvent.change(toInput, { target: { value: "2028" } });
      expect(handleMaxChange).toHaveBeenCalledWith(2028);

      fireEvent.change(fromInput, { target: { value: "" } });
      expect(handleMinChange).toHaveBeenCalledWith(null);
    });

    it("increments and decrements active boundary using stepper buttons", () => {
      const handleMinChange = vi.fn();
      const handleMaxChange = vi.fn();

      render(
        <I18nextProvider i18n={i18n}>
          <ThemeProvider theme={appTheme}>
            <NumberPicker
              mode="range"
              minValue={2022}
              maxValue={2025}
              onMinChange={handleMinChange}
              onMaxChange={handleMaxChange}
              testId="range-steppers"
            />
          </ThemeProvider>
        </I18nextProvider>,
      );

      const incBtn = screen.getByTestId("range-steppers-increment");
      const decBtn = screen.getByTestId("range-steppers-decrement");
      const toInput = screen.getByTestId("range-steppers-to");

      // By default, "from" is active
      fireEvent.click(incBtn);
      expect(handleMinChange).toHaveBeenCalledWith(2023);

      fireEvent.click(decBtn);
      expect(handleMinChange).toHaveBeenCalledWith(2021);

      // Switch active boundary to "to"
      fireEvent.focus(toInput);

      fireEvent.click(incBtn);
      expect(handleMaxChange).toHaveBeenCalledWith(2026);

      fireEvent.click(decBtn);
      expect(handleMaxChange).toHaveBeenCalledWith(2024);
    });

    it("does not render clear button when range is empty", () => {
      render(
        <I18nextProvider i18n={i18n}>
          <ThemeProvider theme={appTheme}>
            <NumberPicker
              mode="range"
              minValue={null}
              maxValue={null}
              onMinChange={vi.fn()}
              onMaxChange={vi.fn()}
              testId="range-empty"
            />
          </ThemeProvider>
        </I18nextProvider>,
      );

      expect(screen.queryByTestId("range-empty-clear-button")).toBeNull();
    });

    it("suppresses start icon when icon={null}", () => {
      render(
        <I18nextProvider i18n={i18n}>
          <ThemeProvider theme={appTheme}>
            <NumberPicker
              mode="range"
              icon={null}
              minValue={2020}
              maxValue={2024}
              onMinChange={vi.fn()}
              onMaxChange={vi.fn()}
              testId="range-no-icon"
            />
          </ThemeProvider>
        </I18nextProvider>,
      );

      expect(screen.queryByTestId("range-icon")).toBeNull();
    });

    it("supports custom start icon", () => {
      render(
        <I18nextProvider i18n={i18n}>
          <ThemeProvider theme={appTheme}>
            <NumberPicker
              mode="range"
              icon={<span data-testid="custom-range-icon">Icon</span>}
              minValue={2020}
              maxValue={2024}
              onMinChange={vi.fn()}
              onMaxChange={vi.fn()}
              testId="range-custom-icon"
            />
          </ThemeProvider>
        </I18nextProvider>,
      );

      expect(screen.getByTestId("custom-range-icon")).toBeDefined();
    });

    it("supports startYear aliases for backward compatibility", () => {
      const handleMinChange = vi.fn();
      const handleMaxChange = vi.fn();

      render(
        <I18nextProvider i18n={i18n}>
          <ThemeProvider theme={appTheme}>
            <NumberPicker
              startYearMin={2021}
              startYearMax={2027}
              onStartYearMinChange={handleMinChange}
              onStartYearMaxChange={handleMaxChange}
              testId="range-aliases"
            />
          </ThemeProvider>
        </I18nextProvider>,
      );

      const fromInput = screen.getByTestId(
        "range-aliases-from",
      ) as HTMLInputElement;
      const toInput = screen.getByTestId(
        "range-aliases-to",
      ) as HTMLInputElement;

      expect(fromInput.value).toBe("2021");
      expect(toInput.value).toBe("2027");

      fireEvent.change(fromInput, { target: { value: "2022" } });
      expect(handleMinChange).toHaveBeenCalledWith(2022);
    });

    it("manages focus states across sub-inputs without un-focusing container", () => {
      render(
        <I18nextProvider i18n={i18n}>
          <ThemeProvider theme={appTheme}>
            <NumberPicker
              mode="range"
              label="Academic Year"
              minValue={null}
              maxValue={null}
              onMinChange={vi.fn()}
              onMaxChange={vi.fn()}
              testId="range-focus"
            />
          </ThemeProvider>
        </I18nextProvider>,
      );

      const container = screen.getByTestId("range-focus");
      const outlinedInput = container.querySelector(".MuiOutlinedInput-root");
      const fromInput = screen.getByTestId("range-focus-from");
      const toInput = screen.getByTestId("range-focus-to");

      fireEvent.focus(fromInput);
      expect(outlinedInput?.className).toContain("Mui-focused");

      // Tabbing from fromInput to toInput keeps focus within
      fireEvent.blur(fromInput, { relatedTarget: toInput });
      expect(outlinedInput?.className).toContain("Mui-focused");

      // Blurring completely outside removes focus
      fireEvent.blur(container, { relatedTarget: document.body });
      expect(outlinedInput?.className).not.toContain("Mui-focused");
    });

    it("shrinks label in empty state to avoid overlapping placeholders", () => {
      const { container } = render(
        <I18nextProvider i18n={i18n}>
          <ThemeProvider theme={appTheme}>
            <NumberPicker
              mode="range"
              label="Academic Year"
              minValue={null}
              maxValue={null}
              testId="empty-range-test"
            />
          </ThemeProvider>
        </I18nextProvider>,
      );

      const label = container.querySelector("label");
      expect(label).not.toBeNull();
      expect(label?.className).toContain("MuiInputLabel-shrink");

      const fromInput = screen.getByTestId(
        "empty-range-test-from",
      ) as HTMLInputElement;
      const toInput = screen.getByTestId(
        "empty-range-test-to",
      ) as HTMLInputElement;
      expect(fromInput.placeholder).toBe("From");
      expect(toInput.placeholder).toBe("To");
    });
  });

  describe("Range Mode (Split Variant)", () => {
    it("renders two separate SingleNumberPickers when variant='split'", () => {
      const handleMinChange = vi.fn();
      const handleMaxChange = vi.fn();

      render(
        <I18nextProvider i18n={i18n}>
          <ThemeProvider theme={appTheme}>
            <NumberPicker
              mode="range"
              variant="split"
              minValue={2021}
              maxValue={2025}
              onMinChange={handleMinChange}
              onMaxChange={handleMaxChange}
              testId="split-range"
            />
          </ThemeProvider>
        </I18nextProvider>,
      );

      expect(screen.getByTestId("split-range")).toBeDefined();
      expect(screen.getByTestId("split-range-from")).toBeDefined();
      expect(screen.getByTestId("split-range-to")).toBeDefined();
      expect(screen.getByTestId("split-range-clear-button")).toBeDefined();

      expect(screen.getByTestId("split-range-from-decrement")).toBeDefined();
      expect(screen.getByTestId("split-range-from-increment")).toBeDefined();
      expect(screen.getByTestId("split-range-to-decrement")).toBeDefined();
      expect(screen.getByTestId("split-range-to-increment")).toBeDefined();

      fireEvent.click(screen.getByTestId("split-range-from-increment"));
      expect(handleMinChange).toHaveBeenCalledWith(2022);

      fireEvent.click(screen.getByTestId("split-range-to-decrement"));
      expect(handleMaxChange).toHaveBeenCalledWith(2024);

      fireEvent.click(screen.getByTestId("split-range-clear-button"));
      expect(handleMinChange).toHaveBeenCalledWith(null);
      expect(handleMaxChange).toHaveBeenCalledWith(null);
    });
  });
});
