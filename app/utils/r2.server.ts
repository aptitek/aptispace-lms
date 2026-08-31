import type { R2Bucket } from "@cloudflare/workers-types";

export interface CloudflareContextEnv {
  AVATARS_BUCKET?: R2Bucket;
  R2?: R2Bucket;
  BUCKET?: R2Bucket;
  R2_PUBLIC_URL?: string;
  [key: string]: unknown;
}

export function extractBucketFromEnv(
  envObj?: CloudflareContextEnv,
): R2Bucket | undefined {
  if (!envObj) return undefined;
  return envObj.AVATARS_BUCKET || envObj.R2 || envObj.BUCKET;
}

export function resolveR2Bucket(context: unknown): R2Bucket | undefined {
  if (context && typeof context === "object") {
    const contextRecord = context as {
      cloudflare?: { env?: CloudflareContextEnv };
      env?: CloudflareContextEnv;
    };
    const bucket = extractBucketFromEnv(
      contextRecord.cloudflare?.env || contextRecord.env,
    );
    if (bucket) return bucket;
  }

  const globalEnv = (
    globalThis as unknown as { __CLOUDFLARE_ENV__?: CloudflareContextEnv }
  ).__CLOUDFLARE_ENV__;
  return extractBucketFromEnv(globalEnv);
}

export function resolvePublicR2Url(
  context: unknown,
  storageKey: string,
): string {
  const contextRecord = context as {
    cloudflare?: { env?: { R2_PUBLIC_URL?: string } };
    env?: { R2_PUBLIC_URL?: string };
  };
  const envObj = contextRecord?.cloudflare?.env || contextRecord?.env;
  const baseUrl = envObj?.R2_PUBLIC_URL || "/avatars";
  const sanitizedBase = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
  return `${sanitizedBase}/${storageKey}`;
}
