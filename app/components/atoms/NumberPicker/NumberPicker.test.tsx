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
  });

  describe("Range Mode (merging YearRangePicker)", () => {
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
  });
});
