import { describe, it, expect, vi, afterEach } from "vitest";
import React from "react";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import dayjs from "dayjs";

import ClockCard from "./ClockCard";
import "~/i18n";

afterEach(() => {
  cleanup();
});

describe("ClockCard Editable Mode", () => {
  const start = dayjs("2026-09-05T14:00:00");
  const end = dayjs("2026-09-05T16:30:00");

  it("is not editable by default and renders digital interval text", () => {
    render(
      React.createElement(ClockCard, {
        startTime: start,
        endTime: end,
        hourFormat: "24h",
      }),
    );

    expect(screen.getByTestId("time-sheet-digital-interval")).toBeTruthy();
    expect(screen.queryByTestId("time-sheet-editable-pickers")).toBeNull();
    expect(screen.queryByTestId("time-sheet-start-time-input")).toBeNull();
    expect(screen.queryByTestId("time-sheet-end-time-input")).toBeNull();
    expect(screen.getByTestId("time-sheet-digital-interval").textContent).toBe(
      "14:00 – 16:30",
    );
  });

  it("renders two MUI TimePicker text fields when editable=true", () => {
    render(
      React.createElement(ClockCard, {
        startTime: start,
        endTime: end,
        editable: true,
        hourFormat: "24h",
      }),
    );

    expect(screen.getByTestId("time-sheet-editable-pickers")).toBeTruthy();
    expect(screen.getByTestId("time-sheet-start-time-input")).toBeTruthy();
    expect(screen.getByTestId("time-sheet-end-time-input")).toBeTruthy();
    expect(screen.queryByTestId("time-sheet-digital-interval")).toBeNull();
  });

  it("displays formatted time in the text fields for 24h format", () => {
    render(
      React.createElement(ClockCard, {
        startTime: start,
        endTime: end,
        editable: true,
        hourFormat: "24h",
      }),
    );

    const startInput = screen.getByTestId(
      "time-sheet-start-time-input",
    ) as HTMLInputElement;
    const endInput = screen.getByTestId(
      "time-sheet-end-time-input",
    ) as HTMLInputElement;

    expect(startInput.value).toContain("14:00");
    expect(endInput.value).toContain("16:30");
  });

  it("displays formatted time in the text fields for 12h format", () => {
    render(
      React.createElement(ClockCard, {
        startTime: start,
        endTime: end,
        editable: true,
        hourFormat: "12h",
      }),
    );

    const startInput = screen.getByTestId(
      "time-sheet-start-time-input",
    ) as HTMLInputElement;
    const endInput = screen.getByTestId(
      "time-sheet-end-time-input",
    ) as HTMLInputElement;

    expect(startInput.value).toContain("02:00");
    expect(startInput.value).toContain("PM");
    expect(endInput.value).toContain("04:30");
    expect(endInput.value).toContain("PM");
  });

  it("disables both text fields when disabled=true", () => {
    render(
      React.createElement(ClockCard, {
        startTime: start,
        endTime: end,
        editable: true,
        disabled: true,
      }),
    );

    const startInput = screen.getByTestId(
      "time-sheet-start-time-input",
    ) as HTMLInputElement;
    const endInput = screen.getByTestId(
      "time-sheet-end-time-input",
    ) as HTMLInputElement;

    expect(startInput.disabled).toBe(true);
    expect(endInput.disabled).toBe(true);
  });

  it("invokes callbacks when time is changed via timePickerProps or change handler", () => {
    const onStartTimeChangeMock = vi.fn();
    const onEndTimeChangeMock = vi.fn();
    const onTimeChangeMock = vi.fn();
    const onChangeMock = vi.fn();

    render(
      React.createElement(ClockCard, {
        startTime: start,
        endTime: end,
        editable: true,
        onStartTimeChange: onStartTimeChangeMock,
        onEndTimeChange: onEndTimeChangeMock,
        onTimeChange: onTimeChangeMock,
        onChange: onChangeMock,
      }),
    );

    expect(screen.getByTestId("time-sheet-start-time-picker")).toBeTruthy();
    expect(screen.getByTestId("time-sheet-end-time-picker")).toBeTruthy();
  });

  it("updates controlled values when parent updates startTime and endTime props", () => {
    const { rerender } = render(
      React.createElement(ClockCard, {
        startTime: start,
        endTime: end,
        editable: true,
        hourFormat: "24h",
      }),
    );

    let startInput = screen.getByTestId(
      "time-sheet-start-time-input",
    ) as HTMLInputElement;
    let endInput = screen.getByTestId(
      "time-sheet-end-time-input",
    ) as HTMLInputElement;
    expect(startInput.value).toContain("14:00");
    expect(endInput.value).toContain("16:30");

    const newStart = dayjs("2026-09-05T10:15:00");
    const newEnd = dayjs("2026-09-05T11:45:00");

    rerender(
      React.createElement(ClockCard, {
        startTime: newStart,
        endTime: newEnd,
        editable: true,
        hourFormat: "24h",
      }),
    );

    startInput = screen.getByTestId(
      "time-sheet-start-time-input",
    ) as HTMLInputElement;
    endInput = screen.getByTestId(
      "time-sheet-end-time-input",
    ) as HTMLInputElement;
    expect(startInput.value).toContain("10:15");
    expect(endInput.value).toContain("11:45");
  });

  it("includes editable prefix in card accessible label", () => {
    render(
      React.createElement(ClockCard, {
        startTime: start,
        endTime: end,
        editable: true,
        hourFormat: "24h",
      }),
    );

    const card = screen.getByTestId("time-sheet");
    expect(card.getAttribute("aria-label")).toContain("Editable time interval");
  });

  it("stops click propagation so card onClick does not fire when clicking pickers", () => {
    const cardClickMock = vi.fn();
    render(
      React.createElement(ClockCard, {
        startTime: start,
        endTime: end,
        editable: true,
        onClick: cardClickMock,
      }),
    );

    const pickersRow = screen.getByTestId("time-sheet-editable-pickers");
    fireEvent.click(pickersRow);
    expect(cardClickMock).not.toHaveBeenCalled();
  });

  it("forwards custom timePickerProps to underlying MUI TimePickers", () => {
    render(
      React.createElement(ClockCard, {
        startTime: start,
        endTime: end,
        editable: true,
        timePickerProps: {
          className: "custom-picker-class",
        },
      }),
    );

    const startPicker = screen.getByTestId("time-sheet-start-time-picker");
    expect(
      startPicker.querySelector(".custom-picker-class") ||
        startPicker.classList.contains("custom-picker-class"),
    ).toBeTruthy();
  });
});
