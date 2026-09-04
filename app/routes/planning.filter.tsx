import React from "react";
import { alpha } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import { FilterBar } from "./planning.styles";
import type { ClassWithDetails } from "~/services/classService";

export interface PlanningFilterProps {
  selectedType: string;
  onSelectType: (type: string) => void;
  classes: ClassWithDetails[];
}

const FILTER_TYPES = ["all", "lecture", "lab", "workshop", "exam"] as const;

export function PlanningFilter({
  selectedType,
  onSelectType,
  classes,
}: PlanningFilterProps) {
  const { t } = useTranslation("common");

  return (
    <FilterBar>
      <Typography
        variant="caption"
        sx={{ fontWeight: 700, color: "text.secondary", px: 1 }}
      >
        {t("planning.filterLabel")}
      </Typography>
      {FILTER_TYPES.map((type) => {
        const isSelected = selectedType === type;
        const count =
          type === "all"
            ? classes.length
            : classes.filter((c) => c.type === type).length;
        const label = t(`planning.types.${type}`);

        return (
          <Button
            key={type}
            size="small"
            onClick={() => onSelectType(type)}
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
