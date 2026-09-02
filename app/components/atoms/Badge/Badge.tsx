import React, { forwardRef, type ReactNode } from "react";
import type {
  BadgeProps,
  BadgeColor,
  BadgeSize,
  BadgeShape,
} from "./Badge.types";
import type { BadgeProps as MuiBadgeProps } from "@mui/material/Badge";
import { StyledMuiBadge, StandaloneBadgeRoot } from "./Badge.styles";
import ShapeDefs from "../Avatar/ShapeDefs";

interface StandaloneBadgeViewProps {
  shape?: BadgeShape;
  size?: BadgeSize;
  glow?: boolean;
  mono?: boolean;
  color?: BadgeColor;
  content?: ReactNode;
  testId?: string;
  shapeDataAttr?: string;
  rest: unknown;
}

const StandaloneBadgeView = forwardRef<
  HTMLSpanElement,
  StandaloneBadgeViewProps
>(function StandaloneBadgeView(
  { shape, size, glow, mono, color, content, testId, shapeDataAttr, rest },
  ref,
) {
  const standaloneProps = rest as React.HTMLAttributes<HTMLSpanElement>;
  return (
    <>
      {shape ? <ShapeDefs /> : null}
      <StandaloneBadgeRoot
        ref={ref}
        $badgeShape={shape}
        $badgeSize={size}
        $glow={glow}
        $mono={mono}
        $badgeColor={color}
        data-testid={testId}
        data-shape={shapeDataAttr}
        {...standaloneProps}
      >
        {content}
      </StandaloneBadgeRoot>
    </>
  );
});

/**
 * Generic Badge Atom Component
 *
 * Extends MUI's Badge component with:
 * - Standalone badge mode (icon / status / role badge indicator)
 * - Expressive M3 shapes & geometric radius presets on badge indicators
 * - Custom icons inside badge content
 * - Ambient glow & glassmorphic backdrop options
 */
export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  function Badge(props, ref) {
    const {
      shape,
      icon,
      size = "medium",
      standalone,
      glow,
      mono,
      color = "default",
      badgeContent,
      children,
      testId,
      "data-testid": dataTestId,
      ...rest
    } = props;

    const resolvedTestId = dataTestId || testId;
    const isStandalone = standalone ?? !children;
    const content = icon ?? badgeContent;
    const shapeDataAttr = typeof shape === "string" ? shape : undefined;

    if (isStandalone) {
      return (
        <StandaloneBadgeView
          ref={ref}
          shape={shape}
          size={size}
          glow={glow}
          mono={mono}
          color={color}
          content={content}
          testId={resolvedTestId}
          shapeDataAttr={shapeDataAttr}
          rest={rest}
        />
      );
    }

    const muiColor =
      color === "default" ? undefined : (color as MuiBadgeProps["color"]);

    return (
      <>
        {shape ? <ShapeDefs /> : null}
        <StyledMuiBadge
          ref={ref}
          $badgeShape={shape}
          $badgeSize={size}
          $glow={glow}
          $mono={mono}
          $badgeColor={color}
          color={muiColor}
          badgeContent={content}
          data-testid={resolvedTestId}
          data-shape={shapeDataAttr}
          {...rest}
        >
          {children}
        </StyledMuiBadge>
      </>
    );
  },
);

Badge.displayName = "Badge";
export default Badge;
