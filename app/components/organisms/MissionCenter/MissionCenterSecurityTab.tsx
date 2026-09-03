import { useState, useMemo } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
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

      {/* ProfileCard of Bad User / Target User */}
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

  return (
    <TableContainer
      sx={{
        borderRadius: 3,
        border: `1px solid ${theme.palette.divider}`,
        backgroundColor: theme.palette.background.paper,
      }}
    >
      <Table size="small" data-testid="security-incidents-table">
        <TableHead>
          <TableRow sx={{ backgroundColor: theme.palette.action.hover }}>
            <TableCell sx={{ fontWeight: 700 }}>Type</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Incident Title</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>
              Attributed User / Target
            </TableCell>
            <TableCell sx={{ fontWeight: 700 }}>IP Origin</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Timestamp</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {securityIncidents.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={5}
                sx={{ textAlign: "center", py: 4, color: "text.secondary" }}
              >
                {t(
                  "common:admin.missionCenter.noSecurityIncidents",
                  "No security incidents or 403 infractions recorded.",
                )}
              </TableCell>
            </TableRow>
          ) : (
            securityIncidents.map((incident) => {
              const isSelected = incident.id === selectedIncidentId;
              const dateStr = new Date(incident.timestamp).toLocaleTimeString(
                [],
                {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                },
              );
              const userDisplay = resolveUserDisplay(incident);

              return (
                <TableRow
                  key={incident.id}
                  hover
                  selected={isSelected}
                  onClick={() => onSelectIncident(incident.id)}
                  sx={{
                    cursor: "pointer",
                    backgroundColor: isSelected
                      ? theme.palette.action.selected
                      : undefined,
                  }}
                  data-testid={`security-row-${incident.id}`}
                >
                  <TableCell>
                    <Chip
                      label={incident.type.replace("_", " ").toUpperCase()}
                      size="small"
                      color={
                        incident.severity === "security" ? "error" : "warning"
                      }
                      sx={{ fontWeight: 700, fontSize: "0.68rem" }}
                    />
                  </TableCell>
                  <TableCell sx={{ fontWeight: isSelected ? 700 : 500 }}>
                    {incident.title}
                  </TableCell>
                  <TableCell>{userDisplay}</TableCell>
                  <TableCell
                    sx={{ fontFamily: "monospace", fontSize: "0.8rem" }}
                  >
                    {incident.ipAddress || "Unknown"}
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
