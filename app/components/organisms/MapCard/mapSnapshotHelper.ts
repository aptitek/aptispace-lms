/**
 * Utility to capture MapLibre's WebGL canvas for the folds map texture.
 * Captures the clean vector map without pin overlay.
 */

export function captureMapSnapshot(
  sourceCanvas: HTMLCanvasElement,
): string | null {
  try {
    if (
      !sourceCanvas ||
      sourceCanvas.width === 0 ||
      sourceCanvas.height === 0
    ) {
      return null;
    }
    const dataUrl = sourceCanvas.toDataURL();
    return dataUrl.length > 500 ? dataUrl : null;
  } catch {
    return null;
  }
}
