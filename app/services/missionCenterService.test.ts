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

  describe("Null / disconnected DB handling (no mock fallbacks)", () => {
    it("returns empty audit logs when db is null", async () => {
      const logs = await getAuditLogs(null);
      expect(logs).toEqual([]);
    });

    it("returns empty error reports when db is null", async () => {
      const reports = await getErrorReports(null);
      expect(reports).toEqual([]);
    });

    it("returns zeroed metrics when db is null", async () => {
      const metrics = await getSystemMetrics(null);
      expect(metrics.infrastructure.status).toBeDefined();
      expect(metrics.counts.totalUsers).toBe(0);
      expect(metrics.tableInventory).toEqual([]);
    });

    it("bundles empty mission center data without mock fallbacks", async () => {
      const missionBundle = await getMissionCenterData(null, null);
      expect(missionBundle.auditLogs).toEqual([]);
      expect(missionBundle.errorReports).toEqual([]);
      expect(missionBundle.securityIncidents).toEqual([]);
      expect(missionBundle.openIssuesCount).toBe(0);
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
