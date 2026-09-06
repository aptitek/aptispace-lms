import type { ReactNode } from "react";
import type { SxProps, Theme } from "@mui/material/styles";
import type { SelectOption } from "~/components/atoms/Select/Select.types";
import type { NumberPickerProps } from "~/components/atoms/NumberPicker/NumberPicker.types";

export type FilterFieldType = "select" | "number" | "range" | "custom";

export interface FilterSelectOption<T = string | number> {
  value: T;
  label?: ReactNode;
  chip?: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
}

export interface FilterSelectFieldConfig<T = string | number> {
  type: "select";
  id: string;
  label?: string;
  value: T;
  onChange: (value: T) => void;
  options: FilterSelectOption<T>[];
  minWidth?: number | string;
  renderValue?: (value: T) => ReactNode;
  placeholder?: string;
  disabled?: boolean;
  testId?: string;
  "data-testid"?: string;
}

export interface FilterNumberFieldConfig {
  type: "number";
  id: string;
  label?: string;
  value: number | string;
  onChange: (value: number | string) => void;
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
  testId?: string;
  "data-testid"?: string;
}

export interface FilterRangeFieldConfig {
  type: "range";
  id: string;
  label?: string;
  startYearMin?: number | null;
  startYearMax?: number | null;
  onStartYearMinChange?: (year: number | null) => void;
  onStartYearMaxChange?: (year: number | null) => void;
  minValue?: number | null;
  maxValue?: number | null;
  onMinChange?: (value: number | null) => void;
  onMaxChange?: (value: number | null) => void;
  placeholderMin?: string;
  placeholderMax?: string;
  testId?: string;
  "data-testid"?: string;
}

export interface FilterCustomFieldConfig {
  type: "custom";
  id: string;
  render: () => ReactNode;
}

export type FilterFieldConfig =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | FilterSelectFieldConfig<any>
  | FilterNumberFieldConfig
  | FilterRangeFieldConfig
  | FilterCustomFieldConfig;

export interface FilterSearchConfig {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minWidth?: number | string;
  testId?: string;
  "data-testid"?: string;
}

export interface FilterSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minWidth?: number | string;
  testId?: string;
  "data-testid"?: string;
  className?: string;
  sx?: SxProps<Theme>;
}

export interface FilterSelectProps<T = string | number> {
  label?: string;
  value: T;
  onChange: (value: T) => void;
  options: SelectOption<T>[];
  minWidth?: number | string;
  renderValue?: (selected: T) => ReactNode;
  placeholder?: string;
  disabled?: boolean;
  testId?: string;
  "data-testid"?: string;
  className?: string;
  sx?: SxProps<Theme>;
}

export type FilterNumberProps = Omit<NumberPickerProps, "mode">;

export interface FilterRangeProps {
  startYearMin?: number | null;
  startYearMax?: number | null;
  onStartYearMinChange?: (year: number | null) => void;
  onStartYearMaxChange?: (year: number | null) => void;
  minValue?: number | null;
  maxValue?: number | null;
  onMinChange?: (value: number | null) => void;
  onMaxChange?: (value: number | null) => void;
  placeholderMin?: string;
  placeholderMax?: string;
  testId?: string;
  "data-testid"?: string;
  className?: string;
  sx?: SxProps<Theme>;
}

export interface FilterClearProps {
  onClear: () => void;
  label?: ReactNode;
  testId?: string;
  "data-testid"?: string;
  disabled?: boolean;
  className?: string;
  sx?: SxProps<Theme>;
}

export interface FilterProps {
  children?: ReactNode;

  /** Declarative fields definition */
  fields?: FilterFieldConfig[];

  /** Modular search configuration */
  search?: FilterSearchConfig;

  /** Clear/Reset handler */
  onClear?: () => void;

  /** Whether active filters are present to show clear button in declarative mode */
  isDirty?: boolean;
  hasActiveFilters?: boolean;

  /** Custom label for clear button */
  clearLabel?: ReactNode;

  /** Custom test ID */
  testId?: string;
  "data-testid"?: string;

  className?: string;
  sx?: SxProps<Theme>;
}
