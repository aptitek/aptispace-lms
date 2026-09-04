import React from "react";
import { alpha } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import { FilterBar } from "./planning.styles";
import type { ClassWithDetails } from "~/services/classService";

export type AttendanceFilter = "all" | "in_person" | "remote";

export interface PlanningFilterProps {
  selectedFilter: AttendanceFilter;
  onSelectFilter: (filter: AttendanceFilter) => void;
  classes: ClassWithDetails[];
}

const FILTERS: readonly AttendanceFilter[] = ["all", "in_person", "remote"];

export function PlanningFilter({
  selectedFilter,
  onSelectFilter,
  classes,
}: PlanningFilterProps) {
  const { t } = useTranslation("common");

  return (
    <FilterBar>
      <Typography
        variant="caption"
        sx={{ fontWeight: 700, color: "text.secondary", px: 1 }}
      >
        {t("planning.filterLabel", "Filter:")}
      </Typography>
      {FILTERS.map((f) => {
        const isSelected = selectedFilter === f;
        let count = classes.length;
        if (f === "in_person") {
          count = classes.filter((c) => !c.isRemote).length;
        } else if (f === "remote") {
          count = classes.filter((c) => c.isRemote).length;
        }

        const fallbackMap: Record<AttendanceFilter, string> = {
          all: "All",
          in_person: "In-Person",
          remote: "Remote",
        };

        const labelKey =
          f === "all" ? "all" : f === "in_person" ? "inPerson" : "remote";
        const label = t(`planning.filter.${labelKey}`, fallbackMap[f]);

        return (
          <Button
            key={f}
            size="small"
            onClick={() => onSelectFilter(f)}
            sx={{
              borderRadius: "12px",
              textTransform: "capitalize",
              fontWeight: isSelected ? 800 : 600,
              px: 1.75,
              py: 0.5,
              backgroundColor: isSelected
                ? (theme) => alpha(theme.palette.primary.main, 0.14)
                : "transparent",
              color: isSelected ? "primary.main" : "text.secondary",
              border: isSelected
                ? (theme) => `1px solid ${theme.palette.primary.main}`
                : "none",
              "&:hover": {
                backgroundColor: (theme) =>
                  alpha(theme.palette.primary.main, 0.08),
              },
            }}
          >
            {label} ({count})
          </Button>
        );
      })}
    </FilterBar>
  );
}
