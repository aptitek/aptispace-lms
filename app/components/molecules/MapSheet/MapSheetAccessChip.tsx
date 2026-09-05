import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import { alpha, type Theme } from "@mui/material/styles";
import DialpadRoundedIcon from "@mui/icons-material/DialpadRounded";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import BadgeRoundedIcon from "@mui/icons-material/BadgeRounded";
import VpnKeyRoundedIcon from "@mui/icons-material/VpnKeyRounded";

import Tooltip from "../../atoms/Tooltip";
import type { AccessType } from "./MapSheet.types";
import type { MapSheetLabels } from "./MapSheetItinerary";
import { DoorCodePill, WayfindingChip } from "./MapSheet.styles";

export function resolveAccessIcon(accessType?: AccessType) {
  if (accessType === "badge") {
    return <BadgeRoundedIcon sx={{ fontSize: "0.95rem" }} />;
  }
  if (accessType === "key") {
    return <VpnKeyRoundedIcon sx={{ fontSize: "0.95rem" }} />;
  }
  return <DialpadRoundedIcon sx={{ fontSize: "0.95rem" }} />;
}

interface InstructionsCardProps {
  instructions: string;
  label: string;
}

export function InstructionsCard({
  instructions,
  label,
}: InstructionsCardProps) {
  return (
    <Box
      sx={{
        p: 1.5,
        display: "flex",
        gap: 1.25,
        alignItems: "flex-start",
        maxWidth: 320,
      }}
      data-testid="instructions-card"
    >
      <InfoOutlinedIcon
        sx={{
          fontSize: "1.2rem",
          color: "warning.main",
          mt: 0.2,
          flexShrink: 0,
        }}
      />
      <Box sx={{ minWidth: 0 }}>
        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: 800,
            mb: 0.5,
            color: "text.primary",
            fontSize: "0.85rem",
          }}
        >
          {label}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: "text.secondary",
            fontSize: "0.8rem",
            lineHeight: 1.5,
            wordBreak: "break-word",
          }}
        >
          {instructions}
        </Typography>
      </Box>
    </Box>
  );
}

const instructionTooltipSlotProps = {
  tooltip: {
    sx: {
      backgroundColor: "background.paper",
      color: "text.primary",
      p: 0,
      maxWidth: 340,
      borderRadius: "12px",
      boxShadow: (theme: Theme) =>
        `0 8px 24px ${alpha(theme.palette.common.black, 0.2)}`,
      border: "1px solid",
      borderColor: "divider",
      "& .MuiTooltip-arrow": {
        color: "background.paper",
        "&::before": {
          border: "1px solid",
          borderColor: "divider",
        },
      },
    },
  },
};

export interface AccessCodeChipProps {
  doorCode?: string;
  instructions?: string;
  accessType?: AccessType;
  isCodeCopied?: boolean;
  onCopyDoorCode?: () => void;
  labels: MapSheetLabels;
}

export function AccessCodeChip({
  doorCode,
  instructions,
  accessType,
  isCodeCopied = false,
  onCopyDoorCode,
  labels,
}: AccessCodeChipProps) {
  if (!doorCode && !instructions) return null;

  // Case 1: Door code is present (combines door code and instruction trigger in ONE single chip)
  if (doorCode) {
    return (
      <DoorCodePill data-testid="door-code-pill">
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          {resolveAccessIcon(accessType)}
          <span>{doorCode}</span>
        </Box>

        {onCopyDoorCode ? (
          <Tooltip
            arrow
            title={isCodeCopied ? labels.copiedDoorCode : labels.copy}
          >
            <IconButton
              size="small"
              onClick={onCopyDoorCode}
              aria-label={labels.doorCode}
              data-testid="copy-door-code-button"
              sx={{
                p: 0.25,
                color: isCodeCopied ? "success.main" : "inherit",
              }}
            >
              {isCodeCopied ? (
                <CheckRoundedIcon sx={{ fontSize: "0.85rem" }} />
              ) : (
                <ContentCopyRoundedIcon sx={{ fontSize: "0.85rem" }} />
              )}
            </IconButton>
          </Tooltip>
        ) : null}

        {instructions ? (
          <>
            <Box
              component="span"
              aria-hidden="true"
              sx={{
                width: "1px",
                height: "14px",
                backgroundColor: "currentColor",
                opacity: 0.35,
                mx: 0.25,
              }}
            />
            <Tooltip
              arrow
              disableInteractive={false}
              placement="top"
              enterDelay={100}
              leaveDelay={200}
              slotProps={instructionTooltipSlotProps}
              title={
                <InstructionsCard
                  instructions={instructions}
                  label={labels.instructions}
                />
              }
            >
              <Box
                component="span"
                role="button"
                tabIndex={0}
                aria-label={labels.instructions}
                data-testid="instructions-menu-trigger"
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  cursor: "pointer",
                  p: 0.25,
                  borderRadius: "4px",
                  color: "warning.main",
                  transition: "color 0.15s ease, transform 0.15s ease",
                  "&:hover": {
                    transform: "scale(1.15)",
                    color: "warning.dark",
                  },
                }}
              >
                <InfoOutlinedIcon sx={{ fontSize: "0.95rem" }} />
              </Box>
            </Tooltip>
          </>
        ) : null}
      </DoorCodePill>
    );
  }

  // Case 2: Only instructions are present (renders as a chip, instructions card on hover)
  return (
    <Tooltip
      arrow
      disableInteractive={false}
      placement="top"
      enterDelay={100}
      leaveDelay={200}
      slotProps={instructionTooltipSlotProps}
      title={
        <InstructionsCard
          instructions={instructions!}
          label={labels.instructions}
        />
      }
    >
      <WayfindingChip
        $variant="instruction"
        role="button"
        tabIndex={0}
        aria-label={labels.instructions}
        data-testid="instructions-menu-trigger"
        sx={{ cursor: "pointer" }}
      >
        <InfoOutlinedIcon sx={{ fontSize: "0.85rem", color: "warning.main" }} />
        <span>{labels.instructions}</span>
      </WayfindingChip>
    </Tooltip>
  );
}

export default AccessCodeChip;
