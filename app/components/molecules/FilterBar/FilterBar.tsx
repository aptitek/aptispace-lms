import React from "react";
import { useTranslation } from "react-i18next";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import IconButton from "@mui/material/IconButton";
import RoleChip from "~/components/atoms/RoleChip/RoleChip";
import InstitutionLogo from "~/components/atoms/InstitutionLogo/InstitutionLogo";
import YearRangePicker from "~/components/molecules/YearRangePicker/YearRangePicker";
import type { SchoolConfig, CohortConfig } from "~/types/institution";

export interface FilterBarProps {
  query: string;
  onQueryChange: (q: string) => void;

  roleFilter: string;
  onRoleFilterChange: (role: string) => void;

  schoolFilter: string;
  onSchoolFilterChange: (schoolId: string) => void;
  schools: SchoolConfig[];

  cohortFilter: string;
  onCohortFilterChange: (cohortId: string) => void;
  cohorts: CohortConfig[];

  startYearMin?: number | null;
  onStartYearMinChange?: (year: number | null) => void;
  startYearMax?: number | null;
  onStartYearMaxChange?: (year: number | null) => void;
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

export function FilterBar({
  query,
  onQueryChange,
  roleFilter,
  onRoleFilterChange,
  schoolFilter,
  onSchoolFilterChange,
  schools,
  cohortFilter,
  onCohortFilterChange,
  cohorts,
  startYearMin = null,
  onStartYearMinChange,
  startYearMax = null,
  onStartYearMaxChange,
}: FilterBarProps) {
  const { t } = useTranslation(["common", "admin", "auth"]);

  const endAdornment = query ? (
    <InputAdornment position="end">
      <IconButton
        size="small"
        onClick={() => onQueryChange("")}
        aria-label={t("common:clearSearch", "Clear search")}
      >
        <ClearIcon sx={{ fontSize: 16 }} />
      </IconButton>
    </InputAdornment>
  ) : null;

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 2,
        alignItems: "center",
        width: "100%",
        p: 2,
        mb: 3,
        borderRadius: "12px",
        bgcolor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      <TextField
        select
        size="small"
        label={t("common:filterBar.role", "Role")}
        value={roleFilter}
        onChange={(e) => onRoleFilterChange(e.target.value)}
        slotProps={{
          select: {
            renderValue: (selectedRole) => (
              <RoleChip userRole={String(selectedRole)} size="small" />
            ),
          },
        }}
        sx={{ minWidth: 170 }}
      >
        <MenuItem value="all" sx={{ py: 0.75 }}>
          <RoleChip userRole="all" size="small" />
        </MenuItem>
        <MenuItem value="student" sx={{ py: 0.75 }}>
          <RoleChip userRole="student" size="small" />
        </MenuItem>
        <MenuItem value="instructor" sx={{ py: 0.75 }}>
          <RoleChip userRole="instructor" size="small" />
        </MenuItem>
        <MenuItem value="admin" sx={{ py: 0.75 }}>
          <RoleChip userRole="admin" size="small" />
        </MenuItem>
      </TextField>

      <TextField
        select
        size="small"
        label={t("common:filterBar.school", "School")}
        value={schoolFilter}
        onChange={(e) => onSchoolFilterChange(e.target.value)}
        slotProps={{
          select: {
            renderValue: (selectedId) => {
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
            },
          },
        }}
        sx={{ minWidth: 200 }}
      >
        <MenuItem value="all">
          {t("common:filterBar.allSchools", "All Schools")}
        </MenuItem>
        {schools.map((school) => (
          <MenuItem key={school.id} value={school.id}>
            <SchoolOptionItem
              school={school}
              allLabel={t("common:filterBar.allSchools", "All Schools")}
            />
          </MenuItem>
        ))}
      </TextField>

      <TextField
        select
        size="small"
        label={t("common:filterBar.cohort", "Cohort")}
        value={cohortFilter}
        onChange={(e) => onCohortFilterChange(e.target.value)}
        sx={{ minWidth: 200 }}
      >
        <MenuItem value="all">
          {t("common:filterBar.allCohorts", "All Cohorts")}
        </MenuItem>
        {cohorts
          .filter(
            (c) => schoolFilter === "all" || c.institutionId === schoolFilter,
          )
          .map((cohort) => (
            <MenuItem key={cohort.id} value={cohort.id}>
              {cohort.name}
            </MenuItem>
          ))}
      </TextField>

      {onStartYearMinChange && onStartYearMaxChange && (
        <YearRangePicker
          startYearMin={startYearMin}
          startYearMax={startYearMax}
          onStartYearMinChange={onStartYearMinChange}
          onStartYearMaxChange={onStartYearMaxChange}
        />
      )}

      <Box sx={{ flexGrow: 1 }} />

      <TextField
        size="small"
        placeholder={t("common:filterBar.searchPlaceholder", "Search users...")}
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        sx={{ minWidth: 250 }}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ fontSize: 18, color: "text.secondary" }} />
              </InputAdornment>
            ),
            endAdornment,
          },
        }}
      />
    </Box>
  );
}

export default FilterBar;
