import { describe, it, expect, vi } from "vitest";
import {
  getClassesForUser,
  getEligibleInstructors,
  getUserByCalendarFeedToken,
} from "./classService";
import type { Database } from "../db/index";

describe("classService", () => {
  const mockAdmin = {
    id: "user-admin-1",
    role: "admin" as const,
    name: "Admin User",
    email: "admin@aptitek.io",
  };

  const mockInstructor = {
    id: "user-instructor-1",
    role: "instructor" as const,
    name: "Prof Alex",
    email: "alex@aptitek.io",
  };

  const mockStudent = {
    id: "user-student-1",
    role: "student" as const,
    name: "Cadet Elena",
    email: "elena@aptitek.io",
    cohort: { id: "cohort-1" },
    cohortId: "cohort-1",
  };

  const mockClass1 = {
    id: "class-1",
    sessionId: "session-1",
    instructorId: "user-instructor-1",
    title: "Distributed Systems",
    isRemote: false,
    startTime: new Date("2026-09-07T09:00:00Z"),
    endTime: new Date("2026-09-07T11:30:00Z"),
    location: "Amphitheater Turing",
    session: {
      id: "session-1",
      courseId: "course-1",
      cohortId: "cohort-1",
      course: {
        id: "course-1",
        title: "Fullstack Architecture",
        description: null,
      },
      cohort: { id: "cohort-1", diploma: "M", year: 1, description: null },
    },
    instructor: {
      id: "user-instructor-1",
      firstName: "Alex",
      lastName: "Mercer",
      displayName: "Alex Mercer",
      githubEmail: "alex@aptitek.io",
      avatarUrl: null,
    },
  };

  const mockClass2 = {
    id: "class-2",
    sessionId: "session-2",
    instructorId: "user-admin-1",
    title: "Executive Architecture",
    isRemote: true,
    startTime: new Date("2026-09-08T14:00:00Z"),
    endTime: new Date("2026-09-08T16:00:00Z"),
    location: "Studio Ada",
    session: {
      id: "session-2",
      courseId: "course-2",
      cohortId: "cohort-2",
      course: { id: "course-2", title: "Leadership", description: null },
      cohort: { id: "cohort-2", diploma: "M", year: 2, description: null },
    },
    instructor: {
      id: "user-admin-1",
      firstName: "Sarah",
      lastName: "Connor",
      displayName: "Sarah Connor",
      githubEmail: "admin@aptitek.io",
      avatarUrl: null,
    },
  };

  it("returns all classes for admin users", async () => {
    const mockDb = {
      query: {
        classes: {
          findMany: vi.fn().mockResolvedValue([mockClass1, mockClass2]),
        },
      },
      select: vi.fn().mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([
            {
              userId: "user-instructor-1",
              email: "alex@aptitek.io",
              role: "instructor",
            },
            {
              userId: "user-admin-1",
              email: "admin@aptitek.io",
              role: "admin",
            },
          ]),
        }),
      }),
    };

    const results = await getClassesForUser(
      mockDb as unknown as Database,
      mockAdmin,
    );
    expect(results).toHaveLength(2);
    expect(results[0].title).toBe("Distributed Systems");
    expect(results[1].title).toBe("Executive Architecture");
  });

  it("returns only assigned classes for instructors", async () => {
    const mockDb = {
      query: {
        classes: {
          findMany: vi.fn().mockResolvedValue([mockClass1]),
        },
      },
      select: vi.fn().mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([
            {
              userId: "user-instructor-1",
              email: "alex@aptitek.io",
              role: "instructor",
            },
          ]),
        }),
      }),
    };

    const results = await getClassesForUser(
      mockDb as unknown as Database,
      mockInstructor,
    );
    expect(results).toHaveLength(1);
    expect(results[0].instructorId).toBe("user-instructor-1");
  });

  it("returns only cohort classes for students", async () => {
    const mockDb = {
      select: vi.fn().mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([{ id: "session-1" }]),
        }),
      }),
      query: {
        classes: {
          findMany: vi.fn().mockResolvedValue([mockClass1]),
        },
      },
    };

    const results = await getClassesForUser(
      mockDb as unknown as Database,
      mockStudent,
    );
    expect(results).toHaveLength(1);
    expect(results[0].session.cohortId).toBe("cohort-1");
  });

  it("filters eligible instructors to admin and instructor roles", async () => {
    const mockDb = {
      select: vi.fn().mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi
            .fn()
            .mockResolvedValueOnce([
              { userId: "u-1", email: "admin@aptitek.io", role: "admin" },
              { userId: "u-2", email: "prof@aptitek.io", role: "instructor" },
            ])
            .mockResolvedValueOnce([
              {
                id: "u-1",
                firstName: "Sarah",
                lastName: "Connor",
                displayName: "Sarah",
                githubEmail: "admin@aptitek.io",
              },
              {
                id: "u-2",
                firstName: "Alex",
                lastName: "Mercer",
                displayName: "Alex",
                githubEmail: "prof@aptitek.io",
              },
            ]),
        }),
      }),
    };

    const instructors = await getEligibleInstructors(
      mockDb as unknown as Database,
    );
    expect(instructors).toHaveLength(2);
    expect(instructors[0].role).toBe("admin");
    expect(instructors[1].role).toBe("instructor");
  });

  it("resolves user by calendar feed token", async () => {
    const mockDb = {
      select: vi.fn().mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi
              .fn()
              .mockResolvedValueOnce([
                {
                  id: "u-1",
                  firstName: "Alex",
                  lastName: "Mercer",
                  calendarFeedToken: "valid-token-123",
                },
              ])
              .mockResolvedValueOnce([{ role: "instructor", cohortId: null }]),
          }),
        }),
      }),
    };

    const user = await getUserByCalendarFeedToken(
      mockDb as unknown as Database,
      "valid-token-123",
    );
    expect(user).not.toBeNull();
    expect(user?.id).toBe("u-1");
    expect(user?.role).toBe("instructor");
  });

  it("returns null for invalid or empty feed token", async () => {
    const mockDb = {} as unknown as Database;
    const user = await getUserByCalendarFeedToken(mockDb, "");
    expect(user).toBeNull();
  });
});
