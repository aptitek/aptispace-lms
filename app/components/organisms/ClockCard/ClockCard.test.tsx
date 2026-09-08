import { describe, it, expect, vi, afterEach } from "vitest";
import React from "react";
import ReactDOMServer from "react-dom/server";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import dayjs from "dayjs";

afterEach(() => {
  cleanup();
});

import ClockCard from "./ClockCard";
import "~/i18n";

describe("ClockCard Molecule", () => {
  const baseToday = dayjs("2026-09-05T12:00:00");

  describe("ClockCard Component Rendering", () => {
    it("renders digital interval alongside the clock", () => {
      const start = dayjs("2026-09-05T14:00:00");
      const end = dayjs("2026-09-05T16:00:00");

      const html = ReactDOMServer.renderToString(
        React.createElement(ClockCard, {
          startTime: start,
          endTime: end,
          referenceTime: baseToday,
          hourFormat: "24h",
        }),
      );

      expect(html).toContain("14:00 – 16:00");
      expect(html).toContain("time-sheet-clock");
      expect(html).toContain("time-sheet-cookie-dial");
      expect(html).toContain("time-sheet-wavy-arc");
      expect(html).not.toContain("time-sheet-accent-dot");
      // Date removed from clock face per user instruction
      expect(html).not.toContain("time-sheet-dial-date");
    });

    it("removes the inner circle inside the cookie dial", () => {
      const start = dayjs("2026-09-05T14:00:00");
      const end = dayjs("2026-09-05T16:00:00");

      const html = ReactDOMServer.renderToString(
        React.createElement(ClockCard, {
          startTime: start,
          endTime: end,
          referenceTime: baseToday,
        }),
      );

      // Verify no r="38" circle inside the cookie
      expect(html).not.toContain('r="38"');
    });

    it("renders 2 needles (shorter hour needle, longer minute needle) and 1 ghostly end hour dot at hour needle distance", () => {
      const start = dayjs("2026-09-05T14:00:00");
      const end = dayjs("2026-09-05T16:00:00");

      const html = ReactDOMServer.renderToString(
        React.createElement(ClockCard, {
          startTime: start,
          endTime: end,
          referenceTime: baseToday,
        }),
      );

      expect(html).toContain("time-sheet-hour-needle");
      expect(html).toContain("time-sheet-minute-needle");
      expect(html).toContain("time-sheet-end-dot");

      // Hour hand is shorter (y2="26"), minute hand is longer (y2="16")
      expect(html).toContain('y2="26"');
      expect(html).toContain('y2="16"');

      // Ghostly fill (rgba with alpha 0.38)
      expect(html).toContain("rgba(25, 118, 210, 0.38)");
      // Dot is at distance 24 from center (50, 50) for 16:00 (120deg) -> cx="70.78" cy="62"
      expect(html).toContain('cx="70.78"');
      expect(html).toContain('cy="62"');
    });

    it("animates the circular wavy progress line MD3 style with SMIL phases on hover only", () => {
      const start = dayjs("2026-09-05T14:00:00");
      const end = dayjs("2026-09-05T16:00:00");

      const defaultHtml = ReactDOMServer.renderToString(
        React.createElement(ClockCard, {
          startTime: start,
          endTime: end,
          referenceTime: baseToday,
        }),
      );

      expect(defaultHtml).toContain("time-sheet-wavy-arc");
      expect(defaultHtml).not.toContain('<animate attributeName="d"');

      const hoveredHtml = ReactDOMServer.renderToString(
        React.createElement(ClockCard, {
          startTime: start,
          endTime: end,
          referenceTime: baseToday,
          isHovered: true,
        }),
      );

      expect(hoveredHtml).toContain("time-sheet-wavy-arc");
      expect(hoveredHtml).toContain('<animate attributeName="d"');
      expect(hoveredHtml).toContain('repeatCount="indefinite"');
    });

    it("renders live mode as a circular MD3 badge on the top right of the card when happening now", () => {
      const start = dayjs("2026-09-05T14:00:00");
      const end = dayjs("2026-09-05T16:00:00");
      const refTime = dayjs("2026-09-05T15:00:00");

      const html = ReactDOMServer.renderToString(
        React.createElement(ClockCard, {
          startTime: start,
          endTime: end,
          referenceTime: refTime,
          locale: "en",
        }),
      );

      expect(html).toContain("Now • 1h remaining");
      expect(html).toContain("time-sheet-live-badge");
      expect(html).toContain("Live");
      expect(html).toContain("time-sheet-wavy-progress");
    });

    it("renders duration chip in digital format on the left of the other chip", () => {
      const start = dayjs("2026-09-05T14:00:00");
      const end = dayjs("2026-09-05T16:30:00");
      const refTime = dayjs("2026-09-05T12:00:00");

      const html = ReactDOMServer.renderToString(
        React.createElement(ClockCard, {
          startTime: start,
          endTime: end,
          referenceTime: refTime,
          locale: "en",
        }),
      );

      expect(html).toContain("time-sheet-duration-chip");
      expect(html).toContain("2h 30m");
      expect(html).toContain("time-sheet-chip");
      expect(html).toContain("in 2 hours");

      const durationIndex = html.indexOf("time-sheet-duration-chip");
      const chipIndex = html.indexOf("time-sheet-chip");
      expect(durationIndex).toBeGreaterThan(-1);
      expect(chipIndex).toBeGreaterThan(-1);
      expect(durationIndex).toBeLessThan(chipIndex);
    });

    it("moves the 2 needles smoothly to the end time on hover", () => {
      const start = dayjs("2026-09-05T14:15:00");
      const end = dayjs("2026-09-05T16:30:00");

      const htmlHovered = ReactDOMServer.renderToString(
        React.createElement(ClockCard, {
          startTime: start,
          endTime: end,
          referenceTime: baseToday,
          isHovered: true,
        }),
      );

      expect(htmlHovered).toContain("time-sheet-hour-needle");
      expect(htmlHovered).toContain("time-sheet-minute-needle");
      expect(htmlHovered).toContain("time-sheet-end-dot");
      // Hour target 16:30 is 135deg (4 * 30 + 15)
      expect(htmlHovered).toContain("rotate(135deg)");
      // Minute target 30 min is 180deg (30 * 6)
      expect(htmlHovered).toContain("rotate(180deg)");

      const htmlRest = ReactDOMServer.renderToString(
        React.createElement(ClockCard, {
          startTime: start,
          endTime: end,
          referenceTime: baseToday,
          isHovered: false,
        }),
      );

      expect(htmlRest).toContain("time-sheet-hour-needle");
      expect(htmlRest).toContain("time-sheet-minute-needle");
      expect(htmlRest).toContain("time-sheet-end-dot");
      // Hour start 14:15 is 67.5deg (2 * 30 + 15 * 0.5)
      expect(htmlRest).toContain("rotate(67.5deg)");
      // Minute start 15 min is 90deg (15 * 6)
      expect(htmlRest).toContain("rotate(90deg)");
    });

    it("does NOT render chip when event is not today", () => {
      const start = dayjs("2026-09-08T14:00:00");
      const end = dayjs("2026-09-08T16:00:00");
      const refTime = dayjs("2026-09-05T12:00:00");

      const html = ReactDOMServer.renderToString(
        React.createElement(ClockCard, {
          startTime: start,
          endTime: end,
          referenceTime: refTime,
        }),
      );

      expect(html).not.toContain("time-sheet-chip");
    });

    it("renders small, medium, and large sizes", () => {
      const start = dayjs("2026-09-05T14:00:00");
      const end = dayjs("2026-09-05T16:00:00");

      for (const size of ["small", "medium", "large"] as const) {
        const html = ReactDOMServer.renderToString(
          React.createElement(ClockCard, {
            startTime: start,
            endTime: end,
            size,
          }),
        );
        expect(html).toContain("time-sheet");
      }
    });

    it("renders vertical orientation", () => {
      const start = dayjs("2026-09-05T14:00:00");
      const end = dayjs("2026-09-05T16:00:00");

      const html = ReactDOMServer.renderToString(
        React.createElement(ClockCard, {
          startTime: start,
          endTime: end,
          orientation: "vertical",
        }),
      );

      expect(html).toBeDefined();
    });
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
      expect(
        screen.getByTestId("time-sheet-digital-interval").textContent,
      ).toBe("14:00 – 16:30");
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
      expect(card.getAttribute("aria-label")).toContain(
        "Editable time interval",
      );
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
});
