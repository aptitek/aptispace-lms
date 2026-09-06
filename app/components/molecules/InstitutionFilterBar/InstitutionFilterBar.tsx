import React from "react";
import { useTranslation } from "react-i18next";
import Box from "@mui/material/Box";

import FilterBar from "~/components/molecules/FilterBar/FilterBar";
import Select from "~/components/atoms/Select/Select";
import NumberPicker from "~/components/atoms/NumberPicker/NumberPicker";
import { SearchField } from "~/components/atoms/TextField/TextField";
import InstitutionChip from "../InstitutionChip/InstitutionChip";

export interface InstitutionFilterBarProps {
  query: string;
  onQueryChange: (q: string) => void;
  typeFilter: string;
  onTypeFilterChange: (type: string) => void;
  startYearMin?: number | null;
  onStartYearMinChange?: (year: number | null) => void;
  startYearMax?: number | null;
  onStartYearMaxChange?: (year: number | null) => void;
  testId?: string;
}

export function InstitutionFilterBar({
  query,
  onQueryChange,
  typeFilter,
  onTypeFilterChange,
  startYearMin = null,
  onStartYearMinChange,
  startYearMax = null,
  onStartYearMaxChange,
  testId = "institution-filter-bar",
}: InstitutionFilterBarProps) {
  const { t } = useTranslation("common");

  return (
    <FilterBar testId={testId}>
      {/* Institution Type Filter using MD3 Select Atom with chips */}
      <Select
        label={t("filterBar.institutionType", "Institution Type")}
        value={typeFilter}
        onChange={onTypeFilterChange}
        minWidth={180}
        testId="institution-type-filter"
        renderValue={(selectedType) => (
          <InstitutionChip
            institutionType={String(selectedType)}
            size="small"
          />
        )}
        options={[
          {
            value: "all",
            chip: <InstitutionChip institutionType="all" size="small" />,
          },
          {
            value: "academic",
            chip: <InstitutionChip institutionType="school" size="small" />,
          },
          {
            value: "company",
            chip: <InstitutionChip institutionType="company" size="small" />,
          },
        ]}
      />

      {/* Start Year Range Filter using unified NumberPicker Atom */}
      {onStartYearMinChange && onStartYearMaxChange && (
        <NumberPicker
          mode="range"
          startYearMin={startYearMin}
          startYearMax={startYearMax}
          onStartYearMinChange={onStartYearMinChange}
          onStartYearMaxChange={onStartYearMaxChange}
          testId="institution-year-range"
        />
      )}

      <Box sx={{ flexGrow: 1 }} />

      {/* Search using MD3 SearchField Atom */}
      <SearchField
        placeholder={t(
          "filterBar.searchInstitutionsPlaceholder",
          "Search institutions (name, slug)...",
        )}
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        sx={{ minWidth: 260 }}
        testId="institution-search-input"
      />
    </FilterBar>
  );
}

export default InstitutionFilterBar;
