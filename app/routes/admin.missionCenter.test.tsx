import { describe, it, expect, vi, beforeEach } from "vitest";
import { action, loader } from "./admin";
import * as sessionServer from "~/utils/session.server";
import * as missionCenterService from "~/services/missionCenterService";

describe("Admin Route - Mission Center", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("loader", () => {
    it("provides missionCenter telemetry bundle to admin", async () => {
      const mockDb = {} as never;
      vi.spyOn(sessionServer, "authGuard").mockResolvedValue({
        session: {
          userId: "admin-1",
          role: "admin",
          issuedAt: Date.now(),
          expiresAt: Date.now() + 10000,
        },
        actorUserId: "admin-1",
        db: mockDb,
        user: {
          id: "admin-1",
          firstName: "Admin",
          lastName: "USER",
          displayName: "Admin User",
          avatarUrl: null,
          githubId: "admin",
          githubEmail: "admin@aptitek.io",
          createdAt: new Date(),
          updatedAt: new Date(),
          affiliations: [],
        },
      });

      const request = new Request("http://localhost:3000/admin");
      const args = {
        request,
        context: {},
        params: {},
      } as unknown as Parameters<typeof loader>[0];

      const result = await loader(args);
      expect(result.missionCenter).toBeDefined();
      expect(result.missionCenter.metrics).toBeDefined();
      expect(result.missionCenter.openIssuesCount).toBeGreaterThanOrEqual(0);
    });
  });

  describe("action intents", () => {
    it("handles update-error-status intent correctly", async () => {
      const mockDb = {} as never;
      vi.spyOn(sessionServer, "authGuard").mockResolvedValue({
        session: {
          userId: "admin-1",
          role: "admin",
          issuedAt: Date.now(),
          expiresAt: Date.now() + 10000,
        },
        actorUserId: "admin-1",
        db: mockDb,
        user: {
          id: "admin-1",
          firstName: "Admin",
          lastName: "USER",
          displayName: "Admin User",
          avatarUrl: null,
          githubId: "admin",
          githubEmail: "admin@aptitek.io",
          createdAt: new Date(),
          updatedAt: new Date(),
          affiliations: [],
        },
      });

      const updateSpy = vi
        .spyOn(missionCenterService, "updateErrorReportStatus")
        .mockResolvedValue([{ id: "err-101", status: "resolved" }] as never);
      const auditSpy = vi
        .spyOn(missionCenterService, "logAdminAudit")
        .mockResolvedValue(undefined as never);

      const formData = new FormData();
      formData.append("intent", "update-error-status");
      formData.append("reportId", "err-101");
      formData.append("status", "resolved");

      const request = new Request("http://localhost:3000/admin", {
        method: "POST",
        body: formData,
      });

      const args = {
        request,
        context: {},
        params: {},
      } as unknown as Parameters<typeof action>[0];

      const res = await action(args);
      expect(res).toEqual({ success: true });
      expect(updateSpy).toHaveBeenCalledWith(mockDb, "err-101", "resolved");
      expect(auditSpy).toHaveBeenCalled();
    });

    it("handles delete-error-report intent correctly", async () => {
      const mockDb = {} as never;
      vi.spyOn(sessionServer, "authGuard").mockResolvedValue({
        session: {
          userId: "admin-1",
          role: "admin",
          issuedAt: Date.now(),
          expiresAt: Date.now() + 10000,
        },
        actorUserId: "admin-1",
        db: mockDb,
        user: {
          id: "admin-1",
          firstName: "Admin",
          lastName: "USER",
          displayName: "Admin User",
          avatarUrl: null,
          githubId: "admin",
          githubEmail: "admin@aptitek.io",
          createdAt: new Date(),
          updatedAt: new Date(),
          affiliations: [],
        },
      });

      const deleteSpy = vi
        .spyOn(missionCenterService, "deleteErrorReport")
        .mockResolvedValue([{ id: "err-101" }] as never);
      const auditSpy = vi
        .spyOn(missionCenterService, "logAdminAudit")
        .mockResolvedValue(undefined as never);

      const formData = new FormData();
      formData.append("intent", "delete-error-report");
      formData.append("reportId", "err-101");

      const request = new Request("http://localhost:3000/admin", {
        method: "POST",
        body: formData,
      });

      const args = {
        request,
        context: {},
        params: {},
      } as unknown as Parameters<typeof action>[0];

      const res = await action(args);
      expect(res).toEqual({ success: true });
      expect(deleteSpy).toHaveBeenCalledWith(mockDb, "err-101");
      expect(auditSpy).toHaveBeenCalled();
    });

    it("handles clear-resolved-errors intent correctly", async () => {
      const mockDb = {} as never;
      vi.spyOn(sessionServer, "authGuard").mockResolvedValue({
        session: {
          userId: "admin-1",
          role: "admin",
          issuedAt: Date.now(),
          expiresAt: Date.now() + 10000,
        },
        actorUserId: "admin-1",
        db: mockDb,
        user: {
          id: "admin-1",
          firstName: "Admin",
          lastName: "USER",
          displayName: "Admin User",
          avatarUrl: null,
          githubId: "admin",
          githubEmail: "admin@aptitek.io",
          createdAt: new Date(),
          updatedAt: new Date(),
          affiliations: [],
        },
      });

      const clearSpy = vi
        .spyOn(missionCenterService, "clearResolvedErrorReports")
        .mockResolvedValue([{ id: "err-1" }, { id: "err-2" }] as never);
      const auditSpy = vi
        .spyOn(missionCenterService, "logAdminAudit")
        .mockResolvedValue(undefined as never);

      const formData = new FormData();
      formData.append("intent", "clear-resolved-errors");

      const request = new Request("http://localhost:3000/admin", {
        method: "POST",
        body: formData,
      });

      const args = {
        request,
        context: {},
        params: {},
      } as unknown as Parameters<typeof action>[0];

      const res = await action(args);
      expect(res).toEqual({ success: true, count: 2 });
      expect(clearSpy).toHaveBeenCalledWith(mockDb);
      expect(auditSpy).toHaveBeenCalled();
    });
  });
});
