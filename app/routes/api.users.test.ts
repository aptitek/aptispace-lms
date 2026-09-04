import { describe, it, expect, vi, beforeEach } from "vitest";
import { loader, action } from "./api.users";
import * as sessionServer from "~/utils/session.server";
import * as userService from "~/services/userService";

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

describe("API Users Endpoint (/api/users)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("GET /api/users throws forbidden if user is not an admin", async () => {
    const forbiddenResponse = new Response(
      JSON.stringify({ error: "Forbidden", code: "FORBIDDEN" }),
      { status: 403 },
    );
    vi.spyOn(sessionServer, "authGuard").mockRejectedValue(forbiddenResponse);

    const request = new Request("http://localhost/api/users");
    await expect(loader(makeLoaderArgs(request))).rejects.toThrow();
  });

  it("GET /api/users returns list of accounts for authorized admin", async () => {
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
      user: null,
    });

    vi.spyOn(userService, "getAllUsersWithAffiliations").mockResolvedValue([
      {
        id: "u-1",
        firstName: "Neil",
        lastName: "ARMSTRONG",
        displayName: "Neil ARMSTRONG",
        avatarUrl: null,
        githubId: "neil",
        githubEmail: "neil@aptitek.io",
        createdAt: new Date(),
        updatedAt: new Date(),
        affiliations: [
          {
            id: "aff-1",
            userId: "u-1",
            institutionId: "inst-1",
            cohortId: "cohort-1",
            email: "neil@aptitek.io",
            role: "student",
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          } as never,
        ],
      },
    ]);

    const request = new Request("http://localhost/api/users");
    const res = await loader(makeLoaderArgs(request, {}));
    expect(res.status).toBe(200);

    const data = (await res.json()) as {
      accounts: Array<{ id: string; name: string; role: string }>;
    };
    expect(data.accounts).toHaveLength(1);
    expect(data.accounts[0].name).toBe("Neil ARMSTRONG");
    expect(data.accounts[0].role).toBe("student");
  });

  it("POST /api/users rejects non-POST methods with 405", async () => {
    const request = new Request("http://localhost/api/users", {
      method: "PUT",
    });
    const res = await action(makeActionArgs(request));
    expect(res.status).toBe(405);
  });
});
