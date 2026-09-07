import React, { useMemo } from "react";
import Box from "@mui/material/Box";
import { useTheme, alpha } from "@mui/material/styles";
import InfoOutlineRoundedIcon from "@mui/icons-material/InfoOutlineRounded";

import SegmentedChip from "~/components/molecules/SegmentedChip";
import type { ChipSegment } from "~/components/molecules/SegmentedChip/SegmentedChip.types";
import type {
  AccessType,
  MapCardSize,
  MapCardOrientation,
  ParsedRoomInfo,
} from "./MapCard.types";
import {
  WayfindingContainer,
  WayfindingHeader,
  WayfindingTitle,
  ChipsStack,
  InstructionNote,
} from "./MapCard.styles";
import {
  resolveAccessColors,
  resolveAccessChipOutline,
  resolveIconSizes,
  resolveLocationMetrics,
  resolveHeroMetrics,
  buildLocationSegments,
  buildHeroRoomSegments,
  buildAccessSegments,
} from "./MapCardWayfinding.helpers";

export interface MapCardWayfindingProps {
  campusName?: string;
  buildingName?: string;
  roomInfo: ParsedRoomInfo;
  doorCode?: string;
  accessType?: AccessType;
  instructions?: string;
  showInstructionBanner?: boolean;
  size?: MapCardSize;
  orientation?: MapCardOrientation;
  chipOrientation?: "horizontal" | "vertical" | "responsive";
  isCodeCopied: boolean;
  onCopyDoorCode?: () => void;
  title?: string;
  children?: React.ReactNode;
}

interface LocationChipProps {
  segments: ChipSegment[];
  size: MapCardSize;
  orientation: "horizontal" | "vertical" | "responsive";
  borderColor: string;
}

function LocationChipView({
  segments,
  size,
  orientation,
  borderColor,
}: LocationChipProps) {
  const metrics = resolveLocationMetrics(size);
  const isColumn = orientation === "vertical";

  return (
    <Box sx={{ width: "fit-content", maxWidth: "100%" }}>
      <SegmentedChip
        segments={segments}
        size={metrics.chipSize}
        variant="outlined"
        shape="pill"
        orientation={orientation}
        borderColor={borderColor}
        sx={{
          height: isColumn ? "auto" : metrics.height,
          fontSize: metrics.fontSize,
          fontWeight: 700,
          letterSpacing: "-0.01em",
          "& .MuiSvgIcon-root": {
            fontSize: metrics.iconSize,
          },
          ...(isColumn && {
            "& > span": {
              minHeight: metrics.height,
            },
          }),
        }}
        testId="location-chip"
        data-testid="location-chip"
      />
    </Box>
  );
}

interface HeroRoomChipProps {
  segments: ChipSegment[];
  size: MapCardSize;
  orientation: "horizontal" | "vertical" | "responsive";
  primaryColor: string;
}

function HeroRoomChipView({
  segments,
  size,
  orientation,
  primaryColor,
}: HeroRoomChipProps) {
  const metrics = resolveHeroMetrics(size);
  const isColumn = orientation === "vertical";

  return (
    <Box sx={{ width: "fit-content", maxWidth: "100%" }}>
      <SegmentedChip
        segments={segments}
        size={metrics.chipSize}
        variant="filled"
        shape="pill"
        orientation={orientation}
        borderColor={alpha(primaryColor, 0.38)}
        bgColor={alpha(primaryColor, 0.04)}
        sx={{
          boxShadow: `0 4px 14px -2px ${alpha(primaryColor, 0.22)}, 0 1px 3px rgba(0, 0, 0, 0.06)`,
          fontSize: metrics.fontSize,
          fontWeight: 800,
          letterSpacing: "-0.01em",
          fontVariantNumeric: "tabular-nums",
          height: isColumn ? "auto" : metrics.height,
          minHeight: metrics.height,
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
          "&:hover": {
            boxShadow: `0 6px 20px -2px ${alpha(primaryColor, 0.35)}`,
          },
          "& .MuiSvgIcon-root": {
            fontSize: metrics.iconSize,
          },
          ...(isColumn && {
            "& > span": {
              minHeight: metrics.height,
            },
          }),
        }}
        testId="prominent-wayfinding-chip"
        data-testid="prominent-wayfinding-chip"
      />
    </Box>
  );
}

interface AccessChipProps {
  segments: ChipSegment[];
  size: MapCardSize;
  borderColor?: string;
  bgColor?: string;
}

function AccessChipView({
  segments,
  size,
  borderColor,
  bgColor,
}: AccessChipProps) {
  if (segments.length === 0) return null;
  const chipSize = size === "large" ? "medium" : "small";

  return (
    <Box sx={{ width: "fit-content", maxWidth: "100%" }}>
      <SegmentedChip
        segments={segments}
        size={chipSize}
        variant="outlined"
        shape="pill"
        borderColor={borderColor}
        bgColor={bgColor}
        testId="optional-access-chip"
        data-testid="optional-access-chip"
      />
    </Box>
  );
}

function WayfindingInstructionNote({ text }: { text?: string }) {
  if (!text) return null;
  return (
    <InstructionNote data-testid="instruction-note">
      <InfoOutlineRoundedIcon
        sx={{ fontSize: 16, color: "primary.main", flexShrink: 0, mt: 0.5 }}
      />
      <span>{text}</span>
    </InstructionNote>
  );
}

export function MapCardWayfinding(props: MapCardWayfindingProps) {
  const theme = useTheme();
  const colors = useMemo(() => resolveAccessColors(theme), [theme]);
  const size = props.size || "medium";
  const orientation = props.orientation || "horizontal";
  const chipOrientation =
    props.chipOrientation ||
    (orientation === "vertical" ? "vertical" : "horizontal");
  const title = props.title;
  const iconSizes = resolveIconSizes(size);

  const locationSegments = useMemo<ChipSegment[]>(
    () =>
      buildLocationSegments({
        campusName: props.campusName,
        buildingName: props.buildingName,
        iconSize: iconSizes.location,
        colors,
      }),
    [props.campusName, props.buildingName, iconSizes.location, colors],
  );

  const heroRoomSegments = useMemo<ChipSegment[]>(
    () =>
      buildHeroRoomSegments({
        roomInfo: props.roomInfo,
        iconSize: iconSizes.hero,
        colors,
      }),
    [props.roomInfo, iconSizes.hero, colors],
  );

  const accessSegments = useMemo<ChipSegment[]>(() => {
    return buildAccessSegments({
      doorCode: props.doorCode,
      accessType: props.accessType,
      instructions: props.instructions,
      isCodeCopied: props.isCodeCopied,
      onCopyDoorCode: props.onCopyDoorCode,
      iconSize: iconSizes.secondary,
      colors,
    });
  }, [
    props.doorCode,
    props.accessType,
    props.instructions,
    props.isCodeCopied,
    props.onCopyDoorCode,
    iconSizes.secondary,
    colors,
  ]);

  const accessChipOutline = useMemo(
    () =>
      resolveAccessChipOutline(
        Boolean(props.doorCode),
        Boolean(props.accessType || props.instructions),
        colors,
      ),
    [props.doorCode, props.accessType, props.instructions, colors],
  );

  return (
    <WayfindingContainer
      $size={size}
      $orientation={orientation}
      data-testid="map-card-wayfinding"
    >
      {title ? (
        <WayfindingHeader>
          <WayfindingTitle>{title}</WayfindingTitle>
        </WayfindingHeader>
      ) : null}

      <ChipsStack>
        {/* Top: Location context chip (Campus | Building) */}
        <LocationChipView
          segments={locationSegments}
          size={size}
          orientation={chipOrientation}
          borderColor={alpha(colors.primary, 0.22)}
        />

        {/* Hero: Floor / Room prominent badge (like digital time in ClockCard!) */}
        <HeroRoomChipView
          segments={heroRoomSegments}
          size={size}
          orientation={chipOrientation}
          primaryColor={colors.primary}
        />

        {/* Bottom: Optional Access Chip (Door code, Badge icon) */}
        <AccessChipView
          segments={accessSegments}
          size={size}
          borderColor={accessChipOutline.border}
          bgColor={accessChipOutline.bg}
        />
      </ChipsStack>

      {props.showInstructionBanner ? (
        <WayfindingInstructionNote text={props.instructions} />
      ) : null}

      {props.children}
    </WayfindingContainer>
  );
}

export default MapCardWayfinding;
