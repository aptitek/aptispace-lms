import type { InputHTMLAttributes, ReactNode } from "react";

export type EmailFieldVariant = "outlined" | "filled";
export type EmailFieldSize = "small" | "medium" | "large";

export type FixedDomainFieldVariant = EmailFieldVariant;
export type FixedDomainFieldSize = EmailFieldSize;

export interface EmailFieldProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "size" | "onChange" | "value" | "defaultValue"
> {
  /**
   * Controlled value of the local username part or full email address.
   * If full email is provided (e.g. "cadet@domain.com"), the local part is extracted automatically.
   */
  value?: string;

  /**
   * Uncontrolled initial value.
   */
  defaultValue?: string;

  /**
   * Fixed domain suffix (e.g. "aptispace.com" or "@aptispace.com").
   * The leading "@" is handled automatically.
   * @default "aptispace.com"
   */
  domain?: string;

  /**
   * Callback fired when the email changes, returning the full composite email address and local part.
   */
  onEmailChange?: (fullEmail: string, localPart: string) => void;

  /**
   * Standard change callback returning full composite email string.
   */
  onChange?: (fullEmail: string) => void;

  /**
   * MD3 Label displayed above or floating inside the field.
   */
  label?: string;

  /**
   * Helper or error text shown below the container.
   */
  helperText?: ReactNode;

  /**
   * Whether the field is in an error state.
   */
  error?: boolean;

  /**
   * MD3 Expressive container style.
   * @default "outlined"
   */
  variant?: EmailFieldVariant;

  /**
   * Height and density sizing.
   * @default "medium"
   */
  size?: EmailFieldSize;

  /**
   * Whether the field takes 100% of the parent width.
   * @default true
   */
  fullWidth?: boolean;

  /**
   * Custom leading icon. Defaults to MD3 Email icon. Pass `null` to disable.
   */
  leadingIcon?: ReactNode | null;

  /**
   * Whether to display a clear button when text is entered.
   * @default true
   */
  showClearButton?: boolean;

  /**
   * Whether to show a subtle lock icon inside the domain compartment.
   * @default true
   */
  showDomainLock?: boolean;

  /**
   * Optional custom error message string for M3 error text.
   */
  errorText?: string;

  /**
   * Optional M3 supporting text string.
   */
  supportingText?: string;

  /**
   * Optional custom test ID.
   * @default "email-field"
   */
  testId?: string;
}

export type FixedDomainEmailFieldProps = EmailFieldProps;
