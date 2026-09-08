import React from "react";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import { useTranslation } from "react-i18next";
import { FloatingActionButton } from "~/components/atoms/FloatingActionButton";
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
  FabOverlay,
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
              width={56}
              height={56}
              animation={config.animation}
              sx={{ borderRadius: "12px" }}
            />
          </SkeletonAvatarContainer>

          <SkeletonDetailsContainer>
            <SkeletonNameBlock>
              <Skeleton
                variant="rounded"
                width="60%"
                height={16}
                animation={config.animation}
                sx={{ borderRadius: "4px" }}
              />
              <Skeleton
                variant="rounded"
                width="85%"
                height={19}
                animation={config.animation}
                sx={{ borderRadius: "4px" }}
              />
            </SkeletonNameBlock>

            <Skeleton
              variant="rounded"
              width="90%"
              height={16}
              animation={config.animation}
              sx={{ borderRadius: "4px" }}
            />
          </SkeletonDetailsContainer>
        </SkeletonBodyRow>

        <SkeletonFooterRow>
          <Skeleton
            variant="rounded"
            width={80}
            height={22}
            animation={config.animation}
            sx={{ borderRadius: "12px" }}
          />
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              flexShrink: 0,
            }}
          >
            <Skeleton
              variant="rounded"
              width={22}
              height={22}
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
        </SkeletonFooterRow>
      </SkeletonCardContent>

      {config.isInteractive && (
        <FabOverlay>
          <FloatingActionButton
            tooltip={resolvedTooltip}
            onClick={props.onClick}
            testId={`${config.testId}-fab`}
          />
        </FabOverlay>
      )}
    </SkeletonCardContainer>
  );
}

export default UserCardSkeleton;
