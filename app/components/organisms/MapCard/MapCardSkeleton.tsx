import React from "react";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import { styled, alpha } from "@mui/material/styles";

import { MapSkeleton } from "~/components/atoms/Map";
import { M3_SHAPE_CORNERS } from "~/tokens/shapes";
import {
  SheetCard,
  CardBodyWrapper,
  WayfindingContainer,
} from "./MapCard.styles";
import type { MapCardSize, MapCardOrientation } from "./MapCard.types";

export interface MapCardSkeletonProps {
  /** Size scale ("small" | "medium" | "large") */
  size?: MapCardSize;
  /** Orientation ("horizontal" | "vertical") */
  orientation?: MapCardOrientation;
  /** Skeleton variant ("shimmer" | "static") */
  variant?: "shimmer" | "static";
  /** Whether loading shimmer animation is active (default: true) */
  animated?: boolean;
  /** Optional class name */
  className?: string;
  /** Test identifier */
  testId?: string;
  /** Inline style overrides */
  style?: React.CSSProperties;
}

const SkeletonFooter = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "10px 16px",
  backgroundColor: alpha(theme.palette.background.default, 0.45),
  borderTop: `1px solid ${alpha(theme.palette.divider, 0.35)}`,
  boxSizing: "border-box",
  width: "100%",
}));

const MapViewportWrapper = styled("div", {
  shouldForwardProp: (prop) => prop !== "$orientation",
})<{ $orientation?: MapCardOrientation }>(({ $orientation }) => ({
  position: "relative",
  flex: $orientation === "horizontal" ? "0 0 46%" : "1 1 auto",
  minHeight: $orientation === "horizontal" ? "100%" : 180,
  minWidth: $orientation === "horizontal" ? 220 : "100%",
  boxSizing: "border-box",
  overflow: "hidden",
  borderRadius: 0,
}));

export function MapCardSkeleton({
  size = "medium",
  orientation = "horizontal",
  variant = "shimmer",
  animated = true,
  className,
  testId = "map-card-skeleton",
  style,
}: MapCardSkeletonProps) {
  const animation = animated && variant === "shimmer" ? "wave" : false;

  return (
    <SheetCard
      $size={size}
      $orientation={orientation}
      className={className}
      style={style}
      role="progressbar"
      aria-label="MapCard loading placeholder"
      aria-busy="true"
      data-testid={testId}
    >
      <CardBodyWrapper $size={size} $orientation={orientation}>
        {/* Left / Top side: Wayfinding skeleton */}
        <WayfindingContainer $size={size} $orientation={orientation}>
          {/* Header title skeleton */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
            <Skeleton
              variant="rounded"
              width={110}
              height={16}
              animation={animation}
              sx={{ borderRadius: "4px" }}
            />
          </Box>

          {/* Large primary campus / building chip */}
          <Skeleton
            variant="rounded"
            width="100%"
            height={36}
            animation={animation}
            sx={{ borderRadius: `${M3_SHAPE_CORNERS.small}px` }}
          />

          {/* Secondary room code pill */}
          <Box sx={{ display: "flex", gap: 1, mt: 0.5 }}>
            <Skeleton
              variant="rounded"
              width={80}
              height={32}
              animation={animation}
              sx={{ borderRadius: `${M3_SHAPE_CORNERS.small}px` }}
            />
            <Skeleton
              variant="rounded"
              width={95}
              height={32}
              animation={animation}
              sx={{ borderRadius: `${M3_SHAPE_CORNERS.small}px` }}
            />
          </Box>

          {/* Access code chip */}
          <Skeleton
            variant="rounded"
            width={72}
            height={24}
            animation={animation}
            sx={{ borderRadius: `${M3_SHAPE_CORNERS.extraSmall}px`, mt: 0.5 }}
          />
        </WayfindingContainer>

        {/* Right / Top side: Map Viewport Skeleton */}
        <MapViewportWrapper $orientation={orientation}>
          <MapSkeleton
            width="100%"
            height="100%"
            borderRadius={0}
            variant={variant}
            animated={animated}
            testId="map-card-skeleton-map"
          />
        </MapViewportWrapper>
      </CardBodyWrapper>

      {/* Bottom Footer skeleton */}
      <SkeletonFooter data-testid="map-card-skeleton-footer">
        <Box
          sx={{ display: "flex", alignItems: "center", gap: 1, width: "65%" }}
        >
          <Skeleton
            variant="circular"
            width={18}
            height={18}
            animation={animation}
          />
          <Skeleton
            variant="rounded"
            width="80%"
            height={16}
            animation={animation}
            sx={{ borderRadius: "4px" }}
          />
        </Box>
        <Skeleton
          variant="rounded"
          width={32}
          height={32}
          animation={animation}
          sx={{ borderRadius: "8px" }}
        />
      </SkeletonFooter>
    </SheetCard>
  );
}

export default MapCardSkeleton;
