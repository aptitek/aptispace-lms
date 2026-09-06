import { describe, it, expect, vi } from "vitest";
import { loader } from "./avatars.$";

function createLoaderArgs(rawKey: string, customContext: unknown = {}) {
  return {
    params: { "*": rawKey },
    context: customContext,
    request: new Request(`http://localhost/avatars/${rawKey}`),
  } as unknown as Parameters<typeof loader>[0];
}

describe("Avatars Serving Route", () => {
  it("returns 404 when key is empty", async () => {
    const response = await loader(createLoaderArgs(""));
    expect(response.status).toBe(404);
  });

  it("returns 404 when R2 bucket is unavailable", async () => {
    const response = await loader(createLoaderArgs("avatar-123.webp"));
    expect(response.status).toBe(404);
  });

  it("serves image object when found in R2 bucket", async () => {
    const mockGet = vi.fn().mockImplementation((key: string) => {
      if (key === "avatars/avatar-123.webp") {
        return {
          body: new ReadableStream(),
          httpEtag: '"mock-etag"',
          httpMetadata: { contentType: "image/webp" },
          writeHttpMetadata: (headers: Headers) => {
            headers.set("Content-Type", "image/webp");
          },
        };
      }
      return null;
    });

    const mockBucket = { get: mockGet };
    const response = await loader(
      createLoaderArgs("avatar-123.webp", {
        cloudflare: { env: { AVATARS_BUCKET: mockBucket } },
      }),
    );

    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toBe("image/webp");
    expect(response.headers.get("Cache-Control")).toContain("immutable");
  });
});
