import { useState, useMemo } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
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
import { DataGrid, type GridColDef } from "@mui/x-data-grid";

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

  const columns = useMemo<GridColDef<AdminAuditLogItem>[]>(
    () => [
      {
        field: "createdAt",
        headerName: t("common:admin.missionCenter.timestamp", "Timestamp"),
        minWidth: 190,
        flex: 1,
        valueFormatter: (value: string) =>
          value ? new Date(value).toLocaleString() : "",
        renderCell: (params) => {
          const dateStr = params.value
            ? new Date(params.value).toLocaleString()
            : "";
          return (
            <Tooltip title={dateStr}>
              <Typography
                variant="body2"
                sx={{
                  fontFamily: "monospace",
                  fontSize: "0.75rem",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {dateStr}
              </Typography>
            </Tooltip>
          );
        },
      },
      {
        field: "actor",
        headerName: t("common:admin.missionCenter.actor", "Actor"),
        minWidth: 200,
        flex: 1.2,
        valueGetter: (_value, row) =>
          row.actor
            ? `${row.actor.firstName || ""} ${row.actor.familyName || ""}`.trim()
            : row.userId || "System",
        renderCell: (params) => {
          const actorName = params.row.actor
            ? `${params.row.actor.firstName || ""} ${params.row.actor.familyName || ""}`.trim()
            : params.row.userId || "System";
          return (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                height: "100%",
              }}
            >
              <Avatar
                src={params.row.actor?.avatarUrl || undefined}
                sx={{ width: 24, height: 24, fontSize: "0.7rem" }}
              >
                {actorName.charAt(0)}
              </Avatar>
              <Box sx={{ minWidth: 0 }}>
                <Typography
                  variant="body2"
                  noWrap
                  sx={{
                    fontWeight: 600,
                    fontSize: "0.8rem",
                    lineHeight: 1.2,
                  }}
                >
                  {actorName}
                </Typography>
                {params.row.actor?.role && (
                  <Typography
                    variant="caption"
                    noWrap
                    sx={{
                      color: "text.secondary",
                      fontSize: "0.65rem",
                      display: "block",
                    }}
                  >
                    {params.row.actor.role}
                  </Typography>
                )}
              </Box>
            </Box>
          );
        },
      },
      {
        field: "action",
        headerName: t("common:admin.missionCenter.action", "Action"),
        width: 120,
        renderCell: (params) => (
          <Box sx={{ display: "flex", alignItems: "center", height: "100%" }}>
            <Chip
              label={params.value}
              size="small"
              color={resolveActionColor(params.value)}
              sx={{
                fontWeight: 800,
                fontSize: "0.65rem",
                height: 20,
              }}
            />
          </Box>
        ),
      },
      {
        field: "tableName",
        headerName: t("common:admin.missionCenter.targetTable", "Target Table"),
        minWidth: 140,
        flex: 0.9,
        renderCell: (params) => (
          <Box sx={{ display: "flex", alignItems: "center", height: "100%" }}>
            <Typography
              variant="body2"
              sx={{
                fontFamily: "monospace",
                fontSize: "0.8rem",
                fontWeight: 600,
              }}
            >
              {params.value}
            </Typography>
          </Box>
        ),
      },
      {
        field: "recordId",
        headerName: t("common:admin.missionCenter.recordId", "Record ID"),
        minWidth: 130,
        flex: 0.9,
        renderCell: (params) => (
          <Box sx={{ display: "flex", alignItems: "center", height: "100%" }}>
            <Typography
              variant="body2"
              noWrap
              sx={{
                fontFamily: "monospace",
                fontSize: "0.75rem",
                color: "text.secondary",
              }}
            >
              {params.value}
            </Typography>
          </Box>
        ),
      },
      {
        field: "payload",
        headerName: t("common:admin.missionCenter.payload", "Payload"),
        width: 110,
        sortable: false,
        filterable: false,
        renderCell: (params) => (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              height: "100%",
            }}
          >
            <Button
              size="small"
              variant="outlined"
              startIcon={<VisibilityRoundedIcon sx={{ fontSize: 16 }} />}
              onClick={() => setSelectedAuditForModal(params.row)}
              sx={{ fontSize: "0.75rem", py: 0.25, px: 1 }}
              data-testid={`inspect-audit-${params.row.id}`}
            >
              {t("common:admin.missionCenter.inspect", "Diff")}
            </Button>
          </Box>
        ),
      },
    ],
    [t],
  );

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

      {/* Audit Logs DataGrid */}
      <Box
        sx={{
          width: "100%",
          height: 520,
          backgroundColor: theme.palette.background.paper,
          borderRadius: 2,
        }}
        data-testid="audit-logs-datagrid"
      >
        <DataGrid
          rows={filteredLogs}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 10, page: 0 },
            },
          }}
          pageSizeOptions={[5, 10, 25, 50]}
          disableRowSelectionOnClick
          aria-label="audit logs table"
          localeText={{
            noRowsLabel: t(
              "common:admin.missionCenter.noAuditLogs",
              "No audit log records match the current filters.",
            ),
          }}
          sx={{
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 2,
          }}
        />
      </Box>

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
