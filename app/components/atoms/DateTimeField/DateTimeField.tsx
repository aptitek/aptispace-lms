import React, { forwardRef, useCallback, useMemo } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import type {
  DateTimeFieldProps,
  DateTimeFieldVariant,
  DateTimeFieldVisualVariant,
} from "./DateTimeField.types";
import {
  DateTimeFieldContainer,
  DateTimeFieldRow,
  DateTimeFieldHelperText,
  DateTimeSeparator,
} from "./DateTimeField.styles";
import {
  resolveIs12Hour,
  resolveFormatString,
  resolveStartAriaLabel,
  resolveEndAriaLabel,
} from "./DateTimeField.utils";
import { useDateTimeFieldState } from "./useDateTimeFieldState";
import { DateTimeFieldPickerItem } from "./DateTimeFieldPickerItem";

function resolveContainerId(props: DateTimeFieldProps): string | undefined {
  return props.containerTestId ?? props["data-testid"] ?? props.testId;
}

function resolveNormLocale(locale?: string, normLocale?: string): string {
  if (normLocale) return normLocale;
  if (locale && locale.startsWith("fr")) return "fr";
  return "en";
}

function resolveRangeLabels(
  props: DateTimeFieldProps,
  normLocale: string,
): { startLabel?: string; endLabel?: string } {
  if (props.startLabel || props.endLabel) {
    return {
      startLabel: props.startLabel,
      endLabel: props.endLabel,
    };
  }
  if (props.label) {
    const defaultEnd = normLocale === "fr" ? "Fin" : "End";
    return {
      startLabel: typeof props.label === "string" ? props.label : undefined,
      endLabel: defaultEnd,
    };
  }
  return {};
}

const DEFAULT_CONFIG = {
  size: "medium" as const,
  hourFormat: "auto" as const,
  mode: "time" as const,
  dateFormat: "iso" as const,
  displayIsoDate: true,
  fullWidth: false,
  fitContent: true,
  error: false,
  stopPropagation: true,
  disabled: false,
  readOnly: false,
  separator: "–",
  variant: "outlined" as const,
  textAlign: "left" as const,
};

function resolveVisualVariant(
  variant?: DateTimeFieldVariant,
  inputVariant?: DateTimeFieldVisualVariant,
): DateTimeFieldVisualVariant {
  if (inputVariant) return inputVariant;
  if (
    variant === "filled" ||
    variant === "standard" ||
    variant === "outlined"
  ) {
    return variant;
  }
  return "outlined";
}

function resolveDateTimeFieldConfig(props: DateTimeFieldProps) {
  const merged = { ...DEFAULT_CONFIG, ...props };
  const size = props.compact ? "compact" : (props.size ?? DEFAULT_CONFIG.size);
  const fitContent = props.fitContent ?? !props.fullWidth;
  const textAlign = props.textAlign ?? (size === "compact" ? "center" : "left");
  const variant = resolveVisualVariant(props.variant, props.inputVariant);
  return {
    ...merged,
    size,
    fitContent,
    textAlign,
    variant,
  };
}

interface RangeFieldsProps {
  props: DateTimeFieldProps;
  config: ReturnType<typeof resolveDateTimeFieldConfig>;
  normLocale: string;
  is12Hour: boolean;
  activeFormat?: string;
  state: ReturnType<typeof useDateTimeFieldState>;
}

function DateTimeFieldRangeFields({
  props,
  config,
  normLocale,
  is12Hour,
  activeFormat,
  state,
}: RangeFieldsProps) {
  const { startLabel, endLabel } = resolveRangeLabels(props, normLocale);
  const startAriaLabel = resolveStartAriaLabel(props.startLabel, normLocale);
  const endAriaLabel = resolveEndAriaLabel(props.endLabel, normLocale);
  const startPickerProps = props.startPickerProps || props.pickerProps;
  const endPickerProps = props.endPickerProps || props.pickerProps;

  return (
    <>
      <DateTimeFieldPickerItem
        mode={config.mode}
        size={config.size}
        value={state.resolvedStart}
        onChange={state.handleStartChange}
        activeFormat={activeFormat}
        is12Hour={is12Hour}
        disabled={config.disabled}
        readOnly={config.readOnly}
        error={config.error}
        label={startLabel}
        placeholder={props.startPlaceholder}
        variant={config.variant}
        fullWidth={config.fullWidth}
        fitContent={config.fitContent}
        isRange={true}
        textAlign={config.textAlign}
        ariaLabel={startAriaLabel}
        inputProps={props.startInputProps}
        pickerProps={startPickerProps}
        wrapperTestId={props.startPickerTestId}
        inputTestId={props.startInputTestId}
      />

      <DateTimeSeparator $size={config.size} aria-hidden="true">
        {config.separator}
      </DateTimeSeparator>

      <DateTimeFieldPickerItem
        mode={config.mode}
        size={config.size}
        value={state.resolvedEnd}
        onChange={state.handleEndChange}
        activeFormat={activeFormat}
        is12Hour={is12Hour}
        disabled={config.disabled}
        readOnly={config.readOnly}
        error={config.error}
        label={endLabel}
        placeholder={props.endPlaceholder}
        variant={config.variant}
        fullWidth={config.fullWidth}
        fitContent={config.fitContent}
        isRange={true}
        textAlign={config.textAlign}
        ariaLabel={endAriaLabel}
        inputProps={props.endInputProps}
        pickerProps={endPickerProps}
        wrapperTestId={props.endPickerTestId}
        inputTestId={props.endInputTestId}
      />
    </>
  );
}

interface SingleFieldProps {
  props: DateTimeFieldProps;
  config: ReturnType<typeof resolveDateTimeFieldConfig>;
  is12Hour: boolean;
  activeFormat?: string;
  state: ReturnType<typeof useDateTimeFieldState>;
}

function DateTimeFieldSingleField({
  props,
  config,
  is12Hour,
  activeFormat,
  state,
}: SingleFieldProps) {
  const ariaLabel = typeof props.label === "string" ? props.label : undefined;
  const inputTestId =
    props.startInputTestId ||
    (props.testId ? `${props.testId}-input` : undefined);

  return (
    <DateTimeFieldPickerItem
      mode={config.mode}
      size={config.size}
      value={state.resolvedSingle}
      onChange={state.handleSingleChange}
      activeFormat={activeFormat}
      is12Hour={is12Hour}
      disabled={config.disabled}
      readOnly={config.readOnly}
      error={config.error}
      label={props.label}
      placeholder={props.placeholder}
      helperText={props.helperText}
      variant={config.variant}
      fullWidth={config.fullWidth}
      fitContent={config.fitContent}
      isRange={false}
      textAlign={config.textAlign}
      ariaLabel={ariaLabel}
      inputProps={props.startInputProps}
      pickerProps={props.pickerProps}
      wrapperTestId={props.startPickerTestId}
      inputTestId={inputTestId}
    />
  );
}

export const DateTimeField = forwardRef<HTMLDivElement, DateTimeFieldProps>(
  function DateTimeField(props, ref) {
    const config = resolveDateTimeFieldConfig(props);
    const normLocale = resolveNormLocale(props.locale, props.normLocale);
    const state = useDateTimeFieldState(props);

    const is12Hour = useMemo(
      () => resolveIs12Hour(config.hourFormat, props.ampm, normLocale),
      [config.hourFormat, props.ampm, normLocale],
    );

    const activeFormat = useMemo(
      () =>
        resolveFormatString({
          mode: config.mode,
          dateFormat: config.dateFormat,
          displayIsoDate: config.displayIsoDate,
          is12Hour,
          customFormat: props.format,
        }),
      [
        config.mode,
        config.dateFormat,
        config.displayIsoDate,
        is12Hour,
        props.format,
      ],
    );

    const handleContainerClick = useCallback(
      (event: React.MouseEvent) => {
        if (config.stopPropagation) {
          event.stopPropagation();
        }
      },
      [config.stopPropagation],
    );

    const containerId = resolveContainerId(props);

    return (
      <LocalizationProvider
        dateAdapter={AdapterDayjs}
        adapterLocale={normLocale}
      >
        <DateTimeFieldContainer
          ref={ref}
          $fullWidth={config.fullWidth}
          $fitContent={config.fitContent}
          className={props.className}
          style={props.style}
          sx={props.sx}
          onClick={handleContainerClick}
          data-testid={containerId}
        >
          <DateTimeFieldRow
            $size={config.size}
            $fullWidth={config.fullWidth}
            $fitContent={config.fitContent}
            role={state.isRange ? "group" : undefined}
          >
            {state.isRange ? (
              <DateTimeFieldRangeFields
                props={props}
                config={config}
                normLocale={normLocale}
                is12Hour={is12Hour}
                activeFormat={activeFormat}
                state={state}
              />
            ) : (
              <DateTimeFieldSingleField
                props={props}
                config={config}
                is12Hour={is12Hour}
                activeFormat={activeFormat}
                state={state}
              />
            )}
          </DateTimeFieldRow>

          {state.isRange && props.helperText && (
            <DateTimeFieldHelperText error={config.error}>
              {props.helperText}
            </DateTimeFieldHelperText>
          )}
        </DateTimeFieldContainer>
      </LocalizationProvider>
    );
  },
);

DateTimeField.displayName = "DateTimeField";

export const CompactDateTimeField = forwardRef<
  HTMLDivElement,
  DateTimeFieldProps
>(function CompactDateTimeField(props, ref) {
  return <DateTimeField ref={ref} compact {...props} />;
});

CompactDateTimeField.displayName = "CompactDateTimeField";

export default DateTimeField;
