import type { ReactNode, FormEvent, FocusEvent } from "react";

export type TextFieldSize = "small" | "medium" | "large";
export type TextFieldVariant = "filled" | "outlined";

export interface TextFieldProps {
  id?: string;
  name?: string;
  label?: string;
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  type?: string;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  error?: boolean;
  errorText?: string;
  supportingText?: string;
  helperText?: ReactNode;
  prefixText?: string;
  suffixText?: string;
  variant?: TextFieldVariant;
  size?: TextFieldSize;
  fullWidth?: boolean;
  autoFocus?: boolean;
  autoComplete?: string;
  tabIndex?: number;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  className?: string;
  testId?: string;
  "data-testid"?: string;
  onInput?: (event: FormEvent<HTMLElement>) => void;
  onChange?: (event: FormEvent<HTMLElement>) => void;
  onFocus?: (event: FocusEvent<HTMLElement>) => void;
  onBlur?: (event: FocusEvent<HTMLElement>) => void;
  onValueChange?: (value: string) => void;
}
