import { getDatabaseFromContext, type Database } from "../db/index";
import { getUserWithAffiliations } from "../services/userService";
import type { UserRole } from "./auth";

export interface SessionPayload {
  userId: string;
  role: UserRole;
  impersonating?: boolean;
  originalUserId?: string;
  githubToken?: string;
  issuedAt: number;
  expiresAt: number;
}

const DEFAULT_SECRET = "aptispace-lms-secure-default-signing-key-2026";
const COOKIE_NAME = "aptispace_session";
const SEVEN_DAYS_SECONDS = 7 * 24 * 60 * 60;

function getSigningSecret(): string {
  if (typeof process !== "undefined" && process.env.SESSION_SECRET) {
    return process.env.SESSION_SECRET;
  }
  return DEFAULT_SECRET;
}

async function getCryptoKey(secretString: string): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const keyBytes = encoder.encode(secretString);
  return crypto.subtle.importKey(
    "raw",
    keyBytes,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

function base64UrlEncode(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/={1,2}$/, "");
}

function base64UrlDecode(encodedString: string): Uint8Array {
  let base64 = encodedString.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4 !== 0) {
    base64 += "=";
  }
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

export async function signSessionToken(
  payload: SessionPayload,
  customSecret?: string,
): Promise<string> {
  const secretKey = await getCryptoKey(customSecret ?? getSigningSecret());
  const encoder = new TextEncoder();
  const serializedPayload = JSON.stringify(payload);
  const payloadBytes = encoder.encode(serializedPayload);
  const encodedPayload = base64UrlEncode(payloadBytes);

  const signatureBuffer = await crypto.subtle.sign(
    "HMAC",
    secretKey,
    encoder.encode(encodedPayload),
  );

  const signatureBytes = new Uint8Array(signatureBuffer);
  const encodedSignature = base64UrlEncode(signatureBytes);

  return `${encodedPayload}.${encodedSignature}`;
}

export async function verifySessionToken(
  token: string,
  customSecret?: string,
): Promise<SessionPayload | null> {
  const parts = token.split(".");
  if (parts.length !== 2) return null;

  const [encodedPayload, encodedSignature] = parts;
  const secretKey = await getCryptoKey(customSecret ?? getSigningSecret());
  const encoder = new TextEncoder();

  try {
    const signatureBytes = base64UrlDecode(encodedSignature);
    const isValid = await crypto.subtle.verify(
      "HMAC",
      secretKey,
      signatureBytes as unknown as BufferSource,
      encoder.encode(encodedPayload),
    );

    if (!isValid) return null;

    const payloadBytes = base64UrlDecode(encodedPayload);
    const decodedJson = new TextDecoder().decode(payloadBytes);
    const parsedPayload = JSON.parse(decodedJson) as SessionPayload;

    if (parsedPayload.expiresAt && Date.now() > parsedPayload.expiresAt) {
      return null;
    }

    return parsedPayload;
  } catch {
    return null;
  }
}

export function createSessionCookieHeader(
  token: string,
  maxAgeSeconds = SEVEN_DAYS_SECONDS,
): string {
  const isProd =
    typeof process !== "undefined" && process.env.NODE_ENV === "production";
  const secureFlag = isProd ? "; Secure" : "";
  return `${COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAgeSeconds}${secureFlag}`;
}

export function createLogoutCookieHeader(): string {
  return `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT`;
}

export function parseSessionCookie(request: Request): string | null {
  const cookieHeader = request.headers.get("Cookie");
  if (!cookieHeader) return null;

  const cookies = cookieHeader.split(";");
  for (const cookie of cookies) {
    const [trimmedName, ...rest] = cookie.trim().split("=");
    if (trimmedName === COOKIE_NAME) {
      return rest.join("=");
    }
  }
  return null;
}

export async function getSession(
  request: Request,
  customSecret?: string,
): Promise<SessionPayload | null> {
  const token = parseSessionCookie(request);
  if (!token) return null;
  return verifySessionToken(token, customSecret);
}

export interface AuditActorContext {
  actorUserId?: string;
  isImpersonating: boolean;
  impersonatedUserId?: string;
  originalUserId?: string;
}

export function getAuditActorUserId(
  session: SessionPayload | null | undefined,
): string | undefined {
  if (!session) return undefined;
  if (session.impersonating && session.originalUserId) {
    return session.originalUserId;
  }
  return session.userId;
}

export function getAuditActorContext(
  session: SessionPayload | null | undefined,
): AuditActorContext {
  if (!session) {
    return { isImpersonating: false };
  }
  const isImpersonating = Boolean(
    session.impersonating && session.originalUserId,
  );
  return {
    actorUserId: isImpersonating ? session.originalUserId : session.userId,
    isImpersonating,
    impersonatedUserId: isImpersonating ? session.userId : undefined,
    originalUserId: session.originalUserId,
  };
}

export interface AuthGuardOptions {
  allowAnonymous?: boolean;
  requiredRole?: UserRole;
}

export interface AuthenticatedContext {
  session: SessionPayload;
  db: Database | null;
  user: Awaited<ReturnType<typeof getUserWithAffiliations>>;
  actorUserId: string;
}

function throwUnauthenticated(request: Request): never {
  const isApiRequest = new URL(request.url).pathname.startsWith("/api");
  if (isApiRequest) {
    throw new Response(
      JSON.stringify({
        error: "Authentication required",
        code: "UNAUTHORIZED",
      }),
      {
        status: 401,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
  const url = new URL(request.url);
  const destination =
    url.pathname === "/"
      ? "/login"
      : `/login?redirect=${encodeURIComponent(url.pathname + url.search)}`;

  throw new Response(null, {
    status: 302,
    headers: { Location: destination },
  });
}

function throwForbiddenRole(requiredRole: UserRole): never {
  throw new Response(
    JSON.stringify({
      error: `Forbidden: requires ${requiredRole} privileges`,
      code: "FORBIDDEN",
    }),
    {
      status: 403,
      headers: { "Content-Type": "application/json" },
    },
  );
}

async function resolveSessionUser(db: Database | null, userId: string) {
  if (!db) return null;
  return getUserWithAffiliations(db, userId);
}

export async function authGuard(
  request: Request,
  context: unknown,
  options: AuthGuardOptions = {},
): Promise<AuthenticatedContext | null> {
  const session = await getSession(request);
  const db = getDatabaseFromContext(context);

  if (!session) {
    if (options.allowAnonymous) {
      return null;
    }
    throwUnauthenticated(request);
  }

  if (options.requiredRole && session.role !== options.requiredRole) {
    throwForbiddenRole(options.requiredRole);
  }

  const user = session.userId
    ? await resolveSessionUser(db, session.userId)
    : null;

  const actorUserId =
    session.impersonating && session.originalUserId
      ? session.originalUserId
      : session.userId;

  return { session, db, user, actorUserId };
}
