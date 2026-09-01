import React from "react";
import { useTranslation } from "react-i18next";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import IconButton from "@mui/material/IconButton";
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
}: FilterBarProps) {
  const { t } = useTranslation(["common", "admin"]);

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
        label="Role"
        value={roleFilter}
        onChange={(e) => onRoleFilterChange(e.target.value)}
        sx={{ minWidth: 150 }}
      >
        <MenuItem value="all">All Roles</MenuItem>
        <MenuItem value="student">Students</MenuItem>
        <MenuItem value="instructor">Instructors</MenuItem>
        <MenuItem value="admin">Admins</MenuItem>
      </TextField>

      <TextField
        select
        size="small"
        label="School"
        value={schoolFilter}
        onChange={(e) => onSchoolFilterChange(e.target.value)}
        sx={{ minWidth: 200 }}
      >
        <MenuItem value="all">All Schools</MenuItem>
        {schools.map((school) => (
          <MenuItem key={school.id} value={school.id}>
            {school.name}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        select
        size="small"
        label="Cohort"
        value={cohortFilter}
        onChange={(e) => onCohortFilterChange(e.target.value)}
        sx={{ minWidth: 200 }}
      >
        <MenuItem value="all">All Cohorts</MenuItem>
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

      <Box sx={{ flexGrow: 1 }} />

      <TextField
        size="small"
        placeholder="Search users..."
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
