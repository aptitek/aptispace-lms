import { describe, it, expect } from "vitest";
import React from "react";
import ReactDOMServer from "react-dom/server";

import CalendarCard, { computeRelativeStatus } from "./CalendarCard";
import "~/i18n";

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
});
