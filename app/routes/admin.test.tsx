import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import AdminManagement, { meta, loader, action } from "./admin";
import * as sessionServer from "~/utils/session.server";
import * as cohortService from "~/services/cohortService";
import * as userService from "~/services/userService";
import * as assessmentService from "~/services/assessmentService";

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
      vi.spyOn(sessionServer, "authGuard").mockResolvedValue({
        session: {
          userId: "admin-1",
          role: "admin",
          issuedAt: Date.now(),
          expiresAt: Date.now() + 10000,
        },
        actorUserId: "admin-1",
        db: null,
        user: {
          id: "admin-1",
          firstName: "",
          lastName: "",
          displayName: null,
          githubId: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          affiliations: [],
        },
      });

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

    it("returns active admin user, students, schools, and cohorts when authorized", async () => {
      vi.spyOn(sessionServer, "authGuard").mockResolvedValue({
        session: {
          userId: "admin-1",
          role: "admin",
          issuedAt: Date.now(),
          expiresAt: Date.now() + 10000,
        },
        actorUserId: "admin-1",
        db: null,
        user: {
          id: "admin-1",
          firstName: "System",
          lastName: "ADMIN",
          displayName: "System Admin",
          githubId: "admin",
          createdAt: new Date(),
          updatedAt: new Date(),
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
              institution: {
                id: "inst-1",
                name: "Aptitek",
                slug: "aptitek",
                type: "academic",
                logoUrl: "/aptitek-logo.svg",
                createdAt: new Date(),
                updatedAt: new Date(),
              },
              cohort: null,
            },
          ],
        },
      });

      const request = new Request("http://localhost:3000/admin");
      const args = {
        request,
        context: {},
        params: {},
      } as unknown as Parameters<typeof loader>[0];

      const result = (await loader(args)) as {
        user: { name: string; role: string };
        students: unknown[];
        totalStudents: number;
        instructors: unknown[];
        totalInstructors: number;
        schools: unknown[];
        cohorts: unknown[];
      };

      expect(result.user.role).toBe("admin");
      expect(result.students.length).toBeGreaterThan(0);
      expect(result.totalStudents).toBe(result.students.length);
      expect(result.instructors.length).toBeGreaterThan(0);
      expect(result.totalInstructors).toBe(result.instructors.length);
      expect(result.schools.length).toBeGreaterThan(0);
      expect(result.cohorts.length).toBeGreaterThan(0);
    });
  });

  describe("action", () => {
    it("handles add-cohort intent correctly", async () => {
      const mockDb = {} as never;
      vi.spyOn(sessionServer, "authGuard").mockResolvedValue({
        session: {
          userId: "admin-1",
          role: "admin",
          issuedAt: Date.now(),
          expiresAt: Date.now() + 10000,
        },
        actorUserId: "admin-1",
        db: mockDb,
        user: {
          id: "admin-1",
          firstName: "Admin",
          lastName: "USER",
          displayName: "Admin User",
          githubId: "admin",
          createdAt: new Date(),
          updatedAt: new Date(),
          affiliations: [],
        },
      });

      const addSpy = vi
        .spyOn(cohortService, "addStudentToCohort")
        .mockResolvedValue({} as never);

      const formData = new FormData();
      formData.append("intent", "add-cohort");
      formData.append("studentId", "std-123");
      formData.append("cohortId", "cohort-2026");

      const request = new Request("http://localhost:3000/admin", {
        method: "POST",
        body: formData,
      });

      const args = {
        request,
        context: {},
        params: {},
      } as unknown as Parameters<typeof action>[0];

      const res = await action(args);
      expect(res).toEqual({ success: true });
      expect(addSpy).toHaveBeenCalledWith(mockDb, {
        userId: "std-123",
        cohortId: "cohort-2026",
        actorUserId: "admin-1",
      });
    });

    it("handles remove-cohort intent correctly", async () => {
      const mockDb = {} as never;
      vi.spyOn(sessionServer, "authGuard").mockResolvedValue({
        session: {
          userId: "admin-1",
          role: "admin",
          issuedAt: Date.now(),
          expiresAt: Date.now() + 10000,
        },
        actorUserId: "admin-1",
        db: mockDb,
        user: {
          id: "admin-1",
          firstName: "Admin",
          lastName: "USER",
          displayName: "Admin User",
          githubId: "admin",
          createdAt: new Date(),
          updatedAt: new Date(),
          affiliations: [],
        },
      });

      const removeSpy = vi
        .spyOn(cohortService, "removeStudentFromCohort")
        .mockResolvedValue({ success: true, count: 1 } as never);

      const formData = new FormData();
      formData.append("intent", "remove-cohort");
      formData.append("studentId", "std-123");
      formData.append("cohortId", "cohort-2026");

      const request = new Request("http://localhost:3000/admin", {
        method: "POST",
        body: formData,
      });

      const args = {
        request,
        context: {},
        params: {},
      } as unknown as Parameters<typeof action>[0];

      const res = await action(args);
      expect(res).toEqual({ success: true });
      expect(removeSpy).toHaveBeenCalledWith(mockDb, {
        userId: "std-123",
        cohortId: "cohort-2026",
        actorUserId: "admin-1",
      });
    });

    it("handles delete-user intent correctly and preserves audit information", async () => {
      const mockDb = {} as never;
      vi.spyOn(sessionServer, "authGuard").mockResolvedValue({
        session: {
          userId: "admin-1",
          role: "admin",
          issuedAt: Date.now(),
          expiresAt: Date.now() + 10000,
        },
        actorUserId: "admin-1",
        db: mockDb,
        user: {
          id: "admin-1",
          firstName: "Admin",
          lastName: "USER",
          displayName: "Admin User",
          githubId: "admin",
          createdAt: new Date(),
          updatedAt: new Date(),
          affiliations: [],
        },
      });

      const userLookupSpy = vi
        .spyOn(userService, "getUserWithAffiliations")
        .mockResolvedValue({
          id: "std-123",
          firstName: "John",
          lastName: "DOE",
          displayName: "John DOE",
          githubId: "johndoe",
          createdAt: new Date(),
          updatedAt: new Date(),
          affiliations: [
            {
              id: "aff-1",
              userId: "std-123",
              institutionId: "school-1",
              cohortId: "cohort-2026",
              email: "john.doe@aptitek.io",
              role: "student",
              isActive: true,
              createdAt: new Date(),
              updatedAt: new Date(),
              institution: {
                id: "school-1",
                name: "Aptitek",
                slug: "aptitek",
                type: "academic",
                logoUrl: "/logo.svg",
                createdAt: new Date(),
                updatedAt: new Date(),
              },
              cohort: {
                id: "cohort-2026",
                name: "Cohort 2026",
                institutionId: "school-1",
                description: null,
                startDate: new Date(),
                endDate: null,
                createdAt: new Date(),
                updatedAt: new Date(),
              },
            },
          ],
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

      const request = new Request("http://localhost:3000/admin", {
        method: "POST",
        body: formData,
      });

      const args = {
        request,
        context: {},
        params: {},
      } as unknown as Parameters<typeof action>[0];

      const res = await action(args);
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
