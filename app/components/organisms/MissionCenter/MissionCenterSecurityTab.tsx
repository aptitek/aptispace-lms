import { useState, useMemo } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ShieldRoundedIcon from "@mui/icons-material/ShieldRounded";
import SecurityRoundedIcon from "@mui/icons-material/SecurityRounded";
import { useTheme, alpha } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

import type { SecurityIncidentItem } from "~/types/missionCenter";
import Card from "~/components/atoms/Card/Card";
import { MissionCenterJsonModal } from "./MissionCenterJsonModal";
import { SecurityBadge } from "./MissionCenterSecurityBadge";
import { SecurityThreatPanel } from "./MissionCenterSecurityThreatPanel";
import { FONT_FAMILIES, RECURSIVE_PRESETS } from "~/tokens/typography";

export interface MissionCenterSecurityTabProps {
  securityIncidents: SecurityIncidentItem[];
}

function formatIncidentTime(timestamp?: string | Date): string {
  if (!timestamp) return "";
  const dateObj = timestamp instanceof Date ? timestamp : new Date(timestamp);
  return dateObj.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
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

interface IncidentCardItemProps {
  incident: SecurityIncidentItem;
  isSelected: boolean;
  onSelect: () => void;
}

function IncidentCardItem({
  incident,
  isSelected,
  onSelect,
}: IncidentCardItemProps) {
  const theme = useTheme();
  const userLabel = resolveUserDisplay(incident);
  const timeLabel = formatIncidentTime(incident.timestamp);
  const isSecurity = incident.severity === "security";

  return (
    <Card
      variant="outlined"
      isInteractive
      isSelected={isSelected}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect();
        }
      }}
      data-testid={`security-row-${incident.id}`}
      sx={{
        p: 2,
        display: "flex",
        flexDirection: "column",
        gap: 1.5,
        borderRadius: (theme) => theme.shape.corners.medium,
        borderColor: isSelected
          ? theme.palette.primary.main
          : alpha(theme.palette.divider, 0.4),
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 1.5,
          flexWrap: "wrap",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            flexWrap: "wrap",
          }}
        >
          <SecurityBadge
            label={incident.type.replace("_", " ")}
            color={isSecurity ? "error" : "warning"}
          />
          <SecurityBadge
            label={incident.severity}
            color={isSecurity ? "error" : "warning"}
          />
        </Box>
        {timeLabel && (
          <Typography
            variant="caption"
            sx={{
              color: "text.secondary",
              fontFamily: FONT_FAMILIES.mono,
              fontVariationSettings: RECURSIVE_PRESETS.mono,
              fontSize: "0.75rem",
            }}
          >
            {timeLabel}
          </Typography>
        )}
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: 700,
            fontSize: "0.95rem",
            color: isSelected ? "primary.main" : "text.primary",
          }}
        >
          {incident.title}
        </Typography>
        {incident.description && (
          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
              fontSize: "0.82rem",
              lineHeight: 1.45,
            }}
          >
            {incident.description}
          </Typography>
        )}
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1,
          pt: 1,
          borderTop: `1px solid ${alpha(theme.palette.divider, 0.3)}`,
          flexWrap: "wrap",
        }}
      >
        <Typography
          variant="caption"
          sx={{
            fontWeight: 600,
            color: "text.secondary",
            fontSize: "0.78rem",
          }}
        >
          {userLabel}
        </Typography>

        <Box
          component="span"
          sx={{
            display: "inline-flex",
            alignItems: "center",
            px: 1,
            py: 0.5,
            borderRadius: (theme) => theme.shape.corners.small,
            bgcolor: alpha(
              theme.palette.surfaceContainerHighest ||
                theme.palette.background.paper,
              0.6,
            ),
            border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
            fontFamily: FONT_FAMILIES.mono,
            fontVariationSettings: RECURSIVE_PRESETS.mono,
            fontSize: "0.75rem",
            color: "text.secondary",
          }}
        >
          {incident.ipAddress || "Unknown IP"}
        </Box>
      </Box>
    </Card>
  );
}

interface SecurityIncidentCardListProps {
  securityIncidents: SecurityIncidentItem[];
  selectedIncidentId: string | null;
  onSelectIncident: (id: string) => void;
}

function SecurityIncidentCardList({
  securityIncidents,
  selectedIncidentId,
  onSelectIncident,
}: SecurityIncidentCardListProps) {
  const { t } = useTranslation(["common"]);

  if (securityIncidents.length === 0) {
    return (
      <Card
        variant="outlined"
        sx={{
          p: 5,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          gap: 1.5,
          borderRadius: (theme) => theme.shape.corners.largeIncreased,
        }}
        data-testid="security-incidents-table"
      >
        <ShieldRoundedIcon color="success" sx={{ fontSize: 44 }} />
        <Typography
          variant="body2"
          sx={{ fontWeight: 600, color: "text.secondary" }}
        >
          {t(
            "common:admin.missionCenter.noSecurityIncidents",
            "No security incidents or 403 infractions recorded.",
          )}
        </Typography>
      </Card>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 1.5,
        width: "100%",
      }}
      data-testid="security-incidents-table"
    >
      {securityIncidents.map((incident) => (
        <IncidentCardItem
          key={incident.id}
          incident={incident}
          isSelected={incident.id === selectedIncidentId}
          onSelect={() => onSelectIncident(incident.id)}
        />
      ))}
    </Box>
  );
}

function SecurityAlertBanner({ count }: { count: number }) {
  const { t } = useTranslation(["common"]);
  const theme = useTheme();
  const hasIncidents = count > 0;
  const statusColor = hasIncidents
    ? theme.palette.warning.main
    : theme.palette.success.main;
  const icon = hasIncidents ? (
    <SecurityRoundedIcon sx={{ color: statusColor, fontSize: 26 }} />
  ) : (
    <ShieldRoundedIcon sx={{ color: statusColor, fontSize: 26 }} />
  );
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
    <Card
      variant="outlined"
      sx={{
        p: 2,
        display: "flex",
        alignItems: "flex-start",
        gap: 2,
        borderRadius: (theme) => theme.shape.corners.medium,
        borderColor: alpha(statusColor, 0.4),
        backgroundColor: alpha(statusColor, 0.04),
      }}
      data-testid="security-status-alert"
    >
      <Box sx={{ mt: 0.25, display: "flex", alignItems: "center" }}>{icon}</Box>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: 700, color: statusColor }}
        >
          {title}
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {desc}
        </Typography>
      </Box>
    </Card>
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
          <SecurityIncidentCardList
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
export { SecurityBadge };
