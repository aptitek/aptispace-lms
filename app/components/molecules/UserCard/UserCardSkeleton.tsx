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
} from "./UserCardSkeleton.styles";
import type { UserCardSkeletonProps } from "./UserCard.types";

export type { UserCardSkeletonProps };

function isGhostMode(props: UserCardSkeletonProps): boolean {
  if (props.isGhost || props.variant === "ghost") return true;
  if (props.onClick && props.variant !== "shimmer") return true;
  return false;
}

function resolveUserCardAnimation(
  variant: string,
  animated: boolean,
  isGhost: boolean,
): false | "wave" {
  if (isGhost || !animated || variant !== "shimmer") {
    return false;
  }
  return "wave";
}

function resolveUserCardSkeletonConfig(props: UserCardSkeletonProps) {
  const isGhost = isGhostMode(props);
  const variant = props.variant || (isGhost ? "ghost" : "shimmer");
  const animated = props.animated !== false;
  const isInteractive = isGhost && Boolean(props.onClick);
  const animation = resolveUserCardAnimation(variant, animated, isGhost);
  const finalOpacity = isGhost ? 1 : props.opacity;
  const contentOpacity = isGhost ? 0.35 : 1;

  return {
    isGhost,
    variant,
    animated,
    isInteractive,
    animation,
    finalOpacity,
    contentOpacity,
    testId: props.testId || "user-card-skeleton",
  };
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

export function UserCardSkeleton(props: UserCardSkeletonProps) {
  const { t } = useTranslation(["common", "admin"]);
  const config = resolveUserCardSkeletonConfig(props);
  const resolvedTooltip =
    props.tooltipTitle || t("common:admin.addUser", "Add User");
  const handleKeyDown = createSkeletonKeyHandler(
    config.isInteractive,
    props.onClick,
  );

  return (
    <SkeletonCardContainer
      variant="outlined"
      animated={config.animation !== false}
      isGhost={config.isGhost}
      isInteractive={config.isInteractive}
      opacity={config.finalOpacity}
      onClick={config.isInteractive ? props.onClick : undefined}
      onKeyDown={handleKeyDown}
      role={config.isInteractive ? "button" : "presentation"}
      tabIndex={config.isInteractive ? 0 : undefined}
      aria-label={config.isInteractive ? resolvedTooltip : undefined}
      className={props.className}
      style={props.style}
      data-testid={config.testId}
      aria-hidden={!config.isInteractive}
    >
      <SkeletonCardContent
        sx={{
          opacity: config.contentOpacity,
          pointerEvents: "none",
        }}
      >
        <SkeletonHeaderRow>
          <Skeleton
            variant="rounded"
            width={65}
            height={16}
            animation={config.animation}
            sx={{ borderRadius: "4px" }}
          />
          <SkeletonHeaderBadges>
            <Skeleton
              variant="rounded"
              width={72}
              height={20}
              animation={config.animation}
              sx={{ borderRadius: "9999px" }}
            />
            <Skeleton
              variant="rounded"
              width={40}
              height={20}
              animation={config.animation}
              sx={{ borderRadius: "9999px" }}
            />
          </SkeletonHeaderBadges>
        </SkeletonHeaderRow>

        <SkeletonBodyRow>
          <SkeletonAvatarContainer>
            <Skeleton
              variant="rectangular"
              width={80}
              height={80}
              animation={config.animation}
              sx={{ borderRadius: "16px" }}
            />
          </SkeletonAvatarContainer>

          <SkeletonDetailsContainer>
            <SkeletonNameBlock>
              <Skeleton
                variant="text"
                width="60%"
                height={14}
                animation={config.animation}
                sx={{ borderRadius: "4px" }}
              />
              <Skeleton
                variant="text"
                width="85%"
                height={20}
                animation={config.animation}
                sx={{ borderRadius: "4px" }}
              />
            </SkeletonNameBlock>

            <Skeleton
              variant="text"
              width="90%"
              height={12}
              animation={config.animation}
              sx={{ borderRadius: "4px" }}
            />

            <SkeletonFooterRow>
              <Skeleton
                variant="rounded"
                width={75}
                height={20}
                animation={config.animation}
                sx={{ borderRadius: "8px" }}
              />
              <Skeleton
                variant="circular"
                width={24}
                height={24}
                animation={config.animation}
              />
            </SkeletonFooterRow>
          </SkeletonDetailsContainer>
        </SkeletonBodyRow>
      </SkeletonCardContent>

      {config.isInteractive && (
        <GhostFabOverlay>
          <GhostActionButton
            tooltip={resolvedTooltip}
            testId={`${config.testId}-fab`}
          />
        </GhostFabOverlay>
      )}
    </SkeletonCardContainer>
  );
}

export const EntityCardSkeleton = UserCardSkeleton;
export default UserCardSkeleton;
