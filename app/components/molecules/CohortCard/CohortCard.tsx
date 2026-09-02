import { forwardRef } from "react";
import Badge from "~/components/atoms/Badge/Badge";
import AddIcon from "@mui/icons-material/Add";
import Box from "@mui/material/Box";
import type { CohortConfig } from "~/types/institution";
import {
  CardContainer,
  CohortName,
  CohortDescription,
  CohortDates,
  SkeletonContainer,
} from "./CohortCard.styles";

export interface CohortCardProps {
  cohort: CohortConfig;
  studentCount?: number;
  isSelected?: boolean;
  onClick?: (cohort: CohortConfig) => void;
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

    const formatDate = (dateString?: string | Date) => {
      if (!dateString) return "";
      const d = new Date(dateString);
      return d.toLocaleDateString(undefined, {
        month: "short",
        year: "numeric",
      });
    };

    const startDate = formatDate(cohort.startDate);
    const endDate = formatDate(cohort.endDate);
    const dateRange =
      startDate && endDate
        ? `${startDate} - ${endDate}`
        : startDate || endDate || "No dates set";

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
          data-testid={`cohort-card-${cohort.id}`}
        >
          <CohortName>{cohort.name}</CohortName>
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
  const isInteractive = Boolean(onClick);

  return (
    <SkeletonContainer
      isInteractive={isInteractive}
      onClick={onClick}
      role={isInteractive ? "button" : "presentation"}
      tabIndex={isInteractive ? 0 : undefined}
      data-testid="cohort-card-skeleton"
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 1,
          opacity: 0.5,
        }}
      >
        <AddIcon sx={{ fontSize: 32 }} />
        <CohortName sx={{ fontSize: "0.9rem" }}>Add Cohort</CohortName>
      </Box>
    </SkeletonContainer>
  );
}

export default CohortCard;
