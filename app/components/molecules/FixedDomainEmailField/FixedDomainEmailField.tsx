import {
  useState,
  useId,
  useRef,
  useImperativeHandle,
  forwardRef,
  type ReactNode,
  type ChangeEvent,
  type FormEvent,
  type AnimationEvent,
  type MouseEvent,
  type RefObject,
} from "react";
import EmailIcon from "@mui/icons-material/Email";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import Tooltip from "@mui/material/Tooltip";
import type {
  FixedDomainEmailFieldProps,
  FixedDomainFieldSize,
} from "./FixedDomainEmailField.types";
import {
  FieldRoot,
  LabelText,
  MD3FieldContainer,
  LeadingIconContainer,
  InputWrapper,
  UsernameInput,
  DomainCompartment,
  ClearIconButton,
  CompartmentDivider,
  HelperTextRoot,
} from "./FixedDomainEmailField.styles";

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

interface DomainBadgeProps {
  size: FixedDomainFieldSize;
  domain: string;
  error?: boolean;
  isFocused?: boolean;
  disabled?: boolean;
  showDomainLock?: boolean;
}

function DomainBadge({
  size,
  domain,
  error,
  isFocused,
  disabled,
  showDomainLock,
}: DomainBadgeProps) {
  return (
    <DomainCompartment
      sizePreset={size}
      hasError={error}
      isFocused={isFocused}
      isDisabled={disabled}
      title={`Fixed domain: @${domain}`}
      role="region"
      aria-label={`Fixed domain suffix @${domain}`}
    >
      <span className="domain-at" aria-hidden="true">
        @
      </span>
      <span className="domain-text">{domain}</span>
      {showDomainLock ? (
        <span className="domain-lock" aria-label="Fixed domain">
          <LockOutlinedIcon />
        </span>
      ) : null}
    </DomainCompartment>
  );
}

interface FieldHelperProps {
  helperId: string;
  error?: boolean;
  helperText?: ReactNode;
}

function FieldHelper({ helperId, error, helperText }: FieldHelperProps) {
  if (!helperText) return null;
  return (
    <HelperTextRoot
      id={helperId}
      hasError={error}
      role={error ? "alert" : undefined}
    >
      {error ? <ErrorOutlineRoundedIcon /> : null}
      <span>{helperText}</span>
    </HelperTextRoot>
  );
}

interface ClearButtonProps {
  visible: boolean;
  onClear: (e: MouseEvent<HTMLButtonElement>) => void;
}

function ClearButton({ visible, onClear }: ClearButtonProps) {
  if (!visible) return null;
  return (
    <Tooltip title="Clear prefix">
      <ClearIconButton
        type="button"
        onClick={onClear}
        aria-label="Clear prefix"
        tabIndex={-1}
      >
        <CancelRoundedIcon />
      </ClearIconButton>
    </Tooltip>
  );
}

interface LeadingIconViewProps {
  icon?: ReactNode | null;
  size: FixedDomainFieldSize;
  isFocused?: boolean;
  hasError?: boolean;
}

function LeadingIconView({
  icon,
  size,
  isFocused,
  hasError,
}: LeadingIconViewProps) {
  if (icon === null) return null;
  const resolvedIcon = icon || <EmailIcon />;
  return (
    <LeadingIconContainer
      sizePreset={size}
      isFocused={isFocused}
      hasError={hasError}
      aria-hidden="true"
    >
      {resolvedIcon}
    </LeadingIconContainer>
  );
}

function useEmailFieldState(
  props: FixedDomainEmailFieldProps,
  inputRef: RefObject<HTMLInputElement | null>,
) {
  const isControlled = props.value !== undefined;
  const normalizedDomain = cleanDomainString(props.domain);
  const initialValue = isControlled
    ? (props.value ?? "")
    : (props.defaultValue ?? "");
  const initialLocal = sanitizeLocalPart(initialValue);

  const [uncontrolledLocal, setUncontrolledLocal] =
    useState<string>(initialLocal);
  const [isFocused, setIsFocused] = useState<boolean>(false);

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

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    handleSyncValue(event.target.value);
  };

  const handleFormInput = (event: FormEvent<HTMLInputElement>) => {
    const target = event.target as HTMLInputElement;
    if (target.value && target.value.includes("@")) {
      handleSyncValue(target.value);
    }
  };

  const handleAnimationStart = (event: AnimationEvent<HTMLInputElement>) => {
    // Detect webkit autofill events from browser & password extensions
    if (event.animationName.includes("autofill") && inputRef.current) {
      handleSyncValue(inputRef.current.value);
    }
  };

  const handleClear = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (!isControlled) setUncontrolledLocal("");
    props.onEmailChange?.("", "");
    props.onChange?.("");
    inputRef.current?.focus();
  };

  return {
    normalizedDomain,
    currentLocal,
    fullEmail,
    hasValue,
    isFocused,
    setIsFocused,
    handleInputChange,
    handleFormInput,
    handleAnimationStart,
    handleClear,
  };
}

interface FieldContainerContentProps {
  props: FixedDomainEmailFieldProps;
  inputId: string;
  helperId: string;
  inputRef: RefObject<HTMLInputElement | null>;
  state: ReturnType<typeof useEmailFieldState>;
}

function FieldContainerContent({
  props,
  inputId,
  helperId,
  inputRef,
  state,
}: FieldContainerContentProps) {
  const size = props.size || "medium";
  const showClear = props.showClearButton !== false;
  const showLock = props.showDomainLock !== false;
  const placeholderText = props.placeholder ?? "username";
  const ariaLabelText =
    props.label || `Email username prefix for @${state.normalizedDomain}`;
  const canClear =
    showClear && state.hasValue && !props.disabled && !props.readOnly;
  const autoCompleteType = props.autoComplete || "email";

  return (
    <>
      <LeadingIconView
        icon={props.leadingIcon}
        size={size}
        isFocused={state.isFocused}
        hasError={props.error}
      />

      <InputWrapper>
        <UsernameInput
          ref={inputRef}
          id={inputId}
          name={props.name}
          type="text"
          inputMode="email"
          autoComplete={autoCompleteType}
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck="false"
          value={state.currentLocal}
          disabled={props.disabled}
          readOnly={props.readOnly}
          required={props.required}
          autoFocus={props.autoFocus}
          tabIndex={props.tabIndex}
          sizePreset={size}
          placeholder={placeholderText}
          onChange={state.handleInputChange}
          onInput={state.handleFormInput}
          onAnimationStart={state.handleAnimationStart}
          onFocus={(e) => {
            state.setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            state.setIsFocused(false);
            props.onBlur?.(e);
          }}
          aria-invalid={props.error}
          aria-describedby={props.helperText ? helperId : undefined}
          aria-label={ariaLabelText}
        />
      </InputWrapper>

      <ClearButton visible={canClear} onClear={state.handleClear} />

      <CompartmentDivider aria-hidden="true" />

      <DomainBadge
        size={size}
        domain={state.normalizedDomain}
        error={props.error}
        isFocused={state.isFocused}
        disabled={props.disabled}
        showDomainLock={showLock}
      />
    </>
  );
}

export const FixedDomainEmailField = forwardRef<
  HTMLInputElement,
  FixedDomainEmailFieldProps
>(function FixedDomainEmailField(props, ref) {
  const generatedId = useId();
  const inputId = props.id || `fixed-email-${generatedId}`;
  const helperId = `fixed-email-helper-${generatedId}`;

  const inputRef = useRef<HTMLInputElement | null>(null);
  useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

  const size = props.size || "medium";
  const variant = props.variant || "outlined";
  const fullWidth = props.fullWidth !== false;
  const testId = props.testId || "fixed-domain-email-field";

  const state = useEmailFieldState(props, inputRef);

  return (
    <FieldRoot
      fullWidth={fullWidth}
      isDisabled={props.disabled}
      data-testid={testId}
      className={props.className}
    >
      {props.label ? (
        <LabelText htmlFor={inputId}>{props.label}</LabelText>
      ) : null}

      <MD3FieldContainer
        variantStyle={variant}
        sizePreset={size}
        isFocused={state.isFocused}
        hasError={props.error}
        isDisabled={props.disabled}
        onClick={() => !props.disabled && inputRef.current?.focus()}
      >
        <FieldContainerContent
          props={props}
          inputId={inputId}
          helperId={helperId}
          inputRef={inputRef}
          state={state}
        />
      </MD3FieldContainer>

      <FieldHelper
        helperId={helperId}
        error={props.error}
        helperText={props.helperText}
      />
    </FieldRoot>
  );
});

export default FixedDomainEmailField;
