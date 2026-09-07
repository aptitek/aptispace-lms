import { forwardRef } from "react";
import Badge from "~/components/atoms/Badge/Badge";
import Box from "@mui/material/Box";
import type { CohortConfig } from "~/types/institution";
import {
  CardContainer,
  CohortDescription,
  CohortDates,
} from "./CohortCard.styles";

import Chip from "@mui/material/Chip";

import SegmentedChip from "~/components/molecules/SegmentedChip/SegmentedChip";
import {
  CohortCardSkeleton,
  type CohortCardSkeletonProps,
} from "./CohortCardSkeleton";

export { CohortCardSkeleton };
export type { CohortCardSkeletonProps };

export interface CohortCardProps {
  cohort: CohortConfig;
  studentCount?: number;
  isSelected?: boolean;
  isNested?: boolean;
  onClick?: (cohort: CohortConfig) => void;
}

function formatCohortDate(dateString?: string | Date): string {
  if (!dateString) return "";
  const d = new Date(dateString);
  return d.toLocaleDateString(undefined, {
    month: "short",
    year: "numeric",
  });
}

function resolveStartYear(dateString?: string | Date): number | null {
  if (!dateString) return null;
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return null;
  return d.getFullYear();
}

function resolveCohortDateRange(
  start?: string | Date | null,
  end?: string | Date | null,
) {
  const startDate = formatCohortDate(start ?? undefined);
  const endDate = formatCohortDate(end ?? undefined);
  if (startDate && endDate) {
    return `${startDate} - ${endDate}`;
  }
  return startDate || endDate || "No dates set";
}

function resolveBadgeContent(studentCount?: number) {
  const count = studentCount ?? 0;
  return {
    badgeContent: count > 0 ? count : undefined,
    invisible: count <= 0,
  };
}

function resolveCardA11y(isInteractive: boolean, isSelected?: boolean) {
  return {
    tabIndex: isInteractive ? 0 : undefined,
    role: isInteractive ? ("button" as const) : ("article" as const),
    ariaSelected: isInteractive ? Boolean(isSelected) : undefined,
    dataSelected: isSelected ? "true" : undefined,
  };
}

export const CohortCard = forwardRef<HTMLDivElement, CohortCardProps>(
  (props, ref) => {
    const { cohort, studentCount, isSelected, isNested, onClick } = props;
    const isInteractive = Boolean(onClick);

    const handleClick = () => {
      onClick?.(cohort);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (isInteractive && (event.key === "Enter" || event.key === " ")) {
        event.preventDefault();
        handleClick();
      }
    };

    const startYear = resolveStartYear(cohort.startDate);
    const dateRange = resolveCohortDateRange(cohort.startDate, cohort.endDate);
    const badge = resolveBadgeContent(studentCount);
    const a11y = resolveCardA11y(isInteractive, isSelected);

    return (
      <Badge
        badgeContent={badge.badgeContent}
        invisible={badge.invisible}
        color="secondary"
        max={9999}
        sx={{
          width: "100%",
          display: "block",
          "& .MuiBadge-badge": {
            right: 16,
            top: 16,
            fontWeight: 700,
          },
        }}
      >
        <CardContainer
          ref={ref}
          isInteractive={isInteractive}
          isSelected={isSelected}
          isNested={Boolean(isNested)}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          tabIndex={a11y.tabIndex}
          role={a11y.role}
          aria-selected={a11y.ariaSelected}
          data-selected={a11y.dataSelected}
          data-testid={`cohort-card-${cohort.id}`}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 1,
              mb: 0.5,
            }}
          >
            <SegmentedChip
              cohort={cohort}
              size="medium"
              data-testid={`cohort-card-chip-${cohort.id}`}
            />
            {startYear && (
              <Chip
                label={startYear}
                size="small"
                variant="outlined"
                color="primary"
                sx={{
                  fontWeight: 700,
                  borderRadius: "9999px",
                  height: 22,
                  fontSize: "0.75rem",
                  flexShrink: 0,
                }}
                data-testid={`cohort-start-year-chip-${cohort.id}`}
              />
            )}
          </Box>

          <CohortDescription>
            {cohort.description || "No description provided."}
          </CohortDescription>
          <CohortDates>{dateRange}</CohortDates>
        </CardContainer>
      </Badge>
    );
  },
);
CohortCard.displayName = "CohortCard";

export default CohortCard;
