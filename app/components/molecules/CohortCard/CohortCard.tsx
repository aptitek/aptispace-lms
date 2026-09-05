import { forwardRef } from "react";
import { useTranslation } from "react-i18next";
import Badge from "~/components/atoms/Badge/Badge";
import Box from "@mui/material/Box";
import type { CohortConfig } from "~/types/institution";
import Skeleton from "@mui/material/Skeleton";
import { GhostActionButton } from "~/components/atoms/GhostActionButton";
import {
  CardContainer,
  CohortDescription,
  CohortDates,
  SkeletonContainer,
  GhostFabOverlay,
} from "./CohortCard.styles";

import Chip from "@mui/material/Chip";

import CohortChip from "~/components/molecules/CohortChip/CohortChip";

export interface CohortCardProps {
  cohort: CohortConfig;
  studentCount?: number;
  isSelected?: boolean;
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
  start?: string | Date,
  end?: string | Date,
): string {
  const startDate = formatCohortDate(start);
  const endDate = formatCohortDate(end);
  if (startDate && endDate) {
    return `${startDate} - ${endDate}`;
  }
  return startDate || endDate || "No dates set";
}

export const CohortCard = forwardRef<HTMLDivElement, CohortCardProps>(
  ({ cohort, studentCount = 0, isSelected, onClick }, ref) => {
    const isInteractive = Boolean(onClick);

    const handleClick = () => {
      if (onClick) onClick(cohort);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (isInteractive && (event.key === "Enter" || event.key === " ")) {
        event.preventDefault();
        handleClick();
      }
    };

    const startYear = resolveStartYear(cohort.startDate);
    const dateRange = resolveCohortDateRange(cohort.startDate, cohort.endDate);

    return (
      <Badge
        badgeContent={studentCount}
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
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          tabIndex={isInteractive ? 0 : undefined}
          role={isInteractive ? "button" : "article"}
          aria-selected={isInteractive ? Boolean(isSelected) : undefined}
          data-selected={isSelected ? "true" : undefined}
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
            <CohortChip
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
                  borderRadius: 1.5,
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

export function CohortCardSkeleton({ onClick }: { onClick?: () => void }) {
  const { t } = useTranslation("common");
  const isInteractive = Boolean(onClick);
  const tooltipTitle = t("admin.addCohort", "Add Cohort");

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (isInteractive && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      onClick?.();
    }
  };

  return (
    <SkeletonContainer
      isInteractive={isInteractive}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role={isInteractive ? "button" : "presentation"}
      tabIndex={isInteractive ? 0 : undefined}
      aria-label={isInteractive ? tooltipTitle : undefined}
      data-testid="cohort-card-skeleton"
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1,
          opacity: 0.35,
          width: "100%",
          pointerEvents: "none",
        }}
      >
        <Skeleton
          variant="text"
          width="50%"
          height={24}
          sx={{ borderRadius: "4px" }}
        />
        <Skeleton
          variant="text"
          width="85%"
          height={16}
          sx={{ borderRadius: "3px" }}
        />
        <Skeleton
          variant="text"
          width="60%"
          height={16}
          sx={{ borderRadius: "3px" }}
        />
        <Skeleton
          variant="text"
          width="40%"
          height={14}
          sx={{ mt: 1, borderRadius: "3px" }}
        />
      </Box>

      {isInteractive && (
        <GhostFabOverlay>
          <GhostActionButton tooltip={tooltipTitle} testId="cohort-ghost-fab" />
        </GhostFabOverlay>
      )}
    </SkeletonContainer>
  );
}

export default CohortCard;
