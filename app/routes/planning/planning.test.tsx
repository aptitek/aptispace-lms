import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";

vi.mock("@mui/x-scheduler/event-calendar", () => ({
  EventCalendar: () =>
    React.createElement("div", { "data-testid": "event-calendar" }),
}));

import Planning, {
  meta,
  loader,
  getSchedulerLocaleText,
  getSchedulerDateLocale,
} from "./planning";
import {
  CalendarSkeleton,
  CalendarErrorState,
  CalendarEmptyState,
  CalendarContentArea,
} from "./planning.states";
import { frFR, enUS } from "@mui/x-scheduler/locales";
import { mapClassToSchedulerEvent, formatTimeRange } from "./planning.types";
import {
  createSvgDataUri,
  DEVICES_ICON_PATH,
  LOCATION_ICON_PATH,
} from "./planning.styles";
import * as sessionServer from "~/utils/session.server";
import * as classService from "~/services/classService";
import * as dbModule from "~/db";

describe("Planning Route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns correct metadata", () => {
    const metaTags = meta();
    expect(metaTags).toEqual([
      { title: "AptiSpace LMS • Planning & Timetable" },
      {
        name: "description",
        content:
          "Interactive academic planning, scheduled classes, and cohort timetables with live iCal subscription.",
      },
    ]);
  });

  it("redirects to onboarding if profile is incomplete or unauthenticated", async () => {
    vi.spyOn(sessionServer, "authGuard").mockResolvedValue(null);

    const request = new Request("http://localhost:3000/planning");
    const args = {
      request,
      context: {},
      params: {},
    } as unknown as Parameters<typeof loader>[0];

    let redirectResponse: Response | null = null;
    try {
      await loader(args);
    } catch (response) {
      if (response instanceof Response) {
        redirectResponse = response;
      }
    }

    expect(redirectResponse).not.toBeNull();
    expect(redirectResponse?.status).toBe(302);
    expect(redirectResponse?.headers.get("Location")).toBe("/onboarding");
  });

  it("loads planning data for authenticated admin", async () => {
    const mockAdmin = {
      id: "admin-1",
      firstName: "Sarah",
      lastName: "Connor",
      displayName: "Sarah Connor",
      email: "admin@aptitek.io",
      role: "admin" as const,
    };

    const mockAuth = {
      user: {
        id: "admin-1",
        firstName: "Sarah",
        lastName: "Connor",
        affiliations: [{ role: "admin" }],
      },
      session: null,
      db: {} as unknown as dbModule.Database,
    };

    vi.spyOn(sessionServer, "authGuard").mockResolvedValue(
      mockAuth as unknown as NonNullable<
        Awaited<ReturnType<typeof sessionServer.authGuard>>
      >,
    );
    vi.spyOn(dbModule, "getDatabaseFromContext").mockReturnValue({
      query: {
        sessions: {
          findMany: vi.fn().mockResolvedValue([
            {
              id: "session-1",
              course: { title: "Fullstack Architecture" },
              cohort: { diploma: "M", year: 1 },
            },
          ]),
        },
      },
    } as unknown as dbModule.Database);

    vi.spyOn(classService, "getClassesForUser").mockResolvedValue([]);
    vi.spyOn(classService, "ensureCalendarFeedToken").mockResolvedValue(
      "feed-token-123",
    );
    vi.spyOn(classService, "getEligibleInstructors").mockResolvedValue([
      {
        id: "inst-1",
        name: "Alex Mercer",
        firstName: "Alex",
        lastName: "Mercer",
        email: "alex@aptitek.io",
        role: "instructor",
      },
    ]);

    const request = new Request("http://localhost:3000/planning");
    const args = {
      request,
      context: {},
      params: {},
    } as unknown as Parameters<typeof loader>[0];

    const result = await loader(args);
    expect(result.feedToken).toBe("feed-token-123");
    expect(result.user.role).toBe(mockAdmin.role);
    expect(result.instructors).toHaveLength(1);
    expect(result.sessions).toHaveLength(1);
  });

  it("exports Planning component", () => {
    expect(Planning).toBeDefined();
    expect(typeof Planning).toBe("function");
    const element = React.createElement(Planning);
    expect(element).toBeDefined();
  });

  it("renders CalendarSkeleton properly", () => {
    expect(CalendarSkeleton).toBeDefined();
    const element = React.createElement(CalendarSkeleton);
    expect(element).toBeDefined();
  });

  it("renders CalendarErrorState with retry and download actions", () => {
    const onRetry = vi.fn();
    const element = React.createElement(CalendarErrorState, {
      onRetry,
      feedToken: "test-token",
      userId: "user-123",
    });
    expect(element).toBeDefined();
    expect(element.props.feedToken).toBe("test-token");
  });

  it("renders CalendarEmptyState with admin controls", () => {
    const onAddClass = vi.fn();
    const onShowGrid = vi.fn();

    const element = React.createElement(CalendarEmptyState, {
      isAdmin: true,
      onAddClass,
      onShowGrid,
    });
    expect(element).toBeDefined();
    expect(element.props.isAdmin).toBe(true);
  });

  describe("mapClassToSchedulerEvent", () => {
    it("maps remote class without [Remote] prefix in title and with event-remote className", () => {
      const remoteClass = {
        id: "class-remote-1",
        title: "Distributed Architecture",
        startTime: new Date("2026-09-08T09:00:00.000Z"),
        endTime: new Date("2026-09-08T11:00:00.000Z"),
        isRemote: true,
        description: "Zoom lecture on distributed databases",
      };

      const event = mapClassToSchedulerEvent(remoteClass);

      expect(event.id).toBe("class-remote-1");
      expect(event.title).toBe("Distributed Architecture");
      expect(event.title).not.toContain("[Remote]");
      expect(event.className).toBe("event-remote");
      expect(event.color).toBe("blue");
      expect(event.start).toBe("2026-09-08T09:00:00.000Z");
      expect(event.end).toBe("2026-09-08T11:00:00.000Z");
    });

    it("maps in-person class with clean title and with event-in-person className", () => {
      const inPersonClass = {
        id: "class-inperson-2",
        title: "Microservices Workshop",
        startTime: new Date("2026-09-09T14:00:00.000Z"),
        endTime: new Date("2026-09-09T17:00:00.000Z"),
        isRemote: false,
        description: "Room 402 lab session",
      };

      const event = mapClassToSchedulerEvent(inPersonClass);

      expect(event.id).toBe("class-inperson-2");
      expect(event.title).toBe("Microservices Workshop");
      expect(event.className).toBe("event-in-person");
      expect(event.color).toBe("green");
    });
  });

  describe("Badge SVG Utilities", () => {
    it("generates valid data URIs for DevicesRounded and LocationOnRounded icons", () => {
      const devicesUri = createSvgDataUri(DEVICES_ICON_PATH, "#ffffff");
      const locationUri = createSvgDataUri(LOCATION_ICON_PATH, "#ffffff");

      expect(devicesUri).toContain('url("data:image/svg+xml,');
      expect(devicesUri).toContain("%23ffffff");
      expect(locationUri).toContain('url("data:image/svg+xml,');
      expect(locationUri).toContain("%23ffffff");
    });
  });

  describe("CalendarContentArea", () => {
    it("renders CalendarErrorState when loadError is true", () => {
      const element = CalendarContentArea({
        loadError: true,
        onRetry: vi.fn(),
        feedToken: "token-123",
        userId: "user-1",
        hasCalendarComponent: true,
        classesCount: 2,
        showEmptyGrid: false,
        isAdmin: true,
        onAddClass: vi.fn(),
        onShowGrid: vi.fn(),
        children: React.createElement("div", {
          "data-testid": "calendar-content",
        }),
      });

      expect(element).toBeDefined();
      expect(element.type).toBe(CalendarErrorState);
    });

    it("renders CalendarSkeleton when calendar component is not yet loaded", () => {
      const element = CalendarContentArea({
        loadError: false,
        onRetry: vi.fn(),
        feedToken: "token-123",
        userId: "user-1",
        hasCalendarComponent: false,
        classesCount: 2,
        showEmptyGrid: false,
        isAdmin: true,
        onAddClass: vi.fn(),
        onShowGrid: vi.fn(),
        children: React.createElement("div", {
          "data-testid": "calendar-content",
        }),
      });

      expect(element).toBeDefined();
      expect(element.type).toBe(CalendarSkeleton);
    });

    it("renders CalendarEmptyState when classesCount is 0 and showEmptyGrid is false", () => {
      const element = CalendarContentArea({
        loadError: false,
        onRetry: vi.fn(),
        feedToken: "token-123",
        userId: "user-1",
        hasCalendarComponent: true,
        classesCount: 0,
        showEmptyGrid: false,
        isAdmin: true,
        onAddClass: vi.fn(),
        onShowGrid: vi.fn(),
        children: React.createElement("div", {
          "data-testid": "calendar-content",
        }),
      });

      expect(element).toBeDefined();
      expect(element.type).toBe(CalendarEmptyState);
    });

    it("renders children when calendar is loaded and classes exist", () => {
      const child = React.createElement("div", {
        "data-testid": "calendar-content",
      });
      const element = CalendarContentArea({
        loadError: false,
        onRetry: vi.fn(),
        feedToken: "token-123",
        userId: "user-1",
        hasCalendarComponent: true,
        classesCount: 2,
        showEmptyGrid: false,
        isAdmin: true,
        onAddClass: vi.fn(),
        onShowGrid: vi.fn(),
        children: child,
      });

      expect(element).toBeDefined();
      expect(element.props.children).toBe(child);
    });
  });

  describe("Calendar i18n Locales", () => {
    it("provides French and English locale text for EventCalendar", () => {
      expect(
        frFR.components.MuiEventCalendar.defaultProps.localeText.today,
      ).toBe("Aujourd'hui");
      expect(
        enUS.components.MuiEventCalendar.defaultProps.localeText.today,
      ).toBe("Today");
      expect(
        frFR.components.MuiEventCalendar.defaultProps.localeText.week,
      ).toBe("Semaine");
      expect(
        enUS.components.MuiEventCalendar.defaultProps.localeText.week,
      ).toBe("Week");
    });

    it("resolves scheduler locale text dynamically based on active language", () => {
      expect(getSchedulerLocaleText("fr")).toBe(
        frFR.components.MuiEventCalendar.defaultProps.localeText,
      );
      expect(getSchedulerLocaleText("fr-FR")).toBe(
        frFR.components.MuiEventCalendar.defaultProps.localeText,
      );
      expect(getSchedulerLocaleText("en")).toBe(
        enUS.components.MuiEventCalendar.defaultProps.localeText,
      );
    });

    it("provides date-fns locales with capitalized French months and weekdays", () => {
      const frLocale = getSchedulerDateLocale("fr");
      const enLocale = getSchedulerDateLocale("en");

      expect(frLocale.code).toBe("fr");
      expect(enLocale.code).toBe("en-US");

      // Verify capitalization is kept for French months and days
      expect(frLocale.localize?.month(8, { width: "wide" })).toBe("Septembre");
      expect(frLocale.localize?.month(8, { width: "abbreviated" })).toBe(
        "Sept.",
      );
      expect(frLocale.localize?.day(2, { width: "wide" })).toBe("Mardi");
      expect(frLocale.localize?.day(2, { width: "abbreviated" })).toBe("Mar.");

      // Verify English remains standard
      expect(enLocale.localize?.month(8, { width: "wide" })).toBe("September");
    });

    it("formats time ranges with capitalized French date parts", () => {
      const start = new Date("2026-09-08T09:00:00.000Z");
      const end = new Date("2026-09-08T11:00:00.000Z");

      const formattedFr = formatTimeRange(start, end, "fr");
      expect(formattedFr).toContain("Sept.");
      expect(formattedFr).toContain("Mar.");
    });
  });
});
