import { describe, it, expect, vi, beforeEach } from "vitest";
import { loader, action } from "./api.dev.personas";
import * as sessionServer from "~/utils/session.server";
import * as userService from "~/services/userService";
import * as dbModule from "~/db";
import * as apiUsersModule from "./api.users";

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

describe("API Dev Personas Endpoint (/api/dev/personas)", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("GET /api/dev/personas returns 403 in production if not admin", async () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = "production";

    try {
      vi.spyOn(sessionServer, "getSession").mockResolvedValue(null);

      const request = new Request("http://localhost/api/dev/personas");
      const res = await loader(makeLoaderArgs(request));
      expect(res.status).toBe(403);
      const data = (await res.json()) as { error: string };
      expect(data.error).toContain("Forbidden");
    } finally {
      process.env.NODE_ENV = originalEnv;
    }
  });

  it("GET /api/dev/personas returns empty list if db is not bound", async () => {
    vi.spyOn(sessionServer, "getSession").mockResolvedValue(null);
    vi.spyOn(dbModule, "getDatabaseFromContext").mockReturnValue(null as never);

    const request = new Request("http://localhost/api/dev/personas");
    const res = await loader(makeLoaderArgs(request));
    expect(res.status).toBe(200);

    const data = (await res.json()) as { personas: unknown[]; total: number };
    expect(data.personas).toEqual([]);
    expect(data.total).toBe(0);
  });

  it("GET /api/dev/personas returns formatted accounts from database in dev mode", async () => {
    const mockDb = {} as never;
    vi.spyOn(sessionServer, "getSession").mockResolvedValue(null);
    vi.spyOn(dbModule, "getDatabaseFromContext").mockReturnValue(mockDb);

    vi.spyOn(userService, "getAllUsersWithAffiliations").mockResolvedValue([
      {
        id: "student-1",
        firstName: "Ada",
        lastName: "LOVELACE",
        displayName: "Ada LOVELACE",
        avatarUrl: null,
        githubId: "ada",
        githubEmail: "ada@aptitek.io",
        createdAt: new Date(),
        updatedAt: new Date(),
        affiliations: [
          {
            id: "aff-1",
            userId: "student-1",
            institutionId: "inst-1",
            cohortId: "cohort-1",
            email: "ada@aptitek.io",
            role: "student",
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          } as never,
        ],
      },
    ]);

    const request = new Request("http://localhost/api/dev/personas");
    const res = await loader(makeLoaderArgs(request));
    expect(res.status).toBe(200);

    const data = (await res.json()) as {
      accounts: Array<{ id: string; name: string; role: string }>;
      personas: Array<{ id: string; name: string }>;
      total: number;
    };
    expect(data.total).toBe(1);
    expect(data.accounts[0].name).toBe("Ada LOVELACE");
    expect(data.personas[0].id).toBe("student-1");
  });

  it("POST /api/dev/personas rejects non-POST methods with 405", async () => {
    const request = new Request("http://localhost/api/dev/personas", {
      method: "GET",
    });
    const res = await action(makeActionArgs(request));
    expect(res.status).toBe(405);
  });

  it("POST /api/dev/personas returns 403 in production if not admin", async () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = "production";

    try {
      vi.spyOn(sessionServer, "getSession").mockResolvedValue(null);

      const request = new Request("http://localhost/api/dev/personas", {
        method: "POST",
      });
      const res = await action(makeActionArgs(request));
      expect(res.status).toBe(403);
    } finally {
      process.env.NODE_ENV = originalEnv;
    }
  });

  it("POST /api/dev/personas delegates to handleCreateUser and returns 201", async () => {
    const mockDb = {} as never;
    vi.spyOn(sessionServer, "getSession").mockResolvedValue(null);
    vi.spyOn(dbModule, "getDatabaseFromContext").mockReturnValue(mockDb);

    const mockAccount = {
      id: "new-user-1",
      name: "New Student",
      role: "student" as const,
      email: "new@aptitek.io",
      badge: "Student",
      title: "Student",
      isProfileComplete: false,
    };

    vi.spyOn(apiUsersModule, "handleCreateUser").mockResolvedValue(
      Response.json(
        { success: true, account: mockAccount, user: mockAccount },
        { status: 201 },
      ),
    );

    const request = new Request("http://localhost/api/dev/personas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: "student" }),
    });

    const res = await action(makeActionArgs(request));
    expect(res.status).toBe(201);
    const data = (await res.json()) as {
      success: boolean;
      account: typeof mockAccount;
    };
    expect(data.success).toBe(true);
    expect(data.account.id).toBe("new-user-1");
  });
});
