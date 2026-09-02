import React, { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import SendIcon from "@mui/icons-material/Send";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import CircularProgress from "@mui/material/CircularProgress";
import { useTranslation } from "react-i18next";
import type { TelemetryEventItem } from "~/utils/statusCenter.types";
import { formatDiagnosticDetails } from "~/utils/statusCenter.utils";

interface StatusTerminalDetailsProps {
  eventEntry: TelemetryEventItem;
  onReport: (eventId: string) => Promise<{ reportId: string } | null>;
}

function DiagnosticMetaGrid({
  eventEntry,
}: {
  eventEntry: TelemetryEventItem;
}) {
  const { t } = useTranslation("common");

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
        gap: 1,
        fontFamily: "monospace",
        fontSize: "0.75rem",
      }}
    >
      <Box>
        <Typography
          variant="caption"
          sx={{ color: "text.secondary", display: "block" }}
        >
          {t("systemStatus.sourceField", {
            defaultValue: "SOURCE & SUBSYSTEM",
          })}
        </Typography>
        <Typography
          variant="body2"
          sx={{ fontFamily: "monospace", fontSize: "0.75rem" }}
        >
          {eventEntry.source || "application"}
          {eventEntry.statusCode ? ` • HTTP ${eventEntry.statusCode}` : ""}
        </Typography>
      </Box>

      <Box>
        <Typography
          variant="caption"
          sx={{ color: "text.secondary", display: "block" }}
        >
          {t("systemStatus.timestampField", { defaultValue: "RECORDED AT" })}
        </Typography>
        <Typography
          variant="body2"
          sx={{ fontFamily: "monospace", fontSize: "0.75rem" }}
        >
          {eventEntry.timestamp.toLocaleTimeString()} (
          {eventEntry.timestamp.toISOString()})
        </Typography>
      </Box>

      {eventEntry.path && (
        <Box sx={{ gridColumn: { sm: "1 / -1" } }}>
          <Typography
            variant="caption"
            sx={{ color: "text.secondary", display: "block" }}
          >
            {t("systemStatus.pathField", { defaultValue: "REQUEST ROUTE" })}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              fontFamily: "monospace",
              fontSize: "0.75rem",
              wordBreak: "break-all",
            }}
          >
            {eventEntry.path}
          </Typography>
        </Box>
      )}
    </Box>
  );
}

function ContextPayloadBlock({
  contextData,
}: {
  contextData?: Record<string, unknown>;
}) {
  const { t } = useTranslation("common");
  if (!contextData) return null;

  return (
    <Box>
      <Typography
        variant="caption"
        sx={{ color: "text.secondary", display: "block", mb: 0.5 }}
      >
        {t("systemStatus.contextField", { defaultValue: "CONTEXT PAYLOAD" })}
      </Typography>
      <Box
        component="pre"
        sx={{
          m: 0,
          p: 1.5,
          borderRadius: 1.5,
          backgroundColor: "background.paper",
          border: 1,
          borderColor: "divider",
          fontFamily: "monospace",
          fontSize: "0.72rem",
          overflowX: "auto",
          color: "text.primary",
        }}
      >
        {JSON.stringify(contextData, null, 2)}
      </Box>
    </Box>
  );
}

function StackTraceBlock({ stack }: { stack?: string }) {
  const { t } = useTranslation("common");
  if (!stack) return null;

  return (
    <Box>
      <Typography
        variant="caption"
        sx={{ color: "text.secondary", display: "block", mb: 0.5 }}
      >
        {t("systemStatus.stackField", {
          defaultValue: "DIAGNOSTIC STACK TRACE",
        })}
      </Typography>
      <Box
        component="pre"
        sx={{
          m: 0,
          p: 1.5,
          borderRadius: 1.5,
          backgroundColor: "background.paper",
          border: 1,
          borderColor: "divider",
          fontFamily: "monospace",
          fontSize: "0.7rem",
          maxHeight: 180,
          overflow: "auto",
          color: "error.light",
          whiteSpace: "pre-wrap",
          wordBreak: "break-all",
        }}
      >
        {stack}
      </Box>
    </Box>
  );
}

function ComponentStackBlock({ componentStack }: { componentStack?: string }) {
  const { t } = useTranslation("common");
  if (!componentStack) return null;

  return (
    <Box>
      <Typography
        variant="caption"
        sx={{ color: "text.secondary", display: "block", mb: 0.5 }}
      >
        {t("systemStatus.componentStackField", {
          defaultValue: "COMPONENT HIERARCHY & STACK",
        })}
      </Typography>
      <Box
        component="pre"
        sx={{
          m: 0,
          p: 1.5,
          borderRadius: 1.5,
          backgroundColor: "background.paper",
          border: 1,
          borderColor: "divider",
          fontFamily: "monospace",
          fontSize: "0.7rem",
          maxHeight: 180,
          overflow: "auto",
          color: "warning.light",
          whiteSpace: "pre-wrap",
          wordBreak: "break-all",
        }}
      >
        {componentStack}
      </Box>
    </Box>
  );
}

export function StatusTerminalDetails({
  eventEntry,
  onReport,
}: StatusTerminalDetailsProps) {
  const { t } = useTranslation("common");
  const [hasCopied, setHasCopied] = useState(false);
  const [isTransmitting, setIsTransmitting] = useState(false);

  const handleCopyDiagnostics = async () => {
    try {
      const diagnosticText = formatDiagnosticDetails(eventEntry);
      await navigator.clipboard.writeText(diagnosticText);
      setHasCopied(true);
      setTimeout(() => setHasCopied(false), 2500);
    } catch {
      // Ignore clipboard write failures
    }
  };

  const handleTransmitReport = async () => {
    setIsTransmitting(true);
    try {
      await onReport(eventEntry.id);
    } finally {
      setIsTransmitting(false);
    }
  };

  return (
    <Box
      sx={{
        p: 2,
        backgroundColor: "action.selected",
        borderTop: 1,
        borderColor: "divider",
        display: "flex",
        flexDirection: "column",
        gap: 1.5,
      }}
    >
      <DiagnosticMetaGrid eventEntry={eventEntry} />
      <ContextPayloadBlock contextData={eventEntry.contextData} />
      <ComponentStackBlock componentStack={eventEntry.componentStack} />
      <StackTraceBlock stack={eventEntry.stack} />

      {/* Action Footer: Copy & Report to Admin */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          gap: 1.5,
          pt: 1,
        }}
      >
        <Button
          size="small"
          variant="outlined"
          startIcon={
            hasCopied ? (
              <CheckCircleOutlineRoundedIcon color="success" />
            ) : (
              <ContentCopyIcon />
            )
          }
          onClick={handleCopyDiagnostics}
          sx={{
            fontSize: "0.75rem",
            textTransform: "none",
            borderRadius: 2,
            borderColor: "divider",
            color: "inherit",
          }}
        >
          {hasCopied
            ? t("systemStatus.copiedBtn", { defaultValue: "Copied Diagnostic" })
            : t("systemStatus.copyBtn", { defaultValue: "Copy Details" })}
        </Button>

        <Button
          size="small"
          variant="contained"
          color={eventEntry.severity === "security" ? "secondary" : "primary"}
          disabled={eventEntry.reported || isTransmitting}
          startIcon={
            isTransmitting ? (
              <CircularProgress size={14} color="inherit" />
            ) : eventEntry.reported ? (
              <CheckCircleOutlineRoundedIcon />
            ) : (
              <SendIcon />
            )
          }
          onClick={handleTransmitReport}
          sx={{
            fontSize: "0.75rem",
            textTransform: "none",
            borderRadius: 2,
            fontWeight: 600,
          }}
        >
          {eventEntry.reported
            ? t("systemStatus.reportedStatus", {
                defaultValue: "Reported to Admin",
              })
            : t("systemStatus.reportBtn", {
                defaultValue: "Report to Mission Control",
              })}
        </Button>
      </Box>
    </Box>
  );
}
