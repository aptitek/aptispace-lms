import React from "react";
import NavigationRoundedIcon from "@mui/icons-material/NavigationRounded";
import { styled, alpha } from "@mui/material/styles";

import { M3_SHAPE_CORNERS } from "~/tokens/shapes";
import type { MapCoordinates } from "./Map.types";
import { MapPin } from "./MapPin";

export interface MapFallbackProps {
  /** Geographic coordinates for pin */
  coordinates?: MapCoordinates;
  /** Latitude override */
  latitude?: number;
  /** Longitude override */
  longitude?: number;
  /** Zoom level override */
  zoom?: number;
  /** Pin label badge text */
  pinLabel?: string;
  /** Custom pin color (default: Solarized green) */
  pinColor?: string;
  /** Accessible pin label */
  pinAriaLabel?: string;
  /** Container width */
  width?: string | number;
  /** Container height */
  height?: string | number;
  /** Border radius */
  borderRadius?: string | number;
  /** Border */
  border?: string;
  /** Box shadow */
  boxShadow?: string;
  /** Aspect ratio */
  aspectRatio?: string | number;
  /** Optional custom status message */
  statusMessage?: string;
  /** Additional React children */
  children?: React.ReactNode;
  /** Optional class name */
  className?: string;
  /** Test identifier */
  testId?: string;
  /** Inline style */
  style?: React.CSSProperties;
}

const FallbackRoot = styled("div", {
  shouldForwardProp: (prop) =>
    prop !== "$width" &&
    prop !== "$height" &&
    prop !== "$borderRadius" &&
    prop !== "$border" &&
    prop !== "$boxShadow" &&
    prop !== "$aspectRatio",
})<{
  $width?: string | number;
  $height?: string | number;
  $borderRadius?: string | number;
  $border?: string;
  $boxShadow?: string;
  $aspectRatio?: string | number;
}>(
  ({
    theme,
    $width,
    $height,
    $borderRadius,
    $border,
    $boxShadow,
    $aspectRatio,
  }) => ({
    position: "relative",
    width: $width ?? "100%",
    height: $height ?? "100%",
    aspectRatio: $aspectRatio,
    borderRadius: $borderRadius ?? `${M3_SHAPE_CORNERS.medium}px`,
    border: $border,
    boxShadow: $boxShadow,
    overflow: "hidden",
    backgroundColor: "var(--color-solarized-base3, #fdf6e3)",
    ...theme.applyStyles("dark", {
      backgroundColor: "var(--color-solarized-base03, #002b36)",
    }),
    backgroundImage: `radial-gradient(${alpha(theme.palette.text.secondary, 0.12)} 1px, transparent 1px)`,
    backgroundSize: "24px 24px",
    boxSizing: "border-box",
  }),
);

const RoadAvenue = styled("div")(({ theme }) => ({
  position: "absolute",
  top: "50%",
  left: "-10%",
  width: "120%",
  height: 24,
  transform: "translateY(-50%) rotate(-5deg)",
  backgroundColor: alpha(theme.palette.background.paper, 0.75),
  borderTop: `1px solid ${alpha(theme.palette.divider, 0.3)}`,
  borderBottom: `1px solid ${alpha(theme.palette.divider, 0.3)}`,
  pointerEvents: "none",
}));

const RoadStreet = styled("div")(({ theme }) => ({
  position: "absolute",
  left: "45%",
  top: "-10%",
  height: "120%",
  width: 20,
  backgroundColor: alpha(theme.palette.background.paper, 0.75),
  borderLeft: `1px solid ${alpha(theme.palette.divider, 0.3)}`,
  borderRight: `1px solid ${alpha(theme.palette.divider, 0.3)}`,
  pointerEvents: "none",
}));

const BuildingBlock = styled("div")(({ theme }) => ({
  position: "absolute",
  borderRadius: `${M3_SHAPE_CORNERS.extraSmall}px`,
  backgroundColor: alpha(theme.palette.text.primary, 0.07),
  border: `1px solid ${alpha(theme.palette.divider, 0.35)}`,
  pointerEvents: "none",
}));

const CompassContainer = styled("div")(({ theme }) => ({
  position: "absolute",
  top: theme.spacing(1.5),
  right: theme.spacing(1.5),
  display: "flex",
  alignItems: "center",
  gap: 4,
  color: theme.palette.text.secondary,
  fontSize: "0.68rem",
  fontWeight: 700,
  opacity: 0.75,
  zIndex: 3,
  pointerEvents: "none",
}));

const PinContainer = styled("div")({
  position: "absolute",
  left: "50%",
  top: "50%",
  transform: "translate(-50%, -50%)",
  zIndex: 2,
  pointerEvents: "none",
});

function FallbackCartoDecorations() {
  return (
    <>
      <RoadAvenue />
      <RoadStreet />
      <BuildingBlock sx={{ top: "16%", left: "14%", width: 64, height: 38 }} />
      <BuildingBlock
        sx={{ bottom: "28%", left: "58%", width: 72, height: 44 }}
      />
      <BuildingBlock sx={{ top: "20%", right: "16%", width: 52, height: 36 }} />
    </>
  );
}

export function MapFallback({
  pinLabel,
  pinColor = "var(--color-solarized-green, #859900)",
  pinAriaLabel,
  width = "100%",
  height = "100%",
  borderRadius = `${M3_SHAPE_CORNERS.medium}px`,
  border,
  boxShadow,
  aspectRatio,
  children,
  className,
  testId = "map-fallback",
  style,
}: MapFallbackProps) {
  return (
    <FallbackRoot
      $width={width}
      $height={height}
      $borderRadius={borderRadius}
      $border={border}
      $boxShadow={boxShadow}
      $aspectRatio={aspectRatio}
      className={className}
      style={style}
      role="region"
      aria-label="Map 2D fallback view"
      data-testid={testId}
    >
      <FallbackCartoDecorations />

      <CompassContainer data-testid="map-fallback-compass">
        <NavigationRoundedIcon
          sx={{ fontSize: 13, transform: "rotate(-25deg)" }}
        />
        N
      </CompassContainer>

      <PinContainer data-testid="map-fallback-pin">
        <MapPin label={pinLabel} color={pinColor} ariaLabel={pinAriaLabel} />
      </PinContainer>

      {children}
    </FallbackRoot>
  );
}

export default MapFallback;
