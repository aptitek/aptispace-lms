import {
  useState,
  useId,
  useRef,
  useImperativeHandle,
  forwardRef,
  useEffect,
  type MouseEvent,
  type ForwardedRef,
  type RefObject,
  type FormEvent,
} from "react";
import EmailIcon from "@mui/icons-material/Email";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Tooltip from "@mui/material/Tooltip";
import "@material/web/textfield/filled-text-field.js";
import "@material/web/textfield/outlined-text-field.js";
import "@material/web/icon/icon.js";
import type {
  MdFilledTextField,
  MdOutlinedTextField,
} from "../../../types/material-web";
import type {
  EmailFieldProps,
  EmailFieldSize,
  EmailFieldVariant,
} from "./EmailField.types";
import { FieldRoot } from "./EmailField.styles";

function cleanDomainString(domain?: string): string {
  if (!domain) return "aptispace.com";
  return domain.replace(/^@+/, "").trim().toLowerCase();
}

function sanitizeLocalPart(rawInput: string): string {
  const cleaned = rawInput.trim();
  if (cleaned.includes("@")) {
    return cleaned.split("@")[0];
  }
  return cleaned;
}

function useEmailFieldState(
  props: EmailFieldProps,
  fieldRef: RefObject<MdFilledTextField | MdOutlinedTextField | null>,
) {
  const isControlled = props.value !== undefined;
  const normalizedDomain = cleanDomainString(props.domain);
  const initialValue = isControlled
    ? (props.value ?? "")
    : (props.defaultValue ?? "");
  const initialLocal = sanitizeLocalPart(initialValue);

  const [uncontrolledLocal, setUncontrolledLocal] =
    useState<string>(initialLocal);

  const currentLocal = isControlled
    ? sanitizeLocalPart(props.value ?? "")
    : uncontrolledLocal;

  const fullEmail = currentLocal ? `${currentLocal}@${normalizedDomain}` : "";
  const hasValue = currentLocal.length > 0;

  const handleSyncValue = (rawValue: string) => {
    const cleanLocal = sanitizeLocalPart(rawValue);
    if (!isControlled) setUncontrolledLocal(cleanLocal);
    const compositeEmail = cleanLocal
      ? `${cleanLocal}@${normalizedDomain}`
      : "";
    props.onEmailChange?.(compositeEmail, cleanLocal);
    props.onChange?.(compositeEmail);
  };

  const handleClear = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (!isControlled) setUncontrolledLocal("");
    props.onEmailChange?.("", "");
    props.onChange?.("");
    fieldRef.current?.focus();
  };

  return {
    normalizedDomain,
    currentLocal,
    fullEmail,
    hasValue,
    handleSyncValue,
    handleClear,
  };
}

function useFieldRefs(
  variant: EmailFieldVariant,
  forwardedRef: ForwardedRef<
    MdFilledTextField | MdOutlinedTextField | HTMLElement
  >,
) {
  const filledRef = useRef<MdFilledTextField | null>(null);
  const outlinedRef = useRef<MdOutlinedTextField | null>(null);
  const activeRef =
    variant === "filled"
      ? (filledRef as RefObject<MdFilledTextField | MdOutlinedTextField | null>)
      : (outlinedRef as RefObject<
          MdFilledTextField | MdOutlinedTextField | null
        >);

  useImperativeHandle(forwardedRef, () => activeRef.current as HTMLElement);

  return { filledRef, outlinedRef, activeRef };
}

function resolveMessages(props: EmailFieldProps) {
  const supporting =
    typeof props.helperText === "string"
      ? props.helperText
      : props.supportingText;
  const err =
    props.error && typeof props.helperText === "string"
      ? props.helperText
      : props.errorText || supporting;
  return { supportingTextString: supporting, errorTextString: err };
}

interface TrailingIconProps {
  canClear: boolean;
  showLock: boolean;
  suffixDomain: string;
  onClear: (event: MouseEvent<HTMLButtonElement>) => void;
}

function TrailingIconSlot({
  canClear,
  showLock,
  suffixDomain,
  onClear,
}: TrailingIconProps) {
  if (canClear) {
    return (
      <span slot="trailing-icon" className="md3-field-icon-slot">
        <Tooltip title="Clear prefix">
          <button
            type="button"
            className="md3-clear-btn"
            onClick={onClear}
            aria-label="Clear prefix"
            tabIndex={-1}
          >
            <CancelRoundedIcon />
          </button>
        </Tooltip>
      </span>
    );
  }
  if (showLock) {
    return (
      <span
        slot="trailing-icon"
        className="md3-field-icon-slot md3-lock-icon"
        title={`Fixed institutional domain: ${suffixDomain}`}
        aria-label={`Fixed domain ${suffixDomain}`}
      >
        <LockOutlinedIcon />
      </span>
    );
  }
  return null;
}

function LeadingIconSlot({ icon }: { icon: EmailFieldProps["leadingIcon"] }) {
  const resolved = icon === undefined ? <EmailIcon /> : icon;
  if (!resolved) return null;
  return (
    <span
      slot="leading-icon"
      className="md3-field-icon-slot"
      aria-hidden="true"
    >
      {resolved}
    </span>
  );
}

interface BuildFieldOptions {
  props: EmailFieldProps;
  inputId: string;
  testId: string;
  currentLocal: string;
  suffixDomain: string;
  errorTextString?: string;
  supportingTextString?: string;
  onSync?: (nextValue: string) => void;
}

function buildFieldProps(options: BuildFieldOptions) {
  const {
    props,
    inputId,
    testId,
    currentLocal,
    suffixDomain,
    errorTextString,
    supportingTextString,
    onSync,
  } = options;

  return {
    id: inputId,
    name: props.name,
    label: props.label,
    value: currentLocal,
    placeholder: props.placeholder ?? "username",
    disabled: props.disabled,
    readOnly: props.readOnly,
    required: props.required,
    error: props.error,
    errorText: errorTextString,
    supportingText: supportingTextString,
    suffixText: suffixDomain,
    type: "text",
    inputMode: "email" as const,
    autocomplete: props.autoComplete || "email",
    autoFocus: props.autoFocus,
    tabIndex: props.tabIndex,
    "data-testid": testId,
    onInput: (e: FormEvent<HTMLElement>) => {
      const target = e.target as HTMLInputElement;
      onSync?.(target.value ?? "");
    },
    onChange: (e: FormEvent<HTMLElement>) => {
      const target = e.target as HTMLInputElement;
      onSync?.(target.value ?? "");
    },
    onFocus: props.onFocus,
    onBlur: props.onBlur,
  };
}

export const EmailField = forwardRef<
  MdFilledTextField | MdOutlinedTextField | HTMLElement,
  EmailFieldProps
>(function EmailField(props, ref) {
  const generatedId = useId();
  const inputId = props.id || `email-field-${generatedId}`;
  const size: EmailFieldSize = props.size || "medium";
  const variant: EmailFieldVariant = props.variant || "outlined";
  const fullWidth = props.fullWidth !== false;
  const testId = props.testId || "email-field";

  const { filledRef, outlinedRef, activeRef } = useFieldRefs(variant, ref);
  const state = useEmailFieldState(props, activeRef);
  const { supportingTextString, errorTextString } = resolveMessages(props);

  const canClear =
    props.showClearButton !== false &&
    state.hasValue &&
    !props.disabled &&
    !props.readOnly;
  const suffixDomain = `@${state.normalizedDomain}`;

  useEffect(() => {
    if (activeRef.current && "value" in activeRef.current) {
      (activeRef.current as unknown as { value: string }).value =
        state.currentLocal;
    }
  }, [state.currentLocal, activeRef]);

  const sharedProps = buildFieldProps({
    props,
    inputId,
    testId,
    currentLocal: state.currentLocal,
    suffixDomain,
    errorTextString,
    supportingTextString,
    onSync: state.handleSyncValue,
  });

  return (
    <FieldRoot
      fullWidth={fullWidth}
      isDisabled={props.disabled}
      sizePreset={size}
      variantStyle={variant}
      className={props.className}
    >
      {variant === "filled" ? (
        <md-filled-text-field ref={filledRef} {...sharedProps}>
          <LeadingIconSlot icon={props.leadingIcon} />
          <TrailingIconSlot
            canClear={canClear}
            showLock={props.showDomainLock !== false}
            suffixDomain={suffixDomain}
            onClear={state.handleClear}
          />
        </md-filled-text-field>
      ) : (
        <md-outlined-text-field ref={outlinedRef} {...sharedProps}>
          <LeadingIconSlot icon={props.leadingIcon} />
          <TrailingIconSlot
            canClear={canClear}
            showLock={props.showDomainLock !== false}
            suffixDomain={suffixDomain}
            onClear={state.handleClear}
          />
        </md-outlined-text-field>
      )}
    </FieldRoot>
  );
});

export const FixedDomainEmailField = EmailField;
export default EmailField;
