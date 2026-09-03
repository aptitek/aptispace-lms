import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Tooltip from "@mui/material/Tooltip";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import StorageRoundedIcon from "@mui/icons-material/StorageRounded";
import BugReportRoundedIcon from "@mui/icons-material/BugReportRounded";
import SecurityRoundedIcon from "@mui/icons-material/SecurityRounded";
import DynamicFeedRoundedIcon from "@mui/icons-material/DynamicFeedRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";

import type { SystemMetricsData } from "~/types/missionCenter";
import { KpiGrid, KpiCard } from "./MissionCenter.styles";

export interface MissionCenterKpiCardsProps {
  metrics: SystemMetricsData;
  onSelectTab?: (tabIndex: number) => void;
}

export function MissionCenterKpiCards({
  metrics,
  onSelectTab,
}: MissionCenterKpiCardsProps) {
  const theme = useTheme();
  const { t } = useTranslation(["common"]);

  const infraStatus = metrics.infrastructure.status;
  const isHealthy = infraStatus === "nominal";
  const isDegraded = infraStatus === "degraded";

  const infraColor = isHealthy
    ? theme.palette.success.main
    : isDegraded
      ? theme.palette.warning.main
      : theme.palette.error.main;

  const errorColor =
    metrics.counts.openErrors > 0
      ? theme.palette.error.main
      : theme.palette.success.main;

  const securityColor =
    metrics.counts.securityIncidents > 0
      ? theme.palette.warning.main
      : theme.palette.success.main;

  const activityColor = theme.palette.primary.main;

  return (
    <KpiGrid data-testid="mission-center-kpis">
      {/* 1. Infrastructure Card */}
      <KpiCard
        statuscolor={infraColor}
        data-testid="kpi-infrastructure"
        onClick={() => onSelectTab?.(3)}
        sx={{ cursor: "pointer" }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 1.5,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <StorageRoundedIcon sx={{ color: infraColor, fontSize: 22 }} />
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
              {t(
                "common:admin.missionCenter.kpi.infrastructure",
                "Cloud Infrastructure",
              )}
            </Typography>
          </Box>
          <Chip
            label={infraStatus.toUpperCase()}
            size="small"
            icon={
              isHealthy ? (
                <CheckCircleRoundedIcon />
              ) : isDegraded ? (
                <WarningAmberRoundedIcon />
              ) : (
                <ErrorOutlineRoundedIcon />
              )
            }
            sx={{
              fontWeight: 700,
              fontSize: "0.7rem",
              bgcolor: infraColor,
              color: theme.palette.common.white,
              "& .MuiChip-icon": { color: theme.palette.common.white },
            }}
          />
        </Box>

        <Box sx={{ my: 1 }}>
          <Typography
            variant="caption"
            sx={{ color: "text.secondary", display: "block" }}
          >
            Cloudflare D1: {metrics.infrastructure.d1.status} (
            {metrics.infrastructure.d1.latencyMs ?? 1}ms)
          </Typography>
          <Typography
            variant="caption"
            sx={{ color: "text.secondary", display: "block" }}
          >
            Cloudflare R2: {metrics.infrastructure.r2.status} (
            {metrics.infrastructure.r2.latencyMs ?? 1}ms)
          </Typography>
        </Box>

        <Box
          sx={{
            pt: 1,
            borderTop: `1px dashed ${theme.palette.divider}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            Runtime
          </Typography>
          <Typography variant="caption" sx={{ fontWeight: 600 }}>
            {metrics.infrastructure.environment}
          </Typography>
        </Box>
      </KpiCard>

      {/* 2. Error Reports Card */}
      <KpiCard
        statuscolor={errorColor}
        data-testid="kpi-errors"
        onClick={() => onSelectTab?.(1)}
        sx={{ cursor: "pointer" }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 1,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <BugReportRoundedIcon sx={{ color: errorColor, fontSize: 22 }} />
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
              {t("common:admin.missionCenter.kpi.errors", "Active Incidents")}
            </Typography>
          </Box>
          <Tooltip
            title={t(
              "common:admin.missionCenter.tooltips.viewErrors",
              "View reported error issues",
            )}
          >
            <Chip
              label={`${metrics.counts.openErrors} OPEN`}
              size="small"
              sx={{
                fontWeight: 700,
                fontSize: "0.7rem",
                bgcolor: errorColor,
                color: theme.palette.common.white,
              }}
            />
          </Tooltip>
        </Box>

        <Typography
          variant="h3"
          sx={{ fontWeight: 800, my: 0.5, color: errorColor }}
        >
          {metrics.counts.openErrors}
        </Typography>

        <Box
          sx={{
            pt: 1,
            borderTop: `1px dashed ${theme.palette.divider}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            Critical: {metrics.counts.criticalErrors}
          </Typography>
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            Total Logged: {metrics.counts.totalErrors}
          </Typography>
        </Box>
      </KpiCard>

      {/* 3. Security Sentinel Card */}
      <KpiCard
        statuscolor={securityColor}
        data-testid="kpi-security"
        onClick={() => onSelectTab?.(2)}
        sx={{ cursor: "pointer" }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 1,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <SecurityRoundedIcon sx={{ color: securityColor, fontSize: 22 }} />
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
              {t(
                "common:admin.missionCenter.kpi.security",
                "Security Sentinel",
              )}
            </Typography>
          </Box>
          <Chip
            label={
              metrics.counts.securityIncidents > 0 ? "ATTENTION" : "SECURE"
            }
            size="small"
            sx={{
              fontWeight: 700,
              fontSize: "0.7rem",
              bgcolor: securityColor,
              color: theme.palette.common.white,
            }}
          />
        </Box>

        <Typography
          variant="h3"
          sx={{ fontWeight: 800, my: 0.5, color: securityColor }}
        >
          {metrics.counts.securityIncidents}
        </Typography>

        <Box
          sx={{
            pt: 1,
            borderTop: `1px dashed ${theme.palette.divider}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            403/401 Probes: {metrics.counts.securityIncidents}
          </Typography>
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            Audited Sessions
          </Typography>
        </Box>
      </KpiCard>

      {/* 4. Activity & Platform Volume Card */}
      <KpiCard
        statuscolor={activityColor}
        data-testid="kpi-activity"
        onClick={() => onSelectTab?.(0)}
        sx={{ cursor: "pointer" }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 1,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <DynamicFeedRoundedIcon
              sx={{ color: activityColor, fontSize: 22 }}
            />
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
              {t(
                "common:admin.missionCenter.kpi.activity",
                "Platform Activity",
              )}
            </Typography>
          </Box>
          <Chip
            label={`${metrics.counts.auditLogs} EVENTS`}
            size="small"
            variant="outlined"
            color="primary"
            sx={{ fontWeight: 700, fontSize: "0.7rem" }}
          />
        </Box>

        <Typography
          variant="h3"
          sx={{ fontWeight: 800, my: 0.5, color: "text.primary" }}
        >
          {metrics.counts.totalUsers}
        </Typography>

        <Box
          sx={{
            pt: 1,
            borderTop: `1px dashed ${theme.palette.divider}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            {metrics.counts.students} Students • {metrics.counts.instructors}{" "}
            Instructors
          </Typography>
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            {metrics.counts.cohorts} Cohorts
          </Typography>
        </Box>
      </KpiCard>
    </KpiGrid>
  );
}
