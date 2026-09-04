import { describe, it, expect, vi, beforeEach } from "vitest";
import { loader } from "./api.calendar.$token[.]ics";
import * as classService from "~/services/classService";
import * as dbModule from "~/db";

describe("api.calendar.$token[.]ics route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(dbModule, "getDatabaseFromContext").mockReturnValue(
      {} as unknown as dbModule.Database,
    );
  });

  it("returns 401 when token is missing", async () => {
    const request = new Request("http://localhost:3000/api/calendar/");
    const res = await loader({
      request,
      params: {},
      context: {},
    } as unknown as Parameters<typeof loader>[0]);

    expect(res.status).toBe(401);
    const text = await res.text();
    expect(text).toContain("Missing calendar feed token");
  });

  it("returns 401 when token is invalid or revoked", async () => {
    vi.spyOn(classService, "getUserByCalendarFeedToken").mockResolvedValue(
      null,
    );

    const request = new Request(
      "http://localhost:3000/api/calendar/invalid-token.ics",
    );
    const res = await loader({
      request,
      params: { token: "invalid-token" },
      context: {},
    } as unknown as Parameters<typeof loader>[0]);

    expect(res.status).toBe(401);
    const text = await res.text();
    expect(text).toContain("Invalid or revoked");
  });

  it("returns valid RFC 5545 iCalendar when token is valid", async () => {
    const mockUser = {
      id: "user-1",
      firstName: "Alex",
      lastName: "Mercer",
      displayName: "Alex Mercer",
      role: "instructor" as const,
    };

    const mockClass = {
      id: "class-101",
      sessionId: "session-1",
      instructorId: "user-1",
      title: "Cloud Edge Computing",
      isRemote: false,
      startTime: new Date("2026-09-08T10:00:00Z"),
      endTime: new Date("2026-09-08T12:00:00Z"),
      location: "Room Turing",
      description: "Advanced Cloudflare architecture",
      session: {
        id: "session-1",
        courseId: "course-1",
        cohortId: "cohort-1",
        course: {
          id: "course-1",
          title: "Distributed Systems",
          description: null,
        },
        cohort: { id: "cohort-1", diploma: "M", year: 1, description: null },
      },
      instructor: {
        id: "user-1",
        firstName: "Alex",
        lastName: "Mercer",
        displayName: "Alex Mercer",
        email: "alex@aptitek.io",
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    } as unknown as classService.ClassWithDetails;

    vi.spyOn(classService, "getUserByCalendarFeedToken").mockResolvedValue(
      mockUser as unknown as NonNullable<
        Awaited<ReturnType<typeof classService.getUserByCalendarFeedToken>>
      >,
    );
    vi.spyOn(classService, "getClassesForUser").mockResolvedValue([mockClass]);

    const request = new Request(
      "http://localhost:3000/api/calendar/secret-token-123.ics",
    );
    const res = await loader({
      request,
      params: { token: "secret-token-123" },
      context: {},
    } as unknown as Parameters<typeof loader>[0]);

    expect(res.status).toBe(200);
    expect(res.headers.get("Content-Type")).toContain("text/calendar");
    expect(res.headers.get("Content-Disposition")).toContain("inline");

    const icsContent = await res.text();
    const unfoldedIcs = icsContent.replace(/\r?\n[ \t]/g, "");
    expect(unfoldedIcs).toContain("BEGIN:VCALENDAR");
    expect(unfoldedIcs).toContain("BEGIN:VEVENT");
    expect(unfoldedIcs).toContain("SUMMARY:Cloud Edge Computing");
    expect(unfoldedIcs).toContain("Format: In-Person");
    expect(unfoldedIcs).toContain("LOCATION:Room Turing");
    expect(unfoldedIcs).toContain("Alex Mercer");
    expect(unfoldedIcs).toContain("END:VCALENDAR");
  });
});
