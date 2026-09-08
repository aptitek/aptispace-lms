import { forwardRef } from "react";
import Badge from "~/components/atoms/Badge/Badge";
import InstitutionLogo from "../InstitutionLogo/InstitutionLogo";
import Chip from "~/components/atoms/Chip/Chip";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import type { SchoolConfig } from "~/types/institution";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import { useTranslation } from "react-i18next";
import { HoldButton } from "~/components/atoms/HoldButton";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import {
  CardContainer,
  LogoContainer,
  InstitutionName,
  DeleteHoldWrapper,
  deleteHoldButtonSx,
} from "./InstitutionCard.styles";
import {
  InstitutionCardSkeleton,
  type InstitutionCardSkeletonProps,
} from "./InstitutionCardSkeleton";

export { InstitutionCardSkeleton };
export type { InstitutionCardSkeletonProps };

export interface InstitutionCardProps {
  school: SchoolConfig;
  studentCount?: number;
  isSelected?: boolean;
  isNested?: boolean;
  onClick?: (school: SchoolConfig) => void;
  onDelete?: (school: SchoolConfig) => void;
}

export const InstitutionCard = forwardRef<HTMLDivElement, InstitutionCardProps>(
  (
    {
      school,
      studentCount = 0,
      isSelected,
      isNested = false,
      onClick,
      onDelete,
    },
    ref,
  ) => {
    const { t } = useTranslation("common");
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

    const deleteLabel = t("common:deleteSchool", {
      name: school.name,
      defaultValue: `Hold to delete ${school.name}`,
    });

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
          isNested={isNested}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          tabIndex={isInteractive ? 0 : undefined}
          role={isInteractive ? "button" : "article"}
          data-testid={`institution-card-${school.id}`}
        >
          <LogoContainer>
            <InstitutionLogo
              logoUrl={school.logoUrl}
              name={school.name}
              height={36}
              maxWidth={120}
              testId={`institution-card-logo-${school.id}`}
              fallback={
                <SchoolRoundedIcon
                  sx={{ fontSize: 36, color: "text.secondary", opacity: 0.5 }}
                />
              }
            />
          </LogoContainer>
          <InstitutionName>{school.name}</InstitutionName>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: onDelete ? "space-between" : "center",
              width: "100%",
              mt: 0.5,
            }}
          >
            <Chip
              institutionType={school.type || "academic"}
              size="small"
              variant="outlined"
              testId={`institution-card-chip-${school.id}`}
            />

            {onDelete && (
              <Tooltip title={deleteLabel} arrow placement="top">
                <DeleteHoldWrapper
                  onClick={(e: React.MouseEvent) => e.stopPropagation()}
                  onPointerDown={(e: React.PointerEvent) => e.stopPropagation()}
                >
                  <HoldButton
                    color="error"
                    size="small"
                    holdTime={1000}
                    borderThickness={1.5}
                    outlineGap={2}
                    onHoldComplete={() => onDelete(school)}
                    aria-label={deleteLabel}
                    data-testid={`institution-delete-btn-${school.id}`}
                    wrapperSx={{
                      width: 22,
                      height: 22,
                      minWidth: 22,
                      maxWidth: 22,
                      minHeight: 22,
                      maxHeight: 22,
                      flexShrink: 0,
                      display: "inline-flex",
                    }}
                    sx={deleteHoldButtonSx}
                  >
                    <DeleteOutlineRoundedIcon sx={{ fontSize: 13 }} />
                  </HoldButton>
                </DeleteHoldWrapper>
              </Tooltip>
            )}
          </Box>
        </CardContainer>
      </Badge>
    );
  },
);
InstitutionCard.displayName = "InstitutionCard";

export default InstitutionCard;
