import type { CohortConfig } from "~/types/institution";
import type { ChipShape } from "~/tokens/shapes";

export type CohortChipSize = "small" | "medium" | "large";

export interface CohortChipProps {
  cohort?:
    | Partial<CohortConfig>
    | {
        diploma?: string | null;
        year?: number | string | null;
        tags?: string[] | null;
        name?: string | null;
      }
    | null;
  size?: CohortChipSize;
  variant?: "outlined" | "filled";
  /**
   * Expressive or geometric shape for the cohort chip.
   * Centralized in the shape engine (defaults to "pill").
   */
  shape?: ChipShape;
  onClick?: () => void;
  onDelete?: () => void;
  disabled?: boolean;
  className?: string;
  testId?: string;
  "data-testid"?: string;
}
