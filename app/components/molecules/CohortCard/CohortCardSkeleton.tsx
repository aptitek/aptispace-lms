import React from "react";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import { useTranslation } from "react-i18next";
import { FloatingActionButton } from "~/components/atoms/FloatingActionButton";
import { SkeletonCardContainer, FabOverlay } from "./CohortCard.styles";

export interface CohortCardSkeletonProps {
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

function isGhostMode(props: CohortCardSkeletonProps): boolean {
  if (props.isGhost || props.variant === "ghost") return true;
  if (props.onClick && props.variant !== "shimmer") return true;
  return false;
}

function resolveCohortAnimation(
  variant: string,
  animated: boolean,
): "wave" | false {
  if (!animated || variant !== "shimmer") {
    return false;
  }
  return "wave";
}

function resolveCohortSkeletonConfig(props: CohortCardSkeletonProps) {
  const isGhost = isGhostMode(props);
  const variant = props.variant || (isGhost ? "ghost" : "shimmer");
  const animated = props.animated !== false;
  const isInteractive = isGhost && Boolean(props.onClick);
  const animation = resolveCohortAnimation(variant, animated);

  return {
    isGhost,
    variant,
    animated,
    isInteractive,
    animation,
    testId: props.testId || "cohort-card-skeleton",
  };
}

export function CohortCardSkeleton(props: CohortCardSkeletonProps) {
  const { t } = useTranslation("common");
  const config = resolveCohortSkeletonConfig(props);
  const resolvedTooltip =
    props.tooltipTitle || t("admin.addCohort", "Add Cohort");

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
          height: "100%",
          gap: (theme) => theme.spacing(0.75),
          opacity: config.isGhost ? 0.35 : 1,
          width: "100%",
          pointerEvents: "none",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1,
            mb: 0.5,
          }}
        >
          <Skeleton
            variant="rounded"
            width={120}
            height={24}
            animation={config.animation}
            sx={{ borderRadius: "8px" }}
          />
          <Skeleton
            variant="rounded"
            width={48}
            height={22}
            animation={config.animation}
            sx={{ borderRadius: "9999px" }}
          />
        </Box>

        <Box
          sx={{
            fontSize: "0.8125rem",
            minHeight: "2.4em",
            display: "flex",
            flexDirection: "column",
            gap: "4px",
          }}
        >
          <Skeleton
            variant="rounded"
            width="90%"
            height={13}
            animation={config.animation}
            sx={{ borderRadius: "4px" }}
          />
          <Skeleton
            variant="rounded"
            width="65%"
            height={13}
            animation={config.animation}
            sx={{ borderRadius: "4px" }}
          />
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            mt: "auto",
            pt: 0.5,
          }}
        >
          <Skeleton
            variant="rounded"
            width={110}
            height={14}
            animation={config.animation}
            sx={{ borderRadius: "4px" }}
          />
          <Skeleton
            variant="rounded"
            width={22}
            height={22}
            animation={config.animation}
            sx={{ borderRadius: "4px" }}
          />
        </Box>
      </Box>

      {config.isInteractive && (
        <FabOverlay>
          <FloatingActionButton
            tooltip={resolvedTooltip}
            onClick={props.onClick}
            testId="cohort-ghost-fab"
          />
        </FabOverlay>
      )}
    </SkeletonCardContainer>
  );
}

export default CohortCardSkeleton;
