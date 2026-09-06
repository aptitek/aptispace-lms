import type { ReactNode } from "react";
import type { SxProps, Theme } from "@mui/material/styles";

export type NumberPickerMode = "single" | "range";
export type RangePickerVariant = "unified" | "split";

export interface NumberPickerProps {
  /**
   * Mode: "single" for single number field with optional +/- buttons,
   * "range" for min/max range picker with icon and clear button.
   * Auto-detected if range props are passed.
   * @default "single"
   */
  mode?: NumberPickerMode;

  /**
   * Layout variant for range mode:
   * - "unified": A single MD3 outlined input with dual seamless inputs inside
   * - "split": Two separate linked SingleNumberPicker fields side-by-side
   * @default "unified"
   */
  variant?: RangePickerVariant;

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
  shrink?: boolean;
  size?: "small" | "medium";
  disabled?: boolean;
  fullWidth?: boolean;
  className?: string;
  sx?: SxProps<Theme>;
  testId?: string;
  "data-testid"?: string;
}
