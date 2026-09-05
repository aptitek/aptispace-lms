import { describe, it, expect } from "vitest";
import React from "react";
import ReactDOMServer from "react-dom/server";
import dayjs from "dayjs";

import TimeSheet, {
  computeNeedleAngle,
  formatDigitalInterval,
  computeTimeIntervalInfo,
  buildWavyArc,
  interpolateProgressColor,
  getContrastTextColor,
} from "./TimeSheet";
import "~/i18n";

describe("TimeSheet Molecule", () => {
  const baseToday = dayjs("2026-09-05T12:00:00");

  describe("computeNeedleAngle", () => {
    it("computes 0° for 12:00", () => {
      expect(computeNeedleAngle("2026-09-05T12:00:00")).toBe(0);
      expect(computeNeedleAngle("2026-09-05T00:00:00")).toBe(0);
    });

    it("computes 60° for 14:00 (2:00 PM)", () => {
      expect(computeNeedleAngle("2026-09-05T14:00:00")).toBe(60);
    });

    it("computes 105° for 15:30 (3:30 PM)", () => {
      // 3 * 30 + 30 * 0.5 = 90 + 15 = 105
      expect(computeNeedleAngle("2026-09-05T15:30:00")).toBe(105);
    });

    it("computes 180° for 06:00 (6:00 AM/PM)", () => {
      expect(computeNeedleAngle("2026-09-05T06:00:00")).toBe(180);
      expect(computeNeedleAngle("2026-09-05T18:00:00")).toBe(180);
    });
  });

  describe("formatDigitalInterval", () => {
    const start = dayjs("2026-09-05T14:00:00");
    const end = dayjs("2026-09-05T16:30:00");

    it("formats 24h interval correctly", () => {
      expect(formatDigitalInterval(start, end, "fr", "24h")).toBe("14:00 – 16:30");
      expect(formatDigitalInterval(start, end, "fr", "auto")).toBe("14:00 – 16:30");
    });

    it("formats 12h interval correctly", () => {
      expect(formatDigitalInterval(start, end, "en", "12h")).toBe("2:00 PM – 4:30 PM");
      expect(formatDigitalInterval(start, end, "en", "auto")).toBe("2:00 PM – 4:30 PM");
    });
  });

  describe("buildWavyArc", () => {
    it("generates an SVG cubic bezier path for positive sweep angle", () => {
      const path = buildWavyArc(60, 45);
      expect(path).toContain("M");
      expect(path).toContain("C");
    });

    it("returns empty string when sweep angle is zero or negative", () => {
      expect(buildWavyArc(60, 0)).toBe("");
      expect(buildWavyArc(60, -10)).toBe("");
    });
  });

  describe("interpolateProgressColor & Theme Spectrum", () => {
    it("returns purple at the start (0%)", () => {
      expect(interpolateProgressColor(0)).toBe("#6c71c4");
    });

    it("returns blue around 20%", () => {
      expect(interpolateProgressColor(20)).toBe("#268bd2");
    });

    it("returns cyan around 38%", () => {
      expect(interpolateProgressColor(38)).toBe("#2aa198");
    });

    it("returns green around 55%", () => {
      expect(interpolateProgressColor(55)).toBe("#859900");
    });

    it("returns yellow around 70%", () => {
      expect(interpolateProgressColor(70)).toBe("#b58900");
    });

    it("returns orange around 82%", () => {
      expect(interpolateProgressColor(82)).toBe("#cb4b16");
    });

    it("returns red around 92%", () => {
      expect(interpolateProgressColor(92)).toBe("#dc322f");
    });

    it("returns magenta at completion (100%)", () => {
      expect(interpolateProgressColor(100)).toBe("#d33682");
    });

    it("smoothly interpolates intermediate percentages", () => {
      const mid = interpolateProgressColor(10);
      expect(mid.startsWith("#")).toBe(true);
      expect(mid).not.toBe("#6c71c4");
      expect(mid).not.toBe("#268bd2");
    });

    it("computes high-contrast text color for chip legibility", () => {
      expect(getContrastTextColor("#6c71c4")).toBe("#ffffff");
      expect(getContrastTextColor("#b58900")).toBe("#002b36");
      expect(getContrastTextColor("#d33682")).toBe("#ffffff");
    });
  });

  describe("computeTimeIntervalInfo", () => {
    const start = dayjs("2026-09-05T14:00:00");
    const end = dayjs("2026-09-05T16:00:00");

    it("identifies upcoming event today and displays countdown", () => {
      const refTime = dayjs("2026-09-05T12:00:00");
      const intervalDetails = computeTimeIntervalInfo(start, end, {
        referenceTime: refTime,
        locale: "en",
      });

      expect(intervalDetails.isToday).toBe(true);
      expect(intervalDetails.isUpcomingToday).toBe(true);
      expect(intervalDetails.isHappeningNow).toBe(false);
      expect(intervalDetails.chipLabel).toBe("in 2 hours");
      expect(intervalDetails.chipColor).toBe("info");
      expect(intervalDetails.digitalRange).toBe("2:00 PM – 4:00 PM");
      expect(intervalDetails.startHourAngle).toBe(60);
      expect(intervalDetails.endHourAngle).toBe(120);
      expect(intervalDetails.sweepAngle).toBe(60);
    });

    it("identifies happening now and computes elapsed percent and remaining time", () => {
      const refTime = dayjs("2026-09-05T15:00:00");
      const intervalDetails = computeTimeIntervalInfo(start, end, {
        referenceTime: refTime,
        locale: "en",
      });

      expect(intervalDetails.isToday).toBe(true);
      expect(intervalDetails.isHappeningNow).toBe(true);
      expect(intervalDetails.isUpcomingToday).toBe(false);
      expect(intervalDetails.remainingMinutes).toBe(60);
      expect(intervalDetails.elapsedPercent).toBe(50);
      expect(intervalDetails.chipLabel).toBe("Now • 1h remaining");
      expect(intervalDetails.chipColor).toBe("warning");
    });

    it("identifies happening now with French locale", () => {
      const refTime = dayjs("2026-09-05T15:30:00");
      const intervalDetails = computeTimeIntervalInfo(start, end, {
        referenceTime: refTime,
        locale: "fr",
      });

      expect(intervalDetails.isToday).toBe(true);
      expect(intervalDetails.isHappeningNow).toBe(true);
      expect(intervalDetails.remainingMinutes).toBe(30);
      expect(intervalDetails.chipLabel).toBe("En cours • 30 min restantes");
    });

    it("identifies past event today", () => {
      const refTime = dayjs("2026-09-05T17:00:00");
      const intervalDetails = computeTimeIntervalInfo(start, end, {
        referenceTime: refTime,
        locale: "en",
      });

      expect(intervalDetails.isToday).toBe(true);
      expect(intervalDetails.isPastToday).toBe(true);
      expect(intervalDetails.isHappeningNow).toBe(false);
      expect(intervalDetails.chipLabel).toBe("Ended 1h ago");
      expect(intervalDetails.chipColor).toBe("default");
    });

    it("does NOT show chip when event is on another day ('if and only if it is today')", () => {
      const futureStart = dayjs("2026-09-08T14:00:00");
      const futureEnd = dayjs("2026-09-08T16:00:00");
      const refTime = dayjs("2026-09-05T12:00:00");

      const intervalDetails = computeTimeIntervalInfo(futureStart, futureEnd, {
        referenceTime: refTime,
        locale: "en",
      });

      expect(intervalDetails.isToday).toBe(false);
      expect(intervalDetails.isUpcomingToday).toBe(false);
      expect(intervalDetails.isHappeningNow).toBe(false);
      expect(intervalDetails.chipLabel).toBeNull();
    });
  });

  describe("TimeSheet Component Rendering", () => {
    it("renders digital interval alongside the clock", () => {
      const start = dayjs("2026-09-05T14:00:00");
      const end = dayjs("2026-09-05T16:00:00");

      const html = ReactDOMServer.renderToString(
        React.createElement(TimeSheet, {
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

    it("renders chip and wavy progress and live dot with tooltip when event is happening now", () => {
      const start = dayjs("2026-09-05T14:00:00");
      const end = dayjs("2026-09-05T16:00:00");
      const refTime = dayjs("2026-09-05T15:00:00");

      const html = ReactDOMServer.renderToString(
        React.createElement(TimeSheet, {
          startTime: start,
          endTime: end,
          referenceTime: refTime,
          locale: "en",
        }),
      );

      expect(html).toContain("Now • 1h remaining");
      expect(html).toContain("time-sheet-live-dot");
      expect(html).toContain("Live");
      expect(html).toContain("time-sheet-wavy-progress");
    });

    it("does NOT render chip when event is not today", () => {
      const start = dayjs("2026-09-08T14:00:00");
      const end = dayjs("2026-09-08T16:00:00");
      const refTime = dayjs("2026-09-05T12:00:00");

      const html = ReactDOMServer.renderToString(
        React.createElement(TimeSheet, {
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
          React.createElement(TimeSheet, {
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
        React.createElement(TimeSheet, {
          startTime: start,
          endTime: end,
          orientation: "vertical",
        }),
      );

      expect(html).toBeDefined();
    });
  });
});
