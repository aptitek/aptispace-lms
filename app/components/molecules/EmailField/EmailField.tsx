import {
  useState,
  useId,
  forwardRef,
  type MouseEvent,
  type FocusEvent,
  type ReactNode,
} from "react";
import { useTranslation } from "react-i18next";
import type { TFunction } from "i18next";
import { AnimatePresence } from "framer-motion";
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
import {
  getFieldMetrics,
  MotionDomainSpan,
  type Metrics,
} from "./EmailField.styles";

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

function useEmailFieldState(props: EmailFieldProps, t: TFunction) {
  const isControlled = props.value !== undefined;
  const normalizedDomain = cleanDomainString(props.domain);
  const initialValue = isControlled
    ? (props.value ?? "")
    : (props.defaultValue ?? "");
  const initialLocal = sanitizeLocalPart(initialValue);

  const [uncontrolledLocal, setUncontrolledLocal] =
    useState<string>(initialLocal);
  const [autoFillError, setAutoFillError] = useState<string | null>(null);

  const currentLocal = isControlled
    ? sanitizeLocalPart(props.value ?? "")
    : uncontrolledLocal;

  const fullEmail = currentLocal ? `${currentLocal}@${normalizedDomain}` : "";
  const hasValue = currentLocal.length > 0;

  const handleSyncValue = (rawValue: string) => {
    let cleanLocal = rawValue.trim();
    let errorMsg: string | null = null;

    if (rawValue.includes("@")) {
      const parts = rawValue.split("@");
      cleanLocal = parts[0].trim();
      const enteredDomain = parts.slice(1).join("@").trim();

      if (enteredDomain.length > 0) {
        const cleanedEntered = cleanDomainString(enteredDomain);
        if (cleanedEntered !== normalizedDomain) {
          errorMsg = t("emailField.errors.autofillAdjusted", {
            enteredDomain: cleanedEntered,
            domain: normalizedDomain,
          });
        }
      } else {
        errorMsg = t("emailField.errors.noAtAllowed", {
          domain: normalizedDomain,
        });
      }
    }

    setAutoFillError(errorMsg);

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
    setAutoFillError(null);
    if (!isControlled) setUncontrolledLocal("");
    props.onEmailChange?.("", "");
    props.onChange?.("");
  };

  return {
    normalizedDomain,
    currentLocal,
    fullEmail,
    hasValue,
    autoFillError,
    handleSyncValue,
    handleClear,
  };
}

interface EndAdornmentProps {
  metrics: Metrics;
  domainText: string;
  canClear: boolean;
  showDomainLock: boolean;
  onClear: (event: MouseEvent<HTMLButtonElement>) => void;
  isFocused: boolean;
}

function EmailEndAdornment({
  metrics,
  domainText,
  canClear,
  showDomainLock,
  onClear,
  isFocused,
}: EndAdornmentProps) {
  const { t } = useTranslation("common");
  const [isHovered, setIsHovered] = useState(false);
  const shouldCollapse = isFocused && !isHovered;

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
        component="div"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        sx={{
          color: "text.secondary",
          fontSize: metrics.suffixSize,
          fontWeight: 600,
          userSelect: "none",
          letterSpacing: "0.02em",
          display: "flex",
          alignItems: "center",
          overflow: "hidden",
          cursor: isFocused ? "pointer" : "default",
          py: 0.25,
          px: 0.25,
          borderRadius: 0.5,
          "&:hover": {
            color: "text.primary",
          },
        }}
      >
        <span>@</span>
        <AnimatePresence initial={false}>
          {!shouldCollapse && (
            <MotionDomainSpan
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "auto", opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{
                duration: 0.3,
                ease: [0.2, 0, 0, 1],
              }}
            >
              {domainText}
            </MotionDomainSpan>
          )}
        </AnimatePresence>
      </Typography>

      {canClear ? (
        <Tooltip title={t("emailField.clearPrefix")} arrow>
          <IconButton
            size="small"
            onClick={onClear}
            aria-label={t("emailField.clearPrefix")}
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
        <Tooltip
          title={t("emailField.fixedDomain", { domain: domainText })}
          arrow
        >
          <Box
            component="span"
            sx={{
              display: "inline-flex",
              alignItems: "center",
              color: "text.secondary",
              opacity: 0.7,
            }}
            aria-label={t("emailField.fixedDomainAria", { domain: domainText })}
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

interface ResolveHelperTextOptions {
  error?: boolean;
  errorText?: string;
  supportingText?: string;
  helperText?: ReactNode;
  autoFillError?: string | null;
}

function resolveHelperText(options: ResolveHelperTextOptions): ReactNode {
  if (options.autoFillError) return options.autoFillError;
  if (options.error && options.errorText) return options.errorText;
  return options.supportingText ?? options.helperText;
}

function isClearable(props: EmailFieldProps, hasValue: boolean): boolean {
  return (
    props.showClearButton !== false &&
    hasValue &&
    !props.disabled &&
    !props.readOnly &&
    !props.showDomainLock
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
    const { t } = useTranslation("common");
    const generatedId = useId();
    const inputId = props.id ?? `email-field-${generatedId}`;
    const size = props.size ?? "medium";
    const variant = props.variant ?? "outlined";
    const metrics = getFieldMetrics(size);
    const state = useEmailFieldState(props, t);

    const [isFocused, setIsFocused] = useState(false);

    const isError = Boolean(props.error || state.autoFillError);
    const canClear = isClearable(props, state.hasValue);
    const resolvedHelperText = resolveHelperText({
      error: props.error,
      errorText: props.errorText,
      supportingText: props.supportingText,
      helperText: props.helperText,
      autoFillError: state.autoFillError,
    });

    const startAdornment = renderStartAdornment(
      props.leadingIcon,
      metrics.iconSize,
    );
    const endAdornment = (
      <EmailEndAdornment
        metrics={metrics}
        domainText={state.normalizedDomain}
        canClear={canClear}
        showDomainLock={props.showDomainLock !== false}
        onClear={state.handleClear}
        isFocused={isFocused}
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
        error={isError}
        helperText={resolvedHelperText}
        placeholder={props.placeholder ?? t("emailField.usernamePlaceholder")}
        slotProps={mergedSlotProps}
        onChange={(e) => state.handleSyncValue(e.target.value)}
        onFocus={(e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
          setIsFocused(true);
          props.onFocus?.(e);
        }}
        onBlur={(e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
          setIsFocused(false);
          props.onBlur?.(e);
        }}
        data-testid={props.testId ?? props["data-testid"] ?? "email-field"}
      />
    );
  },
);

export const FixedDomainEmailField = EmailField;
export default EmailField;
