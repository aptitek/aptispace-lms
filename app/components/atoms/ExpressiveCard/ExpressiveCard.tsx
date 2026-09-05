import React, { forwardRef } from "react";
import {
  StyledExpressiveCard,
  GhostFabOverlay,
  DashedSkeletonCard,
} from "./ExpressiveCard.styles";
import type { ExpressiveCardProps } from "./ExpressiveCard.types";

export const ExpressiveCard = forwardRef<HTMLDivElement, ExpressiveCardProps>(
  (
    {
      children,
      isInteractive = false,
      isSelected = false,
      variant = "elevated",
      className,
      ...props
    },
    ref,
  ) => {
    return (
      <StyledExpressiveCard
        ref={ref}
        isInteractive={isInteractive}
        isSelected={isSelected}
        variant={variant}
        role={isInteractive ? "button" : undefined}
        tabIndex={isInteractive ? 0 : undefined}
        className={className}
        {...props}
      >
        {children}
      </StyledExpressiveCard>
    );
  },
);

ExpressiveCard.displayName = "ExpressiveCard";

export { GhostFabOverlay, DashedSkeletonCard };
