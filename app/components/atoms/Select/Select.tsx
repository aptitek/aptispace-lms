import React, { forwardRef, type ReactNode } from "react";
import MenuItem from "@mui/material/MenuItem";
import InputAdornment from "@mui/material/InputAdornment";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { StyledMD3SelectRoot, MENU_PROPS } from "./Select.styles";
import type { SelectProps, SelectOption } from "./Select.types";

function renderOptionContent(option: SelectOption<unknown>): ReactNode {
  if (option.chip) {
    return option.chip;
  }
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      {option.icon}
      <Typography variant="body2" component="span">
        {option.label ?? String(option.value)}
      </Typography>
    </Box>
  );
}

function resolveSelectedDisplay(
  selected: unknown,
  options?: SelectOption<unknown>[],
  placeholder?: string,
): ReactNode {
  if (options) {
    const matched = options.find((opt) => opt.value === selected);
    if (matched) {
      return renderOptionContent(matched);
    }
  }

  if (!selected && placeholder) {
    return (
      <Typography variant="body2" color="text.secondary">
        {placeholder}
      </Typography>
    );
  }

  return String(selected ?? "");
}

function renderSelectChildren(
  children?: ReactNode,
  options?: SelectOption<unknown>[],
): ReactNode {
  if (children) {
    return children;
  }
  if (!options) {
    return null;
  }
  return options.map((option) => (
    <MenuItem
      key={String(option.value)}
      value={option.value as string | number}
      disabled={option.disabled}
      sx={{ py: 0.75 }}
    >
      {renderOptionContent(option)}
    </MenuItem>
  ));
}

function resolveLeadingAdornment(leadingIcon?: ReactNode): ReactNode {
  if (!leadingIcon) return undefined;
  return <InputAdornment position="start">{leadingIcon}</InputAdornment>;
}

function SelectInner<T = string | number>(
  props: SelectProps<T>,
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  const {
    value,
    onChange,
    options,
    variant = "outlined",
    size = "small",
    label,
    placeholder,
    leadingIcon,
    renderValue,
    minWidth = 160,
    disabled,
    error,
    helperText,
    children,
    className,
    sx,
    "data-testid": dataTestId,
    testId,
    ...rest
  } = props;

  const activeTestId = testId ?? dataTestId ?? "md3-select";

  const customRenderValue = (selected: unknown) => {
    if (renderValue) {
      return renderValue(selected as T);
    }
    return resolveSelectedDisplay(
      selected,
      options as SelectOption<unknown>[],
      placeholder,
    );
  };

  const slotProps = {
    input: {
      startAdornment: resolveLeadingAdornment(leadingIcon),
    },
    select: {
      renderValue: customRenderValue,
      MenuProps: MENU_PROPS,
    },
  };

  return (
    <StyledMD3SelectRoot
      ref={ref}
      select
      variant={variant}
      size={size}
      label={label}
      value={value}
      onChange={(e) => onChange(e.target.value as T)}
      disabled={disabled}
      error={error}
      helperText={helperText}
      className={className}
      sx={{ minWidth, ...sx }}
      data-testid={activeTestId}
      $hasLeadingIcon={Boolean(leadingIcon)}
      slotProps={slotProps}
      {...rest}
    >
      {renderSelectChildren(children, options as SelectOption<unknown>[])}
    </StyledMD3SelectRoot>
  );
}

export const Select = forwardRef(SelectInner) as <T = string | number>(
  props: SelectProps<T> & { ref?: React.Ref<HTMLDivElement> },
) => React.ReactElement | null;

(Select as { displayName?: string }).displayName = "Select";
export default Select;
