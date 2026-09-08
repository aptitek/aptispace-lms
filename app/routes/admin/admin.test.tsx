import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import AdminManagement, { meta, loader, action } from "./admin";
import * as sessionServer from "~/utils/session.server";
import * as cohortService from "~/services/cohortService";
import * as userService from "~/services/userService";
import * as assessmentService from "~/services/assessmentService";

function mockAuthGuard({
  db = null,
  firstName = "Admin",
  lastName = "USER",
  impersonating = false,
  originalUserId,
  affiliations = [],
}: {
  db?: unknown;
  firstName?: string;
  lastName?: string;
  impersonating?: boolean;
  originalUserId?: string;
  affiliations?: unknown[];
} = {}) {
  return vi.spyOn(sessionServer, "authGuard").mockResolvedValue({
    session: {
      userId: "admin-1",
      role: "admin",
      issuedAt: Date.now(),
      expiresAt: Date.now() + 10000,
      ...(impersonating ? { impersonating: true, originalUserId } : {}),
    },
    actorUserId: "admin-1",
    db: db as never,
    user: {
      id: "admin-1",
      firstName,
      lastName,
      displayName: `${firstName} ${lastName}`.trim(),
      avatarUrl: null,
      githubId: "admin",
      githubEmail: "admin@aptitek.io",
      calendarFeedToken: null,
      isOnline: false,
      lastSeenAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      affiliations: affiliations as never,
    },
  });
}

function createActionArgs(formData: FormData) {
  const request = new Request("http://localhost:3000/admin", {
    method: "POST",
    body: formData,
  });
  return {
    request,
    context: {},
    params: {},
  } as unknown as Parameters<typeof action>[0];
}

describe("Admin Route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("meta", () => {
    it("returns correct metadata", () => {
      const metaTags = meta({} as never);
      expect(metaTags).toEqual([
        { title: "AptiSpace LMS • Admin Management" },
        {
          name: "description",
          content:
            "Administrative dashboard for student roster management, credentials, and institutional oversight.",
        },
      ]);
    });
  });

  describe("loader", () => {
    it("redirects to onboarding if profile is incomplete", async () => {
      mockAuthGuard({ firstName: "", lastName: "" });

      const request = new Request("http://localhost:3000/admin");
      const args = {
        request,
        context: {},
        params: {},
      } as unknown as Parameters<typeof loader>[0];

      let errorResponse: Response | null = null;
      try {
        await loader(args);
      } catch (err: unknown) {
        errorResponse = err as Response;
      }

      expect(errorResponse).not.toBeNull();
      expect(errorResponse?.status).toBe(302);
      expect(errorResponse?.headers.get("Location")).toBe("/onboarding");
    });

    it("returns active admin user, students, schools, and cohorts from database", async () => {
      const mockDb = {} as never;
      const mockInst = {
        id: "inst-1",
        name: "Aptitek",
        slug: "aptitek",
        type: "academic" as const,
        logoUrl: "/aptitek-logo.svg",
        emailDomain: "aptitek.io",
        usernamePattern: "{first}.{last}",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const mockCohort = {
        id: "cohort-1",
        name: "M1-IA-Dev",
        institutionId: "inst-1",
        diploma: "M",
        year: 1,
        tags: ["IA"],
        description: "Master 1",
        startDate: new Date("2026-09-01"),
        endDate: new Date("2027-06-30"),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.spyOn(userService, "getAllUsersWithAffiliations").mockResolvedValue([
        {
          id: "student-1",
          firstName: "Jean",
          lastName: "DUPONT",
          displayName: "Jean Dupont",
          avatarUrl: null,
          githubId: "jdupont",
          githubEmail: "jean.dupont@aptitek.io",
          calendarFeedToken: null,
          isOnline: false,
          lastSeenAt: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          affiliations: [
            {
              id: "affil-student-1",
              userId: "student-1",
              institutionId: "inst-1",
              cohortId: "cohort-1",
              email: "jean.dupont@aptitek.io",
              role: "student",
              isActive: true,
              createdAt: new Date(),
              updatedAt: new Date(),
              institution: mockInst,
              cohort: mockCohort,
            },
          ],
        },
      ]);
      vi.spyOn(cohortService, "getAllInstitutions").mockResolvedValue([
        mockInst,
      ]);
      vi.spyOn(cohortService, "getAllCohorts").mockResolvedValue([mockCohort]);

      mockAuthGuard({
        db: mockDb,
        firstName: "System",
        lastName: "ADMIN",
        affiliations: [
          {
            id: "affil-1",
            userId: "admin-1",
            institutionId: "inst-1",
            cohortId: null,
            email: "admin@aptitek.io",
            role: "admin",
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
            institution: mockInst,
            cohort: null,
          },
        ],
      });

      const request = new Request("http://localhost:3000/admin");
      const args = {
        request,
        context: {},
        params: {},
      } as unknown as Parameters<typeof loader>[0];

      const result = (await loader(args)) as {
        user: { name: string; role: string };
        users: unknown[];
        totalUsers: number;
        schools: unknown[];
        cohorts: unknown[];
      };

      expect(result.user.role).toBe("admin");
      expect(result.users).toHaveLength(1);
      expect(result.totalUsers).toBe(1);
      expect(result.schools).toHaveLength(1);
      expect(result.cohorts).toHaveLength(1);
    });

    it("returns empty arrays when database is null (no fallback mocks)", async () => {
      mockAuthGuard({ db: null });

      const request = new Request("http://localhost:3000/admin");
      const args = {
        request,
        context: {},
        params: {},
      } as unknown as Parameters<typeof loader>[0];

      const result = (await loader(args)) as {
        users: unknown[];
        schools: unknown[];
        cohorts: unknown[];
      };

      expect(result.users).toEqual([]);
      expect(result.schools).toEqual([]);
      expect(result.cohorts).toEqual([]);
    });
  });

  describe("action", () => {
    it("handles add-cohort intent correctly", async () => {
      const mockDb = {} as never;
      mockAuthGuard({ db: mockDb });

      const addSpy = vi
        .spyOn(cohortService, "addStudentToCohort")
        .mockResolvedValue({} as never);

      const formData = new FormData();
      formData.append("intent", "add-cohort");
      formData.append("studentId", "std-123");
      formData.append("cohortId", "cohort-2026");

      const res = await action(createActionArgs(formData));
      expect(res).toEqual({ success: true });
      expect(addSpy).toHaveBeenCalledWith(mockDb, {
        userId: "std-123",
        cohortId: "cohort-2026",
        actorUserId: "admin-1",
      });
    });

    it("handles remove-cohort intent correctly", async () => {
      const mockDb = {} as never;
      mockAuthGuard({ db: mockDb });

      const removeSpy = vi
        .spyOn(cohortService, "removeStudentFromCohort")
        .mockResolvedValue({ success: true, count: 1 } as never);

      const formData = new FormData();
      formData.append("intent", "remove-cohort");
      formData.append("studentId", "std-123");
      formData.append("cohortId", "cohort-2026");

      const res = await action(createActionArgs(formData));
      expect(res).toEqual({ success: true });
      expect(removeSpy).toHaveBeenCalledWith(mockDb, {
        userId: "std-123",
        cohortId: "cohort-2026",
        actorUserId: "admin-1",
      });
    });

    it("handles update-user intent and updates githubId", async () => {
      const mockDb = {} as never;
      mockAuthGuard({ db: mockDb, firstName: "Admin", lastName: "ONE" });

      const updateSpy = vi.spyOn(userService, "updateUser").mockResolvedValue({
        id: "std-123",
        githubId: "mariecurie-science",
      } as never);

      const formData = new FormData();
      formData.append("intent", "update-user");
      formData.append("studentId", "std-123");
      formData.append("githubId", "mariecurie-science");

      const res = await action(createActionArgs(formData));
      expect(res).toEqual({
        success: true,
        user: { id: "std-123", githubId: "mariecurie-science" },
      });
      expect(updateSpy).toHaveBeenCalledWith(mockDb, "std-123", {
        githubId: "mariecurie-science",
      });
    });

    it("handles delete-user intent correctly and preserves audit information", async () => {
      const mockDb = {} as never;
      mockAuthGuard({
        db: mockDb,
        impersonating: true,
        originalUserId: "super-admin-id",
      });

      const userLookupSpy = vi
        .spyOn(userService, "getUserWithAffiliations")
        .mockResolvedValue({
          id: "std-123",
          firstName: "John",
          lastName: "DOE",
          displayName: "John DOE",
          avatarUrl: null,
          githubId: "johndoe",
          githubEmail: "john.doe@aptitek.io",
          calendarFeedToken: null,
          isOnline: false,
          lastSeenAt: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          affiliations: [],
        });

      const auditSpy = vi
        .spyOn(assessmentService, "logImpersonatedAudit")
        .mockResolvedValue({} as never);

      const deleteSpy = vi
        .spyOn(userService, "deleteUser")
        .mockResolvedValue(true);

      const formData = new FormData();
      formData.append("intent", "delete-user");
      formData.append("studentId", "std-123");

      const res = await action(createActionArgs(formData));
      expect(res).toEqual({ success: true });
      expect(userLookupSpy).toHaveBeenCalledWith(mockDb, "std-123");
      expect(auditSpy).toHaveBeenCalledWith(
        mockDb,
        expect.anything(),
        expect.objectContaining({
          tableName: "users",
          recordId: "std-123",
          action: "DELETE",
          targetUserId: "std-123",
        }),
      );
      expect(deleteSpy).toHaveBeenCalledWith(mockDb, "std-123");
    });
  });

  describe("AdminManagement Component", () => {
    it("exports AdminManagement component", () => {
      expect(AdminManagement).toBeDefined();
      expect(typeof AdminManagement).toBe("function");
    });

    it("creates React element properly", () => {
      const element = React.createElement(AdminManagement);
      expect(element).toBeDefined();
    });
  });
});
