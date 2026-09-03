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
import Avatar from "@mui/material/Avatar";
import InputAdornment from "@mui/material/InputAdornment";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

import type { AdminAuditLogItem, AuditActionType } from "~/types/missionCenter";
import { MissionCenterJsonModal } from "./MissionCenterJsonModal";

export interface MissionCenterAuditTabProps {
  auditLogs: AdminAuditLogItem[];
}

function resolveActionColor(action: AuditActionType) {
  switch (action) {
    case "INSERT":
      return "success";
    case "UPDATE":
      return "info";
    case "DELETE":
      return "error";
    default:
      return "default";
  }
}

function matchesAuditSearch(log: AdminAuditLogItem, query: string): boolean {
  if (!query) return true;
  const q = query.toLowerCase();
  const searchTargets = [
    log.recordId,
    log.tableName,
    log.actor?.firstName,
    log.actor?.familyName,
    log.actor?.email,
    log.newValues,
    log.oldValues,
  ];
  return searchTargets.some((field) => field?.toLowerCase().includes(q));
}

function filterAuditLog(
  log: AdminAuditLogItem,
  actionFilter: string,
  tableFilter: string,
  search: string,
): boolean {
  if (actionFilter !== "ALL" && log.action !== actionFilter) return false;
  if (tableFilter !== "ALL" && log.tableName !== tableFilter) return false;
  return matchesAuditSearch(log, search.trim());
}

export function MissionCenterAuditTab({
  auditLogs,
}: MissionCenterAuditTabProps) {
  const theme = useTheme();
  const { t } = useTranslation(["common"]);

  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState<string>("ALL");
  const [tableFilter, setTableFilter] = useState<string>("ALL");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedAuditForModal, setSelectedAuditForModal] =
    useState<AdminAuditLogItem | null>(null);

  const uniqueTables = useMemo(() => {
    const set = new Set<string>();
    auditLogs.forEach((l) => set.add(l.tableName));
    return Array.from(set);
  }, [auditLogs]);

  const filteredLogs = useMemo(() => {
    return auditLogs.filter((log) =>
      filterAuditLog(log, actionFilter, tableFilter, search),
    );
  }, [auditLogs, actionFilter, tableFilter, search]);

  const pagedLogs = useMemo(() => {
    const start = page * rowsPerPage;
    return filteredLogs.slice(start, start + rowsPerPage);
  }, [filteredLogs, page, rowsPerPage]);

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", gap: 2 }}
      data-testid="mission-center-audit-tab"
    >
      {/* Search & Filters */}
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
            "common:admin.missionCenter.searchLogs",
            "Search audit trail (tables, records, users, JSON)...",
          )}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(0);
          }}
          sx={{ minWidth: { xs: "100%", sm: 320 } }}
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
          data-testid="audit-search-input"
        />

        <Stack direction="row" spacing={1.5} sx={{ flexWrap: "wrap" }}>
          <TextField
            select
            size="small"
            label={t("common:admin.missionCenter.actionFilter", "Action")}
            value={actionFilter}
            onChange={(e) => {
              setActionFilter(e.target.value);
              setPage(0);
            }}
            sx={{ minWidth: 120 }}
            data-testid="audit-action-filter"
          >
            <MenuItem value="ALL">All Actions</MenuItem>
            <MenuItem value="INSERT">INSERT</MenuItem>
            <MenuItem value="UPDATE">UPDATE</MenuItem>
            <MenuItem value="DELETE">DELETE</MenuItem>
          </TextField>

          <TextField
            select
            size="small"
            label={t("common:admin.missionCenter.tableFilter", "Table")}
            value={tableFilter}
            onChange={(e) => {
              setTableFilter(e.target.value);
              setPage(0);
            }}
            sx={{ minWidth: 140 }}
            data-testid="audit-table-filter"
          >
            <MenuItem value="ALL">All Tables</MenuItem>
            {uniqueTables.map((tName) => (
              <MenuItem key={tName} value={tName}>
                {tName}
              </MenuItem>
            ))}
          </TextField>
        </Stack>
      </Box>

      {/* Audit Logs Table */}
      <TableContainer
        sx={{
          borderRadius: 2,
          border: `1px solid ${theme.palette.divider}`,
          overflowX: "auto",
        }}
      >
        <Table size="small" aria-label="audit logs table">
          <TableHead sx={{ backgroundColor: theme.palette.action.hover }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>Timestamp</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Actor</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Action</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Target Table</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Record ID</TableCell>
              <TableCell sx={{ fontWeight: 700, textAlign: "right" }}>
                Payload
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pagedLogs.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  sx={{ textAlign: "center", py: 4, color: "text.secondary" }}
                >
                  {t(
                    "common:admin.missionCenter.noAuditLogs",
                    "No audit log records match the current filters.",
                  )}
                </TableCell>
              </TableRow>
            ) : (
              pagedLogs.map((log) => {
                const dateStr = new Date(log.createdAt).toLocaleString();
                const actorName = log.actor
                  ? `${log.actor.firstName || ""} ${log.actor.familyName || ""}`.trim()
                  : log.userId || "System";

                return (
                  <TableRow
                    key={log.id}
                    hover
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell
                      sx={{
                        fontFamily: "monospace",
                        fontSize: "0.75rem",
                        whiteSpace: "nowrap",
                      }}
                    >
                      <Tooltip title={dateStr}>
                        <span>{dateStr}</span>
                      </Tooltip>
                    </TableCell>

                    <TableCell>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Avatar
                          src={log.actor?.avatarUrl || undefined}
                          sx={{ width: 24, height: 24, fontSize: "0.7rem" }}
                        >
                          {actorName.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 600,
                              fontSize: "0.8rem",
                              lineHeight: 1.1,
                            }}
                          >
                            {actorName}
                          </Typography>
                          {log.actor?.role && (
                            <Typography
                              variant="caption"
                              sx={{
                                color: "text.secondary",
                                fontSize: "0.65rem",
                              }}
                            >
                              {log.actor.role}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={log.action}
                        size="small"
                        color={resolveActionColor(log.action)}
                        sx={{
                          fontWeight: 800,
                          fontSize: "0.65rem",
                          height: 20,
                        }}
                      />
                    </TableCell>

                    <TableCell
                      sx={{
                        fontFamily: "monospace",
                        fontSize: "0.8rem",
                        fontWeight: 600,
                      }}
                    >
                      {log.tableName}
                    </TableCell>

                    <TableCell
                      sx={{
                        fontFamily: "monospace",
                        fontSize: "0.75rem",
                        color: "text.secondary",
                      }}
                    >
                      {log.recordId}
                    </TableCell>

                    <TableCell sx={{ textAlign: "right" }}>
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={
                          <VisibilityRoundedIcon sx={{ fontSize: 16 }} />
                        }
                        onClick={() => setSelectedAuditForModal(log)}
                        sx={{ fontSize: "0.75rem", py: 0.25, px: 1 }}
                        data-testid={`inspect-audit-${log.id}`}
                      >
                        {t("common:admin.missionCenter.inspect", "Diff")}
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50]}
        component="div"
        count={filteredLogs.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(_e, newPage) => setPage(newPage)}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
      />

      {/* JSON / Diff Modal */}
      {selectedAuditForModal && (
        <MissionCenterJsonModal
          open={Boolean(selectedAuditForModal)}
          title={`Audit Payload: ${selectedAuditForModal.tableName} (${selectedAuditForModal.action})`}
          subtitle={`Record ID: ${selectedAuditForModal.recordId}`}
          payload={{
            action: selectedAuditForModal.action,
            table: selectedAuditForModal.tableName,
            recordId: selectedAuditForModal.recordId,
            actor: selectedAuditForModal.actor,
            timestamp: selectedAuditForModal.createdAt,
            oldValues: selectedAuditForModal.oldValues
              ? JSON.parse(selectedAuditForModal.oldValues)
              : null,
            newValues: selectedAuditForModal.newValues
              ? JSON.parse(selectedAuditForModal.newValues)
              : null,
          }}
          onClose={() => setSelectedAuditForModal(null)}
        />
      )}
    </Box>
  );
}
