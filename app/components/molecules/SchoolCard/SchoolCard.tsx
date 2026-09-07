import { forwardRef } from "react";
import Badge from "~/components/atoms/Badge/Badge";
import InstitutionLogo from "../InstitutionLogo/InstitutionLogo";
import Chip from "~/components/atoms/Chip/Chip";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import type { SchoolConfig } from "~/types/institution";
import { CardContainer, LogoContainer, SchoolName } from "./SchoolCard.styles";
import {
  SchoolCardSkeleton,
  type SchoolCardSkeletonProps,
} from "./SchoolCardSkeleton";

export { SchoolCardSkeleton };
export type { SchoolCardSkeletonProps };

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
        badgeContent={studentCount > 0 ? studentCount : undefined}
        invisible={!studentCount || studentCount <= 0}
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
                <SchoolRoundedIcon
                  sx={{ fontSize: 40, color: "text.secondary", opacity: 0.5 }}
                />
              }
            />
          </LogoContainer>
          <SchoolName>{school.name}</SchoolName>
          <Chip
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

export default SchoolCard;
