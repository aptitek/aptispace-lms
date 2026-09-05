import { describe, it, expect } from "vitest";
import React from "react";
import ReactDOMServer from "react-dom/server";
import dayjs from "dayjs";

import TimeSheet, {
  computeNeedleAngle,
  computeHourNeedleAngle,
  computeMinuteNeedleAngle,
  computeClockwiseTargetAngle,
  computeEndDotCoordinates,
  generateWavyArcPhases,
  formatDigitalInterval,
  formatDigitalDuration,
  computeTimeIntervalInfo,
  buildWavyArc,
  interpolateProgressColor,
  getContrastTextColor,
} from "./TimeSheet";
import "~/i18n";

describe("TimeSheet Molecule", () => {
  const baseToday = dayjs("2026-09-05T12:00:00");

  describe("computeNeedleAngle (Hours)", () => {
    it("computes 0° for 12:00", () => {
      expect(computeNeedleAngle("2026-09-05T12:00:00")).toBe(0);
      expect(computeNeedleAngle("2026-09-05T00:00:00")).toBe(0);
      expect(computeHourNeedleAngle("2026-09-05T12:00:00")).toBe(0);
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

  describe("computeMinuteNeedleAngle (Minutes)", () => {
    it("computes 0° for 00 minutes", () => {
      expect(computeMinuteNeedleAngle("2026-09-05T14:00:00")).toBe(0);
    });

    it("computes 90° for 15 minutes", () => {
      expect(computeMinuteNeedleAngle("2026-09-05T14:15:00")).toBe(90);
    });

    it("computes 180° for 30 minutes", () => {
      expect(computeMinuteNeedleAngle("2026-09-05T14:30:00")).toBe(180);
    });

    it("computes 270° for 45 minutes", () => {
      expect(computeMinuteNeedleAngle("2026-09-05T14:45:00")).toBe(270);
    });
  });

  describe("computeClockwiseTargetAngle", () => {
    it("targets end angle directly when clockwise ahead", () => {
      expect(computeClockwiseTargetAngle(60, 120)).toBe(120);
      expect(computeClockwiseTargetAngle(0, 180)).toBe(180);
    });

    it("wraps forward across 360° boundary for smooth clockwise animation", () => {
      // e.g. 10:00 (300°) to 1:00 (30°) -> rotates forward to 390°
      expect(computeClockwiseTargetAngle(300, 30)).toBe(390);
      // e.g. :45 (270°) to :15 (90°) -> rotates forward to 450°
      expect(computeClockwiseTargetAngle(270, 90)).toBe(450);
    });

    it("keeps angle unchanged when start and end angles match", () => {
      expect(computeClockwiseTargetAngle(60, 60)).toBe(60);
      expect(computeClockwiseTargetAngle(0, 0)).toBe(0);
    });
  });

  describe("computeEndDotCoordinates", () => {
    it("computes (x, y) coordinates at exactly the hour needle distance (24px from center)", () => {
      const top = computeEndDotCoordinates(0); // 12 o'clock
      expect(top.x).toBe(50);
      expect(top.y).toBe(26); // exactly matches hour needle tip y2=26

      const right = computeEndDotCoordinates(90); // 3 o'clock
      expect(right.x).toBe(74);
      expect(right.y).toBe(50);

      const bottom = computeEndDotCoordinates(180); // 6 o'clock
      expect(bottom.x).toBe(50);
      expect(bottom.y).toBe(74);

      const left = computeEndDotCoordinates(270); // 9 o'clock
      expect(left.x).toBe(26);
      expect(left.y).toBe(50);
    });
  });

  describe("formatDigitalInterval", () => {
    const start = dayjs("2026-09-05T14:00:00");
    const end = dayjs("2026-09-05T16:30:00");

    it("formats 24h interval correctly", () => {
      expect(formatDigitalInterval(start, end, "fr", "24h")).toBe(
        "14:00 – 16:30",
      );
      expect(formatDigitalInterval(start, end, "fr", "auto")).toBe(
        "14:00 – 16:30",
      );
    });

    it("formats 12h interval correctly", () => {
      expect(formatDigitalInterval(start, end, "en", "12h")).toBe(
        "2:00 PM – 4:30 PM",
      );
      expect(formatDigitalInterval(start, end, "en", "auto")).toBe(
        "2:00 PM – 4:30 PM",
      );
    });
  });

  describe("formatDigitalDuration", () => {
    it("formats full hours without minutes", () => {
      expect(formatDigitalDuration(60)).toBe("1h");
      expect(formatDigitalDuration(120)).toBe("2h");
    });

    it("formats hours and minutes", () => {
      expect(formatDigitalDuration(90)).toBe("1h 30m");
      expect(formatDigitalDuration(150)).toBe("2h 30m");
    });

    it("formats minutes only for English and French", () => {
      expect(formatDigitalDuration(45, false)).toBe("45m");
      expect(formatDigitalDuration(45, true)).toBe("45 min");
    });
  });

  describe("buildWavyArc & generateWavyArcPhases", () => {
    it("generates an SVG cubic bezier path for positive sweep angle", () => {
      const path = buildWavyArc(60, 45);
      expect(path).toContain("M");
      expect(path).toContain("C");
    });

    it("returns empty string when sweep angle is zero or negative", () => {
      expect(buildWavyArc(60, 0)).toBe("");
      expect(buildWavyArc(60, -10)).toBe("");
      expect(generateWavyArcPhases(60, 0)).toBe("");
    });

    it("generates semicolon-separated phase paths for MD3 SMIL animation", () => {
      const phases = generateWavyArcPhases(60, 60, { numPhases: 4 });
      expect(phases).toContain(";");
      const frames = phases.split(";");
      expect(frames).toHaveLength(5);
      expect(frames[0]).toContain("M");
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

    it("removes the inner circle inside the cookie dial", () => {
      const start = dayjs("2026-09-05T14:00:00");
      const end = dayjs("2026-09-05T16:00:00");

      const html = ReactDOMServer.renderToString(
        React.createElement(TimeSheet, {
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
        React.createElement(TimeSheet, {
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

    it("animates the circular wavy progress line MD3 style with SMIL phases", () => {
      const start = dayjs("2026-09-05T14:00:00");
      const end = dayjs("2026-09-05T16:00:00");

      const html = ReactDOMServer.renderToString(
        React.createElement(TimeSheet, {
          startTime: start,
          endTime: end,
          referenceTime: baseToday,
        }),
      );

      expect(html).toContain("time-sheet-wavy-arc");
      expect(html).toContain('<animate attributeName="d"');
      expect(html).toContain('repeatCount="indefinite"');
    });

    it("renders live mode as a circular MD3 badge on the top right of the card when happening now", () => {
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
      expect(html).toContain("time-sheet-live-badge");
      expect(html).toContain("Live");
      expect(html).toContain("time-sheet-wavy-progress");
    });

    it("renders duration chip in digital format on the left of the other chip", () => {
      const start = dayjs("2026-09-05T14:00:00");
      const end = dayjs("2026-09-05T16:30:00");
      const refTime = dayjs("2026-09-05T12:00:00");

      const html = ReactDOMServer.renderToString(
        React.createElement(TimeSheet, {
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
        React.createElement(TimeSheet, {
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
        React.createElement(TimeSheet, {
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
