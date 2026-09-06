import type { ReactNode } from "react";
import type { SxProps, Theme } from "@mui/material/styles";
import type { ChipShape } from "~/tokens/shapes";
import type { CohortConfig } from "~/types/institution";

export type SegmentedChipSize = "small" | "medium" | "large";
export type SegmentedChipVariant = "outlined" | "filled";

export interface ChipSegment {
  /** Unique key or identifier for this segment */
  id?: string;
  /** Content to display within the segment */
  label: ReactNode;
  /** Optional icon rendered before the label */
  icon?: ReactNode;
  /** Optional tooltip title on hover */
  tooltip?: string;
  /** Custom background color for this segment */
  background?: string;
  /** Custom text/foreground color for this segment */
  color?: string;
  /** Custom font weight (e.g. 700, 800) */
  fontWeight?: number | string;
  /** Bold styling shortcut */
  bold?: boolean;
  /** Monospace typography toggle */
  mono?: boolean;
  /** Optional click handler for this specific segment */
  onClick?: (event: React.MouseEvent) => void;
  /** Custom test ID for the segment */
  testId?: string;
  /** Direct data-testid support */
  "data-testid"?: string;
  /** Custom CSS class name */
  className?: string;
}

export interface SegmentedChipProps {
  /**
   * Array of segment definitions to render in sequence.
   */
  segments?: (ChipSegment | string | ReactNode)[];

  /**
   * Optional prominent leading segment (e.g., status tag, category, diploma).
   */
  leading?: ChipSegment | ReactNode;

  /**
   * Optional secondary items / tags to render following the leading segment.
   */
  items?: (ChipSegment | string | ReactNode)[];

  /**
   * Optional structured cohort data. When provided, automatically resolves
   * diploma badge, tags, and theme colors.
   */
  cohort?:
    | Partial<CohortConfig>
    | {
        diploma?: string | null;
        year?: number | string | null;
        tags?: string[] | null;
        name?: string | null;
      }
    | null;

  /**
   * Size preset ("small" | "medium" | "large"). Defaults to "medium".
   */
  size?: SegmentedChipSize;

  /**
   * Surface variant ("outlined" | "filled"). Defaults to "outlined".
   */
  variant?: SegmentedChipVariant;

  /**
   * Expressive or geometric shape for the chip.
   * Centralized in the shape engine (defaults to "pill").
   */
  shape?: ChipShape;

  /**
   * Overall chip click handler.
   */
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;

  /**
   * Optional delete action callback. Renders an accessible close/delete button at the end.
   */
  onDelete?: () => void;

  /**
   * Accessible delete button tooltip label (defaults to "Delete").
   */
  deleteLabel?: string;

  /**
   * Whether the chip and its actions are disabled.
   */
  disabled?: boolean;

  /**
   * Whether to render dividers between segments (defaults to true).
   */
  showDividers?: boolean;

  /**
   * Custom divider element between segments.
   */
  divider?: ReactNode;

  /**
   * Custom test ID for data-testid
   */
  testId?: string;

  /**
   * Direct data-testid support
   */
  "data-testid"?: string;

  /**
   * Custom CSS class name
   */
  className?: string;

  /**
   * Custom MUI sx styling
   */
  sx?: SxProps<Theme>;

  /**
   * Custom data attributes
   */
  "data-diploma"?: string;
  "data-year"?: number | string;
  "data-size"?: string;
  "data-shape"?: string;
}
