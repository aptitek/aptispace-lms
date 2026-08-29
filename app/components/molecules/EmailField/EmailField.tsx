import {
  useState,
  useId,
  forwardRef,
  type MouseEvent,
  type ReactNode,
} from "react";
import InputAdornment from "@mui/material/InputAdornment";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import EmailIcon from "@mui/icons-material/Email";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import TextField from "@mui/material/TextField";
import type { EmailFieldProps } from "./EmailField.types";
import { getFieldMetrics, type Metrics } from "./EmailField.styles";

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

function useEmailFieldState(props: EmailFieldProps) {
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

interface EndAdornmentProps {
  metrics: Metrics;
  suffixDomain: string;
  canClear: boolean;
  showDomainLock: boolean;
  onClear: (event: MouseEvent<HTMLButtonElement>) => void;
}

function EmailEndAdornment({
  metrics,
  suffixDomain,
  canClear,
  showDomainLock,
  onClear,
}: EndAdornmentProps) {
  return (
    <InputAdornment
      position="end"
      sx={{ display: "flex", alignItems: "center", gap: 0.75 }}
    >
      <Divider
        orientation="vertical"
        flexItem
        sx={{
          height: "1.2rem",
          alignSelf: "center",
          borderColor: "divider",
          my: 0.25,
        }}
      />

      <Typography
        variant="body2"
        component="span"
        sx={{
          color: "text.secondary",
          fontSize: metrics.suffixSize,
          fontWeight: 600,
          userSelect: "none",
          letterSpacing: "0.02em",
        }}
      >
        {suffixDomain}
      </Typography>

      {canClear ? (
        <Tooltip title="Clear prefix" arrow>
          <IconButton
            size="small"
            onClick={onClear}
            aria-label="Clear prefix"
            tabIndex={-1}
            sx={{
              p: 0.25,
              color: "text.secondary",
              "&:hover": { color: "text.primary" },
            }}
          >
            <CancelRoundedIcon sx={{ fontSize: metrics.clearBtnSize }} />
          </IconButton>
        </Tooltip>
      ) : null}

      {showDomainLock && !canClear ? (
        <Tooltip title={`Fixed institutional domain: ${suffixDomain}`} arrow>
          <Box
            component="span"
            sx={{
              display: "inline-flex",
              alignItems: "center",
              color: "text.secondary",
              opacity: 0.7,
            }}
            aria-label={`Fixed domain ${suffixDomain}`}
          >
            <LockOutlinedIcon sx={{ fontSize: metrics.lockIconSize }} />
          </Box>
        </Tooltip>
      ) : null}
    </InputAdornment>
  );
}

function renderStartAdornment(
  leadingIcon: ReactNode | null | undefined,
  iconSize: number | string,
) {
  if (leadingIcon === null) return undefined;
  return (
    <InputAdornment position="start" sx={{ mr: 0.5 }}>
      {leadingIcon ?? (
        <EmailIcon sx={{ fontSize: iconSize, color: "text.secondary" }} />
      )}
    </InputAdornment>
  );
}

function resolveHelperText(
  error?: boolean,
  errorText?: string,
  supportingText?: string,
  helperText?: ReactNode,
): ReactNode {
  if (error && errorText) return errorText;
  return supportingText ?? helperText;
}

function isClearable(props: EmailFieldProps, hasValue: boolean): boolean {
  return (
    props.showClearButton !== false &&
    hasValue &&
    !props.disabled &&
    !props.readOnly
  );
}

function buildMergedSlotProps(
  slotProps: EmailFieldProps["slotProps"],
  startAdornment: ReactNode,
  endAdornment: ReactNode,
) {
  return {
    ...slotProps,
    input: {
      startAdornment,
      endAdornment,
      ...(slotProps?.input as object),
    },
  };
}

export const EmailField = forwardRef<HTMLDivElement, EmailFieldProps>(
  function EmailField(props, ref) {
    const generatedId = useId();
    const inputId = props.id ?? `email-field-${generatedId}`;
    const size = props.size ?? "medium";
    const variant = props.variant ?? "outlined";
    const metrics = getFieldMetrics(size);
    const state = useEmailFieldState(props);

    const suffixDomain = `@${state.normalizedDomain}`;
    const canClear = isClearable(props, state.hasValue);
    const resolvedHelperText = resolveHelperText(
      props.error,
      props.errorText,
      props.supportingText,
      props.helperText,
    );

    const startAdornment = renderStartAdornment(
      props.leadingIcon,
      metrics.iconSize,
    );
    const endAdornment = (
      <EmailEndAdornment
        metrics={metrics}
        suffixDomain={suffixDomain}
        canClear={canClear}
        showDomainLock={props.showDomainLock !== false}
        onClear={state.handleClear}
      />
    );

    const mergedSlotProps = buildMergedSlotProps(
      props.slotProps,
      startAdornment,
      endAdornment,
    );

    return (
      <TextField
        ref={ref}
        id={inputId}
        value={state.currentLocal}
        variant={variant}
        size={size === "small" ? "small" : "medium"}
        fullWidth={props.fullWidth !== false}
        disabled={props.disabled}
        error={props.error}
        helperText={resolvedHelperText}
        placeholder={props.placeholder ?? "username"}
        slotProps={mergedSlotProps}
        onChange={(e) => state.handleSyncValue(e.target.value)}
        data-testid={props.testId ?? props["data-testid"] ?? "email-field"}
      />
    );
  },
);

export const FixedDomainEmailField = EmailField;
export default EmailField;
