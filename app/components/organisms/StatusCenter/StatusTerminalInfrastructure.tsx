import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Chip from "@mui/material/Chip";
import RefreshIcon from "@mui/icons-material/Refresh";
import StorageRoundedIcon from "@mui/icons-material/StorageRounded";
import CloudQueueRoundedIcon from "@mui/icons-material/CloudQueueRounded";
import RadioButtonCheckedRoundedIcon from "@mui/icons-material/RadioButtonCheckedRounded";
import { useTranslation } from "react-i18next";
import { useStatusCenter } from "~/utils/statusCenterContext";
import type {
  ServiceHealthReport,
  SystemHealthStatus,
} from "~/utils/statusCenter.types";

interface StatusTheme {
  label: string;
  color: "success" | "warning" | "error" | "default";
  dotColor: string;
}

function resolveStatusTheme(status?: SystemHealthStatus): StatusTheme {
  switch (status) {
    case "nominal":
      return {
        label: "Connected",
        color: "success",
        dotColor: "success.main",
      };
    case "degraded":
      return {
        label: "Degraded",
        color: "warning",
        dotColor: "warning.main",
      };
    case "critical":
    case "offline":
      return {
        label: "Disconnected",
        color: "error",
        dotColor: "error.main",
      };
    default:
      return {
        label: "Probing...",
        color: "default",
        dotColor: "text.disabled",
      };
  }
}

interface TileHeaderProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  statusTheme: StatusTheme;
  isLoading: boolean;
}

function TileHeader({
  icon,
  title,
  subtitle,
  statusTheme,
  isLoading,
}: TileHeaderProps) {
  const { t } = useTranslation("common");

  const chipLabel = isLoading
    ? t("systemStatus.probing", { defaultValue: "Probing..." })
    : t(`systemStatus.${statusTheme.label.toLowerCase()}`, {
        defaultValue: statusTheme.label,
      });

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 32,
            height: 32,
            borderRadius: 1.5,
            backgroundColor: "action.hover",
            color: "text.primary",
          }}
        >
          {icon}
        </Box>
        <Box>
          <Typography
            variant="caption"
            sx={{
              fontWeight: 700,
              fontFamily: "monospace",
              display: "block",
              lineHeight: 1.2,
            }}
          >
            {title}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              fontSize: "0.7rem",
              color: "text.secondary",
              fontFamily: "monospace",
              display: "block",
            }}
          >
            {subtitle}
          </Typography>
        </Box>
      </Box>

      <Chip
        size="small"
        label={chipLabel}
        color={isLoading ? "default" : statusTheme.color}
        variant="outlined"
        sx={{
          fontFamily: "monospace",
          fontSize: "0.68rem",
          fontWeight: 700,
          height: 22,
        }}
      />
    </Box>
  );
}

function formatLatencyText(latencyMs?: number): string {
  if (latencyMs === undefined) return "—";
  return `${latencyMs}ms`;
}

function resolveLatencyColor(latencyMs?: number): string {
  if (latencyMs && latencyMs > 500) return "warning.main";
  return "text.primary";
}

interface TileFooterProps {
  report?: ServiceHealthReport;
  statusTheme: StatusTheme;
  isLoading: boolean;
}

function TileFooter({ report, statusTheme, isLoading }: TileFooterProps) {
  const detailsText = report?.error || report?.details || "Awaiting status";
  const latencyText = formatLatencyText(report?.latencyMs);
  const latencyColor = resolveLatencyColor(report?.latencyMs);
  const dotColor = isLoading ? "text.disabled" : statusTheme.dotColor;

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        pt: 0.5,
        borderTop: 1,
        borderColor: "divider",
      }}
    >
      <Typography
        variant="caption"
        sx={{
          fontSize: "0.72rem",
          color: "text.secondary",
          fontFamily: "monospace",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          maxWidth: "70%",
        }}
      >
        {detailsText}
      </Typography>

      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
        <RadioButtonCheckedRoundedIcon
          sx={{
            fontSize: "0.75rem",
            color: dotColor,
          }}
        />
        <Typography
          variant="caption"
          sx={{
            fontFamily: "monospace",
            fontWeight: 700,
            fontSize: "0.72rem",
            color: latencyColor,
          }}
        >
          {latencyText}
        </Typography>
      </Box>
    </Box>
  );
}

interface InfrastructureTileProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  report?: ServiceHealthReport;
  isLoading: boolean;
}

function InfrastructureTile({
  icon,
  title,
  subtitle,
  report,
  isLoading,
}: InfrastructureTileProps) {
  const statusTheme = resolveStatusTheme(report?.status);
  const testId = `infra-tile-${title.toLowerCase().replace(/[^a-z0-9]/g, "-")}`;

  return (
    <Box
      data-testid={testId}
      sx={{
        flex: 1,
        minWidth: { xs: "100%", sm: "240px" },
        p: 1.75,
        borderRadius: 2,
        border: 1,
        borderColor: "divider",
        backgroundColor: "background.paper",
        display: "flex",
        flexDirection: "column",
        gap: 1,
        transition: "border-color 0.2s, box-shadow 0.2s",
        "&:hover": {
          borderColor: "primary.main",
          boxShadow: 1,
        },
      }}
    >
      <TileHeader
        icon={icon}
        title={title}
        subtitle={subtitle}
        statusTheme={statusTheme}
        isLoading={isLoading}
      />
      <TileFooter
        report={report}
        statusTheme={statusTheme}
        isLoading={isLoading}
      />
    </Box>
  );
}

export function StatusTerminalInfrastructure() {
  const { t } = useTranslation("common");
  const { infrastructureHealth, isCheckingHealth, checkInfrastructureHealth } =
    useStatusCenter();

  const d1Service = infrastructureHealth?.services?.d1;
  const r2Service = infrastructureHealth?.services?.r2;

  return (
    <Box
      data-testid="status-terminal-infrastructure"
      sx={{
        px: 2,
        py: 1.5,
        borderBottom: 1,
        borderColor: "divider",
        backgroundColor: "background.default",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 1.25,
        }}
      >
        <Typography
          variant="caption"
          sx={{
            fontFamily: "monospace",
            fontWeight: 700,
            letterSpacing: "0.06em",
            color: "text.secondary",
            textTransform: "uppercase",
          }}
        >
          {t("systemStatus.infrastructureTitle", {
            defaultValue: "CLOUD INFRASTRUCTURE CONNECTIVITY",
          })}
        </Typography>

        <Tooltip
          title={t("systemStatus.pingInfra", {
            defaultValue: "Ping Cloudflare Services",
          })}
        >
          <span>
            <IconButton
              size="small"
              onClick={() => void checkInfrastructureHealth()}
              disabled={isCheckingHealth}
              aria-label="Ping cloud infrastructure"
              sx={{
                width: 26,
                height: 26,
                animation: isCheckingHealth
                  ? "spin 1s linear infinite"
                  : "none",
                "@keyframes spin": {
                  "0%": { transform: "rotate(0deg)" },
                  "100%": { transform: "rotate(360deg)" },
                },
              }}
            >
              <RefreshIcon sx={{ fontSize: "1rem" }} />
            </IconButton>
          </span>
        </Tooltip>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 1.5,
        }}
      >
        <InfrastructureTile
          icon={<StorageRoundedIcon fontSize="small" />}
          title="Cloudflare D1"
          subtitle="SQLite Relational Database"
          report={d1Service}
          isLoading={isCheckingHealth && !d1Service}
        />
        <InfrastructureTile
          icon={<CloudQueueRoundedIcon fontSize="small" />}
          title="Cloudflare R2"
          subtitle="Avatars Object Storage Bucket"
          report={r2Service}
          isLoading={isCheckingHealth && !r2Service}
        />
      </Box>
    </Box>
  );
}

export default StatusTerminalInfrastructure;
