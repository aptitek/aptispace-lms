import type { ActionFunctionArgs } from "react-router";
import type { R2Bucket } from "@cloudflare/workers-types";

interface CloudflareContextEnv {
  AVATARS_BUCKET?: R2Bucket;
  R2?: R2Bucket;
  BUCKET?: R2Bucket;
  [key: string]: unknown;
}

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  "image/avif",
]);

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

const MIME_EXTENSION_MAP: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/svg+xml": "svg",
  "image/avif": "avif",
};

function getFileExtension(mimeType: string, originalName?: string): string {
  if (originalName && originalName.includes(".")) {
    const extensionParts = originalName.split(".");
    return extensionParts[extensionParts.length - 1].toLowerCase();
  }
  return MIME_EXTENSION_MAP[mimeType] ?? "png";
}

function validateUploadFile(candidate: unknown): {
  errorMessage?: string;
  validFile?: File;
} {
  if (!candidate || !(candidate instanceof File)) {
    return {
      errorMessage: "Missing or invalid 'file' field in multipart form data.",
    };
  }

  if (!ALLOWED_MIME_TYPES.has(candidate.type)) {
    return {
      errorMessage: `Unsupported image format (${candidate.type}). Allowed formats: JPG, PNG, WebP, GIF, SVG, AVIF.`,
    };
  }

  if (candidate.size > MAX_FILE_SIZE_BYTES) {
    const sizeMb = (candidate.size / (1024 * 1024)).toFixed(2);
    return {
      errorMessage: `File size exceeds the 5MB limit (${sizeMb}MB).`,
    };
  }

  return { validFile: candidate };
}

function resolveR2Bucket(context: unknown): R2Bucket | undefined {
  const contextRecord = context as {
    cloudflare?: { env?: CloudflareContextEnv };
    env?: CloudflareContextEnv;
  };
  const envObj = contextRecord?.cloudflare?.env || contextRecord?.env;
  if (!envObj) return undefined;
  return envObj.AVATARS_BUCKET || envObj.R2 || envObj.BUCKET;
}

function resolvePublicR2Url(context: unknown, storageKey: string): string {
  const contextRecord = context as {
    cloudflare?: { env?: { R2_PUBLIC_URL?: string } };
    env?: { R2_PUBLIC_URL?: string };
  };
  const envObj = contextRecord?.cloudflare?.env || contextRecord?.env;
  const publicBaseUrl = envObj?.R2_PUBLIC_URL;

  if (publicBaseUrl) {
    return `${publicBaseUrl.replace(/\/$/, "")}/${storageKey}`;
  }
  return `/api/avatar/file?key=${encodeURIComponent(storageKey)}`;
}

export async function action({ request, context }: ActionFunctionArgs) {
  if (request.method !== "POST") {
    return Response.json(
      { error: "Method not allowed. Only POST is supported." },
      { status: 405 },
    );
  }

  try {
    const formData = await request.formData();
    const { errorMessage, validFile } = validateUploadFile(
      formData.get("file"),
    );

    if (errorMessage || !validFile) {
      return Response.json({ error: errorMessage }, { status: 400 });
    }

    const fileExtension = getFileExtension(validFile.type, validFile.name);
    const uniqueKey = `avatars/avatar-${Date.now()}-${Math.random().toString(36).slice(2, 9)}.${fileExtension}`;
    const arrayBufferData = await validFile.arrayBuffer();

    const r2Bucket = resolveR2Bucket(context);

    if (r2Bucket) {
      await r2Bucket.put(uniqueKey, arrayBufferData, {
        httpMetadata: { contentType: validFile.type },
      });

      return Response.json({
        success: true,
        url: resolvePublicR2Url(context, uniqueKey),
        storageKey: uniqueKey,
        fileName: validFile.name,
        fileSize: validFile.size,
        mimeType: validFile.type,
      });
    }

    const base64Data = Buffer.from(arrayBufferData).toString("base64");
    return Response.json({
      success: true,
      url: `data:${validFile.type};base64,${base64Data}`,
      storageKey: uniqueKey,
      fileName: validFile.name,
      fileSize: validFile.size,
      mimeType: validFile.type,
      fallbackMode: true,
    });
  } catch (caughtError) {
    const details =
      caughtError instanceof Error
        ? caughtError.message
        : "Unknown upload error";
    return Response.json(
      { error: `Upload processing failed: ${details}` },
      { status: 500 },
    );
  }
}
