import React from "react";
import { styled } from "@mui/material/styles";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import ShieldRoundedIcon from "@mui/icons-material/ShieldRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import TerminalRoundedIcon from "@mui/icons-material/TerminalRounded";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import { SOLARIZED_BASE } from "~/tokens/theme";
import {
  useStatusCenter,
  type NotificationSeverity,
  type TelemetryEventItem,
} from "~/utils/statusCenterContext";

export interface M3SnackbarProps {
  eventEntry?: TelemetryEventItem | null;
  onDismiss?: () => void;
  onViewDetails?: () => void;
  className?: string;
}

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
  padding: theme.spacing(1.5, 2),
  borderRadius: 12,
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  border: `1px solid ${theme.palette.divider}`,
  backdropFilter: "blur(16px)",
  boxShadow: theme.shadows[8],
}));

const IconBox = styled("div", {
  shouldForwardProp: (prop) => prop !== "color",
})<{ color: string }>(({ color }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 36,
  height: 36,
  borderRadius: 10,
  backgroundColor: `${color}18`,
  color: color,
  flexShrink: 0,
  boxShadow: `0 0 12px ${color}33`,
}));

const ContentContainer = styled("div")({
  display: "flex",
  flexDirection: "column",
  flex: 1,
  minWidth: 0,
});

const TitleText = styled("span")({
  fontSize: "0.8125rem",
  fontWeight: 700,
  lineHeight: 1.3,
  letterSpacing: "0.02em",
  fontFamily: "Recursive, Inter, sans-serif",
  color: "inherit",
});

const MessageText = styled("span")(({ theme }) => ({
  fontSize: "0.75rem",
  fontWeight: 400,
  lineHeight: 1.4,
  color:
    theme.palette.mode === "dark"
      ? SOLARIZED_BASE.base0
      : SOLARIZED_BASE.base00,
  overflow: "hidden",
  textOverflow: "ellipsis",
  display: "-webkit-box",
  WebkitLineClamp: 2,
  WebkitBoxOrient: "vertical",
}));

const ActionGroup = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(0.75),
  flexShrink: 0,
}));

function resolveSeverityDetails(severity: NotificationSeverity) {
  switch (severity) {
    case "critical":
    case "error":
      return {
        color: SOLARIZED_BASE.red,
        icon: <ErrorOutlineRoundedIcon fontSize="small" />,
      };
    case "security":
      return {
        color: SOLARIZED_BASE.magenta,
        icon: <ShieldRoundedIcon fontSize="small" />,
      };
    case "warning":
      return {
        color: SOLARIZED_BASE.yellow,
        icon: <WarningAmberRoundedIcon fontSize="small" />,
      };
    case "info":
      return {
        color: SOLARIZED_BASE.cyan,
        icon: <InfoOutlinedIcon fontSize="small" />,
      };
    case "success":
      return {
        color: SOLARIZED_BASE.green,
        icon: <CheckCircleOutlineRoundedIcon fontSize="small" />,
      };
  }
}

export default function M3Snackbar({
  eventEntry: propEventEntry,
  onDismiss: propDismiss,
  onViewDetails: propViewDetails,
  className,
}: M3SnackbarProps) {
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

  const severityDetails = resolveSeverityDetails(activeEvent.severity);

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
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
      >
        <IconBox color={severityDetails.color}>{severityDetails.icon}</IconBox>

        <ContentContainer>
          <TitleText>{activeEvent.title}</TitleText>
          <MessageText>{activeEvent.message}</MessageText>
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
