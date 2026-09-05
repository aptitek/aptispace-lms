import { forwardRef } from "react";
import { useTranslation } from "react-i18next";
import Badge from "~/components/atoms/Badge/Badge";
import InstitutionLogo from "../InstitutionLogo/InstitutionLogo";
import InstitutionChip from "../InstitutionChip/InstitutionChip";
import SchoolIcon from "@mui/icons-material/School";
import Box from "@mui/material/Box";
import type { SchoolConfig } from "~/types/institution";
import Skeleton from "@mui/material/Skeleton";
import { GhostActionButton } from "~/components/atoms/GhostActionButton";
import {
  CardContainer,
  LogoContainer,
  SchoolName,
  SkeletonContainer,
  GhostFabOverlay,
} from "./SchoolCard.styles";

export interface SchoolCardProps {
  school: SchoolConfig;
  studentCount?: number;
  isSelected?: boolean;
  onClick?: (school: SchoolConfig) => void;
}

export const SchoolCard = forwardRef<HTMLDivElement, SchoolCardProps>(
  ({ school, studentCount = 0, isSelected, onClick }, ref) => {
    const isInteractive = Boolean(onClick);

    const handleClick = () => {
      if (onClick) onClick(school);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (isInteractive && (event.key === "Enter" || event.key === " ")) {
        event.preventDefault();
        handleClick();
      }
    };

    return (
      <Badge
        badgeContent={studentCount}
        color="primary"
        max={9999}
        sx={{
          width: "100%",
          display: "block",
          "& .MuiBadge-badge": {
            right: 20,
            top: 20,
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
          data-testid={`school-card-${school.id}`}
        >
          <LogoContainer>
            <InstitutionLogo
              logoUrl={school.logoUrl}
              name={school.name}
              height={40}
              maxWidth={140}
              testId={`school-card-logo-${school.id}`}
              fallback={
                <SchoolIcon
                  sx={{ fontSize: 40, color: "text.secondary", opacity: 0.5 }}
                />
              }
            />
          </LogoContainer>
          <SchoolName>{school.name}</SchoolName>
          <InstitutionChip
            institutionType={school.type || "academic"}
            size="small"
            variant="outlined"
            testId={`school-card-chip-${school.id}`}
          />
        </CardContainer>
      </Badge>
    );
  },
);
SchoolCard.displayName = "SchoolCard";

export function SchoolCardSkeleton({ onClick }: { onClick?: () => void }) {
  const { t } = useTranslation("common");
  const isInteractive = Boolean(onClick);
  const tooltipTitle = t("admin.addInstitution", "Add Institution");

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
      data-testid="school-card-skeleton"
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
          opacity: 0.35,
          width: "100%",
          pointerEvents: "none",
        }}
      >
        <LogoContainer>
          <Skeleton
            variant="rounded"
            width={100}
            height={40}
            sx={{ borderRadius: "8px" }}
          />
        </LogoContainer>
        <Skeleton
          variant="text"
          width="60%"
          height={22}
          sx={{ borderRadius: "4px" }}
        />
      </Box>

      {isInteractive && (
        <GhostFabOverlay>
          <GhostActionButton tooltip={tooltipTitle} testId="school-ghost-fab" />
        </GhostFabOverlay>
      )}
    </SkeletonContainer>
  );
}

export default SchoolCard;
