import type { ReactNode } from "react";
import type { SxProps, Theme } from "@mui/material/styles";

export interface SelectOption<T = string | number> {
  value: T;
  label?: ReactNode;
  chip?: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
}

export interface SelectProps<T = string | number> {
  /**
   * The currently selected value.
   */
  value: T;

  /**
   * Change callback when selection changes.
   */
  onChange: (value: T) => void;

  /**
   * List of selectable options.
   */
  options?: SelectOption<T>[];

  /**
   * Material Design 3 variant.
   * @default "outlined"
   */
  variant?: "outlined" | "filled";

  /**
   * Size scale of the input.
   * @default "small"
   */
  size?: "small" | "medium";

  /**
   * Floating label string.
   */
  label?: string;

  /**
   * Placeholder text when empty.
   */
  placeholder?: string;

  /**
   * Leading icon or decorator.
   */
  leadingIcon?: ReactNode;

  /**
   * Custom renderer for the displayed value inside the trigger.
   */
  renderValue?: (value: T) => ReactNode;

  /**
   * Minimum width of the select element.
   */
  minWidth?: number | string;

  /**
   * Whether the select is disabled.
   */
  disabled?: boolean;

  /**
   * Whether the select has an error state.
   */
  error?: boolean;

  /**
   * Helper text below the input.
   */
  helperText?: ReactNode;

  /**
   * Custom children (e.g. MenuItems) if not using options array.
   */
  children?: ReactNode;

  /**
   * Extra className.
   */
  className?: string;

  /**
   * Style overrides.
   */
  sx?: SxProps<Theme>;

  /**
   * Test identifier.
   */
  "data-testid"?: string;
  testId?: string;
}
