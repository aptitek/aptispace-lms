import { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import HubRoundedIcon from "@mui/icons-material/HubRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import DynamicFeedRoundedIcon from "@mui/icons-material/DynamicFeedRounded";
import BugReportRoundedIcon from "@mui/icons-material/BugReportRounded";
import SecurityRoundedIcon from "@mui/icons-material/SecurityRounded";
import StorageRoundedIcon from "@mui/icons-material/StorageRounded";
import { useTranslation } from "react-i18next";
import { useTheme } from "@mui/material/styles";

import type { MissionCenterData, ErrorStatusType } from "~/types/missionCenter";
import {
  MissionCenterRoot,
  MissionCenterHeader,
  SubTabsBar,
  ContentContainer,
} from "./MissionCenter.styles";
import { MissionCenterKpiCards } from "./MissionCenterKpiCards";
import { MissionCenterAuditTab } from "./MissionCenterAuditTab";
import { MissionCenterErrorsTab } from "./MissionCenterErrorsTab";
import { MissionCenterSecurityTab } from "./MissionCenterSecurityTab";
import { MissionCenterMetricsTab } from "./MissionCenterMetricsTab";

export interface MissionCenterProps {
  missionData: MissionCenterData;
  onRefresh?: () => void;
  onUpdateErrorStatus?: (reportId: string, status: ErrorStatusType) => void;
  onDeleteErrorReport?: (reportId: string) => void;
  onClearResolvedErrors?: () => void;
  isSubmitting?: boolean;
}

export default function MissionCenter({
  missionData,
  onRefresh,
  onUpdateErrorStatus,
  onDeleteErrorReport,
  onClearResolvedErrors,
  isSubmitting = false,
}: MissionCenterProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const [subTab, setSubTab] = useState(0);

  const handleSubTabChange = (
    _event: React.SyntheticEvent,
    newValue: number,
  ) => {
    setSubTab(newValue);
  };

  return (
    <MissionCenterRoot data-testid="mission-center-root">
      {/* Cockpit Title Header */}
      <MissionCenterHeader>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 44,
              height: 44,
              borderRadius: 2,
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
            }}
          >
            <HubRoundedIcon sx={{ fontSize: 26 }} />
          </Box>
          <Box>
            <Typography
              variant="h6"
              sx={{ fontWeight: 800, letterSpacing: "-0.01em" }}
            >
              {t("common:admin.missionCenter.title", "MISSION CENTER")}
            </Typography>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              {t(
                "common:admin.missionCenter.subtitle",
                "Application telemetry, incident tracker, security sentinel & Cloudflare metrics",
              )}
            </Typography>
          </Box>
        </Box>

        {onRefresh && (
          <Button
            variant="outlined"
            size="small"
            startIcon={<RefreshRoundedIcon />}
            onClick={onRefresh}
            disabled={isSubmitting}
            sx={{ borderRadius: 9999 }}
            data-testid="mission-center-refresh-btn"
          >
            {t(
              "common:admin.missionCenter.runDiagnostics",
              "Run Diagnostics Probe",
            )}
          </Button>
        )}
      </MissionCenterHeader>

      {/* Top 4 KPI Metric Cards */}
      <MissionCenterKpiCards
        metrics={missionData.metrics}
        onSelectTab={setSubTab}
      />

      {/* Sub Navigation Tabs */}
      <SubTabsBar>
        <Tabs
          value={subTab}
          onChange={handleSubTabChange}
          aria-label="Mission center views"
          sx={{
            minHeight: 44,
            "& .MuiTab-root": {
              minHeight: 44,
              textTransform: "none",
              fontWeight: 700,
              fontSize: "0.85rem",
              borderRadius: 2,
              px: 2,
            },
          }}
          data-testid="mission-center-subtabs"
        >
          <Tab
            icon={<DynamicFeedRoundedIcon sx={{ fontSize: 18 }} />}
            iconPosition="start"
            label={
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <span>
                  {t("common:admin.missionCenter.tabs.audit", "Audit Trail")}
                </span>
                <Chip
                  label={missionData.auditLogs.length}
                  size="small"
                  sx={{ height: 18, fontSize: "0.65rem", fontWeight: 800 }}
                />
              </Box>
            }
            id="mission-subtab-0"
            aria-controls="mission-subpanel-0"
            data-testid="subtab-audit"
          />

          <Tab
            icon={<BugReportRoundedIcon sx={{ fontSize: 18 }} />}
            iconPosition="start"
            label={
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <span>
                  {t(
                    "common:admin.missionCenter.tabs.errors",
                    "Errors & Incidents",
                  )}
                </span>
                {missionData.openIssuesCount > 0 ? (
                  <Chip
                    label={missionData.openIssuesCount}
                    size="small"
                    color="error"
                    sx={{ height: 18, fontSize: "0.65rem", fontWeight: 800 }}
                  />
                ) : (
                  <Chip
                    label="0"
                    size="small"
                    color="success"
                    sx={{ height: 18, fontSize: "0.65rem", fontWeight: 800 }}
                  />
                )}
              </Box>
            }
            id="mission-subtab-1"
            aria-controls="mission-subpanel-1"
            data-testid="subtab-errors"
          />

          <Tab
            icon={<SecurityRoundedIcon sx={{ fontSize: 18 }} />}
            iconPosition="start"
            label={
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <span>
                  {t(
                    "common:admin.missionCenter.tabs.security",
                    "Security Sentinel",
                  )}
                </span>
                {missionData.securityIncidents.length > 0 && (
                  <Chip
                    label={missionData.securityIncidents.length}
                    size="small"
                    color="warning"
                    sx={{ height: 18, fontSize: "0.65rem", fontWeight: 800 }}
                  />
                )}
              </Box>
            }
            id="mission-subtab-2"
            aria-controls="mission-subpanel-2"
            data-testid="subtab-security"
          />

          <Tab
            icon={<StorageRoundedIcon sx={{ fontSize: 18 }} />}
            iconPosition="start"
            label={
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <span>
                  {t(
                    "common:admin.missionCenter.tabs.metrics",
                    "Infrastructure & Metrics",
                  )}
                </span>
              </Box>
            }
            id="mission-subtab-3"
            aria-controls="mission-subpanel-3"
            data-testid="subtab-metrics"
          />
        </Tabs>
      </SubTabsBar>

      {/* Main Subview Panel */}
      <ContentContainer
        role="tabpanel"
        id={`mission-subpanel-${subTab}`}
        aria-labelledby={`mission-subtab-${subTab}`}
      >
        {subTab === 0 && (
          <MissionCenterAuditTab auditLogs={missionData.auditLogs} />
        )}

        {subTab === 1 && (
          <MissionCenterErrorsTab
            errorReports={missionData.errorReports}
            onUpdateStatus={onUpdateErrorStatus}
            onDeleteReport={onDeleteErrorReport}
            onClearResolved={onClearResolvedErrors}
            isSubmitting={isSubmitting}
          />
        )}

        {subTab === 2 && (
          <MissionCenterSecurityTab
            securityIncidents={missionData.securityIncidents}
          />
        )}

        {subTab === 3 && (
          <MissionCenterMetricsTab metrics={missionData.metrics} />
        )}
      </ContentContainer>
    </MissionCenterRoot>
  );
}
