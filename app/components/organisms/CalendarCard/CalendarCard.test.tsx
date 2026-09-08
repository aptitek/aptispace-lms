import { describe, it, expect, vi, beforeAll, afterEach } from "vitest";
import React from "react";
import ReactDOMServer from "react-dom/server";
import { MotionConfig } from "framer-motion";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  cleanup,
} from "@testing-library/react";

import CalendarCard, { computeRelativeStatus } from "./CalendarCard";
import "~/i18n";

beforeAll(() => {
  if (typeof Element !== "undefined" && Element.prototype.animate) {
    const originalAnimate = Element.prototype.animate;
    Element.prototype.animate = function (...args) {
      const anim = originalAnimate.apply(this, args);
      if (anim && anim.finished) {
        anim.finished.catch(() => {});
      }
      return anim;
    };
  }
});

afterEach(() => {
  cleanup();
});

describe("CalendarCard Organism", () => {
  const referenceDate = new Date("2026-09-05T12:00:00");

  describe("computeRelativeStatus", () => {
    it("returns 'Today' for same day event in English", () => {
      const status = computeRelativeStatus(new Date("2026-09-05T15:30:00"), {
        referenceDate,
        locale: "en",
      });
      expect(status.isToday).toBe(true);
      expect(status.diffDays).toBe(0);
      expect(status.label).toBe("Today");
      expect(status.statusColor).toBe("primary");
    });

    it("returns 'Aujourd'hui' for same day event in French", () => {
      const status = computeRelativeStatus(new Date("2026-09-05T15:30:00"), {
        referenceDate,
        locale: "fr",
      });
      expect(status.isToday).toBe(true);
      expect(status.diffDays).toBe(0);
      expect(status.label).toBe("Aujourd'hui");
      expect(status.statusColor).toBe("primary");
    });

    it("returns 'Tomorrow' / 'Demain' for +1 day event", () => {
      const targetDate = new Date("2026-09-06T10:00:00");
      const statusEn = computeRelativeStatus(targetDate, {
        referenceDate,
        locale: "en",
      });
      expect(statusEn.isTomorrow).toBe(true);
      expect(statusEn.diffDays).toBe(1);
      expect(statusEn.label).toBe("Tomorrow");
      expect(statusEn.statusColor).toBe("info");

      const statusFr = computeRelativeStatus(targetDate, {
        referenceDate,
        locale: "fr",
      });
      expect(statusFr.isTomorrow).toBe(true);
      expect(statusFr.label).toBe("Demain");
    });

    it("returns 'Yesterday' / 'Hier' for -1 day event", () => {
      const targetDate = new Date("2026-09-04T18:00:00");
      const statusEn = computeRelativeStatus(targetDate, {
        referenceDate,
        locale: "en",
      });
      expect(statusEn.isYesterday).toBe(true);
      expect(statusEn.diffDays).toBe(-1);
      expect(statusEn.label).toBe("Yesterday");
      expect(statusEn.statusColor).toBe("default");

      const statusFr = computeRelativeStatus(targetDate, {
        referenceDate,
        locale: "fr",
      });
      expect(statusFr.isYesterday).toBe(true);
      expect(statusFr.label).toBe("Hier");
    });

    it("returns 'in 3 days' / 'dans 3 jours' for +3 days event", () => {
      const targetDate = new Date("2026-09-08T14:00:00");
      const statusEn = computeRelativeStatus(targetDate, {
        referenceDate,
        locale: "en",
      });
      expect(statusEn.isFuture).toBe(true);
      expect(statusEn.diffDays).toBe(3);
      expect(statusEn.label).toBe("in 3 days");
      expect(statusEn.statusColor).toBe("info");
    });

    it("appends formatted time suffix when showTime=true", () => {
      const targetDate = new Date("2026-09-05T14:30:00");
      const status = computeRelativeStatus(targetDate, {
        referenceDate,
        locale: "en",
        showTime: true,
      });
      expect(status.label).toBe("Today • 14:30");
    });

    it("appends end time formatted when endDate is provided", () => {
      const startDate = new Date("2026-09-05T09:00:00");
      const endDate = new Date("2026-09-05T12:00:00");
      const status = computeRelativeStatus(startDate, {
        referenceDate,
        locale: "en",
        showTime: true,
        endDate,
      });
      expect(status.label).toBe("Today • 09:00 - 12:00");
    });
  });

  describe("CalendarCard Component Rendering", () => {
    it("renders month, year, day, and weekday", () => {
      const target = new Date("2026-09-15T10:00:00");
      const html = ReactDOMServer.renderToString(
        React.createElement(CalendarCard, {
          date: target,
          referenceDate,
          locale: "en",
        }),
      );

      expect(html).toContain("September 2026");
      expect(html).toContain("15");
      expect(html).toContain("Tuesday");
      expect(html).toContain("in 10 days");
    });

    it("renders localized French text when locale='fr'", () => {
      const target = new Date("2026-09-05T14:00:00");
      const html = ReactDOMServer.renderToString(
        React.createElement(CalendarCard, {
          date: target,
          referenceDate,
          locale: "fr",
        }),
      );

      expect(html.toLowerCase()).toContain("septembre 2026");
      expect(html).toContain("5");
      expect(html.toLowerCase()).toContain("samedi");
      expect(html).toContain("Aujourd&#x27;hui");
    });

    it("renders custom chipLabel when provided", () => {
      const html = ReactDOMServer.renderToString(
        React.createElement(CalendarCard, {
          date: referenceDate,
          chipLabel: "Custom Event Badge",
        }),
      );

      expect(html).toContain("Custom Event Badge");
    });

    it("does not render chip when showChip is false", () => {
      const html = ReactDOMServer.renderToString(
        React.createElement(CalendarCard, {
          date: referenceDate,
          showChip: false,
        }),
      );

      expect(html).not.toContain("calendar-card-chip");
    });

    it("renders with custom data-testid", () => {
      const html = ReactDOMServer.renderToString(
        React.createElement(CalendarCard, {
          date: referenceDate,
        }),
      );

      expect(html).toContain("calendar-card");
      expect(html).toContain("calendar-card-month-year");
      expect(html).toContain("calendar-card-day");
    });
  });

  describe("CalendarCard Editable Mode & Date Picker", () => {
    it("defaults to editable=false with group role and no popup", () => {
      render(React.createElement(CalendarCard, { date: referenceDate }));

      const card = screen.getByTestId("calendar-card");
      expect(card.getAttribute("role")).toBe("group");
      expect(card.getAttribute("aria-haspopup")).toBeNull();
      expect(card.getAttribute("data-editable")).toBeNull();
    });

    it("renders with button role and popup attributes when editable=true", () => {
      render(
        React.createElement(CalendarCard, {
          date: referenceDate,
          editable: true,
        }),
      );

      const card = screen.getByTestId("calendar-card");
      expect(card.getAttribute("role")).toBe("button");
      expect(card.getAttribute("aria-haspopup")).toBe("dialog");
      expect(card.getAttribute("aria-expanded")).toBe("false");
      expect(card.getAttribute("data-editable")).toBe("true");
    });

    it("opens date picker popper/dialog on click when editable=true", () => {
      render(
        React.createElement(CalendarCard, {
          date: referenceDate,
          editable: true,
        }),
      );

      const card = screen.getByTestId("calendar-card");
      expect(card.getAttribute("aria-expanded")).toBe("false");

      fireEvent.click(card);

      expect(card.getAttribute("aria-expanded")).toBe("true");
    });

    it("opens date picker on Enter or Space keydown when editable=true", () => {
      render(
        React.createElement(CalendarCard, {
          date: referenceDate,
          editable: true,
        }),
      );

      const card = screen.getByTestId("calendar-card");
      expect(card.getAttribute("aria-expanded")).toBe("false");

      fireEvent.keyDown(card, { key: "Enter" });
      expect(card.getAttribute("aria-expanded")).toBe("true");

      fireEvent.keyDown(card, { key: "Enter" });
      expect(card.getAttribute("aria-expanded")).toBe("false");

      fireEvent.keyDown(card, { key: " " });
      expect(card.getAttribute("aria-expanded")).toBe("true");
    });

    it("does not open date picker when disabled=true", () => {
      render(
        React.createElement(CalendarCard, {
          date: referenceDate,
          editable: true,
          disabled: true,
        }),
      );

      const card = screen.getByTestId("calendar-card");
      fireEvent.click(card);
      expect(card.getAttribute("aria-expanded")).toBeNull();
    });

    it("triggers onDateChange and onChange callbacks when date is selected", () => {
      const onDateChangeMock = vi.fn();
      const onChangeMock = vi.fn();

      render(
        React.createElement(CalendarCard, {
          date: new Date("2026-09-05T10:00:00"),
          editable: true,
          onDateChange: onDateChangeMock,
          onChange: onChangeMock,
        }),
      );

      const card = screen.getByTestId("calendar-card");
      fireEvent.click(card);

      // In MUI DatePicker, day cells can be clicked
      const allButtons = screen.getAllByRole("gridcell");
      const day22 = allButtons.find((btn) => btn.textContent === "22");
      expect(day22).toBeDefined();

      fireEvent.click(day22!);
      expect(onDateChangeMock).toHaveBeenCalledTimes(1);
      expect(onChangeMock).toHaveBeenCalledTimes(1);
      expect(onDateChangeMock.mock.calls[0][0].date()).toBe(22);
    });

    it("updates displayed day to the selected date without reverting in uncontrolled mode", async () => {
      render(
        React.createElement(
          MotionConfig,
          { transition: { duration: 0 } },
          React.createElement(CalendarCard, {
            date: new Date("2026-09-05T10:00:00"),
            editable: true,
          }),
        ),
      );

      const card = screen.getByTestId("calendar-card");
      expect(screen.getByTestId("calendar-card-day").textContent).toBe("5");

      fireEvent.click(card);

      const allButtons = screen.getAllByRole("gridcell");
      const day25 = allButtons.find((btn) => btn.textContent === "25");
      expect(day25).toBeDefined();

      fireEvent.click(day25!);

      await waitFor(() => {
        expect(screen.getByTestId("calendar-card-day").textContent).toBe("25");
      });
    });

    it("renders floating action button in the bottom right only when editable=true", () => {
      const { rerender } = render(
        React.createElement(CalendarCard, {
          date: referenceDate,
          editable: false,
        }),
      );

      expect(screen.queryByTestId("calendar-card-fab")).toBeNull();

      rerender(
        React.createElement(CalendarCard, {
          date: referenceDate,
          editable: true,
        }),
      );

      const fab = screen.getByTestId("calendar-card-fab");
      expect(fab).toBeDefined();
      expect(fab.getAttribute("aria-label")).toBe("Edit date");
    });

    it("opens date picker when clicking specifically on the floating action button", () => {
      render(
        React.createElement(CalendarCard, {
          date: referenceDate,
          editable: true,
        }),
      );

      const card = screen.getByTestId("calendar-card");
      expect(card.getAttribute("aria-expanded")).toBe("false");

      const fab = screen.getByTestId("calendar-card-fab");
      fireEvent.click(fab);

      expect(card.getAttribute("aria-expanded")).toBe("true");
    });
  });
});
