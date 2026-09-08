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

  it("returns classes for admin users (empty in roguelike schema)", async () => {
    const mockDb = {} as Database;
    const results = await getClassesForUser(mockDb, mockAdmin);
    expect(results).toHaveLength(0);
  });

  it("returns classes for instructors (empty in roguelike schema)", async () => {
    const mockDb = {} as Database;
    const results = await getClassesForUser(mockDb, mockInstructor);
    expect(results).toHaveLength(0);
  });

  it("returns classes for students (empty in roguelike schema)", async () => {
    const mockDb = {} as Database;
    const results = await getClassesForUser(mockDb, mockStudent);
    expect(results).toHaveLength(0);
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
