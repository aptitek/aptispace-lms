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

export function resolveAccessIcon(
  accessType?: AccessType,
  fontSize: string = "0.95rem",
) {
  if (accessType === "badge") {
    return <BadgeRoundedIcon sx={{ fontSize }} />;
  }
  if (accessType === "key") {
    return <VpnKeyRoundedIcon sx={{ fontSize }} />;
  }
  return <DialpadRoundedIcon sx={{ fontSize }} />;
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
  showIcon?: boolean;
  isCodeCopied?: boolean;
  onCopyDoorCode?: () => void;
  labels: MapSheetLabels;
}

interface CopyDoorCodeButtonProps {
  doorCode: string;
  isCodeCopied: boolean;
  onCopyDoorCode: () => void;
  labels: MapSheetLabels;
}

function CopyDoorCodeButton({
  isCodeCopied,
  onCopyDoorCode,
  labels,
}: CopyDoorCodeButtonProps) {
  return (
    <Tooltip arrow title={isCodeCopied ? labels.copiedDoorCode : labels.copy}>
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
  );
}

interface InstructionTooltipTriggerProps {
  instructions: string;
  label: string;
}

function InstructionTooltipTrigger({
  instructions,
  label,
}: InstructionTooltipTriggerProps) {
  return (
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
        title={<InstructionsCard instructions={instructions} label={label} />}
      >
        <Box
          component="span"
          role="button"
          tabIndex={0}
          aria-label={label}
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
  );
}

interface DoorCodePillViewProps {
  doorCode: string;
  instructions?: string;
  accessType?: AccessType;
  showIcon: boolean;
  isCodeCopied: boolean;
  onCopyDoorCode?: () => void;
  labels: MapSheetLabels;
}

function DoorCodePillView({
  doorCode,
  instructions,
  accessType,
  showIcon,
  isCodeCopied,
  onCopyDoorCode,
  labels,
}: DoorCodePillViewProps) {
  return (
    <DoorCodePill data-testid="door-code-pill">
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
        {showIcon ? resolveAccessIcon(accessType) : null}
        <span>{doorCode}</span>
      </Box>

      {onCopyDoorCode ? (
        <CopyDoorCodeButton
          doorCode={doorCode}
          isCodeCopied={isCodeCopied}
          onCopyDoorCode={onCopyDoorCode}
          labels={labels}
        />
      ) : null}

      {instructions ? (
        <InstructionTooltipTrigger
          instructions={instructions}
          label={labels.instructions}
        />
      ) : null}
    </DoorCodePill>
  );
}

interface InstructionsChipViewProps {
  instructions: string;
  showIcon: boolean;
  label: string;
}

function InstructionsChipView({
  instructions,
  showIcon,
  label,
}: InstructionsChipViewProps) {
  return (
    <Tooltip
      arrow
      disableInteractive={false}
      placement="top"
      enterDelay={100}
      leaveDelay={200}
      slotProps={instructionTooltipSlotProps}
      title={<InstructionsCard instructions={instructions} label={label} />}
    >
      <WayfindingChip
        $variant="instruction"
        role="button"
        tabIndex={0}
        aria-label={label}
        data-testid="instructions-menu-trigger"
        sx={{ cursor: "pointer" }}
      >
        {showIcon ? (
          <InfoOutlinedIcon
            sx={{ fontSize: "0.85rem", color: "warning.main" }}
          />
        ) : null}
        <span>{label}</span>
      </WayfindingChip>
    </Tooltip>
  );
}

export function AccessCodeChip({
  doorCode,
  instructions,
  accessType,
  showIcon = true,
  isCodeCopied = false,
  onCopyDoorCode,
  labels,
}: AccessCodeChipProps) {
  if (doorCode) {
    return (
      <DoorCodePillView
        doorCode={doorCode}
        instructions={instructions}
        accessType={accessType}
        showIcon={showIcon}
        isCodeCopied={isCodeCopied}
        onCopyDoorCode={onCopyDoorCode}
        labels={labels}
      />
    );
  }

  if (instructions) {
    return (
      <InstructionsChipView
        instructions={instructions}
        showIcon={showIcon}
        label={labels.instructions}
      />
    );
  }

  return null;
}

export default AccessCodeChip;
