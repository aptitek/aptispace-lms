/**
 * Utility functions for building and resolving avatar URLs across GitHub and R2 storage.
 */

export const KNOWN_DEFAULT_GITHUB_AVATARS = new Set<string>([
  "https://avatars.githubusercontent.com/u/0",
  "https://avatars.githubusercontent.com/u/0?v=4",
]);

const DEFAULT_GITHUB_AVATAR_URL_PATTERNS = [
  /^https?:\/\/avatars\.githubusercontent\.com\/u\/0\/?(?:\?.*)?$/i,
  /^https?:\/\/github\.com\/images\/modules\/logos_page\/GitHub-Mark\.png/i,
  /^https?:\/\/(?:avatars\.)?github(?:usercontent)?\.com\/identicons?\//i,
];

export function isDefaultGithubAvatarUrl(url?: string | null): boolean {
  if (!url) return false;
  const trimmed = url.trim();
  if (KNOWN_DEFAULT_GITHUB_AVATARS.has(trimmed)) return true;
  return DEFAULT_GITHUB_AVATAR_URL_PATTERNS.some((pattern) =>
    pattern.test(trimmed),
  );
}

export function registerDefaultGithubAvatarUrl(url: string): void {
  if (url) {
    KNOWN_DEFAULT_GITHUB_AVATARS.add(url.trim());
  }
}

function matchesCornerGrey(pixelArray: Uint8ClampedArray): boolean {
  const r0 = pixelArray[0];
  const g0 = pixelArray[1];
  const b0 = pixelArray[2];
  return (
    Math.abs(r0 - 202) <= 8 &&
    Math.abs(g0 - 202) <= 8 &&
    Math.abs(b0 - 202) <= 8
  );
}

function matchesWhiteCircle(pixelArray: Uint8ClampedArray): boolean {
  const whiteIdx = (2 * 16 + 8) * 4;
  return (
    pixelArray[whiteIdx] >= 245 &&
    pixelArray[whiteIdx + 1] >= 245 &&
    pixelArray[whiteIdx + 2] >= 245
  );
}

function matchesCenterGrey(pixelArray: Uint8ClampedArray): boolean {
  const centerIdx = (8 * 16 + 8) * 4;
  return (
    Math.abs(pixelArray[centerIdx] - 202) <= 12 &&
    Math.abs(pixelArray[centerIdx + 1] - 202) <= 12 &&
    Math.abs(pixelArray[centerIdx + 2] - 202) <= 12
  );
}

function checkCanvasOctocatSignature(img: HTMLImageElement): boolean {
  if (typeof document === "undefined") return false;
  const canvas = document.createElement("canvas");
  canvas.width = 16;
  canvas.height = 16;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return false;

  ctx.drawImage(img, 0, 0, 16, 16);
  const pixelArray = ctx.getImageData(0, 0, 16, 16).data;

  return (
    matchesCornerGrey(pixelArray) &&
    matchesWhiteCircle(pixelArray) &&
    matchesCenterGrey(pixelArray)
  );
}

function hasValidDimensions(img?: HTMLImageElement): boolean {
  if (!img) return false;
  return img.naturalWidth === 420 && img.naturalHeight === 420;
}

function isKnownAvatar(img: HTMLImageElement): boolean {
  if (!img) return false;
  if (isDefaultGithubAvatarUrl(img.src)) return true;
  return Boolean(img.currentSrc && isDefaultGithubAvatarUrl(img.currentSrc));
}

/**
 * Inspects a loaded image element to determine if it is GitHub's default grey octocat on pure white.
 * GitHub serves a 420x420 PNG with a grey outer background (#cacaca / rgb(202,202,202)),
 * a pure white circular inset (#ffffff / rgb(255,255,255)), and a grey octocat silhouette.
 */
export function isDefaultGithubAvatarImage(img: HTMLImageElement): boolean {
  if (isKnownAvatar(img)) {
    return true;
  }

  if (!hasValidDimensions(img)) {
    return false;
  }

  try {
    if (checkCanvasOctocatSignature(img)) {
      if (img.src) {
        registerDefaultGithubAvatarUrl(img.src);
      }
      return true;
    }
  } catch {
    // If canvas is blocked or cross-origin tainted, fail gracefully
  }

  return false;
}

export function buildGithubAvatarUrl(
  githubIdOrUsername?: string | null,
): string | undefined {
  if (!githubIdOrUsername) return undefined;
  const cleaned = githubIdOrUsername.trim().replace(/^@+/, "");
  if (!cleaned) return undefined;

  // Numeric ID: GitHub avatar by user ID
  if (/^\d+$/.test(cleaned)) {
    return `https://avatars.githubusercontent.com/u/${cleaned}?v=4`;
  }

  // Handle / Username: GitHub avatar by username
  return `https://avatars.githubusercontent.com/${cleaned}`;
}

export interface ResolveAvatarUrlOptions {
  avatarUrl?: string | null;
  affiliationAvatarUrl?: string | null;
  githubIdOrUsername?: string | null;
  fallbackUrl?: string;
}

export function resolveUserAvatarUrl(
  options: ResolveAvatarUrlOptions,
): string | undefined {
  const { avatarUrl, affiliationAvatarUrl, githubIdOrUsername, fallbackUrl } =
    options;

  if (avatarUrl && avatarUrl.trim().length > 0) {
    return avatarUrl.trim();
  }

  if (affiliationAvatarUrl && affiliationAvatarUrl.trim().length > 0) {
    return affiliationAvatarUrl.trim();
  }

  const githubUrl = buildGithubAvatarUrl(githubIdOrUsername);
  if (githubUrl && !isDefaultGithubAvatarUrl(githubUrl)) {
    return githubUrl;
  }

  return fallbackUrl;
}
