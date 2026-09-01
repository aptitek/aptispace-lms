import React from "react";
import Skeleton from "@mui/material/Skeleton";
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
} from "./EntityCardSkeleton.styles";

export interface EntityCardSkeletonProps {
  variant?: "shimmer" | "static";
  animated?: boolean;
  opacity?: number;
  className?: string;
  testId?: string;
  style?: React.CSSProperties;
}

export function EntityCardSkeleton({
  variant = "shimmer",
  animated = true,
  opacity,
  className,
  testId = "entity-card-skeleton",
  style,
}: EntityCardSkeletonProps) {
  const isStatic = variant === "static" || !animated;
  const skeletonAnimation: false | "wave" | "pulse" = isStatic ? false : "wave";

  return (
    <SkeletonCardContainer
      variant="outlined"
      animated={!isStatic}
      opacity={opacity}
      className={className}
      style={style}
      data-testid={testId}
      aria-hidden="true"
    >
      <SkeletonCardContent>
        <SkeletonHeaderRow>
          <Skeleton
            variant="rounded"
            width={65}
            height={16}
            animation={skeletonAnimation}
            sx={{ borderRadius: "4px" }}
          />
          <SkeletonHeaderBadges>
            <Skeleton
              variant="rounded"
              width={72}
              height={20}
              animation={skeletonAnimation}
              sx={{ borderRadius: "10px" }}
            />
            <Skeleton
              variant="rounded"
              width={40}
              height={20}
              animation={skeletonAnimation}
              sx={{ borderRadius: "10px" }}
            />
          </SkeletonHeaderBadges>
        </SkeletonHeaderRow>

        <SkeletonBodyRow>
          <SkeletonAvatarContainer>
            <Skeleton
              variant="rectangular"
              width={77}
              height={99}
              animation={skeletonAnimation}
              sx={{ borderRadius: "22px 22px 14px 14px" }}
            />
          </SkeletonAvatarContainer>

          <SkeletonDetailsContainer>
            <SkeletonNameBlock>
              <Skeleton
                variant="text"
                width="60%"
                height={14}
                animation={skeletonAnimation}
                sx={{ borderRadius: "3px" }}
              />
              <Skeleton
                variant="text"
                width="85%"
                height={20}
                animation={skeletonAnimation}
                sx={{ borderRadius: "3px" }}
              />
            </SkeletonNameBlock>

            <Skeleton
              variant="text"
              width="90%"
              height={12}
              animation={skeletonAnimation}
              sx={{ borderRadius: "3px" }}
            />

            <SkeletonFooterRow>
              <Skeleton
                variant="rounded"
                width={75}
                height={20}
                animation={skeletonAnimation}
                sx={{ borderRadius: "6px" }}
              />
              <Skeleton
                variant="circular"
                width={24}
                height={24}
                animation={skeletonAnimation}
              />
            </SkeletonFooterRow>
          </SkeletonDetailsContainer>
        </SkeletonBodyRow>
      </SkeletonCardContent>
    </SkeletonCardContainer>
  );
}

export default EntityCardSkeleton;
