import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getAuditLogs,
  getErrorReports,
  getSystemMetrics,
  getMissionCenterData,
  updateErrorReportStatus,
  deleteErrorReport,
  clearResolvedErrorReports,
  logAdminAudit,
} from "./missionCenterService";
import type { Database } from "~/db/index";

describe("missionCenterService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Fallback / Mock mode (db = null)", () => {
    it("returns mock audit logs when db is null", async () => {
      const logs = await getAuditLogs(null);
      expect(logs.length).toBeGreaterThan(0);
      expect(logs[0]).toHaveProperty("id");
      expect(logs[0]).toHaveProperty("action");
      expect(logs[0]).toHaveProperty("tableName");
    });

    it("returns mock error reports when db is null", async () => {
      const reports = await getErrorReports(null);
      expect(reports.length).toBeGreaterThan(0);
      expect(reports[0]).toHaveProperty("message");
      expect(reports[0]).toHaveProperty("severity");
      expect(reports[0]).toHaveProperty("status");
    });

    it("returns fallback system metrics when db is null", async () => {
      const metrics = await getSystemMetrics(null);
      expect(metrics.infrastructure.status).toBeDefined();
      expect(metrics.counts.totalUsers).toBeGreaterThan(0);
      expect(metrics.tableInventory.length).toBeGreaterThan(0);
    });

    it("bundles full mission center data in fallback mode", async () => {
      const missionBundle = await getMissionCenterData(null, null);
      expect(missionBundle.auditLogs.length).toBeGreaterThan(0);
      expect(missionBundle.errorReports.length).toBeGreaterThan(0);
      expect(missionBundle.securityIncidents.length).toBeGreaterThan(0);
      expect(missionBundle.openIssuesCount).toBeGreaterThan(0);
    });
  });

  describe("Database Operations", () => {
    it("updates error report status", async () => {
      const mockReturning = vi
        .fn()
        .mockResolvedValue([{ id: "err-1", status: "resolved" }]);
      const mockWhere = vi.fn().mockReturnValue({ returning: mockReturning });
      const mockSet = vi.fn().mockReturnValue({ where: mockWhere });
      const mockUpdate = vi.fn().mockReturnValue({ set: mockSet });

      const mockDb = {
        update: mockUpdate,
      } as unknown as Database;

      const res = await updateErrorReportStatus(mockDb, "err-1", "resolved");
      expect(mockUpdate).toHaveBeenCalled();
      expect(mockSet).toHaveBeenCalledWith({ status: "resolved" });
      expect(res).toEqual([{ id: "err-1", status: "resolved" }]);
    });

    it("deletes error report", async () => {
      const mockReturning = vi.fn().mockResolvedValue([{ id: "err-1" }]);
      const mockWhere = vi.fn().mockReturnValue({ returning: mockReturning });
      const mockDelete = vi.fn().mockReturnValue({ where: mockWhere });

      const mockDb = {
        delete: mockDelete,
      } as unknown as Database;

      const res = await deleteErrorReport(mockDb, "err-1");
      expect(mockDelete).toHaveBeenCalled();
      expect(res).toEqual([{ id: "err-1" }]);
    });

    it("clears resolved and ignored error reports", async () => {
      const mockReturning = vi
        .fn()
        .mockResolvedValue([{ id: "err-1" }, { id: "err-2" }]);
      const mockWhere = vi.fn().mockReturnValue({ returning: mockReturning });
      const mockDelete = vi.fn().mockReturnValue({ where: mockWhere });

      const mockDb = {
        delete: mockDelete,
      } as unknown as Database;

      const res = await clearResolvedErrorReports(mockDb);
      expect(mockDelete).toHaveBeenCalled();
      expect(res).toHaveLength(2);
    });

    it("logs admin audit entry into database", async () => {
      const mockValues = vi.fn().mockResolvedValue([{ id: "aud-new" }]);
      const mockInsert = vi.fn().mockReturnValue({ values: mockValues });

      const mockDb = {
        insert: mockInsert,
      } as unknown as Database;

      await logAdminAudit(mockDb, {
        tableName: "users",
        recordId: "u-123",
        action: "UPDATE",
        actorUserId: "admin-1",
        oldValues: { role: "student" },
        newValues: { role: "instructor" },
      });

      expect(mockInsert).toHaveBeenCalled();
      expect(mockValues).toHaveBeenCalledWith(
        expect.objectContaining({
          tableName: "users",
          recordId: "u-123",
          action: "UPDATE",
          userId: "admin-1",
        }),
      );
    });
  });
});
