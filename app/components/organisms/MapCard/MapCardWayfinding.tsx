import React, { useMemo } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import { useTheme, alpha } from "@mui/material/styles";
import InfoOutlineRoundedIcon from "@mui/icons-material/InfoOutlineRounded";
import BadgeRoundedIcon from "@mui/icons-material/BadgeRounded";

import SegmentedChip from "~/components/molecules/SegmentedChip";
import Switch from "~/components/atoms/Switch";
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
  editable?: boolean;
  hasBadge?: boolean;
  onBadgeChange?: (hasBadge: boolean) => void;
  onInstructionsChange?: (instructions: string) => void;
  onCampusChange?: (campusName: string) => void;
  onBuildingChange?: (buildingName: string) => void;
  onFloorChange?: (floor: string) => void;
  onRoomChange?: (room: string) => void;
  onDoorCodeChange?: (doorCode: string) => void;
}

interface LocationChipProps {
  segments: ChipSegment[];
  size: MapCardSize;
  orientation: "horizontal" | "vertical" | "responsive";
  borderColor: string;
  editable?: boolean;
}

function LocationChipView({
  segments,
  size,
  orientation,
  borderColor,
  editable,
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
        editable={editable}
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
  editable?: boolean;
}

function HeroRoomChipView({
  segments,
  size,
  orientation,
  primaryColor,
  editable,
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
        editable={editable}
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
  editable?: boolean;
}

function AccessChipView({
  segments,
  size,
  borderColor,
  bgColor,
  editable,
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
        editable={editable}
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
        onCampusChange: props.onCampusChange,
        onBuildingChange: props.onBuildingChange,
      }),
    [
      props.campusName,
      props.buildingName,
      iconSizes.location,
      colors,
      props.onCampusChange,
      props.onBuildingChange,
    ],
  );

  const heroRoomSegments = useMemo<ChipSegment[]>(
    () =>
      buildHeroRoomSegments({
        roomInfo: props.roomInfo,
        iconSize: iconSizes.hero,
        colors,
        onFloorChange: props.onFloorChange,
        onRoomChange: props.onRoomChange,
      }),
    [
      props.roomInfo,
      iconSizes.hero,
      colors,
      props.onFloorChange,
      props.onRoomChange,
    ],
  );

  const accessSegments = useMemo<ChipSegment[]>(() => {
    return buildAccessSegments({
      doorCode: props.doorCode,
      accessType: props.accessType,
      instructions: props.instructions,
      isCodeCopied: props.isCodeCopied,
      onCopyDoorCode: props.onCopyDoorCode,
      onDoorCodeChange: props.onDoorCodeChange,
      hasBadge: props.hasBadge,
      iconSize: iconSizes.secondary,
      colors,
    });
  }, [
    props.doorCode,
    props.accessType,
    props.instructions,
    props.isCodeCopied,
    props.onCopyDoorCode,
    props.onDoorCodeChange,
    props.hasBadge,
    iconSizes.secondary,
    colors,
  ]);

  const accessChipOutline = useMemo(
    () =>
      resolveAccessChipOutline(
        Boolean(props.doorCode),
        Boolean(props.accessType || props.instructions || props.hasBadge),
        colors,
      ),
    [
      props.doorCode,
      props.accessType,
      props.instructions,
      props.hasBadge,
      colors,
    ],
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
          editable={props.editable}
        />

        {/* Hero: Floor / Room prominent badge (like digital time in ClockCard!) */}
        <HeroRoomChipView
          segments={heroRoomSegments}
          size={size}
          orientation={chipOrientation}
          primaryColor={colors.primary}
          editable={props.editable}
        />

        {/* Bottom: Optional Access Chip (Door code, Badge icon) */}
        <AccessChipView
          segments={accessSegments}
          size={size}
          borderColor={accessChipOutline.border}
          bgColor={accessChipOutline.bg}
          editable={props.editable}
        />
      </ChipsStack>

      {/* Editable controls: Badge switch & Instructions textfield */}
      {props.editable && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1.25,
            mt: 1.5,
            pt: 1.25,
            borderTop: "1px dashed",
            borderColor: "divider",
            width: "100%",
          }}
          data-testid="wayfinding-editable-controls"
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 1,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
              <BadgeRoundedIcon
                sx={{ fontSize: 18, color: "secondary.main" }}
              />
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  fontSize: "0.82rem",
                  color: "text.primary",
                }}
              >
                Badge
              </Typography>
            </Box>
            <Switch
              checked={Boolean(props.hasBadge)}
              onChange={(checked) => props.onBadgeChange?.(checked)}
              size="small"
              data-testid="badge-switch"
              aria-label="Badge"
            />
          </Box>

          <TextField
            size="small"
            fullWidth
            label="Instructions"
            placeholder="Consignes d'accès..."
            value={props.instructions ?? ""}
            onChange={(event) =>
              props.onInstructionsChange?.(event.target.value)
            }
            data-testid="instructions-field"
            slotProps={{
              htmlInput: {
                "data-testid": "instructions-input",
              },
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                fontSize: "0.82rem",
              },
            }}
          />
        </Box>
      )}

      {!props.editable && props.showInstructionBanner ? (
        <WayfindingInstructionNote text={props.instructions} />
      ) : null}

      {props.children}
    </WayfindingContainer>
  );
}

export default MapCardWayfinding;
