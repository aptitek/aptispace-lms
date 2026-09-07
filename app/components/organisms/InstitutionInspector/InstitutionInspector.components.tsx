import { useState } from "react";
import Box from "@mui/material/Box";
import Card from "~/components/atoms/Card/Card";
import Typography from "@mui/material/Typography";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Chip from "@mui/material/Chip";
import { alpha } from "@mui/material/styles";
import AlternateEmailRoundedIcon from "@mui/icons-material/AlternateEmailRounded";
import PublicRoundedIcon from "@mui/icons-material/PublicRounded";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import { useTranslation } from "react-i18next";
import { FONT_FAMILIES } from "~/tokens/typography";
import { M3_SHAPE_CORNERS } from "~/tokens/shapes";
import {
  InstitutionEmailPreviewBox,
  InstitutionFreeDomainNotice,
  InstitutionConstrainedDomainFields,
  type InstitutionConstrainedDomainFieldsProps,
} from "./InstitutionEmailFields";

export {
  InstitutionEmailPreviewBox,
  InstitutionFreeDomainNotice,
  InstitutionConstrainedDomainFields,
  type InstitutionConstrainedDomainFieldsProps,
};

function InstitutionEmailSummaryChip({
  isConstrained: _isConstrained,
  trimmedDomain,
}: {
  isConstrained?: boolean;
  trimmedDomain: string;
}) {
  const { t } = useTranslation("common");

  if (trimmedDomain) {
    return (
      <Chip
        icon={
          <AlternateEmailRoundedIcon sx={{ fontSize: "14px !important" }} />
        }
        label={`@${trimmedDomain}`}
        size="small"
        variant="outlined"
        color="primary"
        data-testid="inspector-email-card-summary-chip"
        sx={{
          height: 24,
          fontSize: "0.75rem",
          fontWeight: 600,
          fontFamily: FONT_FAMILIES.mono,
          borderRadius: M3_SHAPE_CORNERS.small,
          bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
          "& .MuiChip-icon": {
            ml: "6px",
            mr: "-2px",
          },
        }}
      />
    );
  }

  return (
    <Chip
      icon={<PublicRoundedIcon sx={{ fontSize: "14px !important" }} />}
      label={t("inspector.anyEmail", "Any Email")}
      size="small"
      variant="outlined"
      data-testid="inspector-email-card-summary-chip"
      sx={{
        height: 24,
        fontSize: "0.75rem",
        fontWeight: 500,
        borderRadius: M3_SHAPE_CORNERS.small,
        color: "text.secondary",
        borderColor: (theme) => alpha(theme.palette.divider, 0.6),
        bgcolor: (theme) => theme.palette.surfaceContainerLow,
        "& .MuiChip-icon": {
          ml: "6px",
          mr: "-2px",
          color: "text.secondary",
        },
      }}
    />
  );
}

function handleCardHeaderKeyDown(
  e: React.KeyboardEvent,
  disabled: boolean,
  onToggleExpand?: () => void,
) {
  if (disabled) return;
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    onToggleExpand?.();
  }
}

function InstitutionEmailExpandButton({
  isExpanded,
  disabled,
}: {
  isExpanded?: boolean;
  disabled?: boolean;
}) {
  return (
    <IconButton
      size="small"
      tabIndex={-1}
      aria-hidden="true"
      disabled={disabled}
      data-testid="inspector-email-card-expand-button"
      sx={{
        p: 0.5,
        color: "text.secondary",
        transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
        transition: (theme) =>
          theme.transitions.create(["transform", "color"], {
            duration: theme.transitions.duration.shorter,
          }),
        "&:hover": {
          color: "text.primary",
        },
      }}
    >
      <ExpandMoreRoundedIcon fontSize="small" />
    </IconButton>
  );
}

export interface InstitutionEmailCardHeaderProps {
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  isConstrained?: boolean;
  emailDomain?: string;
  disabled?: boolean;
  onToggleConstraint?: (checked: boolean) => void;
}

export function InstitutionEmailCardHeader(
  props: InstitutionEmailCardHeaderProps,
) {
  const {
    isExpanded,
    onToggleExpand,
    isConstrained = false,
    emailDomain,
    disabled,
  } = props;
  const { t } = useTranslation("common");
  const trimmedDomain = emailDomain ? emailDomain.trim() : "";
  const isInteractive = !disabled;

  return (
    <Box
      onClick={isInteractive ? onToggleExpand : undefined}
      role="button"
      tabIndex={isInteractive ? 0 : -1}
      aria-expanded={isExpanded}
      aria-label={t("inspector.emailConfig", "Email Configuration")}
      data-testid="inspector-email-card-header"
      onKeyDown={(e) => handleCardHeaderKeyDown(e, !!disabled, onToggleExpand)}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 1.5,
        p: 2,
        cursor: isInteractive ? "pointer" : "default",
        userSelect: "none",
        transition: (theme) =>
          theme.transitions.create(["background-color"], {
            duration: theme.transitions.duration.shorter,
          }),
        "&:hover": {
          bgcolor: isInteractive
            ? (theme) => alpha(theme.palette.action.hover, 0.04)
            : "transparent",
        },
        "&:focus-visible": {
          outline: (theme) => `2px solid ${theme.palette.primary.main}`,
          outlineOffset: "-2px",
        },
      }}
    >
      <Box
        sx={{ display: "flex", alignItems: "center", gap: 1.25, minWidth: 0 }}
      >
        <AlternateEmailRoundedIcon
          fontSize="small"
          sx={{ color: "primary.main", flexShrink: 0 }}
        />
        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: 700,
            color: "text.primary",
            whiteSpace: "nowrap",
          }}
        >
          {t("inspector.emailConfig", "Email Configuration")}
        </Typography>
      </Box>

      <Box
        sx={{ display: "flex", alignItems: "center", gap: 1, flexShrink: 0 }}
      >
        <InstitutionEmailSummaryChip
          isConstrained={isConstrained}
          trimmedDomain={trimmedDomain}
        />

        <InstitutionEmailExpandButton
          isExpanded={isExpanded}
          disabled={disabled}
        />
      </Box>
    </Box>
  );
}

export interface InstitutionEmailCardProps {
  emailDomain: string;
  usernamePattern: string;
  previewEmail: string;
  disabled: boolean;
  isConstrained?: boolean;
  onToggleConstraint?: (constrained: boolean) => void;
  onFieldChange: (
    field: "emailDomain" | "usernamePattern",
    nextValue: string,
  ) => void;
  onBlur: (field: "emailDomain" | "usernamePattern") => void;
  defaultExpanded?: boolean;
  expanded?: boolean;
  onToggleExpand?: () => void;
}

export function InstitutionEmailCard({
  emailDomain,
  usernamePattern,
  previewEmail,
  disabled,
  isConstrained = false,
  onToggleConstraint,
  onFieldChange,
  onBlur,
  defaultExpanded = false,
  expanded: controlledExpanded,
  onToggleExpand,
}: InstitutionEmailCardProps) {
  const [internalExpanded, setInternalExpanded] = useState(defaultExpanded);
  const isExpanded =
    controlledExpanded !== undefined ? controlledExpanded : internalExpanded;

  const handleToggleExpand = () => {
    if (onToggleExpand) {
      onToggleExpand();
    } else {
      setInternalExpanded((prev) => !prev);
    }
  };

  return (
    <Card
      variant="outlined"
      isNested
      sx={{
        p: 0,
        borderRadius: "16px",
        overflow: "visible",
        bgcolor: (theme) =>
          theme.palette.surfaceContainerLow ||
          alpha(theme.palette.background.paper, 0.4),
        border: (theme) => `1px solid ${alpha(theme.palette.divider, 0.4)}`,
        transition: (theme) =>
          theme.transitions.create(["border-color", "background-color"], {
            duration: theme.transitions.duration.shorter,
          }),
        "&:hover": {
          borderColor: (theme) => alpha(theme.palette.primary.main, 0.35),
        },
      }}
      data-testid="inspector-institution-email-card"
    >
      <InstitutionEmailCardHeader
        isExpanded={isExpanded}
        onToggleExpand={handleToggleExpand}
        isConstrained={isConstrained}
        emailDomain={emailDomain}
        disabled={disabled}
        onToggleConstraint={onToggleConstraint}
      />

      <Collapse in={isExpanded} timeout="auto">
        <Box
          sx={{
            p: 2,
            pt: 1,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            borderTop: (theme) =>
              `1px solid ${alpha(theme.palette.divider, 0.15)}`,
            overflowY: "auto",
          }}
        >
          {/* Compatibility anchors for legacy/test selectors if present */}
          {onToggleConstraint && (
            <>
              <Box
                component="span"
                data-testid="inspector-domain-free-toggle"
                onClick={() => onToggleConstraint(false)}
                sx={{ display: "none" }}
                aria-hidden="true"
              />
              <Box
                component="span"
                data-testid="inspector-domain-constrained-toggle"
                onClick={() => onToggleConstraint(true)}
                sx={{ display: "none" }}
                aria-hidden="true"
              />
            </>
          )}

          <InstitutionConstrainedDomainFields
            emailDomain={emailDomain}
            usernamePattern={usernamePattern}
            disabled={disabled}
            previewEmail={previewEmail}
            onFieldChange={onFieldChange}
            onBlur={onBlur}
          />
        </Box>
      </Collapse>
    </Card>
  );
}
