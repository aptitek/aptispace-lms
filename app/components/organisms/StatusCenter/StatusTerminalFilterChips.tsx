import React from "react";
import Box from "@mui/material/Box";
import Chip from "~/components/atoms/Chip/Chip";
import Button from "@mui/material/Button";
import DeleteSweepOutlinedIcon from "@mui/icons-material/DeleteSweepOutlined";
import { useTranslation } from "react-i18next";
import type {
  EventFilterType,
  TelemetryEventItem,
} from "~/utils/statusCenter.types";

interface StatusTerminalFilterChipsProps {
  events: TelemetryEventItem[];
  activeFilter: EventFilterType;
  onSelectFilter: (filter: EventFilterType) => void;
  onClearAll: () => void;
}

export function StatusTerminalFilterChips({
  events,
  activeFilter,
  onSelectFilter,
  onClearAll,
}: StatusTerminalFilterChipsProps) {
  const { t } = useTranslation("common");

  const totalCount = events.length;
  const errorCount = events.filter(
    (ev) => ev.severity === "error" || ev.severity === "critical",
  ).length;
  const securityCount = events.filter(
    (ev) => ev.severity === "security" || ev.statusCode === 403,
  ).length;
  const warningCount = events.filter((ev) => ev.severity === "warning").length;

  return (
    <Box
      sx={{
        px: 2,
        py: 1.5,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: 1,
        borderColor: "divider",
        backgroundColor: "action.hover",
        flexWrap: "wrap",
        gap: 1,
      }}
    >
      <Box
        sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}
      >
        <Chip
          size="small"
          label={`${t("systemStatus.filterAll", { defaultValue: "All" })} (${totalCount})`}
          onClick={() => onSelectFilter("all")}
          color={activeFilter === "all" ? "primary" : "default"}
          variant={activeFilter === "all" ? "filled" : "outlined"}
          sx={{ cursor: "pointer", fontWeight: 600, fontSize: "0.75rem" }}
        />
        <Chip
          size="small"
          label={`${t("systemStatus.filterErrors", { defaultValue: "Errors" })} (${errorCount})`}
          onClick={() => onSelectFilter("errors")}
          color={activeFilter === "errors" ? "error" : "default"}
          variant={activeFilter === "errors" ? "filled" : "outlined"}
          sx={{ cursor: "pointer", fontWeight: 600, fontSize: "0.75rem" }}
        />
        <Chip
          size="small"
          label={`${t("systemStatus.filterSecurity", { defaultValue: "403 Security" })} (${securityCount})`}
          onClick={() => onSelectFilter("security")}
          color={activeFilter === "security" ? "secondary" : "default"}
          variant={activeFilter === "security" ? "filled" : "outlined"}
          sx={{ cursor: "pointer", fontWeight: 600, fontSize: "0.75rem" }}
        />
        <Chip
          size="small"
          label={`${t("systemStatus.filterWarnings", { defaultValue: "Warnings" })} (${warningCount})`}
          onClick={() => onSelectFilter("warnings")}
          color={activeFilter === "warnings" ? "warning" : "default"}
          variant={activeFilter === "warnings" ? "filled" : "outlined"}
          sx={{ cursor: "pointer", fontWeight: 600, fontSize: "0.75rem" }}
        />
      </Box>

      {totalCount > 0 && (
        <Button
          size="small"
          variant="text"
          color="inherit"
          startIcon={<DeleteSweepOutlinedIcon />}
          onClick={onClearAll}
          sx={{
            fontSize: "0.72rem",
            textTransform: "none",
            color: "text.secondary",
            "&:hover": { color: "error.main" },
          }}
        >
          {t("systemStatus.clearAll", { defaultValue: "Clear Log" })}
        </Button>
      )}
    </Box>
  );
}
