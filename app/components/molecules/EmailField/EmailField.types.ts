import type { ReactNode } from "react";
import type { TextFieldProps as MuiTextFieldProps } from "@mui/material/TextField";

export type EmailFieldVariant = "outlined" | "filled" | "standard";
export type EmailFieldSize = "small" | "medium" | "large";

export type FixedDomainFieldVariant = EmailFieldVariant;
export type FixedDomainFieldSize = EmailFieldSize;

export interface EmailFieldProps extends Omit<
  MuiTextFieldProps,
  "size" | "variant" | "onChange" | "value" | "defaultValue"
> {
  value?: string;
  defaultValue?: string;
  domain?: string;
  onEmailChange?: (fullEmail: string, localPart: string) => void;
  onChange?: (fullEmail: string) => void;
  label?: ReactNode;
  helperText?: ReactNode;
  error?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  variant?: EmailFieldVariant;
  size?: EmailFieldSize;
  fullWidth?: boolean;
  leadingIcon?: ReactNode | null;
  showClearButton?: boolean;
  showDomainLock?: boolean;
  errorText?: string;
  supportingText?: string;
  testId?: string;
  "data-testid"?: string;
}

export type FixedDomainEmailFieldProps = EmailFieldProps;
