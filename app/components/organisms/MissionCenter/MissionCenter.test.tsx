/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, afterEach } from "vitest";
import React from "react";
import type * as MuiDataGridType from "@mui/x-data-grid";
import MissionCenter from "./MissionCenter";
import { MissionCenterKpiCards } from "./MissionCenterKpiCards";
import { MissionCenterAuditTab } from "./MissionCenterAuditTab";
import { MissionCenterErrorsTab } from "./MissionCenterErrorsTab";
import { MissionCenterSecurityTab } from "./MissionCenterSecurityTab";
import { MissionCenterMetricsTab } from "./MissionCenterMetricsTab";
import { MissionCenterUserProfileCard } from "./MissionCenterUserProfileCard";
import type { MissionCenterData } from "~/types/missionCenter";

const mockMissionData: MissionCenterData = {
  auditLogs: [
    {
      id: "aud-1",
      tableName: "users",
      recordId: "usr-1",
      action: "UPDATE",
      userId: "admin-1",
      actor: {
        id: "admin-1",
        firstName: "System",
        familyName: "ADMIN",
        email: "admin@aptitek.io",
        role: "admin",
      },
      oldValues: JSON.stringify({ role: "student" }),
      newValues: JSON.stringify({ role: "instructor" }),
      createdAt: new Date().toISOString(),
    },
  ],
  errorReports: [
    {
      id: "err-1",
      message: "403 Forbidden on /api/admin/system",
      stack: "Error: 403 Forbidden\n    at authGuard",
      severity: "security",
      statusCode: 403,
      source: "server",
      url: "https://lms.aptitek.io/api/admin/system",
      path: "/api/admin/system",
      ipAddress: "192.168.1.50",
      userAgent: "Mozilla/5.0 TestBrowser",
      contextData: JSON.stringify({ route: "/api/admin/system" }),
      userId: "std-42",
      user: {
        id: "std-42",
        firstName: "Bad",
        familyName: "ACTOR",
        email: "bad.actor@example.com",
        role: "student",
      },
      status: "open",
      createdAt: new Date().toISOString(),
    },
  ],
  securityIncidents: [
    {
      id: "sec-1",
      type: "403_forbidden",
      title: "403 Forbidden Access Attempt",
      description: "Access denied on administrative endpoint",
      severity: "security",
      ipAddress: "192.168.1.50",
      userAgent: "Mozilla/5.0 TestBrowser",
      timestamp: new Date().toISOString(),
      userId: "std-42",
      user: {
        id: "std-42",
        firstName: "Bad",
        familyName: "ACTOR",
        email: "bad.actor@example.com",
        role: "student",
      },
    },
  ],
  metrics: {
    infrastructure: {
      status: "nominal",
      timestamp: new Date().toISOString(),
      d1: {
        name: "Cloudflare D1",
        status: "nominal",
        latencyMs: 12,
      },
      r2: {
        name: "Cloudflare R2",
        status: "nominal",
        latencyMs: 45,
      },
      environment: "Cloudflare Workers",
    },
    counts: {
      totalUsers: 20,
      students: 15,
      instructors: 3,
      admins: 2,
      institutions: 2,
      cohorts: 4,
      courses: 2,
      modules: 6,
      submissions: 10,
      grades: 10,
      auditLogs: 1,
      totalErrors: 1,
      openErrors: 1,
      criticalErrors: 0,
      securityIncidents: 1,
    },
    tableInventory: [
      { tableName: "users", rowCount: 20 },
      { tableName: "cohorts", rowCount: 4 },
      { tableName: "institutions", rowCount: 2 },
    ],
  },
  openIssuesCount: 1,
};

import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { ThemeProvider } from "@mui/material/styles";
import { I18nextProvider } from "react-i18next";
import i18n from "~/i18n";
import { appTheme } from "~/tokens/theme";

vi.mock("@mui/x-data-grid", async (importOriginal) => {
  const actual = await importOriginal<typeof MuiDataGridType>();
  return {
    ...actual,
    DataGrid: (props: any) => {
      const { rows = [], columns = [], onRowClick, localeText } = props;
      if (!rows.length) {
        return (
          <div data-testid="mock-datagrid-empty">
            {localeText?.noRowsLabel || "No rows"}
          </div>
        );
      }
      return (
        <div data-testid="mock-datagrid">
          {rows.map((row: any) => (
            <div
              key={row.id}
              data-testid={`datagrid-row-${row.id}`}
              role="button"
              tabIndex={0}
              onClick={() => onRowClick?.({ row })}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  onRowClick?.({ row });
                }
              }}
            >
              {columns.map((col: any) => {
                let cellValue = row[col.field];
                if (col.valueGetter) {
                  cellValue = col.valueGetter(cellValue, row);
                }
                if (col.renderCell) {
                  return (
                    <span key={col.field}>
                      {col.renderCell({ row, value: cellValue })}
                    </span>
                  );
                }
                return (
                  <span key={col.field}>
                    {typeof cellValue === "object"
                      ? JSON.stringify(cellValue)
                      : String(cellValue ?? "")}
                  </span>
                );
              })}
            </div>
          ))}
        </div>
      );
    },
  };
});

afterEach(cleanup);

function renderWithProviders(ui: React.ReactElement) {
  return render(
    <I18nextProvider i18n={i18n}>
      <ThemeProvider theme={appTheme}>{ui}</ThemeProvider>
    </I18nextProvider>,
  );
}

describe("MissionCenter Organism", () => {
  it("renders MissionCenter main cockpit component and switches tabs", () => {
    const onRefresh = vi.fn();
    renderWithProviders(
      <MissionCenter missionData={mockMissionData} onRefresh={onRefresh} />,
    );

    expect(screen.getByText("OPERATIONS CENTER")).toBeDefined();
    expect(screen.getByTestId("subtab-audit")).toBeDefined();
    expect(screen.getByTestId("subtab-errors")).toBeDefined();

    // Click tab 1: Error Reports
    fireEvent.click(screen.getByTestId("subtab-errors"));
    expect(
      screen.getAllByText("403 Forbidden on /api/admin/system")[0],
    ).toBeDefined();

    // Click refresh button
    const refreshBtn = screen.getByTestId("mission-center-refresh-btn");
    fireEvent.click(refreshBtn);
    expect(onRefresh).toHaveBeenCalledTimes(1);
  });

  it("renders MissionCenterKpiCards component", () => {
    const onSelectTab = vi.fn();
    renderWithProviders(
      <MissionCenterKpiCards
        metrics={mockMissionData.metrics}
        onSelectTab={onSelectTab}
      />,
    );

    expect(screen.getByText("Cloud Infrastructure")).toBeDefined();
    expect(screen.getByText("Active Incidents")).toBeDefined();
    fireEvent.click(screen.getByTestId("kpi-infrastructure"));
    expect(onSelectTab).toHaveBeenCalledWith(3);
  });

  it("renders MissionCenterAuditTab component", () => {
    renderWithProviders(
      <MissionCenterAuditTab auditLogs={mockMissionData.auditLogs} />,
    );

    expect(screen.getByText("System ADMIN")).toBeDefined();
  });

  it("renders MissionCenterErrorsTab component", () => {
    const onUpdateStatus = vi.fn();
    const onDeleteReport = vi.fn();
    const onClearResolved = vi.fn();

    renderWithProviders(
      <MissionCenterErrorsTab
        errorReports={mockMissionData.errorReports}
        onUpdateStatus={onUpdateStatus}
        onDeleteReport={onDeleteReport}
        onClearResolved={onClearResolved}
      />,
    );

    expect(
      screen.getAllByText("403 Forbidden on /api/admin/system")[0],
    ).toBeDefined();
  });

  it("renders MissionCenterSecurityTab component", () => {
    renderWithProviders(
      <MissionCenterSecurityTab
        securityIncidents={mockMissionData.securityIncidents}
      />,
    );

    expect(screen.getByText("403 Forbidden Access Attempt")).toBeDefined();
  });

  it("renders MissionCenterMetricsTab component", () => {
    renderWithProviders(
      <MissionCenterMetricsTab metrics={mockMissionData.metrics} />,
    );

    expect(screen.getByText("Cloudflare D1")).toBeDefined();
    expect(screen.getByText("Cloudflare R2")).toBeDefined();
    expect(screen.getByText("Platform User Demographics")).toBeDefined();
  });

  it("renders MissionCenterUserProfileCard with user and IP origin", () => {
    renderWithProviders(
      <MissionCenterUserProfileCard
        user={mockMissionData.errorReports[0].user}
        ipAddress="192.168.1.50"
        userAgent="Mozilla/5.0 TestBrowser"
        title="Attributed User Profile Card"
        isSecurityInfraction={true}
      />,
    );

    expect(screen.getByText("Attributed User Profile Card")).toBeDefined();
    expect(screen.getByText("192.168.1.50")).toBeDefined();
  });

  it("renders MissionCenterAuditTab with empty logs", () => {
    renderWithProviders(<MissionCenterAuditTab auditLogs={[]} />);
    expect(
      screen.getByText("No audit log records match the current filters."),
    ).toBeDefined();
  });

  it("renders MissionCenterErrorsTab with empty error reports", () => {
    renderWithProviders(<MissionCenterErrorsTab errorReports={[]} />);
    expect(
      screen.getByText("No error incidents found matching criteria."),
    ).toBeDefined();
  });

  it("renders MissionCenterSecurityTab with empty security incidents", () => {
    renderWithProviders(<MissionCenterSecurityTab securityIncidents={[]} />);
    expect(
      screen.getByText("Security & Access: Zero Active Incidents"),
    ).toBeDefined();
  });

  it("renders MissionCenterUserProfileCard for anonymous visitor", () => {
    renderWithProviders(
      <MissionCenterUserProfileCard
        user={null}
        ipAddress="10.0.0.1"
        userAgent="Mozilla/5.0 Anonymous"
        title="Anonymous Visitor"
        isSecurityInfraction={false}
      />,
    );

    expect(screen.getByText("Anonymous Visitor")).toBeDefined();
    expect(screen.getByText("10.0.0.1")).toBeDefined();
  });
});
