import type { ActionFunctionArgs } from "react-router";
import { resolveR2Bucket, resolvePublicR2Url } from "~/utils/r2.server";

const ALLOWED_MIME_TYPES = new Set(["image/webp", "image/png", "image/jpeg"]);

const MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024; // 2 MB for client-processed avatars

function validateUploadFile(candidate: unknown): {
  errorMessage?: string;
  errorCode?: string;
  validFile?: File;
} {
  if (!candidate || !(candidate instanceof File)) {
    return {
      errorMessage: "Missing or invalid 'file' field in multipart form data.",
      errorCode: "INVALID_FILE_TYPE",
    };
  }

  if (!ALLOWED_MIME_TYPES.has(candidate.type)) {
    return {
      errorMessage: `Unsupported image format (${candidate.type}). Images must be processed into WebP before upload.`,
      errorCode: "INVALID_FILE_TYPE",
    };
  }

  if (candidate.size > MAX_FILE_SIZE_BYTES) {
    const sizeMb = (candidate.size / (1024 * 1024)).toFixed(2);
    return {
      errorMessage: `File size exceeds the 2MB limit (${sizeMb}MB).`,
      errorCode: "FILE_TOO_LARGE",
    };
  }

  return { validFile: candidate };
}

export async function action({ request, context }: ActionFunctionArgs) {
  if (request.method !== "POST") {
    return Response.json(
      {
        error: "Method not allowed. Only POST is supported.",
        errorCode: "FORBIDDEN",
      },
      { status: 405 },
    );
  }

  try {
    const formData = await request.formData();
    const { errorMessage, errorCode, validFile } = validateUploadFile(
      formData.get("file"),
    );

    if (errorMessage || !validFile) {
      return Response.json(
        { error: errorMessage, errorCode: errorCode || "INVALID_FILE_TYPE" },
        { status: 400 },
      );
    }

    const extension = validFile.type === "image/png" ? "png" : "webp";
    const uniqueKey = `avatars/avatar-${Date.now()}-${Math.random().toString(36).slice(2, 9)}.${extension}`;
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
      {
        error: `Upload processing failed: ${details}`,
        errorCode: "UPLOAD_FAILED",
      },
      { status: 500 },
    );
  }
}
