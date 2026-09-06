import React from "react";
import { useTranslation } from "react-i18next";
import Box from "@mui/material/Box";
import FilterListRoundedIcon from "@mui/icons-material/FilterListRounded";

import Select from "~/components/atoms/Select/Select";
import { SearchField } from "~/components/atoms/TextField/TextField";
import NumberPicker from "~/components/atoms/NumberPicker/NumberPicker";
import { FilterContainer, FilterClearButton } from "./Filter.styles";
import type {
  FilterProps,
  FilterSearchProps,
  FilterSelectProps,
  FilterNumberProps,
  FilterRangeProps,
  FilterClearProps,
  FilterFieldConfig,
  FilterSelectFieldConfig,
  FilterNumberFieldConfig,
  FilterRangeFieldConfig,
  FilterSearchConfig,
} from "./Filter.types";

/**
 * Modular Search field within Filter
 */
export function FilterSearch({
  value,
  onChange,
  placeholder,
  minWidth = 250,
  testId = "filter-search-input",
  "data-testid": dataTestId,
  className,
  sx,
}: FilterSearchProps) {
  const { t } = useTranslation(["common"]);
  const activeTestId = testId ?? dataTestId ?? "filter-search-input";
  const activePlaceholder =
    placeholder ?? t("common:filterBar.searchPlaceholder", "Search...");

  return (
    <SearchField
      value={value}
      onChange={(e) => {
        // Support both direct value or change event
        if (typeof e === "string") {
          onChange(e);
        } else if (e && "target" in e && typeof e.target.value === "string") {
          onChange(e.target.value);
        }
      }}
      placeholder={activePlaceholder}
      className={className}
      sx={{ minWidth, ...sx }}
      testId={activeTestId}
      data-testid={activeTestId}
    />
  );
}

/**
 * Modular Select field within Filter
 */
export function FilterSelect<T = string | number>({
  label,
  value,
  onChange,
  options,
  minWidth = 170,
  renderValue,
  placeholder,
  disabled,
  testId = "filter-select",
  "data-testid": dataTestId,
  className,
  sx,
}: FilterSelectProps<T>) {
  const activeTestId = testId ?? dataTestId ?? "filter-select";

  return (
    <Select
      label={label}
      value={value}
      onChange={onChange}
      options={options}
      minWidth={minWidth}
      renderValue={renderValue}
      placeholder={placeholder}
      disabled={disabled}
      className={className}
      sx={sx}
      testId={activeTestId}
      data-testid={activeTestId}
    />
  );
}

/**
 * Modular Number field (single mode) within Filter
 */
export function FilterNumber(props: FilterNumberProps) {
  const activeTestId = props.testId ?? props["data-testid"] ?? "filter-number";

  return (
    <NumberPicker
      mode="single"
      {...props}
      testId={activeTestId}
      data-testid={activeTestId}
    />
  );
}

/**
 * Modular Range field within Filter
 */
export function FilterRange({
  startYearMin,
  startYearMax,
  onStartYearMinChange,
  onStartYearMaxChange,
  minValue,
  maxValue,
  onMinChange,
  onMaxChange,
  placeholderMin,
  placeholderMax,
  testId = "filter-range",
  "data-testid": dataTestId,
  className,
  sx,
}: FilterRangeProps) {
  const activeTestId = testId ?? dataTestId ?? "filter-range";

  return (
    <NumberPicker
      mode="range"
      startYearMin={startYearMin}
      startYearMax={startYearMax}
      onStartYearMinChange={onStartYearMinChange}
      onStartYearMaxChange={onStartYearMaxChange}
      minValue={minValue}
      maxValue={maxValue}
      onMinChange={onMinChange}
      onMaxChange={onMaxChange}
      placeholderMin={placeholderMin}
      placeholderMax={placeholderMax}
      className={className}
      sx={sx}
      testId={activeTestId}
      data-testid={activeTestId}
    />
  );
}

/**
 * Modular Clear / Reset button within Filter
 */
export function FilterClear({
  onClear,
  label,
  testId = "filter-clear-button",
  "data-testid": dataTestId,
  disabled = false,
  className,
  sx,
}: FilterClearProps) {
  const { t } = useTranslation(["common"]);
  const activeTestId = testId ?? dataTestId ?? "filter-clear-button";
  const displayLabel = label ?? t("common:clearFilters", "Reset");

  return (
    <FilterClearButton
      size="small"
      variant="outlined"
      color="inherit"
      startIcon={<FilterListRoundedIcon fontSize="small" />}
      onClick={onClear}
      disabled={disabled}
      className={className}
      sx={sx}
      data-testid={activeTestId}
    >
      {displayLabel}
    </FilterClearButton>
  );
}

/**
 * Spacer component to push items (like search) to the right
 */
export function FilterSpacer() {
  return <Box sx={{ flexGrow: 1 }} data-testid="filter-spacer" />;
}

function resolveFieldTestId(field: {
  id: string;
  testId?: string;
  "data-testid"?: string;
}) {
  return field.testId || field["data-testid"] || `filter-${field.id}`;
}

function renderSelectField(field: FilterSelectFieldConfig) {
  return (
    <FilterSelect
      key={field.id}
      label={field.label}
      value={field.value}
      onChange={field.onChange}
      options={field.options}
      minWidth={field.minWidth}
      renderValue={field.renderValue}
      placeholder={field.placeholder}
      disabled={field.disabled}
      testId={resolveFieldTestId(field)}
    />
  );
}

function renderNumberField(field: FilterNumberFieldConfig) {
  return (
    <FilterNumber
      key={field.id}
      label={field.label}
      value={field.value}
      onChange={field.onChange}
      min={field.min}
      max={field.max}
      step={field.step}
      placeholder={field.placeholder}
      minWidth={field.minWidth}
      maxWidth={field.maxWidth}
      testId={resolveFieldTestId(field)}
    />
  );
}

function renderRangeField(field: FilterRangeFieldConfig) {
  return (
    <FilterRange
      key={field.id}
      startYearMin={field.startYearMin}
      startYearMax={field.startYearMax}
      onStartYearMinChange={field.onStartYearMinChange}
      onStartYearMaxChange={field.onStartYearMaxChange}
      minValue={field.minValue}
      maxValue={field.maxValue}
      onMinChange={field.onMinChange}
      onMaxChange={field.onMaxChange}
      placeholderMin={field.placeholderMin}
      placeholderMax={field.placeholderMax}
      testId={resolveFieldTestId(field)}
    />
  );
}

function renderField(field: FilterFieldConfig) {
  if (field.type === "select") return renderSelectField(field);
  if (field.type === "number") return renderNumberField(field);
  if (field.type === "range") return renderRangeField(field);
  return <React.Fragment key={field.id}>{field.render()}</React.Fragment>;
}

interface DeclarativeFilterContentProps {
  fields?: FilterFieldConfig[];
  search?: FilterSearchConfig;
  onClear?: () => void;
  isDirty?: boolean;
  hasActiveFilters?: boolean;
  clearLabel?: React.ReactNode;
  activeTestId: string;
}

function DeclarativeFilterContent({
  fields,
  search,
  onClear,
  isDirty,
  hasActiveFilters,
  clearLabel,
  activeTestId,
}: DeclarativeFilterContentProps) {
  const showClear = Boolean(onClear && (isDirty || hasActiveFilters));

  return (
    <>
      {fields?.map(renderField)}
      {showClear && onClear && (
        <FilterClear
          onClear={onClear}
          label={clearLabel}
          testId={`${activeTestId}-clear`}
        />
      )}
      {search && <FilterSpacer />}
      {search && (
        <FilterSearch
          value={search.value}
          onChange={search.onChange}
          placeholder={search.placeholder}
          minWidth={search.minWidth}
          testId={
            search.testId ?? search["data-testid"] ?? `${activeTestId}-search`
          }
        />
      )}
    </>
  );
}

/**
 * Generic Filter Molecule with modular fields and search.
 * Supports both compound component composition and declarative config array.
 */
export function Filter(props: FilterProps) {
  const {
    children,
    className,
    testId,
    "data-testid": dataTestId,
    sx,
    fields,
    search,
    onClear,
    isDirty,
    hasActiveFilters,
    clearLabel,
  } = props;
  const activeTestId = testId ?? dataTestId ?? "generic-filter";

  return (
    <FilterContainer className={className} sx={sx} data-testid={activeTestId}>
      {children || (
        <DeclarativeFilterContent
          fields={fields}
          search={search}
          onClear={onClear}
          isDirty={isDirty}
          hasActiveFilters={hasActiveFilters}
          clearLabel={clearLabel}
          activeTestId={activeTestId}
        />
      )}
    </FilterContainer>
  );
}

// Attach subcomponents for compound usage
Filter.Container = FilterContainer;
Filter.Search = FilterSearch;
Filter.Select = FilterSelect;
Filter.Number = FilterNumber;
Filter.Range = FilterRange;
Filter.Clear = FilterClear;
Filter.Reset = FilterClear;
Filter.Spacer = FilterSpacer;

export default Filter;
