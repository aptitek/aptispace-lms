import { describe, it, expect, vi, afterEach } from "vitest";
import React from "react";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import dayjs from "dayjs";

import DateTimeField, { CompactDateTimeField } from "./DateTimeField";
import "~/i18n";

afterEach(() => {
  cleanup();
});

describe("DateTimeField Atom Component", () => {
  const sampleTime = dayjs("2026-09-09T14:30:00");
  const startTime = dayjs("2026-09-09T09:00:00");
  const endTime = dayjs("2026-09-09T17:30:00");

  describe("Single Variant", () => {
    it("renders single time picker by default with formatted 24h time", () => {
      render(
        <DateTimeField
          mode="time"
          variant="single"
          hourFormat="24h"
          value={sampleTime}
          testId="time-field"
        />,
      );

      const input = screen.getByTestId("time-field-input") as HTMLInputElement;
      expect(input).toBeTruthy();
      expect(input.value).toContain("14:30");
    });

    it("renders single time picker with 12h AM/PM format", () => {
      render(
        <DateTimeField
          mode="time"
          variant="single"
          hourFormat="12h"
          value={sampleTime}
          testId="time-field"
        />,
      );

      const input = screen.getByTestId("time-field-input") as HTMLInputElement;
      expect(input.value).toContain("02:30");
      expect(input.value).toContain("PM");
    });

    it("renders date picker in ISO format (YYYY-MM-DD)", () => {
      render(
        <DateTimeField
          mode="date"
          variant="single"
          dateFormat="iso"
          value={sampleTime}
          testId="date-field"
        />,
      );

      const input = screen.getByTestId("date-field-input") as HTMLInputElement;
      expect(input).toBeTruthy();
      expect(input.value).toBe("2026-09-09");
    });

    it("renders combined datetime picker in ISO format", () => {
      render(
        <DateTimeField
          mode="datetime"
          variant="single"
          dateFormat="iso"
          hourFormat="24h"
          value={sampleTime}
          testId="datetime-field"
        />,
      );

      const input = screen.getByTestId(
        "datetime-field-input",
      ) as HTMLInputElement;
      expect(input.value).toContain("2026-09-09");
      expect(input.value).toContain("14:30");
    });
  });

  describe("Range / Period Variant", () => {
    it("renders start and end pickers with interval separator", () => {
      render(
        <DateTimeField
          mode="time"
          variant="range"
          hourFormat="24h"
          startValue={startTime}
          endValue={endTime}
          containerTestId="time-range-container"
          startInputTestId="time-range-start-input"
          endInputTestId="time-range-end-input"
        />,
      );

      expect(screen.getByTestId("time-range-container")).toBeTruthy();
      const startInput = screen.getByTestId(
        "time-range-start-input",
      ) as HTMLInputElement;
      const endInput = screen.getByTestId(
        "time-range-end-input",
      ) as HTMLInputElement;

      expect(startInput.value).toContain("09:00");
      expect(endInput.value).toContain("17:30");
      expect(screen.getByText("–")).toBeTruthy();
    });

    it("supports 12h format in range mode", () => {
      render(
        <DateTimeField
          mode="time"
          variant="range"
          hourFormat="12h"
          startValue={startTime}
          endValue={endTime}
          startInputTestId="start-12h"
          endInputTestId="end-12h"
        />,
      );

      const startInput = screen.getByTestId("start-12h") as HTMLInputElement;
      const endInput = screen.getByTestId("end-12h") as HTMLInputElement;

      expect(startInput.value).toContain("09:00");
      expect(startInput.value).toContain("AM");
      expect(endInput.value).toContain("05:30");
      expect(endInput.value).toContain("PM");
    });

    it("supports ISO date format in range mode", () => {
      render(
        <DateTimeField
          mode="date"
          variant="range"
          dateFormat="iso"
          startValue={dayjs("2026-09-01")}
          endValue={dayjs("2026-09-15")}
          startInputTestId="start-date"
          endInputTestId="end-date"
        />,
      );

      const startInput = screen.getByTestId("start-date") as HTMLInputElement;
      const endInput = screen.getByTestId("end-date") as HTMLInputElement;

      expect(startInput.value).toBe("2026-09-01");
      expect(endInput.value).toBe("2026-09-15");
    });

    it("supports combined datetime ISO format in range mode", () => {
      render(
        <DateTimeField
          mode="datetime"
          variant="range"
          dateFormat="iso"
          hourFormat="24h"
          startValue={startTime}
          endValue={endTime}
          startInputTestId="start-dt"
          endInputTestId="end-dt"
        />,
      );

      const startInput = screen.getByTestId("start-dt") as HTMLInputElement;
      const endInput = screen.getByTestId("end-dt") as HTMLInputElement;

      expect(startInput.value).toContain("2026-09-09 09:00");
      expect(endInput.value).toContain("2026-09-09 17:30");
    });
  });

  describe("Sizing Variants", () => {
    const sizes = ["compact", "small", "medium", "large"] as const;

    sizes.forEach((size) => {
      it(`renders correctly with size="${size}"`, () => {
        render(
          <DateTimeField
            size={size}
            mode="time"
            variant="range"
            startValue={startTime}
            endValue={endTime}
            startPickerTestId={`picker-${size}-start`}
          />,
        );

        expect(screen.getByTestId(`picker-${size}-start`)).toBeTruthy();
      });
    });

    it("renders correctly with compact={true} shorthand prop", () => {
      render(
        <DateTimeField
          compact={true}
          mode="time"
          variant="range"
          startValue={startTime}
          endValue={endTime}
          startPickerTestId="picker-compact-prop-start"
        />,
      );

      expect(screen.getByTestId("picker-compact-prop-start")).toBeTruthy();
    });

    it("renders correctly using CompactDateTimeField helper component", () => {
      render(
        <CompactDateTimeField
          mode="time"
          variant="range"
          startValue={startTime}
          endValue={endTime}
          startPickerTestId="picker-compact-helper-start"
        />,
      );

      expect(screen.getByTestId("picker-compact-helper-start")).toBeTruthy();
    });

    it("supports fitContent prop to fit width to content without empty space", () => {
      render(
        <DateTimeField
          fitContent={true}
          mode="time"
          variant="range"
          startValue={startTime}
          endValue={endTime}
          containerTestId="picker-fit-content-container"
        />,
      );

      expect(screen.getByTestId("picker-fit-content-container")).toBeTruthy();
    });
  });

  describe("Interactivity & Callbacks", () => {
    it("disables inputs when disabled=true", () => {
      render(
        <DateTimeField
          mode="time"
          variant="range"
          disabled={true}
          startValue={startTime}
          endValue={endTime}
          startInputTestId="disabled-start"
          endInputTestId="disabled-end"
        />,
      );

      const startInput = screen.getByTestId(
        "disabled-start",
      ) as HTMLInputElement;
      const endInput = screen.getByTestId("disabled-end") as HTMLInputElement;

      expect(startInput.disabled).toBe(true);
      expect(endInput.disabled).toBe(true);
    });

    it("invokes onStartTimeChange and onEndTimeChange aliases", () => {
      const onStartTimeChangeMock = vi.fn();
      const onEndTimeChangeMock = vi.fn();
      const onChangeMock = vi.fn();

      render(
        <DateTimeField
          mode="time"
          variant="range"
          startValue={startTime}
          endValue={endTime}
          onStartTimeChange={onStartTimeChangeMock}
          onEndTimeChange={onEndTimeChangeMock}
          onChange={onChangeMock}
          startPickerTestId="start-picker"
          endPickerTestId="end-picker"
        />,
      );

      expect(screen.getByTestId("start-picker")).toBeTruthy();
      expect(screen.getByTestId("end-picker")).toBeTruthy();
    });

    it("stops click propagation by default so card containers do not fire onClick", () => {
      const parentClickMock = vi.fn();

      render(
        <div onClick={parentClickMock}>
          <DateTimeField
            mode="time"
            variant="range"
            startValue={startTime}
            endValue={endTime}
            containerTestId="range-container"
          />
        </div>,
      );

      const container = screen.getByTestId("range-container");
      fireEvent.click(container);
      expect(parentClickMock).not.toHaveBeenCalled();
    });
  });

  describe("Labels and Error States", () => {
    it("renders label and helperText", () => {
      render(
        <DateTimeField
          label="Event Schedule"
          helperText="Select duration"
          mode="time"
          value={sampleTime}
        />,
      );

      expect(
        screen.getAllByText("Event Schedule").length,
      ).toBeGreaterThanOrEqual(1);
      expect(screen.getByText("Select duration")).toBeTruthy();
    });

    it("renders error helperText when error=true", () => {
      render(
        <DateTimeField
          error={true}
          helperText="Invalid time selected"
          mode="time"
          value={sampleTime}
        />,
      );

      expect(screen.getByText("Invalid time selected")).toBeTruthy();
    });

    it("supports filled visual variant matching TextField filled style", () => {
      const { container } = render(
        <DateTimeField
          variant="filled"
          mode="date"
          label="Submission Date"
          value={sampleTime}
          testId="filled-date-field"
        />,
      );

      const filledInput = container.querySelector(
        ".MuiPickersFilledInput-root, .MuiFilledInput-root",
      );
      expect(filledInput).toBeTruthy();
    });

    it("supports range helper text with error styling matching TextField", () => {
      render(
        <DateTimeField
          variant="range"
          mode="time"
          startValue={startTime}
          endValue={endTime}
          error={true}
          helperText="Interval must be at least 30 minutes"
        />,
      );

      const helperText = screen.getByText(
        "Interval must be at least 30 minutes",
      );
      expect(helperText).toBeTruthy();
      expect(helperText.classList.contains("Mui-error")).toBe(true);
    });
  });
});
