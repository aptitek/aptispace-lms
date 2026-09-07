import React, { forwardRef } from "react";
import { StyledCard } from "./Card.styles";
import type { CardProps } from "./Card.types";

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      children,
      isInteractive = false,
      isSelected = false,
      isNested = false,
      variant = "elevated",
      className,
      sx,
      ...props
    },
    ref,
  ) => {
    return (
      <StyledCard
        ref={ref}
        isInteractive={isInteractive}
        isSelected={isSelected}
        isNested={isNested}
        variant={variant}
        role={isInteractive ? "button" : undefined}
        tabIndex={isInteractive ? 0 : undefined}
        className={className}
        sx={sx}
        {...props}
      >
        {children}
      </StyledCard>
    );
  },
);

Card.displayName = "Card";

export default Card;
