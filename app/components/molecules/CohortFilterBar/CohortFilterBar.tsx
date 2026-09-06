import React from "react";
import { useTranslation } from "react-i18next";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FilterListRoundedIcon from "@mui/icons-material/FilterListRounded";

import FilterBar from "~/components/molecules/FilterBar/FilterBar";
import Select from "~/components/atoms/Select/Select";
import NumberPicker from "~/components/atoms/NumberPicker/NumberPicker";
import { SearchField } from "~/components/atoms/TextField/TextField";
import {
  DIPLOMA_OPTIONS,
  COMMON_SPECIALTY_TAGS,
  getSpecialtySlug,
} from "~/utils/cohortFormat";

export interface CohortFilterBarProps {
  query: string;
  onQueryChange: (q: string) => void;
  diplomaFilter: string;
  onDiplomaFilterChange: (diploma: string) => void;
  yearFilter: string | number;
  onYearFilterChange: (year: string | number) => void;
  tagFilter: string;
  onTagFilterChange: (tag: string) => void;
  startYearMin?: number | null;
  onStartYearMinChange?: (year: number | null) => void;
  startYearMax?: number | null;
  onStartYearMaxChange?: (year: number | null) => void;
  availableTags?: string[];
  testId?: string;
}

interface ActiveFilterCriteria {
  query: string;
  diplomaFilter: string;
  yearFilter: string | number;
  tagFilter: string;
  startYearMin: number | null;
  startYearMax: number | null;
}

function checkHasActiveFilters(criteria: ActiveFilterCriteria): boolean {
  if (criteria.query.trim().length > 0) return true;
  if (criteria.diplomaFilter !== "all") return true;
  if (criteria.yearFilter !== "all" && criteria.yearFilter !== "") return true;
  if (criteria.tagFilter !== "all") return true;
  return criteria.startYearMin !== null || criteria.startYearMax !== null;
}

export function CohortFilterBar({
  query,
  onQueryChange,
  diplomaFilter,
  onDiplomaFilterChange,
  yearFilter,
  onYearFilterChange,
  tagFilter,
  onTagFilterChange,
  startYearMin = null,
  onStartYearMinChange,
  startYearMax = null,
  onStartYearMaxChange,
  availableTags,
  testId = "cohort-filter-bar",
}: CohortFilterBarProps) {
  const { t } = useTranslation("common");

  // Merge available tags from cohorts with standard common tags, removing duplicates
  const allTags = Array.from(
    new Set([...(availableTags || []), ...COMMON_SPECIALTY_TAGS]),
  );

  const hasActiveFilters = checkHasActiveFilters({
    query,
    diplomaFilter,
    yearFilter,
    tagFilter,
    startYearMin,
    startYearMax,
  });

  const handleClearFilters = () => {
    onQueryChange("");
    onDiplomaFilterChange("all");
    onYearFilterChange("all");
    onTagFilterChange("all");
    if (onStartYearMinChange) onStartYearMinChange(null);
    if (onStartYearMaxChange) onStartYearMaxChange(null);
  };

  return (
    <FilterBar testId={testId}>
      {/* Diploma Filter using MD3 Select Atom */}
      <Select
        label={t("diplomas.title", "Diploma")}
        value={diplomaFilter}
        onChange={onDiplomaFilterChange}
        minWidth={150}
        testId="cohort-diploma-filter"
        options={[
          {
            value: "all",
            label: <em>{t("diplomas.all", "All Diplomas")}</em>,
          },
          ...DIPLOMA_OPTIONS.map((opt) => ({
            value: opt.code,
            label: `${opt.code} – ${t(opt.labelKey, opt.defaultLabel)}`,
          })),
        ]}
      />

      {/* Year Filter using modular NumberPicker Atom */}
      <NumberPicker
        label={t("cohortYear.title", "Year")}
        placeholder={t("cohortYear.all", "All")}
        value={yearFilter}
        onChange={onYearFilterChange}
        min={0}
        max={20}
        testId="cohort-year-filter"
      />

      {/* Specialty Tag Filter using MD3 Select Atom */}
      <Select
        label={t("filterBar.tag", "Specialty")}
        value={tagFilter}
        onChange={onTagFilterChange}
        minWidth={160}
        testId="cohort-tag-filter"
        options={[
          {
            value: "all",
            label: <em>{t("filterBar.allTags", "All Specialties")}</em>,
          },
          ...allTags.map((tag) => ({
            value: tag,
            label: t(`cohortTags.${getSpecialtySlug(tag)}`, tag.toUpperCase()),
          })),
        ]}
      />

      {/* Start Year Range Picker using unified NumberPicker in Range mode */}
      {onStartYearMinChange && onStartYearMaxChange && (
        <NumberPicker
          mode="range"
          startYearMin={startYearMin}
          startYearMax={startYearMax}
          onStartYearMinChange={onStartYearMinChange}
          onStartYearMaxChange={onStartYearMaxChange}
          testId="cohort-year-range"
        />
      )}

      {/* Reset / Clear Filters Action */}
      {hasActiveFilters && (
        <Button
          size="small"
          variant="outlined"
          color="inherit"
          startIcon={<FilterListRoundedIcon fontSize="small" />}
          onClick={handleClearFilters}
          sx={{
            textTransform: "none",
            borderRadius: "8px",
            color: "text.secondary",
            borderColor: "divider",
            height: 38,
            px: 1.5,
          }}
          data-testid="cohort-clear-filters"
        >
          {t("common:clearFilters", "Reset")}
        </Button>
      )}

      <Box sx={{ flexGrow: 1 }} />

      {/* Search using MD3 SearchField Atom */}
      <SearchField
        placeholder={t(
          "filterBar.searchCohortsPlaceholder",
          "Search cohorts (name, tag, year)...",
        )}
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        sx={{ minWidth: 260 }}
        testId="cohort-search-input"
      />
    </FilterBar>
  );
}

export default CohortFilterBar;
