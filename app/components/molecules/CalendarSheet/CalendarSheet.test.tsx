import { describe, it, expect } from "vitest";
import React from "react";
import ReactDOMServer from "react-dom/server";
import dayjs from "dayjs";

import CalendarSheet, { computeRelativeStatus } from "./CalendarSheet";
import "~/i18n";

describe("CalendarSheet Molecule", () => {
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

      const statusFr = computeRelativeStatus(targetDate, {
        referenceDate,
        locale: "fr",
      });
      expect(statusFr.label).toBe("dans 3 jours");
    });

    it("returns '4 days ago' / 'il y a 4 jours' for -4 days event", () => {
      const targetDate = new Date("2026-09-01T09:00:00");
      const statusEn = computeRelativeStatus(targetDate, {
        referenceDate,
        locale: "en",
      });
      expect(statusEn.isPast).toBe(true);
      expect(statusEn.diffDays).toBe(-4);
      expect(statusEn.label).toBe("4 days ago");
      expect(statusEn.statusColor).toBe("default");

      const statusFr = computeRelativeStatus(targetDate, {
        referenceDate,
        locale: "fr",
      });
      expect(statusFr.label).toBe("il y a 4 jours");
    });

    it("formats time suffix when showTime is true", () => {
      const targetDate = new Date("2026-09-05T14:30:00");
      const endDate = new Date("2026-09-05T16:00:00");
      const status = computeRelativeStatus(targetDate, {
        referenceDate,
        locale: "en",
        variant: "auto",
        showTime: true,
        endDate,
      });
      expect(status.label).toBe("Today • 14:30 - 16:00");
    });

    it("supports relative variant using dayjs fromNow / from", () => {
      const targetDate = dayjs(referenceDate).add(2, "hour").toDate();
      const status = computeRelativeStatus(targetDate, {
        referenceDate,
        locale: "en",
        variant: "relative",
      });
      expect(status.label).toBe("in 2 hours");
    });
  });

  describe("CalendarSheet Component Rendering", () => {
    it("renders month, year, day, and weekday", () => {
      const target = new Date("2026-09-15T10:00:00");
      const html = ReactDOMServer.renderToString(
        React.createElement(CalendarSheet, {
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
        React.createElement(CalendarSheet, {
          date: target,
          referenceDate,
          locale: "fr",
        }),
      );

      // "septembre 2026" or "Septembre 2026", "samedi", "Aujourd&#x27;hui"
      expect(html.toLowerCase()).toContain("septembre 2026");
      expect(html).toContain("5");
      expect(html.toLowerCase()).toContain("samedi");
      expect(html).toContain("Aujourd&#x27;hui");
    });

    it("renders custom chipLabel when provided", () => {
      const html = ReactDOMServer.renderToString(
        React.createElement(CalendarSheet, {
          date: referenceDate,
          chipLabel: "Custom Event Badge",
        }),
      );

      expect(html).toContain("Custom Event Badge");
    });

    it("does not render chip when showChip is false", () => {
      const html = ReactDOMServer.renderToString(
        React.createElement(CalendarSheet, {
          date: referenceDate,
          showChip: false,
        }),
      );

      expect(html).not.toContain("calendar-sheet-chip");
    });

    it("renders small, medium, and large sizes without error", () => {
      for (const size of ["small", "medium", "large"] as const) {
        const html = ReactDOMServer.renderToString(
          React.createElement(CalendarSheet, {
            date: referenceDate,
            size,
          }),
        );
        expect(html).toContain("September 2026");
      }
    });

    it("renders horizontal orientation", () => {
      const html = ReactDOMServer.renderToString(
        React.createElement(CalendarSheet, {
          date: referenceDate,
          orientation: "horizontal",
        }),
      );

      expect(html).toBeDefined();
      expect(html).toContain("Today");
    });

    it("renders different headerColor variants", () => {
      for (const headerColor of [
        "primary",
        "secondary",
        "error",
        "default",
      ] as const) {
        const html = ReactDOMServer.renderToString(
          React.createElement(CalendarSheet, {
            date: referenceDate,
            headerColor,
          }),
        );
        expect(html).toBeDefined();
      }
    });

    it("sets accessible aria-label", () => {
      const html = ReactDOMServer.renderToString(
        React.createElement(CalendarSheet, {
          date: referenceDate,
          referenceDate,
          locale: "en",
        }),
      );

      expect(html).toContain("aria-label=");
      expect(html).toContain("September 5, 2026");
    });
  });
});
