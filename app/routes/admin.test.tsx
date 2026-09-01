import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import AdminManagement, { meta, loader } from "./admin";
import * as sessionServer from "~/utils/session.server";

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

    it("returns active admin user and students when authorized", async () => {
      vi.spyOn(sessionServer, "authGuard").mockResolvedValue({
        session: {
          userId: "admin-1",
          role: "admin",
          issuedAt: Date.now(),
          expiresAt: Date.now() + 10000,
        },
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
        user: { id: string; role: string };
        students: unknown[];
        totalStudents: number;
      };

      expect(result.user).toBeDefined();
      expect(result.user.role).toBe("admin");
      expect(result.students.length).toBeGreaterThan(0);
      expect(result.totalStudents).toBe(result.students.length);
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
