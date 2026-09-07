import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import WarningRoundedIcon from "@mui/icons-material/WarningRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

import type { SecurityIncidentItem } from "~/types/missionCenter";
import Card from "~/components/atoms/Card/Card";
import { MissionCenterUserProfileCard } from "./MissionCenterUserProfileCard";
import { SecurityBadge } from "./MissionCenterSecurityBadge";
import { FONT_FAMILIES, RECURSIVE_PRESETS } from "~/tokens/typography";

export interface SecurityThreatPanelProps {
  incident: SecurityIncidentItem;
  onInspectPayload: (payload: unknown) => void;
}

export function SecurityThreatPanel({
  incident,
  onInspectPayload,
}: SecurityThreatPanelProps) {
  const theme = useTheme();
  const { t } = useTranslation(["common"]);
  const targetUser = incident.user || incident.actorUser || null;
  const isSecurity = incident.severity === "security";

  return (
    <Card
      variant="outlined"
      sx={{
        p: 2.5,
        borderRadius: "16px",
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
        <SecurityBadge
          label={incident.severity.toUpperCase()}
          color={isSecurity ? "error" : "warning"}
        />
      </Box>

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
            borderRadius: (theme) => theme.shape.corners.small,
            backgroundColor:
              theme.palette.surfaceContainerHighest ||
              theme.palette.background.paper,
            fontFamily: FONT_FAMILIES.mono,
            fontVariationSettings: RECURSIVE_PRESETS.mono,
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
