import React from "react";
import { styled, useTheme, type Theme } from "@mui/material/styles";
import { motion, AnimatePresence } from "framer-motion";
import { M3_SPRINGS } from "~/tokens/motion";
import { useTranslation } from "react-i18next";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import InfoOutlineRoundedIcon from "@mui/icons-material/InfoOutlineRounded";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import ShieldRoundedIcon from "@mui/icons-material/ShieldRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import TerminalRoundedIcon from "@mui/icons-material/TerminalRounded";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import {
  useStatusCenter,
  type NotificationSeverity,
  type TelemetryEventItem,
} from "~/utils/statusCenterContext";

export interface StatusSnackbarProps {
  eventEntry?: TelemetryEventItem | null;
  onDismiss?: () => void;
  onViewDetails?: () => void;
  className?: string;
}

export type M3SnackbarProps = StatusSnackbarProps;

const SnackbarRoot = styled(motion.div)(({ theme }) => ({
  position: "fixed",
  bottom: 24,
  left: "50%",
  transform: "translateX(-50%)",
  zIndex: 1400,
  minWidth: 320,
  maxWidth: "min(560px, calc(100vw - 32px))",
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1.5),
  padding: theme.spacing(1.25, 2),
  borderRadius: 12,
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  border: `1px solid ${theme.palette.divider}`,
  backgroundClip: "padding-box",
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
  boxShadow:
    "0 8px 24px -4px rgba(0, 0, 0, 0.12), 0 2px 6px -1px rgba(0, 0, 0, 0.08)",
  ...theme.applyStyles("dark", {
    boxShadow:
      "0 12px 32px -4px rgba(0, 0, 0, 0.5), 0 4px 12px -2px rgba(0, 0, 0, 0.3)",
  }),
}));

const IconBox = styled("div", {
  shouldForwardProp: (prop) => prop !== "color",
})<{ color: string }>(({ color }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 36,
  height: 36,
  borderRadius: 12,
  backgroundColor: `${color}18`,
  color: color,
  flexShrink: 0,
  boxShadow: `0 0 12px ${color}33`,
}));

const ContentContainer = styled("div")({
  display: "flex",
  alignItems: "center",
  flex: 1,
  minWidth: 0,
});

const MessageText = styled("span")(({ theme }) => ({
  fontSize: "0.8125rem",
  fontWeight: 500,
  lineHeight: 1.4,
  color: theme.palette.text.primary,
  overflow: "hidden",
  textOverflow: "ellipsis",
  display: "-webkit-box",
  WebkitLineClamp: 2,
  WebkitBoxOrient: "vertical",
  wordBreak: "break-word",
}));

const ActionGroup = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(0.75),
  flexShrink: 0,
}));

function resolveSeverityDetails(severity: NotificationSeverity, theme: Theme) {
  switch (severity) {
    case "critical":
    case "error":
      return {
        color: theme.palette.error.main,
        icon: <ErrorOutlineRoundedIcon fontSize="small" />,
      };
    case "security":
      return {
        color: theme.palette.secondary.main,
        icon: <ShieldRoundedIcon fontSize="small" />,
      };
    case "warning":
      return {
        color: theme.palette.warning.main,
        icon: <WarningAmberRoundedIcon fontSize="small" />,
      };
    case "info":
      return {
        color: theme.palette.info.main,
        icon: <InfoOutlineRoundedIcon fontSize="small" />,
      };
    case "success":
      return {
        color: theme.palette.success.main,
        icon: <CheckCircleOutlineRoundedIcon fontSize="small" />,
      };
  }
}

export function StatusSnackbar({
  eventEntry: propEventEntry,
  onDismiss: propDismiss,
  onViewDetails: propViewDetails,
  className,
}: StatusSnackbarProps) {
  const theme = useTheme();
  const { t } = useTranslation("common");
  const statusCenter = useStatusCenter();

  const activeEvent =
    propEventEntry !== undefined ? propEventEntry : statusCenter.activeSnackbar;
  const handleDismiss = propDismiss || statusCenter.dismissSnackbar;
  const handleView = () => {
    if (propViewDetails) {
      propViewDetails();
    } else {
      statusCenter.openTerminal();
      statusCenter.dismissSnackbar();
    }
  };

  if (!activeEvent) return null;

  const severityDetails = resolveSeverityDetails(activeEvent.severity, theme);

  return (
    <AnimatePresence>
      <SnackbarRoot
        key={activeEvent.id}
        className={className}
        role="alert"
        aria-live="assertive"
        initial={{ opacity: 0, y: 32, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.96 }}
        transition={M3_SPRINGS.snackbar}
      >
        <IconBox
          color={severityDetails.color}
          data-testid="status-snackbar-icon"
        >
          {severityDetails.icon}
        </IconBox>

        <ContentContainer>
          <MessageText data-testid="status-snackbar-message">
            {activeEvent.message || activeEvent.title}
          </MessageText>
        </ContentContainer>

        <ActionGroup>
          <Button
            size="small"
            variant="text"
            startIcon={<TerminalRoundedIcon fontSize="inherit" />}
            onClick={handleView}
            sx={{
              fontSize: "0.75rem",
              fontWeight: 600,
              textTransform: "none",
              color: severityDetails.color,
              padding: "4px 8px",
              minWidth: "auto",
              "&:hover": {
                backgroundColor: `${severityDetails.color}15`,
              },
            }}
          >
            {t("systemStatus.viewDetails", { defaultValue: "Details" })}
          </Button>

          <IconButton
            size="small"
            aria-label={t("systemStatus.dismiss", { defaultValue: "Dismiss" })}
            onClick={handleDismiss}
            sx={{
              color: "inherit",
              opacity: 0.7,
              "&:hover": { opacity: 1 },
            }}
          >
            <CloseRoundedIcon fontSize="small" />
          </IconButton>
        </ActionGroup>
      </SnackbarRoot>
    </AnimatePresence>
  );
}

export default StatusSnackbar;
