import React, { type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";

import Select from "~/components/atoms/Select/Select";
import { SearchField } from "~/components/atoms/TextField/TextField";
import NumberPicker from "~/components/atoms/NumberPicker/NumberPicker";
import RoleChip from "../RoleChip/RoleChip";
import InstitutionLogo from "../InstitutionLogo/InstitutionLogo";
import type { SchoolConfig, CohortConfig } from "~/types/institution";

export const FilterBarContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexWrap: "wrap",
  gap: theme.spacing(2),
  alignItems: "center",
  width: "100%",
  padding: theme.spacing(2),
  marginBottom: theme.spacing(3),
  borderRadius: "12px",
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
}));

export interface FilterBarProps {
  children?: ReactNode;

  query?: string;
  onQueryChange?: (q: string) => void;

  roleFilter?: string;
  onRoleFilterChange?: (role: string) => void;

  schoolFilter?: string;
  onSchoolFilterChange?: (schoolId: string) => void;
  schools?: SchoolConfig[];

  cohortFilter?: string;
  onCohortFilterChange?: (cohortId: string) => void;
  cohorts?: CohortConfig[];

  startYearMin?: number | null;
  onStartYearMinChange?: (year: number | null) => void;
  startYearMax?: number | null;
  onStartYearMaxChange?: (year: number | null) => void;

  testId?: string;
  "data-testid"?: string;
  className?: string;
}

function SchoolOptionItem({
  school,
  allLabel,
}: {
  school?: SchoolConfig;
  allLabel: string;
}) {
  if (!school) {
    return <Typography variant="body2">{allLabel}</Typography>;
  }

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      {school.logoUrl && (
        <InstitutionLogo
          logoUrl={school.logoUrl}
          name={school.name}
          height={18}
          maxWidth={80}
          fallback={null}
        />
      )}
      <Typography variant="body2">{school.name}</Typography>
    </Box>
  );
}

function RoleFilterField({
  roleFilter,
  onRoleFilterChange,
}: {
  roleFilter?: string;
  onRoleFilterChange?: (role: string) => void;
}) {
  const { t } = useTranslation(["common"]);
  if (roleFilter === undefined || !onRoleFilterChange) return null;

  return (
    <Select
      label={t("common:filterBar.role", "Role")}
      value={roleFilter}
      onChange={onRoleFilterChange}
      minWidth={170}
      testId="filter-role-select"
      options={[
        { value: "all", chip: <RoleChip userRole="all" size="small" /> },
        {
          value: "student",
          chip: <RoleChip userRole="student" size="small" />,
        },
        {
          value: "instructor",
          chip: <RoleChip userRole="instructor" size="small" />,
        },
        { value: "admin", chip: <RoleChip userRole="admin" size="small" /> },
      ]}
    />
  );
}

function SchoolFilterField({
  schoolFilter,
  onSchoolFilterChange,
  schools = [],
}: {
  schoolFilter?: string;
  onSchoolFilterChange?: (schoolId: string) => void;
  schools?: SchoolConfig[];
}) {
  const { t } = useTranslation(["common"]);
  if (schoolFilter === undefined || !onSchoolFilterChange) return null;

  const schoolOptions = [
    {
      value: "all",
      label: t("common:filterBar.allSchools", "All Schools"),
    },
    ...schools.map((school) => ({
      value: school.id,
      label: (
        <SchoolOptionItem
          school={school}
          allLabel={t("common:filterBar.allSchools", "All Schools")}
        />
      ),
    })),
  ];

  return (
    <Select
      label={t("common:filterBar.school", "School")}
      value={schoolFilter}
      onChange={onSchoolFilterChange}
      minWidth={200}
      testId="filter-school-select"
      renderValue={(selectedId) => {
        if (selectedId === "all") {
          return t("common:filterBar.allSchools", "All Schools");
        }
        const found = schools.find((s) => s.id === selectedId);
        return (
          <SchoolOptionItem
            school={found}
            allLabel={t("common:filterBar.allSchools", "All Schools")}
          />
        );
      }}
      options={schoolOptions}
    />
  );
}

function CohortFilterField({
  cohortFilter,
  onCohortFilterChange,
  cohorts = [],
  schoolFilter,
}: {
  cohortFilter?: string;
  onCohortFilterChange?: (cohortId: string) => void;
  cohorts?: CohortConfig[];
  schoolFilter?: string;
}) {
  const { t } = useTranslation(["common"]);
  if (cohortFilter === undefined || !onCohortFilterChange) return null;

  const cohortOptions = [
    {
      value: "all",
      label: t("common:filterBar.allCohorts", "All Cohorts"),
    },
    ...cohorts
      .filter(
        (c) =>
          schoolFilter === "all" ||
          !schoolFilter ||
          c.institutionId === schoolFilter,
      )
      .map((cohort) => ({
        value: cohort.id,
        label: cohort.name,
      })),
  ];

  return (
    <Select
      label={t("common:filterBar.cohort", "Cohort")}
      value={cohortFilter}
      onChange={onCohortFilterChange}
      minWidth={200}
      testId="filter-cohort-select"
      options={cohortOptions}
    />
  );
}

function YearRangeFilterField({
  startYearMin,
  startYearMax,
  onStartYearMinChange,
  onStartYearMaxChange,
}: {
  startYearMin?: number | null;
  startYearMax?: number | null;
  onStartYearMinChange?: (year: number | null) => void;
  onStartYearMaxChange?: (year: number | null) => void;
}) {
  if (!onStartYearMinChange || !onStartYearMaxChange) return null;

  return (
    <NumberPicker
      mode="range"
      startYearMin={startYearMin ?? null}
      startYearMax={startYearMax ?? null}
      onStartYearMinChange={onStartYearMinChange}
      onStartYearMaxChange={onStartYearMaxChange}
      testId="filter-year-range"
    />
  );
}

function SearchFilterField({
  query,
  onQueryChange,
}: {
  query?: string;
  onQueryChange?: (q: string) => void;
}) {
  const { t } = useTranslation(["common"]);
  if (query === undefined || !onQueryChange) return null;

  return (
    <SearchField
      value={query}
      onChange={(e) => onQueryChange(e.target.value)}
      placeholder={t("common:filterBar.searchPlaceholder", "Search users...")}
      sx={{ minWidth: 250 }}
      testId="filter-search-input"
    />
  );
}

function StudentFilterPreset(props: FilterBarProps) {
  return (
    <>
      <RoleFilterField
        roleFilter={props.roleFilter}
        onRoleFilterChange={props.onRoleFilterChange}
      />
      <SchoolFilterField
        schoolFilter={props.schoolFilter}
        onSchoolFilterChange={props.onSchoolFilterChange}
        schools={props.schools}
      />
      <CohortFilterField
        cohortFilter={props.cohortFilter}
        onCohortFilterChange={props.onCohortFilterChange}
        cohorts={props.cohorts}
        schoolFilter={props.schoolFilter}
      />
      <YearRangeFilterField
        startYearMin={props.startYearMin}
        startYearMax={props.startYearMax}
        onStartYearMinChange={props.onStartYearMinChange}
        onStartYearMaxChange={props.onStartYearMaxChange}
      />
      <Box sx={{ flexGrow: 1 }} />
      <SearchFilterField
        query={props.query}
        onQueryChange={props.onQueryChange}
      />
    </>
  );
}

export function FilterBar(props: FilterBarProps) {
  const { children, testId, "data-testid": dataTestId, className } = props;
  const activeTestId = testId || dataTestId || "generic-filter-bar";

  return (
    <FilterBarContainer className={className} data-testid={activeTestId}>
      {children ? children : <StudentFilterPreset {...props} />}
    </FilterBarContainer>
  );
}

// Attach subcomponents for compound usage
FilterBar.Container = FilterBarContainer;
FilterBar.Select = Select;
FilterBar.Search = SearchField;
FilterBar.Number = NumberPicker;

export default FilterBar;
