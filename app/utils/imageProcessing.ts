export interface ImageProcessOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  outputType?: string;
  fileName?: string;
}

const DEFAULT_OPTIONS: Required<ImageProcessOptions> = {
  maxWidth: 512,
  maxHeight: 512,
  quality: 0.88,
  outputType: "image/webp",
  fileName: "avatar.webp",
};

/**
 * Calculates resized dimensions fitting within max dimensions while preserving aspect ratio.
 */
export function calculateAspectRatioFit(
  srcWidth: number,
  srcHeight: number,
  maxWidth: number,
  maxHeight: number,
): { width: number; height: number } {
  if (srcWidth <= 0 || srcHeight <= 0) {
    return { width: maxWidth, height: maxHeight };
  }

  const ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight, 1);
  return {
    width: Math.max(1, Math.round(srcWidth * ratio)),
    height: Math.max(1, Math.round(srcHeight * ratio)),
  };
}

/**
 * Processes an image File/Blob on the client side (raster or SVG)
 * and rasterizes/converts it into a lightweight WebP File.
 */
export async function processImageToWebp(
  file: File | Blob,
  options: ImageProcessOptions = {},
): Promise<File> {
  if (typeof window === "undefined" || typeof document === "undefined") {
    if (file instanceof File) return file;
    return new File([file], options.fileName || DEFAULT_OPTIONS.fileName, {
      type: file.type || DEFAULT_OPTIONS.outputType,
    });
  }

  const { maxWidth, maxHeight, quality, outputType, fileName } = {
    ...DEFAULT_OPTIONS,
    ...options,
  };

  const originalName =
    file instanceof File
      ? file.name
      : "image." + (file.type.split("/")[1] || "png");
  const baseName = originalName.replace(/\.[^/.]+$/, "");
  const targetFileName = fileName || `${baseName}.webp`;

  return new Promise((resolve) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();

    const cleanup = () => {
      URL.revokeObjectURL(objectUrl);
    };

    img.onload = () => {
      try {
        const { width: targetWidth, height: targetHeight } =
          calculateAspectRatioFit(
            img.naturalWidth || img.width || maxWidth,
            img.naturalHeight || img.height || maxHeight,
            maxWidth,
            maxHeight,
          );

        const canvas = document.createElement("canvas");
        canvas.width = targetWidth;
        canvas.height = targetHeight;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          cleanup();
          resolve(
            file instanceof File
              ? file
              : new File([file], targetFileName, { type: file.type }),
          );
          return;
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

        canvas.toBlob(
          (blob) => {
            cleanup();
            if (blob) {
              const processedFile = new File([blob], targetFileName, {
                type: blob.type || outputType,
                lastModified: Date.now(),
              });
              resolve(processedFile);
            } else {
              resolve(
                file instanceof File
                  ? file
                  : new File([file], targetFileName, { type: file.type }),
              );
            }
          },
          outputType,
          quality,
        );
      } catch {
        cleanup();
        resolve(
          file instanceof File
            ? file
            : new File([file], targetFileName, { type: file.type }),
        );
      }
    };

    img.onerror = () => {
      cleanup();
      resolve(
        file instanceof File
          ? file
          : new File([file], targetFileName, { type: file.type }),
      );
    };

    img.src = objectUrl;
  });
}
