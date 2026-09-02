import type { CohortConfig } from "~/types/institution";

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
  onClick?: () => void;
  onDelete?: () => void;
  disabled?: boolean;
  className?: string;
  testId?: string;
  "data-testid"?: string;
}
