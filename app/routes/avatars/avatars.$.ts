import type { LoaderFunctionArgs } from "react-router";
import { resolveR2Bucket } from "~/utils/r2.server";

export async function loader({ params, context }: LoaderFunctionArgs) {
  const rawKey = params["*"] || "";
  if (!rawKey) {
    return new Response("Not Found", { status: 404 });
  }

  const r2Bucket = resolveR2Bucket(context);
  if (!r2Bucket) {
    return new Response("Object storage not available", { status: 404 });
  }

  // Try finding with avatars/ prefix or exact key
  const storageKey = rawKey.startsWith("avatars/")
    ? rawKey
    : `avatars/${rawKey}`;
  let object = await r2Bucket.get(storageKey);
  if (!object) {
    object = await r2Bucket.get(rawKey);
  }

  if (!object) {
    return new Response("Not Found", { status: 404 });
  }

  const headers = new Headers();
  if (object.httpMetadata?.contentType) {
    headers.set("Content-Type", object.httpMetadata.contentType);
  } else {
    headers.set("Content-Type", "image/webp");
  }

  if (object.httpEtag) {
    headers.set("etag", object.httpEtag);
  }
  headers.set("Cache-Control", "public, max-age=31536000, immutable");

  return new Response(object.body as unknown as BodyInit, { headers });
}
