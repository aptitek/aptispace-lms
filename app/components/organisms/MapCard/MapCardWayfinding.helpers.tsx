import React from "react";
import { alpha, type Theme } from "@mui/material/styles";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import ApartmentRoundedIcon from "@mui/icons-material/ApartmentRounded";
import ElevatorRoundedIcon from "@mui/icons-material/ElevatorRounded";
import MeetingRoomRoundedIcon from "@mui/icons-material/MeetingRoomRounded";
import DialpadRoundedIcon from "@mui/icons-material/DialpadRounded";
import BadgeRoundedIcon from "@mui/icons-material/BadgeRounded";
import PhoneInTalkRoundedIcon from "@mui/icons-material/PhoneInTalkRounded";
import VpnKeyRoundedIcon from "@mui/icons-material/VpnKeyRounded";
import LockOpenRoundedIcon from "@mui/icons-material/LockOpenRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";

import type { ChipSegment } from "~/components/molecules/SegmentedChip/SegmentedChip.types";
import type { AccessType, MapCardSize, ParsedRoomInfo } from "./MapCard.types";
import { cleanCampusName, cleanBuildingName } from "./MapCard.utils";

export interface AccessColorTheme {
  primary: string;
  secondary: string;
  warning: string;
  infoColor: string;
  success: string;
  purple: string;
  orange: string;
  textPrimary: string;
}

export function resolveAccessColors(theme: Theme): AccessColorTheme {
  return {
    primary: theme.palette.primary.main,
    secondary: theme.palette.secondary.main,
    warning: theme.palette.warning.main,
    infoColor: theme.palette.info.main,
    success: theme.palette.success.main,
    purple: theme.palette.secondary.main,
    orange: theme.palette.warning.dark,
    textPrimary: theme.palette.text.primary,
  };
}

export function resolveAccessTypeVisuals(
  accessType: AccessType | undefined,
  colors: AccessColorTheme,
) {
  switch (accessType) {
    case "intercom":
      return {
        color: colors.infoColor,
        bg: alpha(colors.infoColor, 0.16),
        label: "Interphone",
      };
    case "key":
      return {
        color: colors.orange,
        bg: alpha(colors.orange, 0.16),
        label: "Clé",
      };
    case "open":
      return {
        color: colors.success,
        bg: alpha(colors.success, 0.16),
        label: "Accès libre",
      };
    case "badge":
    default:
      return {
        color: colors.purple,
        bg: alpha(colors.purple, 0.16),
        label: "Badge",
      };
  }
}

export function resolveAccessTypeIcon(
  accessType?: AccessType,
  iconSize = 16,
  color?: string,
) {
  const sx = { fontSize: iconSize, ...(color ? { color } : {}) };
  switch (accessType) {
    case "badge":
      return <BadgeRoundedIcon sx={sx} />;
    case "intercom":
      return <PhoneInTalkRoundedIcon sx={sx} />;
    case "key":
      return <VpnKeyRoundedIcon sx={sx} />;
    case "open":
      return <LockOpenRoundedIcon sx={sx} />;
    case "code":
    default:
      return <DialpadRoundedIcon sx={sx} />;
  }
}

export interface LocationSegmentsOptions {
  campusName?: string;
  buildingName?: string;
  iconSize: number;
  colors: AccessColorTheme;
  onCampusChange?: (newCampus: string) => void;
  onBuildingChange?: (newBuilding: string) => void;
}

export function buildLocationSegments(
  options: LocationSegmentsOptions,
): ChipSegment[] {
  const campus = options.campusName || "Campus";
  const building = options.buildingName || "Building";
  const { iconSize, colors, onCampusChange, onBuildingChange } = options;

  return [
    {
      id: "campus",
      icon: (
        <SchoolRoundedIcon sx={{ fontSize: iconSize, color: colors.primary }} />
      ),
      label: cleanCampusName(campus),
      tooltip: campus,
      color: colors.primary,
      bold: true,
      onEdit: onCampusChange,
      testId: "seg-campus",
    },
    {
      id: "building",
      icon: (
        <ApartmentRoundedIcon
          sx={{ fontSize: iconSize, color: colors.secondary }}
        />
      ),
      label: cleanBuildingName(building),
      tooltip: building,
      color: colors.textPrimary,
      bold: true,
      onEdit: onBuildingChange,
      testId: "seg-building",
    },
  ];
}

export interface HeroRoomSegmentsOptions {
  roomInfo: ParsedRoomInfo;
  iconSize: number;
  colors: AccessColorTheme;
  onFloorChange?: (newFloor: string) => void;
  onRoomChange?: (newRoom: string) => void;
}

export function buildHeroRoomSegments(
  options: HeroRoomSegmentsOptions,
): ChipSegment[] {
  const { roomInfo, iconSize, colors, onFloorChange, onRoomChange } = options;
  const roomDisplay = roomInfo.roomName
    ? roomInfo.roomName
    : roomInfo.roomNumber || roomInfo.rawRoom;

  return [
    {
      id: "floor",
      icon: (
        <ElevatorRoundedIcon
          sx={{ fontSize: iconSize, color: colors.infoColor }}
        />
      ),
      label: roomInfo.floor,
      tooltip: roomInfo.floorLabel,
      color: colors.infoColor,
      background: alpha(colors.infoColor, 0.12),
      mono: true,
      bold: true,
      onEdit: onFloorChange,
      testId: "seg-floor",
    },
    {
      id: "room",
      icon: (
        <MeetingRoomRoundedIcon
          sx={{ fontSize: iconSize, color: colors.primary }}
        />
      ),
      label: roomDisplay,
      tooltip: roomInfo.roomName
        ? `${roomInfo.roomName} (${roomInfo.roomLabel})`
        : roomInfo.tooltipText,
      background: alpha(colors.primary, 0.16),
      color: colors.primary,
      mono: !roomInfo.roomName,
      bold: true,
      onEdit: onRoomChange,
      testId: "seg-room",
    },
  ];
}

interface DoorCodeSegmentOptions {
  doorCode?: string;
  isCodeCopied?: boolean;
  onCopyDoorCode?: () => void;
  onDoorCodeChange?: (newDoorCode: string) => void;
  iconSize?: number;
  colors: AccessColorTheme;
}

function createDoorCodeSegment(
  options: DoorCodeSegmentOptions,
): ChipSegment | null {
  const {
    doorCode,
    isCodeCopied,
    onCopyDoorCode,
    onDoorCodeChange,
    iconSize = 14,
    colors,
  } = options;
  if (!doorCode) return null;

  if (isCodeCopied) {
    return {
      id: "doorCode",
      icon: (
        <CheckRoundedIcon sx={{ fontSize: iconSize, color: colors.success }} />
      ),
      label: "Copié !",
      mono: true,
      bold: true,
      background: alpha(colors.success, 0.2),
      color: colors.success,
      tooltip: "Code copié dans le presse-papier",
      onClick: onCopyDoorCode,
      testId: "seg-doorcode",
    };
  }

  return {
    id: "doorCode",
    icon: (
      <DialpadRoundedIcon sx={{ fontSize: iconSize, color: colors.warning }} />
    ),
    label: doorCode,
    mono: true,
    bold: true,
    background: alpha(colors.warning, 0.14),
    color: colors.warning,
    tooltip: "Digicode (Cliquer pour copier)",
    onClick: onCopyDoorCode,
    onEdit: onDoorCodeChange,
    testId: "seg-doorcode",
  };
}

function isBadgeAccess(
  accessType?: AccessType,
  instructions?: string,
  hasDoorCode?: boolean,
  hasBadge?: boolean,
): boolean {
  if (hasBadge !== undefined) return hasBadge;
  if (accessType === "badge") return true;
  if (instructions && /(badge|rfid|pass|carte)/i.test(instructions))
    return true;
  return Boolean(instructions && !hasDoorCode);
}

interface AccessIconSegmentOptions {
  accessType?: AccessType;
  instructions?: string;
  hasDoorCode?: boolean;
  hasBadge?: boolean;
  iconSize?: number;
  colors: AccessColorTheme;
}

function createAccessIconSegment(
  options: AccessIconSegmentOptions,
): ChipSegment | null {
  const {
    accessType,
    instructions,
    hasDoorCode,
    hasBadge,
    iconSize = 14,
    colors,
  } = options;

  if (isBadgeAccess(accessType, instructions, hasDoorCode, hasBadge)) {
    const visuals = resolveAccessTypeVisuals("badge", colors);
    return {
      id: "badge",
      icon: (
        <BadgeRoundedIcon
          sx={{ fontSize: iconSize + 1, color: visuals.color }}
        />
      ),
      background: visuals.bg,
      color: visuals.color,
      tooltip: instructions || "Badge d'accès requis",
      testId: "seg-access-badge",
    };
  }

  if (accessType && accessType !== "code") {
    const visuals = resolveAccessTypeVisuals(accessType, colors);
    return {
      id: "accessType",
      icon: resolveAccessTypeIcon(accessType, iconSize + 1, visuals.color),
      background: visuals.bg,
      color: visuals.color,
      tooltip: instructions || `Accès: ${visuals.label}`,
      testId: "seg-access-type",
    };
  }

  return null;
}

export interface AccessSegmentsOptions {
  doorCode?: string;
  accessType?: AccessType;
  instructions?: string;
  isCodeCopied: boolean;
  onCopyDoorCode?: () => void;
  onDoorCodeChange?: (newDoorCode: string) => void;
  hasBadge?: boolean;
  iconSize: number;
  colors: AccessColorTheme;
}

export function buildAccessSegments(
  options: AccessSegmentsOptions,
): ChipSegment[] {
  const segs: ChipSegment[] = [];
  const doorCodeSeg = createDoorCodeSegment({
    doorCode: options.doorCode,
    isCodeCopied: options.isCodeCopied,
    onCopyDoorCode: options.onCopyDoorCode,
    onDoorCodeChange: options.onDoorCodeChange,
    iconSize: options.iconSize,
    colors: options.colors,
  });
  if (doorCodeSeg) segs.push(doorCodeSeg);

  const accessIconSeg = createAccessIconSegment({
    accessType: options.accessType,
    instructions: options.instructions,
    hasDoorCode: Boolean(options.doorCode),
    hasBadge: options.hasBadge,
    iconSize: options.iconSize,
    colors: options.colors,
  });
  if (accessIconSeg) segs.push(accessIconSeg);

  return segs;
}

export function resolveAccessChipOutline(
  hasDoorCode: boolean,
  hasAccessIcon: boolean,
  colors: AccessColorTheme,
) {
  if (hasDoorCode && hasAccessIcon) {
    return {
      border: alpha(colors.warning, 0.35),
      bg: alpha(colors.warning, 0.04),
    };
  }
  if (hasDoorCode) {
    return {
      border: alpha(colors.warning, 0.35),
      bg: alpha(colors.warning, 0.04),
    };
  }
  return {
    border: alpha(colors.purple, 0.35),
    bg: alpha(colors.purple, 0.04),
  };
}

export function resolveIconSizes(size: MapCardSize) {
  if (size === "small") {
    return { location: 15, hero: 18, secondary: 13 };
  }
  if (size === "large") {
    return { location: 20, hero: 24, secondary: 15 };
  }
  return { location: 18, hero: 21, secondary: 14 };
}

export function resolveLocationMetrics(size: MapCardSize) {
  if (size === "small") {
    return {
      chipSize: "small" as const,
      height: 24,
      fontSize: "0.75rem",
      iconSize: 15,
    };
  }
  if (size === "large") {
    return {
      chipSize: "large" as const,
      height: 34,
      fontSize: "0.95rem",
      iconSize: 20,
    };
  }
  return {
    chipSize: "medium" as const,
    height: 28,
    fontSize: "0.875rem",
    iconSize: 18,
  };
}

export function resolveHeroMetrics(size: MapCardSize) {
  if (size === "small") {
    return {
      height: 32,
      fontSize: "1rem",
      iconSize: 18,
      chipSize: "medium" as const,
    };
  }
  if (size === "large") {
    return {
      height: 44,
      fontSize: "1.25rem",
      iconSize: 24,
      chipSize: "large" as const,
    };
  }
  return {
    height: 38,
    fontSize: "1.25rem",
    iconSize: 21,
    chipSize: "large" as const,
  };
}
