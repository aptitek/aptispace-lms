import React from "react";
import Skeleton from "@mui/material/Skeleton";
import UserCardSkeleton from "~/components/molecules/UserCard/UserCardSkeleton";
import {
  GridContainer,
  MD3CollectionGrid,
  LoadingSentinel,
  SkeletonControlsHeader,
  SkeletonHeaderLeft,
  SkeletonHeaderRight,
  SkeletonTitleBox,
  SkeletonSearchField,
  SkeletonLazyZone,
} from "./UserGridSkeleton.styles";
import { SKELETON_SLOT_KEYS } from "./UserGrid.helpers";

export interface UserGridSkeletonProps {
  /** Number of skeleton cards to render (default: 6) */
  count?: number;
  /** Whether to render the header skeleton (default: true) */
  showHeader?: boolean;
  /** Whether to render the search input skeleton in the header (default: true) */
  showSearch?: boolean;
  /** Optional title to render instead of skeleton block */
  title?: React.ReactNode;
  /** Visual animation style (default: "shimmer") */
  variant?: "shimmer" | "static";
  /** Whether skeleton shimmer is animated (default: true) */
  animated?: boolean;
  /** Opacity override */
  opacity?: number;
  /** Whether this skeleton represents a lazy loading sentinel zone (default: false) */
  isLazy?: boolean;
  /** Ref for the lazy loading sentinel observer */
  sentinelRef?: React.Ref<HTMLDivElement>;
  /** Custom test ID (default: "user-grid-skeleton") */
  testId?: string;
  /** Additional CSS class */
  className?: string;
  /** Additional inline styles */
  style?: React.CSSProperties;
}

function resolveSlotKeys(count: number): string[] {
  if (count <= SKELETON_SLOT_KEYS.length) {
    return SKELETON_SLOT_KEYS.slice(0, count);
  }
  return Array.from({ length: count }, (_, i) => `sk-slot-${i + 1}`);
}

interface SkeletonHeaderProps {
  title?: React.ReactNode;
  showSearch: boolean;
  animation: "wave" | false;
}

function SkeletonHeader({ title, showSearch, animation }: SkeletonHeaderProps) {
  return (
    <SkeletonControlsHeader data-testid="grid-skeleton-header">
      <SkeletonHeaderLeft>
        <SkeletonTitleBox>
          <Skeleton
            variant="circular"
            width={24}
            height={24}
            animation={animation}
          />
          {title ? (
            <span>{title}</span>
          ) : (
            <Skeleton
              variant="rounded"
              width={160}
              height={24}
              animation={animation}
              sx={{ borderRadius: "8px" }}
            />
          )}
        </SkeletonTitleBox>
        <Skeleton
          variant="rounded"
          width={52}
          height={24}
          animation={animation}
          sx={{ borderRadius: "9999px" }}
          data-testid="skeleton-count-badge"
        />
      </SkeletonHeaderLeft>

      {showSearch && (
        <SkeletonHeaderRight>
          <SkeletonSearchField>
            <Skeleton
              variant="circular"
              width={18}
              height={18}
              animation={animation}
            />
            <Skeleton
              variant="text"
              width={120}
              height={20}
              animation={animation}
              sx={{ borderRadius: "4px" }}
            />
          </SkeletonSearchField>
        </SkeletonHeaderRight>
      )}
    </SkeletonControlsHeader>
  );
}

interface SkeletonLazyProps {
  testId: string;
  className?: string;
  style?: React.CSSProperties;
  count: number;
  variant: "shimmer" | "static";
  animated: boolean;
  opacity?: number;
  sentinelRef?: React.Ref<HTMLDivElement>;
}

function SkeletonLazyLoadingView({
  testId,
  className,
  style,
  count,
  variant,
  animated,
  opacity,
  sentinelRef,
}: SkeletonLazyProps) {
  const slotKeys = resolveSlotKeys(count);

  return (
    <SkeletonLazyZone
      data-testid={testId}
      className={className}
      style={style}
      role="presentation"
      aria-hidden="true"
    >
      {count > 0 && (
        <MD3CollectionGrid data-testid="lazy-skeleton-grid">
          {slotKeys.map((slotKey) => (
            <UserCardSkeleton
              key={slotKey}
              variant={variant}
              animated={animated}
              opacity={opacity}
              testId={`lazy-${slotKey}`}
            />
          ))}
        </MD3CollectionGrid>
      )}
      <LoadingSentinel ref={sentinelRef} data-testid="lazy-loading-sentinel" />
    </SkeletonLazyZone>
  );
}

function resolveUserGridSkeletonConfig(props: UserGridSkeletonProps) {
  const count = props.count ?? 6;
  const showHeader = props.showHeader ?? true;
  const showSearch = props.showSearch ?? true;
  const variant = props.variant ?? "shimmer";
  const animated = props.animated ?? true;
  const isLazy = Boolean(props.isLazy);
  const testId = props.testId || "user-grid-skeleton";
  const animation: "wave" | false =
    animated && variant !== "static" ? "wave" : false;

  return {
    count,
    showHeader,
    showSearch,
    variant,
    animated,
    isLazy,
    testId,
    animation,
  };
}

export function UserGridSkeleton(props: UserGridSkeletonProps) {
  const config = resolveUserGridSkeletonConfig(props);

  if (config.isLazy) {
    return (
      <SkeletonLazyLoadingView
        testId={config.testId}
        className={props.className}
        style={props.style}
        count={config.count}
        variant={config.variant}
        animated={config.animated}
        opacity={props.opacity}
        sentinelRef={props.sentinelRef}
      />
    );
  }

  const slotKeys = resolveSlotKeys(config.count);

  return (
    <GridContainer
      data-testid={config.testId}
      className={props.className}
      style={props.style}
      role="presentation"
      aria-hidden="true"
    >
      {config.showHeader && (
        <SkeletonHeader
          title={props.title}
          showSearch={config.showSearch}
          animation={config.animation}
        />
      )}

      <MD3CollectionGrid data-testid="grid-skeleton-loading-zone">
        {slotKeys.map((slotKey) => (
          <UserCardSkeleton
            key={slotKey}
            variant={config.variant}
            animated={config.animated}
            opacity={props.opacity}
            testId={slotKey}
          />
        ))}
      </MD3CollectionGrid>
    </GridContainer>
  );
}

export default UserGridSkeleton;
