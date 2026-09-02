import type { ElementType, ReactNode } from "react";
import type { BadgeProps as MuiBadgeProps } from "@mui/material/Badge";
import type { ExpressiveShapeName } from "../Avatar/shapes";

export type BadgeShape = ExpressiveShapeName | string | number;
export type BadgeSize = "small" | "medium" | "large";
export type BadgeColor =
  | "primary"
  | "secondary"
  | "success"
  | "error"
  | "info"
  | "warning"
  | "default";

export interface BaseBadgeProps {
  /**
   * Expressive or geometric shape for the badge indicator or standalone badge.
   * Supports all 35 M3 expressive shapes (e.g. 'pill', 'circle', 'square', '9-sided-cookie',
   * 'ghost-ish', 'diamond', 'arch', 'slanted', etc.) or custom radius string/number.
   */
  shape?: BadgeShape;

  /**
   * Optional icon to render inside the badge indicator or standalone badge.
   */
  icon?: ReactNode;

  /**
   * Size scale of the badge ("small" | "medium" | "large"). Default is "medium".
   */
  size?: BadgeSize;

  /**
   * Standalone badge mode. Automatically active if no children are passed.
   * Renders the badge itself as an atomic indicator node (e.g., role badge, status dot, icon chip).
   */
  standalone?: boolean;

  /**
   * Glow effect for subtle ambient lighting / highlights.
   */
  glow?: boolean;

  /**
   * Monospace typography toggle for badge count/text.
   */
  mono?: boolean;

  /**
   * Theme color palette for the badge.
   */
  color?: BadgeColor;

  /**
   * Custom test ID for data-testid
   */
  testId?: string;

  /**
   * Direct data-testid support
   */
  "data-testid"?: string;
}

export type BadgeProps<
  RootComponent extends ElementType = "span",
  AdditionalProps = object,
> = Omit<
  MuiBadgeProps<RootComponent, AdditionalProps & BaseBadgeProps>,
  "color" | "size"
> & {
  color?: BadgeColor;
  size?: BadgeSize;
};
