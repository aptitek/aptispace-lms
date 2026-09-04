import type { ActionFunctionArgs } from "react-router";
import { resolveR2Bucket, resolvePublicR2Url } from "~/utils/r2.server";
import { authGuard } from "~/utils/session.server";
import { updateUser } from "~/services/userService";

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

function generateUniqueKey(file: File): string {
  const extension = file.type === "image/png" ? "png" : "webp";
  return `avatars/avatar-${Date.now()}-${Math.random().toString(36).slice(2, 9)}.${extension}`;
}

async function persistAuthAvatar(
  auth: Awaited<ReturnType<typeof authGuard>>,
  avatarUrl: string,
) {
  const userId = auth?.session?.userId ?? auth?.user?.id;
  if (userId && auth?.db) {
    await updateUser(auth.db, userId, { avatarUrl });
  }
}

interface R2UploadParams {
  r2Bucket: NonNullable<ReturnType<typeof resolveR2Bucket>>;
  context: unknown;
  key: string;
  data: ArrayBuffer;
  mimeType: string;
}

async function saveToR2Bucket(params: R2UploadParams): Promise<string> {
  const { r2Bucket, context, key, data, mimeType } = params;
  await r2Bucket.put(key, data, {
    httpMetadata: { contentType: mimeType },
  });
  return resolvePublicR2Url(context, key);
}

function saveToDataUrlFallback(data: ArrayBuffer, mimeType: string): string {
  const base64 = Buffer.from(data).toString("base64");
  return `data:${mimeType};base64,${base64}`;
}

function handleUploadError(caughtError: unknown): Response {
  const details =
    caughtError instanceof Error ? caughtError.message : "Unknown upload error";
  return Response.json(
    {
      error: `Upload processing failed: ${details}`,
      errorCode: "UPLOAD_FAILED",
    },
    { status: 500 },
  );
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

    const uniqueKey = generateUniqueKey(validFile);
    const arrayBufferData = await validFile.arrayBuffer();
    const r2Bucket = resolveR2Bucket(context);
    const isR2 = Boolean(r2Bucket);

    const publicUrl = r2Bucket
      ? await saveToR2Bucket({
          r2Bucket,
          context,
          key: uniqueKey,
          data: arrayBufferData,
          mimeType: validFile.type,
        })
      : saveToDataUrlFallback(arrayBufferData, validFile.type);

    const auth = await authGuard(request, context, { allowAnonymous: true });
    await persistAuthAvatar(auth, publicUrl);

    return Response.json({
      success: true,
      url: publicUrl,
      storageKey: uniqueKey,
      fileName: validFile.name,
      fileSize: validFile.size,
      mimeType: validFile.type,
      ...(isR2 ? {} : { fallbackMode: true }),
    });
  } catch (caughtError) {
    return handleUploadError(caughtError);
  }
}
