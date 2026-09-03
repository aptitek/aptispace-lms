import { useState, useMemo } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@mui/material/TablePagination";
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
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);

  const selectedReport = useMemo(
    () => errorReports.find((r) => r.id === selectedReportId) || null,
    [errorReports, selectedReportId],
  );

  const filteredReports = useMemo(() => {
    return errorReports.filter((rep) =>
      filterErrorReport(rep, severityFilter, statusFilter, search),
    );
  }, [errorReports, severityFilter, statusFilter, search]);

  const pagedReports = useMemo(() => {
    const start = page * rowsPerPage;
    return filteredReports.slice(start, start + rowsPerPage);
  }, [filteredReports, page, rowsPerPage]);

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
            setPage(0);
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
              setPage(0);
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
              setPage(0);
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

      {/* Main Split-Screen: Table of Incidents (Left) + Inspector with User ProfileCard (Right) */}
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
        {/* Left Table */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <TableContainer
            sx={{
              borderRadius: 3,
              border: `1px solid ${theme.palette.divider}`,
              backgroundColor: theme.palette.background.paper,
            }}
          >
            <Table size="small" data-testid="errors-table">
              <TableHead>
                <TableRow sx={{ backgroundColor: theme.palette.action.hover }}>
                  <TableCell sx={{ fontWeight: 700 }}>Severity</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Error Message</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>User</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Time</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredReports.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      sx={{
                        textAlign: "center",
                        py: 4,
                        color: "text.secondary",
                      }}
                    >
                      {t(
                        "common:admin.missionCenter.noErrorsFound",
                        "No matching error incidents.",
                      )}
                    </TableCell>
                  </TableRow>
                ) : (
                  pagedReports.map((rep) => {
                    const isSelected = rep.id === selectedReportId;
                    const dateStr = new Date(rep.createdAt).toLocaleTimeString(
                      [],
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      },
                    );

                    return (
                      <TableRow
                        key={rep.id}
                        hover
                        selected={isSelected}
                        onClick={() => setSelectedReportId(rep.id)}
                        sx={{
                          cursor: "pointer",
                          backgroundColor: isSelected
                            ? theme.palette.action.selected
                            : undefined,
                        }}
                        data-testid={`error-row-${rep.id}`}
                      >
                        <TableCell>
                          <Chip
                            label={rep.severity.toUpperCase()}
                            size="small"
                            color={resolveSeverityColor(rep.severity)}
                            sx={{ fontWeight: 800, fontSize: "0.68rem" }}
                          />
                        </TableCell>
                        <TableCell sx={{ maxWidth: 260 }}>
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: isSelected ? 700 : 500,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {rep.message}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{ color: "text.secondary" }}
                          >
                            {rep.path || rep.url || "Internal"}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={rep.status.toUpperCase()}
                            size="small"
                            color={resolveStatusColor(rep.status)}
                            variant={
                              rep.status === "resolved" ? "outlined" : "filled"
                            }
                            sx={{ fontWeight: 700, fontSize: "0.68rem" }}
                          />
                        </TableCell>
                        <TableCell>
                          {rep.user ? (
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 600 }}
                            >
                              {rep.user.firstName} {rep.user.familyName}
                            </Typography>
                          ) : (
                            <Typography
                              variant="caption"
                              sx={{
                                color: "text.secondary",
                                fontStyle: "italic",
                              }}
                            >
                              {rep.ipAddress || "Guest"}
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell
                          sx={{ color: "text.secondary", fontSize: "0.78rem" }}
                        >
                          {dateStr}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={filteredReports.length}
            page={page}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[5, 8, 15, 30]}
            onPageChange={(_e, newPage) => setPage(newPage)}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
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
