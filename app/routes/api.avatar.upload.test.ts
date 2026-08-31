import { describe, it, expect, vi } from "vitest";
import { action } from "./api.avatar.upload";

function makeActionArgs(request: Request, customContext: unknown = {}) {
  return {
    request,
    params: {},
    context: customContext,
    url: new URL(request.url),
    pattern: "",
  } as unknown as Parameters<typeof action>[0];
}

describe("API Avatar Upload Route", () => {
  it("rejects non-POST HTTP methods with 405", async () => {
    const request = new Request("http://localhost/api/avatar/upload", {
      method: "GET",
    });

    const response = await action(makeActionArgs(request));

    expect(response.status).toBe(405);
    const payload = (await response.json()) as { error: string };
    expect(payload.error).toContain("Method not allowed");
  });

  it("returns 400 when file is missing from formData", async () => {
    const formData = new FormData();
    const request = new Request("http://localhost/api/avatar/upload", {
      method: "POST",
      body: formData,
    });

    const response = await action(makeActionArgs(request));

    expect(response.status).toBe(400);
    const payload = (await response.json()) as { error: string };
    expect(payload.error).toContain("Missing or invalid 'file'");
  });

  it("returns 400 when file has unsupported mime type", async () => {
    const formData = new FormData();
    const badFile = new File(["some script"], "payload.sh", {
      type: "application/x-sh",
    });
    formData.append("file", badFile);

    const request = new Request("http://localhost/api/avatar/upload", {
      method: "POST",
      body: formData,
    });

    const response = await action(makeActionArgs(request));

    expect(response.status).toBe(400);
    const payload = (await response.json()) as { error: string };
    expect(payload.error).toContain("Unsupported image format");
  });

  it("processes valid image file upload in local fallback mode", async () => {
    const formData = new FormData();
    const validImageFile = new File(["fake-image-bytes"], "user-avatar.webp", {
      type: "image/webp",
    });
    formData.append("file", validImageFile);

    const request = new Request("http://localhost/api/avatar/upload", {
      method: "POST",
      body: formData,
    });

    const response = await action(makeActionArgs(request));

    expect(response.status).toBe(200);
    const payload = (await response.json()) as {
      success: boolean;
      url: string;
      fileName: string;
      fallbackMode: boolean;
    };

    expect(payload.success).toBe(true);
    expect(payload.url.startsWith("data:image/webp;base64,")).toBe(true);
    expect(payload.fileName).toBe("user-avatar.webp");
    expect(payload.fallbackMode).toBe(true);
  });

  it("puts WebP image into Cloudflare R2 bucket when R2 binding is provided", async () => {
    const mockPut = vi.fn().mockResolvedValue({});
    const mockR2Bucket = {
      put: mockPut,
    };

    const formData = new FormData();
    const validImageFile = new File(["avatar-pixels"], "portrait.webp", {
      type: "image/webp",
    });
    formData.append("file", validImageFile);

    const request = new Request("http://localhost/api/avatar/upload", {
      method: "POST",
      body: formData,
    });

    const response = await action(
      makeActionArgs(request, {
        cloudflare: {
          env: {
            AVATARS_BUCKET: mockR2Bucket,
            R2_PUBLIC_URL: "https://cdn.aptispace.academy",
          },
        },
      }),
    );

    expect(response.status).toBe(200);
    const payload = (await response.json()) as {
      success: boolean;
      url: string;
      storageKey: string;
    };

    expect(payload.success).toBe(true);
    expect(mockPut).toHaveBeenCalledTimes(1);
    expect(
      payload.url.startsWith("https://cdn.aptispace.academy/avatars/avatar-"),
    ).toBe(true);
  });

  it("rejects files exceeding 2MB limit", async () => {
    const formData = new FormData();
    const hugeBuffer = new Uint8Array(3 * 1024 * 1024);
    const bigFile = new File([hugeBuffer], "huge-avatar.webp", {
      type: "image/webp",
    });
    formData.append("file", bigFile);

    const request = new Request("http://localhost/api/avatar/upload", {
      method: "POST",
      body: formData,
    });

    const response = await action(makeActionArgs(request));

    expect(response.status).toBe(400);
    const payload = (await response.json()) as {
      error: string;
      errorCode: string;
    };
    expect(payload.errorCode).toBe("FILE_TOO_LARGE");
  });
});
