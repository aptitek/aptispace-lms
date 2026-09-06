import type { ReactNode } from "react";
import type { SxProps, Theme } from "@mui/material/styles";

export type NumberPickerMode = "single" | "range";

export interface NumberPickerProps {
  /**
   * Mode: "single" for single number field with optional +/- buttons,
   * "range" for min/max range picker with icon and clear button.
   * Auto-detected if range props are passed.
   * @default "single"
   */
  mode?: NumberPickerMode;

  // --- Single mode props ---
  value?: number | string;
  onChange?: (value: number | string) => void;
  label?: string;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  showStepButtons?: boolean;
  allowAll?: boolean;

  // --- Range mode props ---
  minValue?: number | null;
  maxValue?: number | null;
  onMinChange?: (value: number | null) => void;
  onMaxChange?: (value: number | null) => void;
  placeholderMin?: string;
  placeholderMax?: string;
  icon?: ReactNode;
  clearable?: boolean;

  // Compatibility aliases for YearRangePicker
  startYearMin?: number | null;
  onStartYearMinChange?: (year: number | null) => void;
  startYearMax?: number | null;
  onStartYearMaxChange?: (year: number | null) => void;

  // Common props
  size?: "small" | "medium";
  className?: string;
  sx?: SxProps<Theme>;
  testId?: string;
  "data-testid"?: string;
}
