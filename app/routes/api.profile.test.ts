import { describe, it, expect, vi, beforeEach } from "vitest";
import { loader, action } from "./api.profile";
import * as sessionServer from "~/utils/session.server";

function makeLoaderArgs(request: Request, context: unknown = {}) {
  return {
    request,
    params: {},
    context,
  } as unknown as Parameters<typeof loader>[0];
}

function makeActionArgs(request: Request, context: unknown = {}) {
  return {
    request,
    params: {},
    context,
  } as unknown as Parameters<typeof action>[0];
}

describe("API Profile Endpoint (/api/profile)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("GET /api/profile", () => {
    it("returns active user profile when authenticated", async () => {
      vi.spyOn(sessionServer, "authGuard").mockResolvedValue({
        session: {
          userId: "u-1",
          role: "student",
          issuedAt: Date.now(),
          expiresAt: Date.now() + 10000,
        },
        actorUserId: "u-1",
        db: {} as never,
        user: {
          id: "u-1",
          firstName: "Buzz",
          lastName: "ALDRIN",
          displayName: "Buzz ALDRIN",
          avatarUrl: "/avatars/buzz.webp",
          githubId: "buzz",
          githubEmail: "buzz@aptitek.io",
          createdAt: new Date(),
          updatedAt: new Date(),
          affiliations: [
            {
              id: "aff-1",
              userId: "u-1",
              institutionId: "inst-1",
              cohortId: "cohort-1",
              email: "buzz@aptitek.io",
              role: "student",
              isActive: true,
              createdAt: new Date(),
              updatedAt: new Date(),
            } as never,
          ],
        },
      });

      const request = new Request("http://localhost/api/profile");
      const res = await loader(makeLoaderArgs(request));
      expect(res.status).toBe(200);

      const data = (await res.json()) as { user: { id: string; name: string } };
      expect(data.user.id).toBe("u-1");
      expect(data.user.name).toBe("Buzz ALDRIN");
    });
  });

  describe("PATCH /api/profile", () => {
    it("rejects editing another user profile if not admin", async () => {
      vi.spyOn(sessionServer, "authGuard").mockResolvedValue({
        session: {
          userId: "student-1",
          role: "student",
          impersonating: false,
          issuedAt: Date.now(),
          expiresAt: Date.now() + 10000,
        },
        actorUserId: "student-1",
        db: {} as never,
        user: null,
      });

      const request = new Request("http://localhost/api/profile", {
        method: "PATCH",
        body: JSON.stringify({ userId: "other-user-999", firstName: "Hacked" }),
      });

      const res = await action(makeActionArgs(request));
      expect(res.status).toBe(403);
      const data = (await res.json()) as { error: string };
      expect(data.error).toContain("Forbidden");
    });
  });
});
