import { useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

import type {
  AdminErrorReportItem,
  ErrorStatusType,
  ErrorSeverityType,
} from "~/types/missionCenter";
import { CodePreBox } from "./MissionCenter.styles";
import { MissionCenterUserProfileCard } from "./MissionCenterUserProfileCard";

export interface MissionCenterErrorInspectorProps {
  report: AdminErrorReportItem;
  onClose: () => void;
  onUpdateStatus?: (reportId: string, status: ErrorStatusType) => void;
  onDeleteReport?: (reportId: string) => void;
  isSubmitting?: boolean;
}

function resolveSeverityColor(
  severity: ErrorSeverityType,
): "error" | "warning" | "info" | "default" {
  switch (severity) {
    case "critical":
    case "error":
      return "error";
    case "security":
    case "warning":
      return "warning";
    case "info":
      return "info";
    default:
      return "default";
  }
}

export function MissionCenterErrorInspector({
  report,
  onClose,
  onUpdateStatus,
  onDeleteReport,
  isSubmitting = false,
}: MissionCenterErrorInspectorProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const [copiedStack, setCopiedStack] = useState(false);

  const handleCopyStack = async () => {
    if (!report.stack) return;
    try {
      await navigator.clipboard.writeText(report.stack);
      setCopiedStack(true);
      setTimeout(() => setCopiedStack(false), 2000);
    } catch {
      // ignore
    }
  };

  const isSecurity =
    report.severity === "security" || report.statusCode === 403;

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
      data-testid="error-inspector-panel"
    >
      {/* Inspector Header & Actions */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 1,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
            {t(
              "common:admin.missionCenter.incidentDetails",
              "Incident Inspection",
            )}
          </Typography>
          <Chip
            label={report.severity.toUpperCase()}
            size="small"
            color={resolveSeverityColor(report.severity)}
            sx={{ fontWeight: 800, fontSize: "0.7rem" }}
          />
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <TextField
            select
            size="small"
            value={report.status}
            onChange={(e) =>
              onUpdateStatus?.(report.id, e.target.value as ErrorStatusType)
            }
            disabled={isSubmitting}
            sx={{ minWidth: 130 }}
            data-testid="inspector-status-select"
          >
            <MenuItem value="open">Open</MenuItem>
            <MenuItem value="investigating">Investigating</MenuItem>
            <MenuItem value="resolved">Resolved</MenuItem>
            <MenuItem value="ignored">Ignored</MenuItem>
          </TextField>

          {onDeleteReport && (
            <Tooltip title={t("common:delete", "Delete incident report")}>
              <IconButton
                size="small"
                color="error"
                onClick={() => onDeleteReport(report.id)}
                disabled={isSubmitting}
                data-testid="inspector-delete-error-btn"
              >
                <DeleteOutlineRoundedIcon sx={{ fontSize: 20 }} />
              </IconButton>
            </Tooltip>
          )}

          <IconButton
            size="small"
            onClick={onClose}
            aria-label="close inspector"
          >
            <CloseRoundedIcon sx={{ fontSize: 20 }} />
          </IconButton>
        </Box>
      </Box>

      {/* User Profile Card (Reporting User) */}
      <MissionCenterUserProfileCard
        user={report.user}
        ipAddress={report.ipAddress}
        userAgent={report.userAgent}
        title={t(
          "common:admin.missionCenter.reportingUserCard",
          "Reporting User Profile",
        )}
        isSecurityInfraction={isSecurity}
      />

      {/* Error Message & Details */}
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
            "common:admin.missionCenter.diagnosticMessage",
            "Diagnostic Message",
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
          {report.message}
        </Typography>
      </Box>

      {/* Stack Trace */}
      {report.stack && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography
              variant="caption"
              sx={{
                fontWeight: 700,
                textTransform: "uppercase",
                color: "text.secondary",
              }}
            >
              {t("common:stackTrace", "Stack Trace")}
            </Typography>
            <Button
              size="small"
              startIcon={
                copiedStack ? <CheckRoundedIcon /> : <ContentCopyRoundedIcon />
              }
              onClick={handleCopyStack}
              sx={{ fontSize: "0.7rem", py: 0.2 }}
            >
              {copiedStack
                ? t("common:copied", "Copied!")
                : t("common:copyTrace", "Copy")}
            </Button>
          </Box>
          <CodePreBox sx={{ maxHeight: 200 }} data-testid="error-stack-trace">
            {report.stack}
          </CodePreBox>
        </Box>
      )}

      {/* Context Data */}
      {report.contextData && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <Typography
            variant="caption"
            sx={{
              fontWeight: 700,
              textTransform: "uppercase",
              color: "text.secondary",
            }}
          >
            Context Data (JSON)
          </Typography>
          <CodePreBox sx={{ maxHeight: 150 }}>
            {typeof report.contextData === "string"
              ? report.contextData
              : JSON.stringify(report.contextData, null, 2)}
          </CodePreBox>
        </Box>
      )}
    </Card>
  );
}
