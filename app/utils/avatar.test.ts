import { describe, it, expect, vi } from "vitest";
import {
  buildGithubAvatarUrl,
  resolveUserAvatarUrl,
  isDefaultGithubAvatarUrl,
  registerDefaultGithubAvatarUrl,
  isDefaultGithubAvatarImage,
} from "./avatar";

describe("Avatar Utilities", () => {
  describe("buildGithubAvatarUrl", () => {
    it("returns undefined for null, undefined, or empty string", () => {
      expect(buildGithubAvatarUrl(null)).toBeUndefined();
      expect(buildGithubAvatarUrl(undefined)).toBeUndefined();
      expect(buildGithubAvatarUrl("")).toBeUndefined();
      expect(buildGithubAvatarUrl("   ")).toBeUndefined();
    });

    it("builds numeric user ID GitHub avatar URLs with /u/ prefix", () => {
      expect(buildGithubAvatarUrl("583231")).toBe(
        "https://avatars.githubusercontent.com/u/583231?v=4",
      );
      expect(buildGithubAvatarUrl("  12345678  ")).toBe(
        "https://avatars.githubusercontent.com/u/12345678?v=4",
      );
    });

    it("builds handle/username GitHub avatar URLs without /u/ prefix", () => {
      expect(buildGithubAvatarUrl("octocat")).toBe(
        "https://avatars.githubusercontent.com/octocat",
      );
      expect(buildGithubAvatarUrl("@admin-sarah")).toBe(
        "https://avatars.githubusercontent.com/admin-sarah",
      );
      expect(buildGithubAvatarUrl("instructor-alex")).toBe(
        "https://avatars.githubusercontent.com/instructor-alex",
      );
    });
  });

  describe("isDefaultGithubAvatarUrl", () => {
    it("identifies known default GitHub avatar URLs", () => {
      expect(
        isDefaultGithubAvatarUrl("https://avatars.githubusercontent.com/u/0"),
      ).toBe(true);
      expect(
        isDefaultGithubAvatarUrl(
          "https://avatars.githubusercontent.com/u/0?v=4",
        ),
      ).toBe(true);
      expect(
        isDefaultGithubAvatarUrl(
          "https://avatars.githubusercontent.com/u/0/?s=40&v=4",
        ),
      ).toBe(true);
      expect(
        isDefaultGithubAvatarUrl(
          "https://github.com/images/modules/logos_page/GitHub-Mark.png",
        ),
      ).toBe(true);
      expect(
        isDefaultGithubAvatarUrl(
          "https://avatars.githubusercontent.com/identicons/cadet.png",
        ),
      ).toBe(true);
    });

    it("returns false for custom user avatars and invalid inputs", () => {
      expect(
        isDefaultGithubAvatarUrl(
          "https://avatars.githubusercontent.com/u/583231?v=4",
        ),
      ).toBe(false);
      expect(
        isDefaultGithubAvatarUrl(
          "https://avatars.githubusercontent.com/octocat",
        ),
      ).toBe(false);
      expect(isDefaultGithubAvatarUrl(null)).toBe(false);
      expect(isDefaultGithubAvatarUrl(undefined)).toBe(false);
      expect(isDefaultGithubAvatarUrl("")).toBe(false);
    });

    it("allows registering dynamic default GitHub avatar URLs", () => {
      const dynamicUrl = "https://avatars.githubusercontent.com/u/999999999";
      expect(isDefaultGithubAvatarUrl(dynamicUrl)).toBe(false);
      registerDefaultGithubAvatarUrl(dynamicUrl);
      expect(isDefaultGithubAvatarUrl(dynamicUrl)).toBe(true);
    });
  });

  describe("isDefaultGithubAvatarImage", () => {
    it("returns false for missing or unrendered images", () => {
      expect(
        isDefaultGithubAvatarImage({
          naturalWidth: 0,
          naturalHeight: 0,
        } as HTMLImageElement),
      ).toBe(false);
    });

    it("returns true immediately if image src is a known default avatar", () => {
      const img = {
        naturalWidth: 420,
        naturalHeight: 420,
        src: "https://avatars.githubusercontent.com/u/0?v=4",
      } as HTMLImageElement;
      expect(isDefaultGithubAvatarImage(img)).toBe(true);
    });

    it("returns false if image dimensions differ from 420x420 default", () => {
      const img = {
        naturalWidth: 200,
        naturalHeight: 200,
        src: "https://example.com/custom.png",
      } as HTMLImageElement;
      expect(isDefaultGithubAvatarImage(img)).toBe(false);
    });

    it("detects GitHub default octocat via canvas pixel sampling", () => {
      const img = {
        naturalWidth: 420,
        naturalHeight: 420,
        src: "https://avatars.githubusercontent.com/u/987654321",
      } as HTMLImageElement;

      const fakeData = new Uint8ClampedArray(16 * 16 * 4);

      // (0, 0): grey corner (#cacaca -> r=202, g=202, b=202, a=255)
      fakeData[0] = 202;
      fakeData[1] = 202;
      fakeData[2] = 202;
      fakeData[3] = 255;

      // (8, 2): white circle (#ffffff -> r=255, g=255, b=255, a=255)
      const whiteIdx = (2 * 16 + 8) * 4;
      fakeData[whiteIdx] = 255;
      fakeData[whiteIdx + 1] = 255;
      fakeData[whiteIdx + 2] = 255;
      fakeData[whiteIdx + 3] = 255;

      // (8, 8): center grey octocat (#cacaca -> r=202, g=202, b=202, a=255)
      const centerIdx = (8 * 16 + 8) * 4;
      fakeData[centerIdx] = 202;
      fakeData[centerIdx + 1] = 202;
      fakeData[centerIdx + 2] = 202;
      fakeData[centerIdx + 3] = 255;

      const fakeCtx = {
        drawImage: vi.fn(),
        getImageData: vi.fn().mockReturnValue({ data: fakeData }),
      };

      const fakeDoc = {
        createElement: (tag: string) => {
          if (tag === "canvas") {
            return {
              getContext: () => fakeCtx,
            };
          }
          return {};
        },
      };

      vi.stubGlobal("document", fakeDoc);

      expect(isDefaultGithubAvatarImage(img)).toBe(true);
      // Once registered, isDefaultGithubAvatarUrl now returns true for this URL
      expect(isDefaultGithubAvatarUrl(img.src)).toBe(true);

      vi.unstubAllGlobals();
    });
  });

  describe("resolveUserAvatarUrl", () => {
    it("prioritizes direct avatarUrl", () => {
      expect(
        resolveUserAvatarUrl({
          avatarUrl: "/avatars/avatar-123.webp",
          affiliationAvatarUrl: "/avatars/affil.webp",
          githubIdOrUsername: "octocat",
        }),
      ).toBe("/avatars/avatar-123.webp");
    });

    it("falls back to affiliationAvatarUrl if avatarUrl is missing", () => {
      expect(
        resolveUserAvatarUrl({
          avatarUrl: null,
          affiliationAvatarUrl: "/avatars/affil.webp",
          githubIdOrUsername: "octocat",
        }),
      ).toBe("/avatars/affil.webp");
    });

    it("falls back to github avatar if both avatarUrl and affiliationAvatarUrl are missing", () => {
      expect(
        resolveUserAvatarUrl({
          avatarUrl: undefined,
          affiliationAvatarUrl: undefined,
          githubIdOrUsername: "admin-sarah",
        }),
      ).toBe("https://avatars.githubusercontent.com/admin-sarah");
    });

    it("skips default GitHub avatar URLs and falls back to fallbackUrl", () => {
      expect(
        resolveUserAvatarUrl({
          avatarUrl: undefined,
          affiliationAvatarUrl: undefined,
          githubIdOrUsername: "0",
          fallbackUrl: "/default-avatar.png",
        }),
      ).toBe("/default-avatar.png");
    });

    it("returns fallbackUrl or undefined if nothing available", () => {
      expect(
        resolveUserAvatarUrl({
          avatarUrl: "",
          fallbackUrl: "/default.png",
        }),
      ).toBe("/default.png");

      expect(resolveUserAvatarUrl({})).toBeUndefined();
    });
  });
});
