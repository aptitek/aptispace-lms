import React from "react";
import { styled, keyframes } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import Tooltip from "@mui/material/Tooltip";
import Badge from "@mui/material/Badge";
import MonitorHeartRoundedIcon from "@mui/icons-material/MonitorHeartRounded";
import { SOLARIZED_BASE } from "~/tokens/theme";
import {
  useStatusCenter,
  type SystemHealthStatus,
} from "~/utils/statusCenterContext";

export interface StatusGatewayTriggerProps {
  className?: string;
  showBadge?: boolean;
}

const pulseGlow = (color: string) => keyframes`
  0% {
    filter: drop-shadow(0 0 1px ${color}88);
    transform: scale(0.96);
  }
  50% {
    filter: drop-shadow(0 0 6px ${color}CC);
    transform: scale(1.04);
  }
  100% {
    filter: drop-shadow(0 0 1px ${color}88);
    transform: scale(0.96);
  }
`;

const TriggerIconButton = styled("button")<{
  statusColor: string;
  isOffline: boolean;
}>(({ theme, statusColor, isOffline }) => ({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: 32,
  height: 32,
  padding: 0,
  backgroundColor: "transparent",
  border: `1px solid transparent`,
  borderRadius: "50%",
  cursor: "pointer",
  outline: "none",
  color: statusColor,
  transition: "all 0.2s cubic-bezier(0.2, 0, 0, 1)",
  userSelect: "none",

  "& svg": {
    fontSize: "1.25rem",
    animation: isOffline
      ? "none"
      : `${pulseGlow(statusColor)} 2.4s infinite cubic-bezier(0.45, 0, 0.55, 1)`,
  },

  "&:hover": {
    backgroundColor: theme.palette.action.hover,
    borderColor: theme.palette.divider,
    transform: "scale(1.08)",
    boxShadow: theme.shadows[1],
  },

  "&:focus-visible": {
    borderColor: theme.palette.primary.main,
    boxShadow: `0 0 0 2px ${theme.palette.primary.main}66`,
  },
}));

function resolveStatusColor(systemStatus: SystemHealthStatus): string {
  switch (systemStatus) {
    case "critical":
      return SOLARIZED_BASE.red;
    case "security_breach":
      return SOLARIZED_BASE.magenta;
    case "degraded":
      return SOLARIZED_BASE.yellow;
    case "offline":
      return SOLARIZED_BASE.base01;
    case "nominal":
    default:
      return SOLARIZED_BASE.green;
  }
}

export default function StatusGatewayTrigger({
  className,
  showBadge = true,
}: StatusGatewayTriggerProps) {
  const { t } = useTranslation("common");
  const { systemStatus, events, openTerminal, isTerminalOpen } =
    useStatusCenter();

  const activeIssueCount = events.filter(
    (eventEntry) =>
      eventEntry.severity === "error" ||
      eventEntry.severity === "critical" ||
      eventEntry.severity === "security" ||
      eventEntry.severity === "warning",
  ).length;

  const statusColor = resolveStatusColor(systemStatus);
  const neutralTooltip = t("systemStatus.tooltipNeutral", {
    defaultValue: "System status & telemetry",
  });
  const ariaLabel = t("systemStatus.buttonAria", {
    defaultValue: "System status and telemetry",
  });

  return (
    <Tooltip title={neutralTooltip} arrow enterDelay={300}>
      <TriggerIconButton
        type="button"
        className={className}
        statusColor={statusColor}
        isOffline={systemStatus === "offline"}
        onClick={() => openTerminal()}
        aria-expanded={isTerminalOpen}
        aria-label={ariaLabel}
        data-testid="status-gateway-trigger"
      >
        <Badge
          variant="dot"
          invisible={
            !showBadge || activeIssueCount === 0 || systemStatus === "offline"
          }
          sx={{
            "& .MuiBadge-badge": {
              backgroundColor: statusColor,
              boxShadow: `0 0 4px ${statusColor}`,
            },
          }}
        >
          <MonitorHeartRoundedIcon />
        </Badge>
      </TriggerIconButton>
    </Tooltip>
  );
}
