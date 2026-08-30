import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Chip from "@mui/material/Chip";
import Tooltip from "@mui/material/Tooltip";
import Collapse from "@mui/material/Collapse";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import { useTranslation } from "react-i18next";
import type { TelemetryEventItem } from "~/utils/statusCenter.types";
import { StatusTerminalDetails } from "./StatusTerminalDetails";

interface StatusTerminalEventRowProps {
  eventEntry: TelemetryEventItem;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onClear: () => void;
  onReport: (eventId: string) => Promise<{ reportId: string } | null>;
}

function resolveSeverityColor(severity: TelemetryEventItem["severity"]) {
  switch (severity) {
    case "critical":
      return "error.main";
    case "error":
      return "error.light";
    case "security":
      return "secondary.main";
    case "warning":
      return "warning.main";
    case "success":
      return "success.main";
    case "info":
    default:
      return "info.main";
  }
}

function resolveSeverityIcon(severity: TelemetryEventItem["severity"]) {
  const iconColor = resolveSeverityColor(severity);
  const iconStyle = { color: iconColor, fontSize: "1.25rem" };

  switch (severity) {
    case "critical":
      return <LocalFireDepartmentIcon sx={iconStyle} />;
    case "security":
      return <ShieldOutlinedIcon sx={iconStyle} />;
    case "warning":
      return <WarningAmberIcon sx={iconStyle} />;
    case "success":
      return <CheckCircleOutlineRoundedIcon sx={iconStyle} />;
    case "error":
      return <ErrorOutlineRoundedIcon sx={iconStyle} />;
    case "info":
    default:
      return <InfoOutlinedIcon sx={iconStyle} />;
  }
}

export function StatusTerminalEventRow({
  eventEntry,
  isExpanded,
  onToggleExpand,
  onClear,
  onReport,
}: StatusTerminalEventRowProps) {
  const { t } = useTranslation("common");

  return (
    <Box
      sx={{
        borderBottom: 1,
        borderColor: "divider",
        transition: "background-color 0.15s ease",
        "&:hover": {
          backgroundColor: "action.hover",
        },
      }}
    >
      {/* Summary Header Row */}
      <Box
        onClick={onToggleExpand}
        sx={{
          p: 1.75,
          display: "flex",
          alignItems: "flex-start",
          gap: 1.5,
          cursor: "pointer",
        }}
      >
        {/* Leading Severity Icon */}
        <Box sx={{ mt: 0.25, display: "flex", flexShrink: 0 }}>
          {resolveSeverityIcon(eventEntry.severity)}
        </Box>

        {/* Title, message and meta */}
        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              flexWrap: "wrap",
              mb: 0.5,
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 700,
                fontSize: "0.82rem",
                fontFamily: "monospace",
                color: resolveSeverityColor(eventEntry.severity),
              }}
            >
              {eventEntry.title}
            </Typography>

            {eventEntry.statusCode && (
              <Chip
                size="small"
                label={`HTTP ${eventEntry.statusCode}`}
                color={eventEntry.statusCode === 403 ? "secondary" : "error"}
                sx={{
                  height: 18,
                  fontSize: "0.65rem",
                  fontFamily: "monospace",
                  fontWeight: 700,
                }}
              />
            )}

            {eventEntry.reported && (
              <Chip
                size="small"
                label={t("systemStatus.reportedChip", {
                  defaultValue: "REPORTED",
                })}
                color="success"
                variant="outlined"
                sx={{ height: 18, fontSize: "0.65rem", fontWeight: 700 }}
              />
            )}
          </Box>

          <Typography
            variant="body2"
            sx={{
              color: "text.primary",
              fontSize: "0.8rem",
              wordBreak: "break-word",
              lineHeight: 1.4,
            }}
          >
            {eventEntry.message}
          </Typography>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              mt: 0.75,
              color: "text.secondary",
              fontSize: "0.72rem",
              fontFamily: "monospace",
            }}
          >
            <span>{eventEntry.timestamp.toLocaleTimeString()}</span>
            <span>•</span>
            <span>{eventEntry.source || "app"}</span>
            {eventEntry.path && (
              <>
                <span>•</span>
                <Box component="span" sx={{ opacity: 0.8 }}>
                  {eventEntry.path}
                </Box>
              </>
            )}
          </Box>
        </Box>

        {/* Trailing action buttons */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            flexShrink: 0,
          }}
        >
          <Tooltip
            title={t("systemStatus.deleteEvent", { defaultValue: "Dismiss" })}
          >
            <IconButton
              size="small"
              onClick={(clickEv) => {
                clickEv.stopPropagation();
                onClear();
              }}
              aria-label="Dismiss event"
            >
              <DeleteOutlineRoundedIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <IconButton
            size="small"
            aria-label={isExpanded ? "Collapse details" : "Expand details"}
          >
            {isExpanded ? (
              <ExpandLessIcon fontSize="small" />
            ) : (
              <ExpandMoreIcon fontSize="small" />
            )}
          </IconButton>
        </Box>
      </Box>

      {/* Expanded Accordion Details */}
      <Collapse in={isExpanded} timeout="auto" unmountOnExit>
        <StatusTerminalDetails eventEntry={eventEntry} onReport={onReport} />
      </Collapse>
    </Box>
  );
}
