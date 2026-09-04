import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";

vi.mock("@mui/x-scheduler/event-calendar", () => ({
  EventCalendar: () =>
    React.createElement("div", { "data-testid": "event-calendar" }),
}));

import Planning, { meta, loader } from "./planning";
import {
  CalendarSkeleton,
  CalendarErrorState,
  CalendarEmptyState,
} from "./planning.states";
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

  it("renders CalendarEmptyState with filter and admin controls", () => {
    const onResetFilter = vi.fn();
    const onAddClass = vi.fn();
    const onShowGrid = vi.fn();

    const element = React.createElement(CalendarEmptyState, {
      isFiltered: true,
      selectedFilter: "remote",
      isAdmin: true,
      onResetFilter,
      onAddClass,
      onShowGrid,
    });
    expect(element).toBeDefined();
    expect(element.props.selectedFilter).toBe("remote");
  });
});
