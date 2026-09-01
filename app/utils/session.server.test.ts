import { describe, it, expect } from "vitest";
import {
  signSessionToken,
  verifySessionToken,
  createSessionCookieHeader,
  createLogoutCookieHeader,
  parseSessionCookie,
  authGuard,
  getAuditActorUserId,
  getAuditActorContext,
  type SessionPayload,
} from "./session.server";

describe("Session & Auth-by-Default Security Guard", () => {
  const testPayload: SessionPayload = {
    userId: "user-test-123",
    role: "student",
    issuedAt: Date.now(),
    expiresAt: Date.now() + 3600 * 1000,
  };

  it("signs and verifies session token successfully using Web Crypto HMAC", async () => {
    const token = await signSessionToken(testPayload);
    expect(token).toContain(".");

    const verified = await verifySessionToken(token);
    expect(verified).not.toBeNull();
    expect(verified?.userId).toBe(testPayload.userId);
    expect(verified?.role).toBe("student");
  });

  it("rejects tampered session tokens", async () => {
    const token = await signSessionToken(testPayload);
    const [payloadPart, sigPart] = token.split(".");

    // Tamper payload
    const tamperedToken = `${payloadPart}tampered.${sigPart}`;
    const result = await verifySessionToken(tamperedToken);
    expect(result).toBeNull();
  });

  it("rejects expired session tokens", async () => {
    const expiredPayload: SessionPayload = {
      userId: "user-expired",
      role: "student",
      issuedAt: Date.now() - 20000,
      expiresAt: Date.now() - 1000, // Expired in past
    };

    const token = await signSessionToken(expiredPayload);
    const verified = await verifySessionToken(token);
    expect(verified).toBeNull();
  });

  it("formats and parses HTTP-only session cookies correctly", () => {
    const dummyToken = "abc.xyz";
    const header = createSessionCookieHeader(dummyToken);
    expect(header).toContain("aptispace_session=abc.xyz");
    expect(header).toContain("HttpOnly");
    expect(header).toContain("SameSite=Lax");

    const logoutHeader = createLogoutCookieHeader();
    expect(logoutHeader).toContain("Max-Age=0");

    const reqWithCookie = new Request("http://localhost:3000", {
      headers: {
        Cookie: `other_cookie=123; aptispace_session=${dummyToken}; lang=en`,
      },
    });

    const parsed = parseSessionCookie(reqWithCookie);
    expect(parsed).toBe(dummyToken);
  });

  it("authGuard throws 401 Unauthorized for unauthenticated API requests by default", async () => {
    const unauthApiReq = new Request("http://localhost:3000/api/courses");
    await expect(authGuard(unauthApiReq, {})).rejects.toSatisfy(
      (err: Response) => {
        expect(err.status).toBe(401);
        return true;
      },
    );
  });

  it("authGuard throws 302 Redirect to /login for unauthenticated page requests by default", async () => {
    const unauthPageReq = new Request("http://localhost:3000/dashboard");
    await expect(authGuard(unauthPageReq, {})).rejects.toSatisfy(
      (err: Response) => {
        expect(err.status).toBe(302);
        expect(err.headers.get("Location")).toContain("/login?redirect=");
        return true;
      },
    );
  });

  it("authGuard permits anonymous when explicitly specified", async () => {
    const anonReq = new Request("http://localhost:3000/api/public");
    const result = await authGuard(anonReq, {}, { allowAnonymous: true });
    expect(result).toBeNull();
  });

  it("authGuard enforces RBAC roles with 403 Forbidden", async () => {
    const studentToken = await signSessionToken({
      userId: "student-1",
      role: "student",
      issuedAt: Date.now(),
      expiresAt: Date.now() + 3600000,
    });

    const studentReq = new Request("http://localhost:3000/api/admin/system", {
      headers: { Cookie: `aptispace_session=${studentToken}` },
    });

    await expect(
      authGuard(studentReq, {}, { requiredRole: "admin" }),
    ).rejects.toSatisfy((err: Response) => {
      expect(err.status).toBe(403);
      return true;
    });
  });

  it("authGuard succeeds and resolves context for authorized requests", async () => {
    const adminToken = await signSessionToken({
      userId: "admin-1",
      role: "admin",
      issuedAt: Date.now(),
      expiresAt: Date.now() + 3600000,
    });

    const adminReq = new Request("http://localhost:3000/api/admin/dashboard", {
      headers: { Cookie: `aptispace_session=${adminToken}` },
    });

    const authContext = await authGuard(
      adminReq,
      {},
      { requiredRole: "admin" },
    );
    expect(authContext).not.toBeNull();
    expect(authContext?.session.userId).toBe("admin-1");
    expect(authContext?.session.role).toBe("admin");
    expect(authContext?.actorUserId).toBe("admin-1");
  });

  it("getAuditActorUserId and getAuditActorContext correctly attribute impersonated sessions to the admin", () => {
    const normalSession: SessionPayload = {
      userId: "student-1",
      role: "student",
      issuedAt: Date.now(),
      expiresAt: Date.now() + 3600000,
    };
    expect(getAuditActorUserId(normalSession)).toBe("student-1");
    expect(getAuditActorContext(normalSession)).toEqual({
      actorUserId: "student-1",
      isImpersonating: false,
      impersonatedUserId: undefined,
      originalUserId: undefined,
    });

    const impersonatedSession: SessionPayload = {
      userId: "student-1",
      role: "student",
      impersonating: true,
      originalUserId: "admin-superuser-999",
      issuedAt: Date.now(),
      expiresAt: Date.now() + 3600000,
    };
    expect(getAuditActorUserId(impersonatedSession)).toBe(
      "admin-superuser-999",
    );
    expect(getAuditActorContext(impersonatedSession)).toEqual({
      actorUserId: "admin-superuser-999",
      isImpersonating: true,
      impersonatedUserId: "student-1",
      originalUserId: "admin-superuser-999",
    });
  });

  it("authGuard assigns actorUserId to the admin when impersonation is active", async () => {
    const impersonatedToken = await signSessionToken({
      userId: "student-target",
      role: "student",
      impersonating: true,
      originalUserId: "admin-actual-actor",
      issuedAt: Date.now(),
      expiresAt: Date.now() + 3600000,
    });

    const impersonatedReq = new Request("http://localhost:3000/api/courses", {
      headers: { Cookie: `aptispace_session=${impersonatedToken}` },
    });

    const authContext = await authGuard(impersonatedReq, {});
    expect(authContext).not.toBeNull();
    expect(authContext?.session.userId).toBe("student-target");
    expect(authContext?.session.impersonating).toBe(true);
    expect(authContext?.actorUserId).toBe("admin-actual-actor");
  });
});
