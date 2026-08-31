import type { D1Database } from "@cloudflare/workers-types";
import { drizzle, type DrizzleD1Database } from "drizzle-orm/d1";
import * as schema from "./schema";

export function getDb(d1: D1Database): DrizzleD1Database<typeof schema> {
  return drizzle(d1, { schema });
}

export interface CloudflareEnv {
  DB?: D1Database;
  [key: string]: unknown;
}

export function getDatabaseFromContext(context: unknown): Database | null {
  if (context && typeof context === "object") {
    const ctx = context as {
      cloudflare?: { env?: CloudflareEnv };
      env?: CloudflareEnv;
    };
    const d1 = ctx.cloudflare?.env?.DB ?? ctx.env?.DB;
    if (d1) return getDb(d1);
  }

  const globalEnv = (
    globalThis as unknown as { __CLOUDFLARE_ENV__?: CloudflareEnv }
  ).__CLOUDFLARE_ENV__;
  if (globalEnv?.DB) {
    return getDb(globalEnv.DB);
  }

  return null;
}

export type Database = DrizzleD1Database<typeof schema>;
export * from "./schema";
