import {
  useState,
  useId,
  useRef,
  useImperativeHandle,
  forwardRef,
  useEffect,
  type ForwardedRef,
  type ReactNode,
} from "react";
import "@material/web/textfield/filled-text-field.js";
import "@material/web/textfield/outlined-text-field.js";
import type {
  MdFilledTextField,
  MdOutlinedTextField,
} from "../../../types/material-web";
import type {
  TextFieldProps,
  TextFieldSize,
  TextFieldVariant,
} from "./TextField.types";
import { FieldRoot } from "./TextField.styles";

function useFieldRefs(
  variant: TextFieldVariant,
  forwardedRef: ForwardedRef<
    MdFilledTextField | MdOutlinedTextField | HTMLElement
  >,
) {
  const filledRef = useRef<MdFilledTextField | null>(null);
  const outlinedRef = useRef<MdOutlinedTextField | null>(null);
  const activeRef =
    variant === "filled"
      ? (filledRef as React.RefObject<
          MdFilledTextField | MdOutlinedTextField | null
        >)
      : (outlinedRef as React.RefObject<
          MdFilledTextField | MdOutlinedTextField | null
        >);

  useImperativeHandle(forwardedRef, () => activeRef.current as HTMLElement);

  return { filledRef, outlinedRef, activeRef };
}

function resolveMessages(props: TextFieldProps) {
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

function IconSlot({
  icon,
  slot,
}: {
  icon?: ReactNode;
  slot: "leading-icon" | "trailing-icon";
}) {
  if (!icon) return null;
  return (
    <span slot={slot} className="md3-field-icon-slot" aria-hidden="true">
      {icon}
    </span>
  );
}

interface BuildFieldOptions {
  props: TextFieldProps;
  inputId: string;
  testId: string;
  currentValue: string;
  errorTextString?: string;
  supportingTextString?: string;
  onSync?: (nextValue: string) => void;
}

function buildFieldAttributes(options: BuildFieldOptions) {
  const {
    props,
    inputId,
    testId,
    currentValue,
    errorTextString,
    supportingTextString,
    onSync,
  } = options;

  return {
    id: inputId,
    name: props.name,
    label: props.label,
    value: currentValue,
    placeholder: props.placeholder,
    disabled: props.disabled,
    readOnly: props.readOnly,
    required: props.required,
    error: props.error,
    errorText: errorTextString,
    supportingText: supportingTextString,
    prefixText: props.prefixText,
    suffixText: props.suffixText,
    type: props.type || "text",
    autocomplete: props.autoComplete,
    autoFocus: props.autoFocus,
    tabIndex: props.tabIndex,
    "data-testid": testId,
    onInput: (e: React.FormEvent<HTMLElement>) => {
      const target = e.target as HTMLInputElement;
      const nextVal = target.value ?? "";
      onSync?.(nextVal);
      props.onInput?.(e);
    },
    onChange: (e: React.FormEvent<HTMLElement>) => {
      const target = e.target as HTMLInputElement;
      const nextVal = target.value ?? "";
      onSync?.(nextVal);
      props.onChange?.(e);
    },
    onFocus: props.onFocus,
    onBlur: props.onBlur,
  };
}

export const TextField = forwardRef<
  MdFilledTextField | MdOutlinedTextField | HTMLElement,
  TextFieldProps
>(function TextField(props, ref) {
  const generatedId = useId();
  const inputId = props.id || `text-field-${generatedId}`;
  const size: TextFieldSize = props.size || "medium";
  const variant: TextFieldVariant = props.variant || "outlined";
  const fullWidth = props.fullWidth !== false;
  const testId = props.testId || props["data-testid"] || "text-field";

  const isControlled = props.value !== undefined;
  const [uncontrolledVal, setUncontrolledVal] = useState(
    props.defaultValue ?? "",
  );
  const currentValue = isControlled ? (props.value ?? "") : uncontrolledVal;

  const { filledRef, outlinedRef, activeRef } = useFieldRefs(variant, ref);
  const { supportingTextString, errorTextString } = resolveMessages(props);

  const handleSync = (nextValue: string) => {
    if (!isControlled) setUncontrolledVal(nextValue);
    props.onValueChange?.(nextValue);
  };

  useEffect(() => {
    if (activeRef.current && "value" in activeRef.current) {
      (activeRef.current as unknown as { value: string }).value = currentValue;
    }
  }, [currentValue, activeRef]);

  const sharedProps = buildFieldAttributes({
    props,
    inputId,
    testId,
    currentValue,
    errorTextString,
    supportingTextString,
    onSync: handleSync,
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
          <IconSlot icon={props.leadingIcon} slot="leading-icon" />
          <IconSlot icon={props.trailingIcon} slot="trailing-icon" />
        </md-filled-text-field>
      ) : (
        <md-outlined-text-field ref={outlinedRef} {...sharedProps}>
          <IconSlot icon={props.leadingIcon} slot="leading-icon" />
          <IconSlot icon={props.trailingIcon} slot="trailing-icon" />
        </md-outlined-text-field>
      )}
    </FieldRoot>
  );
});

export default TextField;
