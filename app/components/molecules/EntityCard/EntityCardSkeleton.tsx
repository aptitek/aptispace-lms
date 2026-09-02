import React from "react";
import Skeleton from "@mui/material/Skeleton";
import { useTranslation } from "react-i18next";
import { GhostActionButton } from "~/components/atoms/GhostActionButton";
import {
  SkeletonCardContainer,
  SkeletonCardContent,
  SkeletonHeaderRow,
  SkeletonHeaderBadges,
  SkeletonBodyRow,
  SkeletonAvatarContainer,
  SkeletonDetailsContainer,
  SkeletonNameBlock,
  SkeletonFooterRow,
  GhostFabOverlay,
} from "./EntityCardSkeleton.styles";

export interface EntityCardSkeletonProps {
  variant?: "shimmer" | "static";
  animated?: boolean;
  opacity?: number;
  isGhost?: boolean;
  onClick?: () => void;
  tooltipTitle?: string;
  className?: string;
  testId?: string;
  style?: React.CSSProperties;
}

function resolveSkeletonState(
  isGhost: boolean,
  variant: "shimmer" | "static",
  animated: boolean,
  opacity?: number,
) {
  const isStatic = isGhost || variant === "static" || !animated;
  const animation: false | "wave" | "pulse" = isStatic ? false : "wave";
  const finalOpacity = isGhost ? 1 : opacity;
  const contentOpacity = isGhost ? 0.35 : 1;
  return { isStatic, animation, finalOpacity, contentOpacity };
}

function createSkeletonKeyHandler(
  isInteractive: boolean,
  onClick?: () => void,
) {
  return (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (isInteractive && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      onClick?.();
    }
  };
}

export function EntityCardSkeleton({
  variant = "shimmer",
  animated = true,
  opacity,
  isGhost = false,
  onClick,
  tooltipTitle,
  className,
  testId = "entity-card-skeleton",
  style,
}: EntityCardSkeletonProps) {
  const { t } = useTranslation(["common", "admin"]);
  const isInteractive = Boolean(onClick);
  const state = resolveSkeletonState(isGhost, variant, animated, opacity);
  const resolvedTooltip = tooltipTitle || t("common:admin.addUser", "Add User");
  const handleKeyDown = createSkeletonKeyHandler(isInteractive, onClick);

  return (
    <SkeletonCardContainer
      variant="outlined"
      animated={!state.isStatic}
      isGhost={isGhost}
      isInteractive={isInteractive}
      opacity={state.finalOpacity}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role={isInteractive ? "button" : "presentation"}
      tabIndex={isInteractive ? 0 : undefined}
      aria-label={isInteractive ? resolvedTooltip : undefined}
      className={className}
      style={style}
      data-testid={testId}
      aria-hidden={!isInteractive}
    >
      <SkeletonCardContent
        sx={{
          opacity: state.contentOpacity,
          pointerEvents: "none",
        }}
      >
        <SkeletonHeaderRow>
          <Skeleton
            variant="rounded"
            width={65}
            height={16}
            animation={state.animation}
            sx={{ borderRadius: "4px" }}
          />
          <SkeletonHeaderBadges>
            <Skeleton
              variant="rounded"
              width={72}
              height={20}
              animation={state.animation}
              sx={{ borderRadius: "10px" }}
            />
            <Skeleton
              variant="rounded"
              width={40}
              height={20}
              animation={state.animation}
              sx={{ borderRadius: "10px" }}
            />
          </SkeletonHeaderBadges>
        </SkeletonHeaderRow>

        <SkeletonBodyRow>
          <SkeletonAvatarContainer>
            <Skeleton
              variant="rectangular"
              width={80}
              height={80}
              animation={state.animation}
              sx={{ borderRadius: "16px" }}
            />
          </SkeletonAvatarContainer>

          <SkeletonDetailsContainer>
            <SkeletonNameBlock>
              <Skeleton
                variant="text"
                width="60%"
                height={14}
                animation={state.animation}
                sx={{ borderRadius: "3px" }}
              />
              <Skeleton
                variant="text"
                width="85%"
                height={20}
                animation={state.animation}
                sx={{ borderRadius: "3px" }}
              />
            </SkeletonNameBlock>

            <Skeleton
              variant="text"
              width="90%"
              height={12}
              animation={state.animation}
              sx={{ borderRadius: "3px" }}
            />

            <SkeletonFooterRow>
              <Skeleton
                variant="rounded"
                width={75}
                height={20}
                animation={state.animation}
                sx={{ borderRadius: "6px" }}
              />
              <Skeleton
                variant="circular"
                width={24}
                height={24}
                animation={state.animation}
              />
            </SkeletonFooterRow>
          </SkeletonDetailsContainer>
        </SkeletonBodyRow>
      </SkeletonCardContent>

      {isInteractive && (
        <GhostFabOverlay>
          <GhostActionButton
            tooltip={resolvedTooltip}
            testId={`${testId}-fab`}
          />
        </GhostFabOverlay>
      )}
    </SkeletonCardContainer>
  );
}

export default EntityCardSkeleton;
