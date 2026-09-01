import { forwardRef } from "react";
import { useTranslation } from "react-i18next";
import Box from "@mui/material/Box";
import { alpha } from "@mui/material/styles";
import Chip from "@mui/material/Chip";
import LoginIcon from "@mui/icons-material/Login";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import Avatar from "../../atoms/Avatar/Avatar";
import RoleBadge from "../../atoms/RoleBadge/RoleBadge";
import GithubHandle from "../../atoms/GithubHandle/GithubHandle";
import Tooltip from "../../atoms/Tooltip/Tooltip";
import { HoldButton } from "../../atoms/HoldButton";
import type { EntityCardProps, EntityCardData } from "./EntityCard.types";
import type { SchoolConfig, CohortConfig } from "~/types/institution";
import { loginAsAccount, type UserRole } from "~/utils/auth";
import {
  StyledCard,
  StyledCardContent,
  CardHeaderRow,
  InstitutionBadge,
  InstitutionLogo,
  InstitutionName,
  HeaderBadges,
  CardBodyRow,
  AvatarContainer,
  FloatingBadge,
  StudentDetails,
  StudentNameBlock,
  StudentFirstName,
  StudentFamilyName,
  StudentEmail,
  CardFooterRow,
  ImpersonateIconButton,
} from "./EntityCard.styles";

function resolveDisplayName(entity: EntityCardData): string {
  if (entity.displayName) return entity.displayName;
  const fullName = `${entity.firstName} ${entity.familyName}`.trim();
  return fullName || "User";
}

function resolveCohortLabel(
  entity: EntityCardData,
  cohort?: CohortConfig,
): string {
  if (cohort?.name) return cohort.name;
  if (entity.cohortName) return entity.cohortName;
  return "Cohort 2026";
}

function parseDateYear(dateInput?: string | Date | null): string | null {
  if (!dateInput) return null;
  const d = new Date(dateInput);
  const yr = d.getFullYear();
  return isNaN(yr) ? null : String(yr);
}

function resolveCohortYear(
  entity: EntityCardData,
  cohort?: CohortConfig,
): string {
  if (cohort?.startYear) return String(cohort.startYear);
  const cohortDateYear = parseDateYear(cohort?.startDate);
  if (cohortDateYear) return cohortDateYear;

  if (entity.cohortStartYear) return String(entity.cohortStartYear);
  const studentDateYear = parseDateYear(entity.cohortStartDate);
  if (studentDateYear) return studentDateYear;

  const match = entity.cohortName?.match(/\b(20\d{2})\b/);
  return match ? match[1] : "2026";
}

function resolveInstitutionLabel(
  entity: EntityCardData,
  school?: SchoolConfig,
): string {
  if (school?.name) return school.name;
  if (entity.institutionName) return entity.institutionName;
  return "Aptitek";
}

const DEFAULT_SCHOOL: SchoolConfig = {
  id: "default-school",
  name: "Aptitek",
  logoUrl: "/aptitek-logo.svg",
};

interface InstitutionBrandProps {
  school: SchoolConfig;
  label: string;
}

function InstitutionBrand({ school, label }: InstitutionBrandProps) {
  if (school.logoUrl) {
    return (
      <InstitutionLogo
        src={school.logoUrl}
        alt={label}
        data-testid="compact-institution-logo"
      />
    );
  }
  return (
    <InstitutionName data-testid="compact-institution-name">
      {label}
    </InstitutionName>
  );
}

interface CompactHeaderRowProps {
  school: SchoolConfig;
  institutionLabel: string;
  cohortLabel: string;
  cohortYear: string;
  isProfileComplete?: boolean;
}

function CompactHeaderSlot({
  school,
  institutionLabel,
  cohortLabel,
  cohortYear,
  isProfileComplete,
}: CompactHeaderRowProps) {
  const { t } = useTranslation(["auth", "common"]);

  return (
    <CardHeaderRow>
      <InstitutionBadge data-testid="compact-institution">
        <InstitutionBrand school={school} label={institutionLabel} />
      </InstitutionBadge>

      <HeaderBadges>
        <Chip
          label={cohortLabel}
          size="small"
          color="primary"
          variant="outlined"
          sx={{
            height: 20,
            fontSize: "0.65rem",
            fontWeight: 700,
            "& .MuiChip-label": { px: 0.75 },
          }}
          data-testid="compact-cohort-chip"
        />
        <Chip
          label={cohortYear}
          size="small"
          color="secondary"
          variant="filled"
          sx={{
            height: 20,
            fontSize: "0.65rem",
            fontWeight: 800,
            "& .MuiChip-label": { px: 0.75 },
          }}
          data-testid="compact-year-chip"
        />
        {isProfileComplete === false && (
          <Chip
            label={t("auth:pending", "Pending")}
            size="small"
            color="warning"
            variant="filled"
            sx={{
              height: 20,
              fontSize: "0.625rem",
              fontWeight: 800,
              "& .MuiChip-label": { px: 0.6 },
            }}
            data-testid="compact-pending-chip"
          />
        )}
      </HeaderBadges>
    </CardHeaderRow>
  );
}

interface CompactAvatarSlotProps {
  entity: EntityCardData;
  displayName: string;
  role: UserRole;
}

function CompactAvatarSlot({
  entity,
  displayName,
  role,
}: CompactAvatarSlotProps) {
  return (
    <AvatarContainer data-testid="compact-avatar-container">
      <Avatar
        name={displayName}
        src={entity.avatarUrl}
        width={77}
        height={99}
        shape="biometric"
        isPortrait={true}
        testId="compact-avatar"
      />
      <FloatingBadge data-testid="compact-role-badge">
        <RoleBadge role={role} size="small" variant="icon-only" />
      </FloatingBadge>
    </AvatarContainer>
  );
}

interface CompactDetailsProps {
  entity: EntityCardData;
  displayName: string;
  showImpersonate?: boolean;
  onImpersonate?: (entity: EntityCardData) => void;
  showDelete?: boolean;
  onDelete?: (entity: EntityCardData) => void;
}

function CompactStudentDetailsSlot({
  entity,
  displayName,
  showImpersonate = true,
  onImpersonate,
  showDelete = true,
  onDelete,
}: CompactDetailsProps) {
  const { t } = useTranslation(["auth", "common"]);
  const firstName = entity.firstName;
  const familyName = (entity.familyName ?? "").toUpperCase();
  const emailText =
    entity.email || t("auth:noInstitutionalEmail", "No institutional email");
  const impersonateLabel = t("auth:impersonateUser", {
    name: displayName,
    defaultValue: `Impersonate ${displayName}`,
  });
  const deleteLabel = t("common:deleteUser", {
    name: displayName,
    defaultValue: `Hold to delete ${displayName}`,
  });

  const handleImpersonateClick = async (event: React.MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();
    if (onImpersonate) {
      onImpersonate(entity);
    } else {
      try {
        await loginAsAccount({
          id: entity.id,
          name: displayName,
          email: entity.email,
          role: entity.role ?? "student",
        });
        if (typeof window !== "undefined") {
          window.location.href = "/";
        }
      } catch {
        // Handled
      }
    }
  };

  const shouldRenderDelete = Boolean(showDelete && onDelete);

  return (
    <StudentDetails>
      <StudentNameBlock data-testid="compact-student-name">
        <StudentFirstName data-testid="compact-first-name">
          {firstName}
        </StudentFirstName>
        <StudentFamilyName data-testid="compact-family-name">
          {familyName}
        </StudentFamilyName>
      </StudentNameBlock>

      <StudentEmail data-testid="compact-student-email">
        {emailText}
      </StudentEmail>

      <CardFooterRow>
        <GithubHandle
          username={entity.githubUsername}
          size="small"
          testId="compact-github-handle"
        />

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.75,
            flexShrink: 0,
          }}
        >
          {showImpersonate && (
            <Tooltip title={impersonateLabel} arrow placement="top">
              <ImpersonateIconButton
                size="small"
                onClick={handleImpersonateClick}
                aria-label={impersonateLabel}
                data-testid="compact-impersonate-btn"
              >
                <LoginIcon sx={{ fontSize: 14 }} />
              </ImpersonateIconButton>
            </Tooltip>
          )}

          {shouldRenderDelete && (
            <Tooltip title={deleteLabel} arrow placement="top">
              <Box
                component="span"
                onClick={(e: React.MouseEvent) => e.stopPropagation()}
                onPointerDown={(e: React.PointerEvent) => e.stopPropagation()}
                sx={{
                  display: "inline-flex",
                  width: "24px",
                  height: "24px",
                  flexShrink: 0,
                }}
              >
                <HoldButton
                  color="error"
                  size="small"
                  holdTime={1000}
                  borderThickness={1.5}
                  outlineGap={2}
                  onHoldComplete={() => onDelete?.(entity)}
                  aria-label={deleteLabel}
                  data-testid="compact-delete-btn"
                  wrapperSx={{
                    width: "24px",
                    height: "24px",
                    minWidth: "24px",
                    maxWidth: "24px",
                    minHeight: "24px",
                    maxHeight: "24px",
                    flexShrink: 0,
                    display: "inline-flex",
                  }}
                  sx={{
                    width: "24px",
                    height: "24px",
                    minWidth: "24px",
                    maxWidth: "24px",
                    minHeight: "24px",
                    maxHeight: "24px",
                    p: 0,
                    padding: "3px",
                    borderRadius: "6px",
                    boxSizing: "border-box",
                    color: "error.main",
                    backgroundColor: (theme) =>
                      alpha(theme.palette.error.main, 0.1),
                    border: (theme) =>
                      `1px solid ${alpha(theme.palette.error.main, 0.3)}`,
                    transition: (theme) =>
                      theme.transitions.create(
                        [
                          "background-color",
                          "border-color",
                          "transform",
                          "color",
                        ],
                        { duration: theme.transitions.duration.shorter },
                      ),
                    "&:hover": {
                      backgroundColor: (theme) =>
                        alpha(theme.palette.error.main, 0.2),
                      borderColor: "error.main",
                      color: "error.main",
                      transform: "scale(1.08)",
                    },
                    "& .MuiSvgIcon-root": {
                      fontSize: "14px",
                    },
                  }}
                >
                  <DeleteOutlineRoundedIcon sx={{ fontSize: 14 }} />
                </HoldButton>
              </Box>
            </Tooltip>
          )}
        </Box>
      </CardFooterRow>
    </StudentDetails>
  );
}

function useCardInteractivity(
  interactive: boolean,
  onClick: ((entity: EntityCardData) => void) | undefined,
  entity: EntityCardData,
) {
  const isInteractive = Boolean(interactive && onClick);
  const handleClick = () => {
    if (isInteractive && onClick) {
      onClick(entity);
    }
  };
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const isActivationKey = event.key === "Enter" || event.key === " ";
    if (isInteractive && isActivationKey) {
      event.preventDefault();
      onClick?.(entity);
    }
  };
  return { isInteractive, handleClick, handleKeyDown };
}

export const EntityCard = forwardRef<HTMLDivElement, EntityCardProps>(
  (props, ref) => {
    const {
      entity,
      school = DEFAULT_SCHOOL,
      cohort,
      variant = "elevation",
      onClick,
      onImpersonate,
      showImpersonate = true,
      onDelete,
      showDelete = true,
      interactive = true,
      className,
      testId = "entity-card",
      style,
    } = props;

    const { isInteractive, handleClick, handleKeyDown } = useCardInteractivity(
      interactive,
      onClick,
      entity,
    );
    const role: UserRole = entity.role ?? "student";
    const displayName = resolveDisplayName(entity);
    const cohortLabel = resolveCohortLabel(entity, cohort);
    const cohortYear = resolveCohortYear(entity, cohort);
    const institutionLabel = resolveInstitutionLabel(entity, school);

    return (
      <StyledCard
        ref={ref}
        variant={variant}
        isInteractive={isInteractive}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        tabIndex={isInteractive ? 0 : undefined}
        role={isInteractive ? "button" : "article"}
        aria-label={`User card for ${displayName}`}
        className={className}
        style={style}
        data-testid={testId}
        data-student-id={entity.id}
      >
        <StyledCardContent>
          <CompactHeaderSlot
            school={school}
            institutionLabel={institutionLabel}
            cohortLabel={cohortLabel}
            cohortYear={cohortYear}
            isProfileComplete={entity.isProfileComplete}
          />

          <CardBodyRow>
            <CompactAvatarSlot
              entity={entity}
              displayName={displayName}
              role={role}
            />

            <CompactStudentDetailsSlot
              entity={entity}
              displayName={displayName}
              showImpersonate={showImpersonate}
              onImpersonate={onImpersonate}
              showDelete={showDelete}
              onDelete={onDelete}
            />
          </CardBodyRow>
        </StyledCardContent>
      </StyledCard>
    );
  },
);

EntityCard.displayName = "EntityCard";

export default EntityCard;
