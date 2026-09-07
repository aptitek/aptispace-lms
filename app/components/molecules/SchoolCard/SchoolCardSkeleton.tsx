import React from "react";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import { useTranslation } from "react-i18next";
import { GhostActionButton } from "~/components/atoms/GhostActionButton";
import {
  SkeletonCardContainer,
  LogoContainer,
  GhostFabOverlay,
} from "./SchoolCard.styles";

export interface SchoolCardSkeletonProps {
  /** Skeleton variant: "shimmer" for loading, "static" for empty placeholder, "ghost" for add card */
  variant?: "shimmer" | "static" | "ghost";
  /** Optional flag to enable ghost add variant */
  isGhost?: boolean;
  /** Whether loading shimmer is animated (default: true) */
  animated?: boolean;
  /** Opacity override */
  opacity?: number;
  /** Click handler for interactive ghost add variant */
  onClick?: () => void;
  /** Tooltip/accessible label for ghost add action */
  tooltipTitle?: string;
  className?: string;
  testId?: string;
  style?: React.CSSProperties;
}

function isGhostMode(props: SchoolCardSkeletonProps): boolean {
  if (props.isGhost || props.variant === "ghost") return true;
  if (props.onClick && props.variant !== "shimmer") return true;
  return false;
}

function resolveSchoolAnimation(
  variant: string,
  animated: boolean,
): "wave" | false {
  if (!animated || variant !== "shimmer") {
    return false;
  }
  return "wave";
}

function resolveSchoolSkeletonConfig(props: SchoolCardSkeletonProps) {
  const isGhost = isGhostMode(props);
  const variant = props.variant || (isGhost ? "ghost" : "shimmer");
  const animated = props.animated !== false;
  const isInteractive = isGhost && Boolean(props.onClick);
  const animation = resolveSchoolAnimation(variant, animated);

  return {
    isGhost,
    variant,
    animated,
    isInteractive,
    animation,
    testId: props.testId || "school-card-skeleton",
  };
}

export function SchoolCardSkeleton(props: SchoolCardSkeletonProps) {
  const { t } = useTranslation("common");
  const config = resolveSchoolSkeletonConfig(props);
  const resolvedTooltip =
    props.tooltipTitle || t("admin.addInstitution", "Add Institution");

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (config.isInteractive && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      props.onClick?.();
    }
  };

  return (
    <SkeletonCardContainer
      isGhost={config.isGhost}
      isInteractive={config.isInteractive}
      opacity={props.opacity}
      onClick={config.isInteractive ? props.onClick : undefined}
      onKeyDown={handleKeyDown}
      role={config.isInteractive ? "button" : "presentation"}
      tabIndex={config.isInteractive ? 0 : undefined}
      aria-label={config.isInteractive ? resolvedTooltip : undefined}
      aria-hidden={!config.isInteractive}
      className={props.className}
      style={props.style}
      data-testid={config.testId}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
          opacity: config.isGhost ? 0.35 : 1,
          width: "100%",
          pointerEvents: "none",
        }}
      >
        <LogoContainer>
          <Skeleton
            variant="rounded"
            width={100}
            height={40}
            animation={config.animation}
            sx={{ borderRadius: "8px" }}
          />
        </LogoContainer>
        <Skeleton
          variant="text"
          width="60%"
          height={22}
          animation={config.animation}
          sx={{ borderRadius: "4px" }}
        />
        {!config.isGhost && (
          <Skeleton
            variant="rounded"
            width={80}
            height={24}
            animation={config.animation}
            sx={{ borderRadius: "9999px" }}
          />
        )}
      </Box>

      {config.isInteractive && (
        <GhostFabOverlay>
          <GhostActionButton
            tooltip={resolvedTooltip}
            testId="school-ghost-fab"
          />
        </GhostFabOverlay>
      )}
    </SkeletonCardContainer>
  );
}

export default SchoolCardSkeleton;
