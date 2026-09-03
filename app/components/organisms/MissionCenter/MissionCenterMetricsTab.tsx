import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import LinearProgress from "@mui/material/LinearProgress";
import Chip from "@mui/material/Chip";
import StorageRoundedIcon from "@mui/icons-material/StorageRounded";
import CloudQueueRoundedIcon from "@mui/icons-material/CloudQueueRounded";
import MemoryRoundedIcon from "@mui/icons-material/MemoryRounded";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

import type { SystemMetricsData } from "~/types/missionCenter";

export interface MissionCenterMetricsTabProps {
  metrics: SystemMetricsData;
}

export function MissionCenterMetricsTab({
  metrics,
}: MissionCenterMetricsTabProps) {
  const theme = useTheme();
  const { t } = useTranslation(["common"]);

  const maxRows = Math.max(...metrics.tableInventory.map((t) => t.rowCount), 1);

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", gap: 3 }}
      data-testid="mission-center-metrics-tab"
    >
      {/* 1. Services Infrastructure Grid */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          gap: 2,
        }}
      >
        {/* D1 Service Card */}
        <Card variant="outlined" sx={{ p: 2.5, borderRadius: 2 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 1.5,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <StorageRoundedIcon sx={{ color: "primary.main" }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                {metrics.infrastructure.d1.name}
              </Typography>
            </Box>
            <Chip
              label={metrics.infrastructure.d1.status.toUpperCase()}
              size="small"
              color={
                metrics.infrastructure.d1.status === "nominal"
                  ? "success"
                  : "warning"
              }
              sx={{ fontWeight: 800, fontSize: "0.7rem" }}
            />
          </Box>
          <Typography variant="body2" sx={{ color: "text.secondary", mb: 1 }}>
            {metrics.infrastructure.d1.details ||
              "SQLite database operational and responding to probes."}
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              pt: 1,
              borderTop: `1px dashed ${theme.palette.divider}`,
            }}
          >
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              Query Ping Latency
            </Typography>
            <Typography
              variant="caption"
              sx={{ fontFamily: "monospace", fontWeight: 700 }}
            >
              {metrics.infrastructure.d1.latencyMs ?? 1} ms
            </Typography>
          </Box>
        </Card>

        {/* R2 Service Card */}
        <Card variant="outlined" sx={{ p: 2.5, borderRadius: 2 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 1.5,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <CloudQueueRoundedIcon sx={{ color: "secondary.main" }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                {metrics.infrastructure.r2.name}
              </Typography>
            </Box>
            <Chip
              label={metrics.infrastructure.r2.status.toUpperCase()}
              size="small"
              color={
                metrics.infrastructure.r2.status === "nominal"
                  ? "success"
                  : "warning"
              }
              sx={{ fontWeight: 800, fontSize: "0.7rem" }}
            />
          </Box>
          <Typography variant="body2" sx={{ color: "text.secondary", mb: 1 }}>
            {metrics.infrastructure.r2.details ||
              "R2 Object Storage binding connected for optimized user avatar assets."}
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              pt: 1,
              borderTop: `1px dashed ${theme.palette.divider}`,
            }}
          >
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              Storage Probe Latency
            </Typography>
            <Typography
              variant="caption"
              sx={{ fontFamily: "monospace", fontWeight: 700 }}
            >
              {metrics.infrastructure.r2.latencyMs ?? 1} ms
            </Typography>
          </Box>
        </Card>
      </Box>

      {/* 2. Platform Demographics & Volume */}
      <Card variant="outlined" sx={{ p: 2.5, borderRadius: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          <PeopleAltRoundedIcon sx={{ color: "primary.main" }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            {t(
              "common:admin.missionCenter.platformVolume",
              "Platform User Demographics",
            )}
          </Typography>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "repeat(2, 1fr)", sm: "repeat(4, 1fr)" },
            gap: 2,
          }}
        >
          <Box
            sx={{
              p: 1.5,
              borderRadius: 1.5,
              bgcolor: theme.palette.action.hover,
            }}
          >
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              Students
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, mt: 0.5 }}>
              {metrics.counts.students}
            </Typography>
          </Box>
          <Box
            sx={{
              p: 1.5,
              borderRadius: 1.5,
              bgcolor: theme.palette.action.hover,
            }}
          >
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              Instructors
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, mt: 0.5 }}>
              {metrics.counts.instructors}
            </Typography>
          </Box>
          <Box
            sx={{
              p: 1.5,
              borderRadius: 1.5,
              bgcolor: theme.palette.action.hover,
            }}
          >
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              Administrators
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, mt: 0.5 }}>
              {metrics.counts.admins}
            </Typography>
          </Box>
          <Box
            sx={{
              p: 1.5,
              borderRadius: 1.5,
              bgcolor: theme.palette.action.hover,
            }}
          >
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              Institutions
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, mt: 0.5 }}>
              {metrics.counts.institutions}
            </Typography>
          </Box>
        </Box>
      </Card>

      {/* 3. D1 SQLite Database Table Inventory */}
      <Card
        variant="outlined"
        sx={{ p: 2.5, borderRadius: 2 }}
        data-testid="d1-table-inventory"
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <MemoryRoundedIcon sx={{ color: "primary.main" }} />
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              {t(
                "common:admin.missionCenter.tableInventoryTitle",
                "D1 Database Table Inventory & Row Counts",
              )}
            </Typography>
          </Box>
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            {metrics.tableInventory.length} Tables Monitored
          </Typography>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {metrics.tableInventory.map((tMetric) => {
            const percentage = Math.round((tMetric.rowCount / maxRows) * 100);

            return (
              <Box
                key={tMetric.tableName}
                sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{ fontFamily: "monospace", fontWeight: 600 }}
                  >
                    {tMetric.tableName}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ fontFamily: "monospace", fontWeight: 700 }}
                  >
                    {tMetric.rowCount} rows
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={percentage}
                  sx={{
                    height: 6,
                    borderRadius: 3,
                    bgcolor: theme.palette.action.hover,
                  }}
                />
              </Box>
            );
          })}
        </Box>
      </Card>
    </Box>
  );
}
