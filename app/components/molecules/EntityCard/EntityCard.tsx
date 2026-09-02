import React, { forwardRef } from "react";
import { useTranslation } from "react-i18next";
import Box from "@mui/material/Box";
import LoginIcon from "@mui/icons-material/Login";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import GitHubIcon from "@mui/icons-material/GitHub";
import AdminPanelSettingsRoundedIcon from "@mui/icons-material/AdminPanelSettingsRounded";
import SupervisorAccountRoundedIcon from "@mui/icons-material/SupervisorAccountRounded";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import Avatar from "../../atoms/Avatar/Avatar";
import Chip from "../../atoms/Chip/Chip";
import Badge from "../../atoms/Badge/Badge";
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
  DeleteHoldWrapper,
  deleteHoldButtonSx,
} from "./EntityCard.styles";

function formatGithubHandle(username?: string | null): string {
  if (!username) return "@cadet";
  const trimmed = username.trim();
  if (!trimmed) return "@cadet";
  return trimmed.startsWith("@") ? trimmed : `@${trimmed}`;
}

function getRoleBadgeConfig(role?: UserRole | string) {
  const norm = (role || "").toLowerCase().trim();
  switch (norm) {
    case "admin":
    case "administrator":
      return {
        shape: "9-sided-cookie" as const,
        color: "secondary" as const,
        icon: <AdminPanelSettingsRoundedIcon data-testid="role-icon-admin" />,
        label: "Admin",
      };
    case "instructor":
    case "teacher":
    case "editingteacher":
    case "faculty":
      return {
        shape: "ghost-ish" as const,
        color: "info" as const,
        icon: (
          <SupervisorAccountRoundedIcon data-testid="role-icon-instructor" />
        ),
        label: "Instructor",
      };
    case "student":
    default:
      return {
        shape: "pill" as const,
        color: "success" as const,
        icon: <SchoolRoundedIcon data-testid="role-icon-student" />,
        label: "Student",
      };
  }
}

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

function CompactHeaderSlot({
  school,
  institutionLabel,
  cohortLabel,
  cohortYear,
  isProfileComplete,
}: {
  school: SchoolConfig;
  institutionLabel: string;
  cohortLabel: string;
  cohortYear: string;
  isProfileComplete?: boolean;
}) {
  const { t } = useTranslation(["auth", "common"]);

  return (
    <CardHeaderRow>
      <InstitutionBadge data-testid="compact-institution">
        {school.logoUrl ? (
          <InstitutionLogo
            src={school.logoUrl}
            alt={institutionLabel}
            data-testid="compact-institution-logo"
          />
        ) : (
          <InstitutionName data-testid="compact-institution-name">
            {institutionLabel}
          </InstitutionName>
        )}
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

function CompactAvatarSlot({
  entity,
  displayName,
  role,
}: {
  entity: EntityCardData;
  displayName: string;
  role: UserRole;
}) {
  const { t } = useTranslation(["auth", "common"]);
  const roleConfig = getRoleBadgeConfig(role);
  const roleLabel = t(
    `auth:devTool.roles.${roleConfig.label.toLowerCase()}`,
    roleConfig.label,
  );

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
      <Tooltip title={roleLabel} arrow placement="top">
        <FloatingBadge data-testid="compact-role-badge">
          <Badge
            shape={roleConfig.shape}
            color={roleConfig.color}
            icon={roleConfig.icon}
            size="small"
            standalone
            testId="compact-role-badge-inner"
          />
        </FloatingBadge>
      </Tooltip>
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
        <Chip
          icon={<GitHubIcon sx={{ fontSize: 15 }} data-testid="octocat-icon" />}
          label={formatGithubHandle(entity.githubUsername)}
          size="small"
          variant="outlined"
          mono
          testId="compact-github-handle"
          sx={{
            height: 24,
            fontSize: "0.75rem",
            fontWeight: 600,
            backgroundColor: "background.paper",
            border: (theme: { palette: { divider: string } }) =>
              `1px solid ${theme.palette.divider}`,
            "& .MuiChip-label": { px: 0.8 },
            "&:hover": { borderColor: "primary.main" },
          }}
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

          {showDelete && onDelete && (
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
                  onHoldComplete={() => onDelete(entity)}
                  aria-label={deleteLabel}
                  data-testid="compact-delete-btn"
                  wrapperSx={{
                    width: 24,
                    height: 24,
                    minWidth: 24,
                    maxWidth: 24,
                    minHeight: 24,
                    maxHeight: 24,
                    flexShrink: 0,
                    display: "inline-flex",
                  }}
                  sx={deleteHoldButtonSx}
                >
                  <DeleteOutlineRoundedIcon sx={{ fontSize: 14 }} />
                </HoldButton>
              </DeleteHoldWrapper>
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
    if (isInteractive && onClick) onClick(entity);
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
