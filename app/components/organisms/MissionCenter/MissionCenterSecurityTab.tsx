import { useState, useMemo } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import ShieldRoundedIcon from "@mui/icons-material/ShieldRounded";
import SecurityRoundedIcon from "@mui/icons-material/SecurityRounded";
import WarningRoundedIcon from "@mui/icons-material/WarningRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import {
  DataGrid,
  type GridColDef,
  type GridRowSelectionModel,
} from "@mui/x-data-grid";

import type { SecurityIncidentItem } from "~/types/missionCenter";
import { MissionCenterUserProfileCard } from "./MissionCenterUserProfileCard";
import { MissionCenterJsonModal } from "./MissionCenterJsonModal";

export interface MissionCenterSecurityTabProps {
  securityIncidents: SecurityIncidentItem[];
}

interface ThreatPanelProps {
  incident: SecurityIncidentItem;
  onInspectPayload: (payload: unknown) => void;
}

function SecurityThreatPanel({ incident, onInspectPayload }: ThreatPanelProps) {
  const theme = useTheme();
  const { t } = useTranslation(["common"]);
  const targetUser = incident.user || incident.actorUser || null;

  return (
    <Card
      variant="outlined"
      sx={{
        p: 2.5,
        borderRadius: 3,
        backgroundColor: theme.palette.background.paper,
        display: "flex",
        flexDirection: "column",
        gap: 2.5,
        position: "sticky",
        top: 24,
      }}
      data-testid="security-inspector-panel"
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 1,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <WarningRoundedIcon color="error" />
          <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
            {t(
              "common:admin.missionCenter.securityThreatIntel",
              "Attributed User & Origin",
            )}
          </Typography>
        </Box>
        <Chip
          label={incident.severity.toUpperCase()}
          size="small"
          color={incident.severity === "security" ? "error" : "warning"}
          sx={{ fontWeight: 800, fontSize: "0.7rem" }}
        />
      </Box>

      {/* User Grid Card of Bad User / Target User */}
      <MissionCenterUserProfileCard
        user={targetUser}
        ipAddress={incident.ipAddress}
        userAgent={incident.userAgent}
        title={t(
          "common:admin.missionCenter.badUserCardTitle",
          "Attributed User Identity Card",
        )}
        isSecurityInfraction
      />

      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        <Typography
          variant="caption"
          sx={{
            fontWeight: 700,
            textTransform: "uppercase",
            color: "text.secondary",
          }}
        >
          {t(
            "common:admin.missionCenter.incidentDescription",
            "Infraction Summary",
          )}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            fontWeight: 600,
            p: 1.5,
            borderRadius: 1.5,
            backgroundColor: theme.palette.action.hover,
            fontFamily: "monospace",
          }}
        >
          {incident.description}
        </Typography>
      </Box>

      {(incident.rawError || incident.rawAudit) && (
        <Button
          variant="outlined"
          size="small"
          startIcon={<VisibilityRoundedIcon />}
          onClick={() =>
            onInspectPayload(incident.rawError || incident.rawAudit)
          }
          sx={{ alignSelf: "flex-start" }}
          data-testid="inspect-security-payload-btn"
        >
          {t(
            "common:admin.missionCenter.inspectRawPayload",
            "Inspect Security Raw Event",
          )}
        </Button>
      )}
    </Card>
  );
}

interface SecurityIncidentTableProps {
  securityIncidents: SecurityIncidentItem[];
  selectedIncidentId: string | null;
  onSelectIncident: (id: string) => void;
}

function resolveUserDisplay(incident: SecurityIncidentItem): string {
  if (incident.user) {
    return `${incident.user.firstName || ""} ${incident.user.familyName || ""}`.trim();
  }
  if (incident.actorUser) {
    return `Admin: ${incident.actorUser.firstName || ""}`;
  }
  return "Anonymous / Unauthenticated";
}

function SecurityIncidentTable({
  securityIncidents,
  selectedIncidentId,
  onSelectIncident,
}: SecurityIncidentTableProps) {
  const theme = useTheme();
  const { t } = useTranslation(["common"]);

  const rowSelectionModel: GridRowSelectionModel = useMemo(
    () => ({
      type: "include",
      ids: new Set(selectedIncidentId ? [selectedIncidentId] : []),
    }),
    [selectedIncidentId],
  );

  const columns = useMemo<GridColDef<SecurityIncidentItem>[]>(
    () => [
      {
        field: "type",
        headerName: t("common:admin.missionCenter.type", "Type"),
        width: 140,
        renderCell: (params) => (
          <Box sx={{ display: "flex", alignItems: "center", height: "100%" }}>
            <Chip
              label={params.value.replace("_", " ").toUpperCase()}
              size="small"
              color={params.row.severity === "security" ? "error" : "warning"}
              sx={{ fontWeight: 700, fontSize: "0.68rem" }}
            />
          </Box>
        ),
      },
      {
        field: "title",
        headerName: t(
          "common:admin.missionCenter.incidentTitle",
          "Incident Title",
        ),
        flex: 1.5,
        minWidth: 180,
        renderCell: (params) => {
          const isSelected = params.row.id === selectedIncidentId;
          return (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                height: "100%",
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
            </Box>
          );
        },
      },
      {
        field: "user",
        headerName: t(
          "common:admin.missionCenter.attributedUser",
          "Attributed User / Target",
        ),
        flex: 1.2,
        minWidth: 150,
        valueGetter: (_value, row) => resolveUserDisplay(row),
        renderCell: (params) => (
          <Box sx={{ display: "flex", alignItems: "center", height: "100%" }}>
            <Typography variant="body2" noWrap sx={{ fontSize: "0.85rem" }}>
              {resolveUserDisplay(params.row)}
            </Typography>
          </Box>
        ),
      },
      {
        field: "ipAddress",
        headerName: t("common:admin.missionCenter.ipOrigin", "IP Origin"),
        flex: 0.9,
        minWidth: 110,
        renderCell: (params) => (
          <Box sx={{ display: "flex", alignItems: "center", height: "100%" }}>
            <Typography
              variant="body2"
              sx={{ fontFamily: "monospace", fontSize: "0.8rem" }}
            >
              {params.value || "Unknown"}
            </Typography>
          </Box>
        ),
      },
      {
        field: "timestamp",
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
            <Box sx={{ display: "flex", alignItems: "center", height: "100%" }}>
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
    [t, selectedIncidentId],
  );

  return (
    <Box
      sx={{
        width: "100%",
        height: 520,
        borderRadius: 3,
        backgroundColor: theme.palette.background.paper,
      }}
      data-testid="security-incidents-table"
    >
      <DataGrid
        rows={securityIncidents}
        columns={columns}
        rowSelectionModel={rowSelectionModel}
        onRowSelectionModelChange={(newSelection) => {
          if (newSelection.type === "include") {
            const first = Array.from(newSelection.ids)[0];
            if (first !== undefined) {
              onSelectIncident(String(first));
            }
          }
        }}
        onRowClick={(params) => onSelectIncident(String(params.row.id))}
        disableMultipleRowSelection
        initialState={{
          pagination: {
            paginationModel: { pageSize: 8, page: 0 },
          },
        }}
        pageSizeOptions={[5, 8, 15, 30]}
        localeText={{
          noRowsLabel: t(
            "common:admin.missionCenter.noSecurityIncidents",
            "No security incidents or 403 infractions recorded.",
          ),
        }}
        sx={{
          borderRadius: 3,
          border: `1px solid ${theme.palette.divider}`,
          cursor: "pointer",
        }}
      />
    </Box>
  );
}

function SecurityAlertBanner({ count }: { count: number }) {
  const { t } = useTranslation(["common"]);
  const hasIncidents = count > 0;
  const severity = hasIncidents ? "warning" : "success";
  const icon = hasIncidents ? <SecurityRoundedIcon /> : <ShieldRoundedIcon />;
  const title = hasIncidents
    ? t(
        "common:admin.missionCenter.securityAlertTitle",
        "Active Sentinel: {{count}} Incidents Audited",
        { count },
      )
    : t(
        "common:admin.missionCenter.securityCleanTitle",
        "Security Sentinel: Zero Active Vulnerabilities or Breaches",
      );
  const desc = hasIncidents
    ? t(
        "common:admin.missionCenter.securityAlertDesc",
        "Access control infractions, 403 Forbidden spikes, and sensitive administrative operations are tracked with full origin attribution.",
      )
    : t(
        "common:admin.missionCenter.securityCleanDesc",
        "All access controls, role guards, and credentials integrity checks are nominal.",
      );

  return (
    <Alert
      severity={severity}
      icon={icon}
      sx={{ borderRadius: 2 }}
      data-testid="security-status-alert"
    >
      <AlertTitle sx={{ fontWeight: 700 }}>{title}</AlertTitle>
      {desc}
    </Alert>
  );
}

export function MissionCenterSecurityTab({
  securityIncidents,
}: MissionCenterSecurityTabProps) {
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(
    securityIncidents[0]?.id || null,
  );
  const [inspectModalPayload, setInspectModalPayload] = useState<
    unknown | null
  >(null);

  const selectedIncident = useMemo(
    () => securityIncidents.find((i) => i.id === selectedIncidentId) || null,
    [securityIncidents, selectedIncidentId],
  );

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}
      data-testid="mission-center-security-tab"
    >
      <SecurityAlertBanner count={securityIncidents.length} />

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: selectedIncident
            ? { xs: "1fr", lg: "1.2fr 1fr" }
            : "1fr",
          gap: 2.5,
          alignItems: "start",
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <SecurityIncidentTable
            securityIncidents={securityIncidents}
            selectedIncidentId={selectedIncidentId}
            onSelectIncident={setSelectedIncidentId}
          />
        </Box>

        {selectedIncident && (
          <SecurityThreatPanel
            incident={selectedIncident}
            onInspectPayload={(p) => setInspectModalPayload(p)}
          />
        )}
      </Box>

      {Boolean(inspectModalPayload) && (
        <MissionCenterJsonModal
          open={Boolean(inspectModalPayload)}
          title={`Security Raw Event: ${selectedIncident?.title}`}
          payload={inspectModalPayload}
          onClose={() => setInspectModalPayload(null)}
        />
      )}
    </Box>
  );
}
