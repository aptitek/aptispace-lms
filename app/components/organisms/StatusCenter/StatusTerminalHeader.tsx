import React, { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";
import CloseIcon from "@mui/icons-material/Close";
import ScienceOutlinedIcon from "@mui/icons-material/ScienceOutlined";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import { useTranslation } from "react-i18next";
import type { SystemHealthStatus } from "~/utils/statusCenter.types";

interface StatusTerminalHeaderProps {
  systemStatus: SystemHealthStatus;
  bpm?: number;
  onClose: () => void;
  onSimulate: (
    simulationType:
      | "nominal"
      | "warning"
      | "error"
      | "critical"
      | "security_403"
      | "offline"
      | "hydration",
  ) => void;
}

export function StatusTerminalHeader({
  systemStatus,
  bpm: _bpm,
  onClose,
  onSimulate,
}: StatusTerminalHeaderProps) {
  const { t } = useTranslation("common");
  const [simulationMenuAnchor, setSimulationMenuAnchor] =
    useState<HTMLElement | null>(null);

  const statusLabel =
    systemStatus === "offline"
      ? t("systemStatus.headerOffline", { defaultValue: "OFFLINE" })
      : systemStatus === "critical"
        ? t("systemStatus.headerCritical", { defaultValue: "CRITICAL ERROR" })
        : systemStatus === "security_breach"
          ? t("systemStatus.headerSecurity", {
              defaultValue: "SECURITY ALERT (403)",
            })
          : systemStatus === "degraded"
            ? t("systemStatus.headerDegraded", {
                defaultValue: "SYSTEM DEGRADED",
              })
            : t("systemStatus.headerNominal", {
                defaultValue: "ALL SYSTEMS OPERATIONAL",
              });

  const statusBadgeColor =
    systemStatus === "offline"
      ? "text.disabled"
      : systemStatus === "critical"
        ? "error.main"
        : systemStatus === "security_breach"
          ? "secondary.main"
          : systemStatus === "degraded"
            ? "warning.main"
            : "success.main";

  return (
    <Box
      sx={{
        p: 2,
        borderBottom: 1,
        borderColor: "divider",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "background.paper",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        <RadioButtonCheckedIcon
          sx={{
            fontSize: "1rem",
            color: statusBadgeColor,
          }}
        />
        <Box>
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              fontFamily: "monospace",
            }}
          >
            {t("systemStatus.terminalTitle", {
              defaultValue: "SYSTEM STATUS & DIAGNOSTICS",
            })}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: statusBadgeColor,
              fontWeight: 600,
              fontFamily: "monospace",
              display: "flex",
              alignItems: "center",
              gap: 0.5,
            }}
          >
            {statusLabel}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Button
          size="small"
          variant="outlined"
          startIcon={<ScienceOutlinedIcon />}
          onClick={(clickEvent) =>
            setSimulationMenuAnchor(clickEvent.currentTarget)
          }
          sx={{
            fontSize: "0.75rem",
            textTransform: "none",
            borderRadius: 2,
            borderColor: "divider",
            color: "inherit",
          }}
        >
          {t("systemStatus.simulateBtn", { defaultValue: "Simulate Event" })}
        </Button>

        <Menu
          anchorEl={simulationMenuAnchor}
          open={Boolean(simulationMenuAnchor)}
          onClose={() => setSimulationMenuAnchor(null)}
          slotProps={{
            root: {
              sx: { zIndex: 1500 },
            },
            paper: {
              sx: {
                borderRadius: 2,
                fontSize: "0.75rem",
                minWidth: 180,
              },
            },
          }}
        >
          <MenuItem
            onClick={() => {
              onSimulate("nominal");
              setSimulationMenuAnchor(null);
            }}
          >
            🟢 {t("systemStatus.simNominal", { defaultValue: "Nominal Sync" })}
          </MenuItem>
          <MenuItem
            onClick={() => {
              onSimulate("warning");
              setSimulationMenuAnchor(null);
            }}
          >
            🟡{" "}
            {t("systemStatus.simWarning", {
              defaultValue: "Warning (Latency)",
            })}
          </MenuItem>
          <MenuItem
            onClick={() => {
              onSimulate("security_403");
              setSimulationMenuAnchor(null);
            }}
          >
            🟣{" "}
            {t("systemStatus.simSecurity", {
              defaultValue: "403 Security Infraction",
            })}
          </MenuItem>
          <MenuItem
            onClick={() => {
              onSimulate("error");
              setSimulationMenuAnchor(null);
            }}
          >
            🔴{" "}
            {t("systemStatus.simError", { defaultValue: "Diagnostic Error" })}
          </MenuItem>
          <MenuItem
            onClick={() => {
              onSimulate("hydration");
              setSimulationMenuAnchor(null);
            }}
          >
            💧{" "}
            {t("systemStatus.simHydration", {
              defaultValue: "Hydration Mismatch (SSR)",
            })}
          </MenuItem>
          <MenuItem
            onClick={() => {
              onSimulate("critical");
              setSimulationMenuAnchor(null);
            }}
          >
            🔥{" "}
            {t("systemStatus.simCritical", { defaultValue: "Critical Fault" })}
          </MenuItem>
          <MenuItem
            onClick={() => {
              onSimulate("offline");
              setSimulationMenuAnchor(null);
            }}
          >
            ⚪{" "}
            {t("systemStatus.simOffline", {
              defaultValue: "Lost Carrier (Flatline)",
            })}
          </MenuItem>
        </Menu>

        <Tooltip
          title={t("systemStatus.closeTerminal", {
            defaultValue: "Close Terminal",
          })}
        >
          <IconButton
            size="small"
            onClick={onClose}
            aria-label="Close telemetry terminal"
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
}
