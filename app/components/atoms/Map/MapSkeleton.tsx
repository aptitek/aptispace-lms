import React from "react";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import { styled, alpha } from "@mui/material/styles";

import { M3_SPACINGS } from "~/tokens/spacing";
import { M3_SHAPE_CORNERS } from "~/tokens/shapes";

export interface MapSkeletonProps {
  /** Width override (e.g. "100%", 320, "380px") */
  width?: string | number;
  /** Height override (e.g. "100%", 220, "240px") */
  height?: string | number;
  /** Border radius (default: "12px") */
  borderRadius?: string | number;
  /** Border override */
  border?: string;
  /** Box shadow override */
  boxShadow?: string;
  /** Aspect ratio override (e.g. "16 / 9") */
  aspectRatio?: string | number;
  /** Skeleton variant: "shimmer" for animated loading, "static" for static placeholder */
  variant?: "shimmer" | "static";
  /** Whether loading shimmer animation is active (default: true) */
  animated?: boolean;
  /** Optional class name */
  className?: string;
  /** Custom test ID (default: "map-skeleton") */
  testId?: string;
  /** Inline style overrides */
  style?: React.CSSProperties;
}

const SkeletonRoot = styled("div", {
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
    userSelect: "none",
  }),
);

const RoadBandAvenue = styled("div")(({ theme }) => ({
  position: "absolute",
  top: "48%",
  left: "-10%",
  width: "120%",
  height: 24,
  transform: "translateY(-50%) rotate(-6deg)",
  backgroundColor: alpha(theme.palette.background.paper, 0.55),
  borderTop: `1px solid ${alpha(theme.palette.divider, 0.25)}`,
  borderBottom: `1px solid ${alpha(theme.palette.divider, 0.25)}`,
  pointerEvents: "none",
}));

const RoadBandStreet = styled("div")(({ theme }) => ({
  position: "absolute",
  left: "42%",
  top: "-10%",
  height: "120%",
  width: 18,
  backgroundColor: alpha(theme.palette.background.paper, 0.55),
  borderLeft: `1px solid ${alpha(theme.palette.divider, 0.25)}`,
  borderRight: `1px solid ${alpha(theme.palette.divider, 0.25)}`,
  pointerEvents: "none",
}));

const ControlsStack = styled("div")({
  position: "absolute",
  top: M3_SPACINGS.medium,
  right: M3_SPACINGS.medium,
  display: "flex",
  flexDirection: "column",
  gap: 6,
  pointerEvents: "none",
  zIndex: 2,
});

const CompassPlaceholder = styled("div")({
  position: "absolute",
  top: M3_SPACINGS.medium,
  left: M3_SPACINGS.medium,
  display: "flex",
  alignItems: "center",
  gap: 4,
  pointerEvents: "none",
  zIndex: 2,
});

const PinCenterPlaceholder = styled("div")({
  position: "absolute",
  left: "50%",
  top: "50%",
  transform: "translate(-50%, -100%)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  pointerEvents: "none",
  zIndex: 3,
});

export function MapSkeleton({
  width = "100%",
  height = "100%",
  borderRadius = `${M3_SHAPE_CORNERS.medium}px`,
  border,
  boxShadow,
  aspectRatio,
  variant = "shimmer",
  animated = true,
  className,
  testId = "map-skeleton",
  style,
}: MapSkeletonProps) {
  const animation = animated && variant === "shimmer" ? "wave" : false;

  return (
    <SkeletonRoot
      $width={width}
      $height={height}
      $borderRadius={borderRadius}
      $border={border}
      $boxShadow={boxShadow}
      $aspectRatio={aspectRatio}
      className={className}
      style={style}
      role="progressbar"
      aria-label="Map loading placeholder"
      aria-busy="true"
      data-testid={testId}
    >
      {/* Background cartographic corridors */}
      <RoadBandAvenue />
      <RoadBandStreet />

      {/* Building footprint blocks */}
      <Box
        sx={{
          position: "absolute",
          top: "18%",
          left: "12%",
          width: 68,
          height: 42,
        }}
      >
        <Skeleton
          variant="rounded"
          width="100%"
          height="100%"
          animation={animation}
          sx={{ borderRadius: `${M3_SHAPE_CORNERS.small}px` }}
        />
      </Box>
      <Box
        sx={{
          position: "absolute",
          bottom: "16%",
          left: "56%",
          width: 78,
          height: 46,
        }}
      >
        <Skeleton
          variant="rounded"
          width="100%"
          height="100%"
          animation={animation}
          sx={{ borderRadius: `${M3_SHAPE_CORNERS.small}px` }}
        />
      </Box>
      <Box
        sx={{
          position: "absolute",
          top: "22%",
          right: "18%",
          width: 56,
          height: 38,
        }}
      >
        <Skeleton
          variant="rounded"
          width="100%"
          height="100%"
          animation={animation}
          sx={{ borderRadius: `${M3_SHAPE_CORNERS.small}px` }}
        />
      </Box>

      {/* Top compass placeholder */}
      <CompassPlaceholder>
        <Skeleton
          variant="circular"
          width={20}
          height={20}
          animation={animation}
        />
      </CompassPlaceholder>

      {/* Navigation controls stack placeholder */}
      <ControlsStack data-testid="map-skeleton-controls">
        <Skeleton
          variant="rounded"
          width={28}
          height={28}
          animation={animation}
          sx={{ borderRadius: `${M3_SHAPE_CORNERS.small}px` }}
        />
        <Skeleton
          variant="rounded"
          width={28}
          height={28}
          animation={animation}
          sx={{ borderRadius: `${M3_SHAPE_CORNERS.small}px` }}
        />
      </ControlsStack>

      {/* Center pin badge placeholder */}
      <PinCenterPlaceholder data-testid="map-skeleton-pin">
        <Skeleton
          variant="rounded"
          width={96}
          height={20}
          animation={animation}
          sx={{ borderRadius: `${M3_SHAPE_CORNERS.medium}px`, mb: 0.5 }}
        />
        <Skeleton
          variant="circular"
          width={16}
          height={16}
          animation={animation}
        />
      </PinCenterPlaceholder>
    </SkeletonRoot>
  );
}

export default MapSkeleton;
