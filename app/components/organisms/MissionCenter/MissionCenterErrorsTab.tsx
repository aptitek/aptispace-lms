import { useState, useMemo } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import InputAdornment from "@mui/material/InputAdornment";
import Stack from "@mui/material/Stack";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import CleaningServicesRoundedIcon from "@mui/icons-material/CleaningServicesRounded";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import {
  DataGrid,
  type GridColDef,
  type GridRowSelectionModel,
} from "@mui/x-data-grid";

import type {
  AdminErrorReportItem,
  ErrorSeverityType,
  ErrorStatusType,
} from "~/types/missionCenter";
import { MissionCenterErrorInspector } from "./MissionCenterErrorInspector";

export interface MissionCenterErrorsTabProps {
  errorReports: AdminErrorReportItem[];
  onUpdateStatus?: (reportId: string, status: ErrorStatusType) => void;
  onDeleteReport?: (reportId: string) => void;
  onClearResolved?: () => void;
  isSubmitting?: boolean;
}

function resolveSeverityColor(severity: ErrorSeverityType) {
  switch (severity) {
    case "critical":
    case "error":
      return "error";
    case "security":
      return "error";
    case "warning":
      return "warning";
    case "info":
      return "info";
    default:
      return "default";
  }
}

function resolveStatusColor(status: ErrorStatusType) {
  switch (status) {
    case "open":
      return "error";
    case "investigating":
      return "warning";
    case "resolved":
      return "success";
    case "ignored":
      return "default";
  }
}

function matchesErrorSearch(rep: AdminErrorReportItem, query: string): boolean {
  if (!query) return true;
  const q = query.toLowerCase();
  const targets = [
    rep.message,
    rep.url,
    rep.path,
    rep.ipAddress,
    rep.user?.firstName,
    rep.user?.familyName,
    rep.user?.email,
  ];
  return targets.some((field) => field?.toLowerCase().includes(q));
}

function filterErrorReport(
  rep: AdminErrorReportItem,
  severity: string,
  status: string,
  search: string,
): boolean {
  if (severity !== "ALL" && rep.severity !== severity) return false;
  if (status !== "ALL" && rep.status !== status) return false;
  return matchesErrorSearch(rep, search.trim());
}

export function MissionCenterErrorsTab({
  errorReports,
  onUpdateStatus,
  onDeleteReport,
  onClearResolved,
  isSubmitting = false,
}: MissionCenterErrorsTabProps) {
  const theme = useTheme();
  const { t } = useTranslation(["common"]);

  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [selectedReportId, setSelectedReportId] = useState<string | null>(
    errorReports[0]?.id || null,
  );

  const selectedReport = useMemo(
    () => errorReports.find((r) => r.id === selectedReportId) || null,
    [errorReports, selectedReportId],
  );

  const filteredReports = useMemo(() => {
    return errorReports.filter((rep) =>
      filterErrorReport(rep, severityFilter, statusFilter, search),
    );
  }, [errorReports, severityFilter, statusFilter, search]);

  const rowSelectionModel: GridRowSelectionModel = useMemo(
    () => ({
      type: "include",
      ids: new Set(selectedReportId ? [selectedReportId] : []),
    }),
    [selectedReportId],
  );

  const columns = useMemo<GridColDef<AdminErrorReportItem>[]>(
    () => [
      {
        field: "severity",
        headerName: t("common:admin.missionCenter.severity", "Severity"),
        width: 110,
        renderCell: (params) => (
          <Box sx={{ display: "flex", alignItems: "center", height: "100%" }}>
            <Chip
              label={params.value.toUpperCase()}
              size="small"
              color={resolveSeverityColor(params.value)}
              sx={{ fontWeight: 800, fontSize: "0.68rem" }}
            />
          </Box>
        ),
      },
      {
        field: "message",
        headerName: t(
          "common:admin.missionCenter.errorMessage",
          "Error Message",
        ),
        flex: 1.5,
        minWidth: 200,
        renderCell: (params) => {
          const isSelected = params.row.id === selectedReportId;
          return (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                height: "100%",
                overflow: "hidden",
                minWidth: 0,
              }}
            >
              <Typography
                variant="body2"
                noWrap
                sx={{
                  fontWeight: isSelected ? 700 : 500,
                }}
              >
                {params.value}
              </Typography>
              <Typography
                variant="caption"
                noWrap
                sx={{ color: "text.secondary" }}
              >
                {params.row.path || params.row.url || "Internal"}
              </Typography>
            </Box>
          );
        },
      },
      {
        field: "status",
        headerName: t("common:admin.missionCenter.status", "Status"),
        width: 120,
        renderCell: (params) => (
          <Box sx={{ display: "flex", alignItems: "center", height: "100%" }}>
            <Chip
              label={params.value.toUpperCase()}
              size="small"
              color={resolveStatusColor(params.value)}
              variant={params.value === "resolved" ? "outlined" : "filled"}
              sx={{ fontWeight: 700, fontSize: "0.68rem" }}
            />
          </Box>
        ),
      },
      {
        field: "user",
        headerName: t("common:admin.missionCenter.user", "User"),
        flex: 1,
        minWidth: 130,
        valueGetter: (_value, row) =>
          row.user
            ? `${row.user.firstName} ${row.user.familyName}`
            : row.ipAddress || "Guest",
        renderCell: (params) => (
          <Box sx={{ display: "flex", alignItems: "center", height: "100%" }}>
            {params.row.user ? (
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {params.row.user.firstName} {params.row.user.familyName}
              </Typography>
            ) : (
              <Typography
                variant="caption"
                sx={{
                  color: "text.secondary",
                  fontStyle: "italic",
                }}
              >
                {params.row.ipAddress || "Guest"}
              </Typography>
            )}
          </Box>
        ),
      },
      {
        field: "createdAt",
        headerName: t("common:admin.missionCenter.time", "Time"),
        width: 100,
        valueFormatter: (value: string) =>
          value
            ? new Date(value).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })
            : "",
        renderCell: (params) => {
          const dateStr = params.value
            ? new Date(params.value).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })
            : "";
          return (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                height: "100%",
              }}
            >
              <Typography
                variant="body2"
                sx={{ color: "text.secondary", fontSize: "0.78rem" }}
              >
                {dateStr}
              </Typography>
            </Box>
          );
        },
      },
    ],
    [t, selectedReportId],
  );

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", gap: 2 }}
      data-testid="mission-center-errors-tab"
    >
      {/* Search & Filter Bar */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <TextField
          size="small"
          placeholder={t(
            "common:admin.missionCenter.searchErrors",
            "Search errors (message, route, user, IP)...",
          )}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
          sx={{ minWidth: { xs: "100%", sm: 300 } }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRoundedIcon
                    sx={{ fontSize: 20, color: "text.secondary" }}
                  />
                </InputAdornment>
              ),
            },
          }}
          data-testid="errors-search-input"
        />

        <Stack
          direction="row"
          spacing={1.5}
          sx={{ flexWrap: "wrap", alignItems: "center" }}
        >
          <TextField
            select
            size="small"
            label={t("common:admin.missionCenter.severityFilter", "Severity")}
            value={severityFilter}
            onChange={(e) => {
              setSeverityFilter(e.target.value);
            }}
            sx={{ minWidth: 130 }}
            data-testid="errors-severity-filter"
          >
            <MenuItem value="ALL">All Severities</MenuItem>
            <MenuItem value="critical">Critical</MenuItem>
            <MenuItem value="security">Security</MenuItem>
            <MenuItem value="error">Error</MenuItem>
            <MenuItem value="warning">Warning</MenuItem>
            <MenuItem value="info">Info</MenuItem>
          </TextField>

          <TextField
            select
            size="small"
            label={t("common:admin.missionCenter.statusFilter", "Status")}
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
            }}
            sx={{ minWidth: 130 }}
            data-testid="errors-status-filter"
          >
            <MenuItem value="ALL">All Statuses</MenuItem>
            <MenuItem value="open">Open</MenuItem>
            <MenuItem value="investigating">Investigating</MenuItem>
            <MenuItem value="resolved">Resolved</MenuItem>
            <MenuItem value="ignored">Ignored</MenuItem>
          </TextField>

          {onClearResolved && (
            <Button
              variant="text"
              size="small"
              color="inherit"
              startIcon={<CleaningServicesRoundedIcon />}
              onClick={onClearResolved}
              disabled={isSubmitting}
              sx={{ textTransform: "none" }}
              data-testid="clear-resolved-errors-btn"
            >
              {t("common:admin.missionCenter.clearResolved", "Purge Resolved")}
            </Button>
          )}
        </Stack>
      </Box>

      {/* Main Split-Screen: DataGrid of Incidents (Left) + Inspector with User ProfileCard (Right) */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: selectedReport
            ? { xs: "1fr", lg: "1.2fr 1fr" }
            : "1fr",
          gap: 2.5,
          alignItems: "start",
        }}
      >
        {/* Left Table / DataGrid */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
            width: "100%",
            height: 520,
            backgroundColor: theme.palette.background.paper,
            borderRadius: 3,
          }}
          data-testid="errors-table"
        >
          <DataGrid
            rows={filteredReports}
            columns={columns}
            rowSelectionModel={rowSelectionModel}
            onRowSelectionModelChange={(newSelection) => {
              if (newSelection.type === "include") {
                const first = Array.from(newSelection.ids)[0];
                if (first !== undefined) {
                  setSelectedReportId(String(first));
                }
              }
            }}
            onRowClick={(params) => setSelectedReportId(String(params.row.id))}
            disableMultipleRowSelection
            initialState={{
              pagination: {
                paginationModel: { pageSize: 8, page: 0 },
              },
            }}
            pageSizeOptions={[5, 8, 15, 30]}
            localeText={{
              noRowsLabel: t(
                "common:admin.missionCenter.noErrorsFound",
                "No matching error incidents.",
              ),
            }}
            sx={{
              borderRadius: 3,
              border: `1px solid ${theme.palette.divider}`,
              cursor: "pointer",
            }}
          />
        </Box>

        {/* Right Inspector: Featuring the User ProfileCard and Error Diagnostic */}
        {selectedReport && (
          <MissionCenterErrorInspector
            report={selectedReport}
            onClose={() => setSelectedReportId(null)}
            onUpdateStatus={onUpdateStatus}
            onDeleteReport={onDeleteReport}
            isSubmitting={isSubmitting}
          />
        )}
      </Box>
    </Box>
  );
}
