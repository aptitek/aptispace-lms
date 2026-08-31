import { describe, it, expect, vi, beforeEach } from "vitest";
import { loader } from "./api.health";
import type { D1Database, R2Bucket } from "@cloudflare/workers-types";

function createMockD1Database(shouldFail = false): D1Database {
  return {
    prepare: vi.fn(() => ({
      bind: vi.fn().mockReturnThis(),
      first: vi.fn().mockImplementation(async () => {
        if (shouldFail) throw new Error("SQLite query failed");
        return { 1: 1 };
      }),
      run: vi.fn().mockImplementation(async () => {
        if (shouldFail) throw new Error("SQLite query failed");
        return { success: true, meta: { duration: 1 } };
      }),
      all: vi.fn().mockImplementation(async () => {
        if (shouldFail) throw new Error("SQLite query failed");
        return { results: [{ 1: 1 }], success: true };
      }),
      raw: vi.fn().mockImplementation(async () => {
        if (shouldFail) throw new Error("SQLite query failed");
        return [[1]];
      }),
    })),
    dump: vi.fn(),
    batch: vi.fn(),
    exec: vi.fn().mockResolvedValue({ count: 1, duration: 1 }),
  } as unknown as D1Database;
}

describe("API Health Route (/api/health)", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  function createLoaderArgs(context: unknown = {}) {
    const request = new Request("http://localhost:3000/api/health");
    return {
      request,
      context,
      params: {},
    } as unknown as Parameters<typeof loader>[0];
  }

  it("returns 200 with nominal status when D1 and R2 are healthy", async () => {
    const mockD1 = createMockD1Database();

    const mockR2 = {
      list: vi.fn().mockResolvedValue({ objects: [], truncated: false }),
    } as unknown as R2Bucket;

    const context = {
      cloudflare: {
        env: {
          DB: mockD1,
          AVATARS_BUCKET: mockR2,
        },
      },
    };

    const response = await loader(createLoaderArgs(context));
    expect(response.status).toBe(200);

    const body = (await response.json()) as {
      status: string;
      timestamp: string;
      services: {
        d1: { name: string; status: string; latencyMs: number };
        r2: { name: string; status: string; latencyMs: number };
      };
    };

    expect(body.status).toBe("nominal");
    expect(body.services.d1.status).toBe("nominal");
    expect(body.services.d1.latencyMs).toBeGreaterThanOrEqual(1);
    expect(body.services.r2.status).toBe("nominal");
    expect(body.services.r2.latencyMs).toBeGreaterThanOrEqual(1);
  });

  it("returns 503 when D1 database binding is missing", async () => {
    const mockR2 = {
      list: vi.fn().mockResolvedValue({ objects: [], truncated: false }),
    } as unknown as R2Bucket;

    const context = {
      cloudflare: {
        env: {
          AVATARS_BUCKET: mockR2,
        },
      },
    };

    const response = await loader(createLoaderArgs(context));
    expect(response.status).toBe(503);

    const body = (await response.json()) as {
      status: string;
      services: {
        d1: { status: string; error?: string };
        r2: { status: string };
      };
    };

    expect(body.status).toBe("offline");
    expect(body.services.d1.status).toBe("offline");
    expect(body.services.d1.error).toContain("D1 database binding unavailable");
    expect(body.services.r2.status).toBe("nominal");
  });

  it("returns 503 when R2 bucket binding is missing", async () => {
    const mockD1 = createMockD1Database();

    const context = {
      cloudflare: {
        env: {
          DB: mockD1,
        },
      },
    };

    const response = await loader(createLoaderArgs(context));
    expect(response.status).toBe(503);

    const body = (await response.json()) as {
      status: string;
      services: {
        d1: { status: string };
        r2: { status: string; error?: string };
      };
    };

    expect(body.status).toBe("offline");
    expect(body.services.d1.status).toBe("nominal");
    expect(body.services.r2.status).toBe("offline");
    expect(body.services.r2.error).toContain("R2 bucket binding unavailable");
  });

  it("returns critical status when D1 query throws an error", async () => {
    const mockD1 = createMockD1Database(true);

    const mockR2 = {
      list: vi.fn().mockResolvedValue({ objects: [] }),
    } as unknown as R2Bucket;

    const context = {
      cloudflare: {
        env: {
          DB: mockD1,
          AVATARS_BUCKET: mockR2,
        },
      },
    };

    const response = await loader(createLoaderArgs(context));
    expect(response.status).toBe(503);

    const body = (await response.json()) as {
      status: string;
      services: {
        d1: { status: string; error?: string };
      };
    };

    expect(body.status).toBe("critical");
    expect(body.services.d1.status).toBe("critical");
    expect(body.services.d1.error).toContain("SELECT 1 as ping");
  });
});
