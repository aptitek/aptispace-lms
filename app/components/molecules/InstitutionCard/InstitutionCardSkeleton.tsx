import React from "react";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import { useTranslation } from "react-i18next";
import { FloatingActionButton } from "~/components/atoms/FloatingActionButton";
import {
  SkeletonCardContainer,
  LogoContainer,
  FabOverlay,
} from "./InstitutionCard.styles";

export interface InstitutionCardSkeletonProps {
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

function isGhostMode(props: InstitutionCardSkeletonProps): boolean {
  if (props.isGhost || props.variant === "ghost") return true;
  if (props.onClick && props.variant !== "shimmer") return true;
  return false;
}

function resolveInstitutionAnimation(
  variant: string,
  animated: boolean,
): "wave" | false {
  if (!animated || variant !== "shimmer") {
    return false;
  }
  return "wave";
}

function resolveInstitutionSkeletonConfig(props: InstitutionCardSkeletonProps) {
  const isGhost = isGhostMode(props);
  const variant = props.variant || (isGhost ? "ghost" : "shimmer");
  const animated = props.animated !== false;
  const isInteractive = isGhost && Boolean(props.onClick);
  const animation = resolveInstitutionAnimation(variant, animated);

  return {
    isGhost,
    variant,
    animated,
    isInteractive,
    animation,
    testId: props.testId || "institution-card-skeleton",
  };
}

export function InstitutionCardSkeleton(props: InstitutionCardSkeletonProps) {
  const { t } = useTranslation("common");
  const config = resolveInstitutionSkeletonConfig(props);
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
        <FabOverlay>
          <FloatingActionButton
            tooltip={resolvedTooltip}
            onClick={props.onClick}
            testId="institution-ghost-fab"
          />
        </FabOverlay>
      )}
    </SkeletonCardContainer>
  );
}

export default InstitutionCardSkeleton;
