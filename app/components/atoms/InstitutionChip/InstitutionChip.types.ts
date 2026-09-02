import type { ChipProps } from "../Chip/Chip.types";
import type { InstitutionType } from "~/tokens/institutions";

export interface InstitutionChipProps extends Omit<
  ChipProps,
  "color" | "shape"
> {
  /** Target institution type ("school" | "company" | string) */
  institutionType?: InstitutionType | string | null;
  /** Alias for institutionType */
  type?: InstitutionType | string;
  /** Optional override for chip shape */
  shape?: ChipProps["shape"];
  /** Optional override for chip color token */
  color?: ChipProps["color"];
  /** Whether to show the institution type's associated icon (defaults to true) */
  showIcon?: boolean;
}
