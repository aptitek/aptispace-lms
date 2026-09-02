import { forwardRef } from "react";
import { useTranslation } from "react-i18next";
import Badge from "~/components/atoms/Badge/Badge";
import InstitutionLogo from "~/components/atoms/InstitutionLogo/InstitutionLogo";
import SchoolIcon from "@mui/icons-material/School";
import AddIcon from "@mui/icons-material/Add";
import Box from "@mui/material/Box";
import type { SchoolConfig } from "~/types/institution";
import {
  CardContainer,
  LogoContainer,
  SchoolName,
  SkeletonContainer,
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
        </CardContainer>
      </Badge>
    );
  },
);
SchoolCard.displayName = "SchoolCard";

export function SchoolCardSkeleton({ onClick }: { onClick?: () => void }) {
  const { t } = useTranslation("common");
  const isInteractive = Boolean(onClick);

  return (
    <SkeletonContainer
      isInteractive={isInteractive}
      onClick={onClick}
      role={isInteractive ? "button" : "presentation"}
      tabIndex={isInteractive ? 0 : undefined}
      data-testid="school-card-skeleton"
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
        <SchoolName sx={{ fontSize: "0.9rem" }}>
          {t("admin.addInstitution", "Add Institution")}
        </SchoolName>
      </Box>
    </SkeletonContainer>
  );
}

export default SchoolCard;
