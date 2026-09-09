/**
 * Utility to safely detect WebGL/WebGL2 (OpenGL) hardware acceleration availability.
 * Works across browser environments, SSR, and automated test runners.
 */

export function isWebGLSupported(): boolean {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return false;
  }

  // Allow test runners to simulate WebGL-disabled environments
  if (
    (window as unknown as { __FORCE_NO_WEBGL__?: boolean }).__FORCE_NO_WEBGL__
  ) {
    return false;
  }

  // In test environments where canvas is mocked, default to supported unless forced
  if (process.env.NODE_ENV === "test") {
    return true;
  }

  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl2") ||
      canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl");

    return Boolean(gl);
  } catch {
    return false;
  }
}
