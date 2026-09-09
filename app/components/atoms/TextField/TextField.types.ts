import type { TextFieldProps as MuiTextFieldProps } from "@mui/material/TextField";

export type TextFieldVariant = "outlined" | "filled" | "standard" | "search";
export type TextFieldSize = "compact" | "small" | "medium";

export interface TextFieldProps extends Omit<
  MuiTextFieldProps,
  "variant" | "onChange" | "size"
> {
  /**
   * Field size option. "compact" creates a dense 32px height field.
   * @default "small"
   */
  size?: TextFieldSize;

  /**
   * Shorthand boolean to activate compact 32px dense size variant.
   * When true, overrides size to "compact".
   * @default false
   */
  compact?: boolean;

  /**
   * Automatically fit the field width to its contents.
   * @default false
   */
  fitContent?: boolean;

  /**
   * Data test identifier.
   */
  "data-testid"?: string;

  /**
   * Deprecated legacy inputProps mapping for backwards compatibility.
   */
  InputProps?: Record<string, unknown>;

  /**
   * Visual variant. Includes MD3 "search" pill variant.
   * @default "outlined"
   */
  variant?: TextFieldVariant;

  /**
   * Callback fired when value changes (standard event or string).
   */
  onChange?: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;

  /**
   * Optional direct clear callback fired when clear button is clicked.
   */
  onClear?: () => void;

  /**
   * Whether to show clear button when text is present.
   * @default true
   */
  clearable?: boolean;

  /**
   * Test identifier.
   */
  testId?: string;
}
