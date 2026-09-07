import type { ReactNode } from "react";
import type { TabsProps as MuiTabsProps } from "@mui/material/Tabs";
import type { TabProps as MuiTabProps } from "@mui/material/Tab";

export type VerticalTabVariant = "default" | "compact";

export interface VerticalTabsContextValue {
  variant: VerticalTabVariant;
  extended: boolean;
  size: number;
}

export interface VerticalTabsProps extends Omit<
  MuiTabsProps,
  "orientation" | "variant"
> {
  /**
   * Layout variant for vertical tabs:
   * - "default": standard vertical tabs with icon and full text side-by-side
   * - "compact": icon-only tabs that extend into full text when extended is true
   */
  variant?: VerticalTabVariant;

  /**
   * Convenience boolean shortcut for variant="compact"
   */
  compact?: boolean;

  /**
   * Whether compact tabs are extended horizontally to show full text labels
   * (similar to the logout button in ProfileButton)
   */
  extended?: boolean;

  /**
   * Height/diameter of the tabs in pixels (default 40px)
   */
  size?: number;

  /**
   * Test ID for data-testid
   */
  testId?: string;
  "data-testid"?: string;

  /**
   * Tab elements
   */
  children?: ReactNode;
}

export interface VerticalTabProps extends Omit<MuiTabProps, "iconPosition"> {
  /**
   * Layout variant override (defaults to parent VerticalTabs variant, or "default")
   */
  variant?: VerticalTabVariant;

  /**
   * Convenience boolean shortcut for variant="compact"
   */
  compact?: boolean;

  /**
   * Whether the compact tab is extended to show the full text label
   */
  extended?: boolean;

  /**
   * Size in pixels (default 40px)
   */
  size?: number;

  /**
   * Optional badge or counter indicator displayed at the end of the tab
   */
  badge?: ReactNode;

  /**
   * Custom tooltip content when collapsed in compact mode. Defaults to label.
   */
  tooltip?: ReactNode;

  /**
   * Test ID for data-testid
   */
  testId?: string;
  "data-testid"?: string;
}
