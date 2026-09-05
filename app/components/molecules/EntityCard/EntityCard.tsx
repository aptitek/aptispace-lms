import React, { forwardRef } from "react";
import { useTranslation } from "react-i18next";
import Box from "@mui/material/Box";
import LoginIcon from "@mui/icons-material/Login";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import GitHubIcon from "@mui/icons-material/GitHub";
import Avatar from "../../atoms/Avatar/Avatar";
import Chip from "../../atoms/Chip/Chip";
import CohortChip from "../CohortChip/CohortChip";
import Badge from "../../atoms/Badge/Badge";
import Tooltip from "../../atoms/Tooltip/Tooltip";
import { HoldButton } from "../../atoms/HoldButton";
import type { EntityCardProps, EntityCardData } from "./EntityCard.types";
import type { SchoolConfig, CohortConfig } from "~/types/institution";
import { loginAsAccount, type UserRole } from "~/utils/auth";
import { getRoleConfig } from "~/tokens/roles";
import {
  DEFAULT_SCHOOL,
  formatGithubHandle,
  resolveEntityCardLabels,
  useCardInteractivity,
} from "./EntityCard.helpers";
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

function CompactHeaderSlot({
  school,
  institutionLabel,
  cohortConfig,
  cohortYear,
  isProfileComplete,
  role = "student",
}: {
  school: SchoolConfig;
  institutionLabel: string;
  cohortConfig: CohortConfig;
  cohortYear: string;
  isProfileComplete?: boolean;
  role?: UserRole;
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
        {role === "student" ? (
          <>
            <CohortChip
              cohort={cohortConfig}
              size="small"
              data-testid="compact-cohort-chip"
            />
            {cohortYear && (
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
            )}
          </>
        ) : (
          <Chip
            label={t("auth:roles.allCohorts", "All Cohorts")}
            size="small"
            color="default"
            variant="outlined"
            sx={{
              height: 20,
              fontSize: "0.65rem",
              fontWeight: 700,
              "& .MuiChip-label": { px: 0.75 },
            }}
            data-testid="compact-all-cohorts-chip"
          />
        )}
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
  const roleConfig = getRoleConfig(role);
  const roleLabel = t(
    `auth:devTool.roles.${roleConfig.label.toLowerCase()}`,
    roleConfig.label,
  );

  return (
    <AvatarContainer data-testid="compact-avatar-container">
      <Avatar
        name={displayName}
        src={entity.avatarUrl}
        role={role}
        shape={roleConfig.avatarShape}
        width={80}
        height={80}
        isPortrait={false}
        testId="compact-avatar"
      />
      <Tooltip title={roleLabel} arrow placement="top">
        <FloatingBadge data-testid="compact-role-badge">
          <Badge
            shape={roleConfig.badgeShape}
            color={roleConfig.badgeColor}
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
      isSelected = false,
      className,
      testId = "entity-card",
      style,
    } = props;

    const { isInteractive, handleClick, handleKeyDown } = useCardInteractivity(
      interactive,
      onClick,
      entity,
    );
    const labels = resolveEntityCardLabels(entity, school, cohort);

    return (
      <StyledCard
        ref={ref}
        variant={variant}
        isInteractive={isInteractive}
        isSelected={isSelected}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        tabIndex={isInteractive ? 0 : undefined}
        role={isInteractive ? "button" : "article"}
        aria-label={`User card for ${labels.displayName}`}
        className={className}
        style={style}
        data-testid={testId}
        data-student-id={entity.id}
      >
        <StyledCardContent>
          <CompactHeaderSlot
            school={school}
            institutionLabel={labels.institutionLabel}
            cohortConfig={labels.cohortConfig}
            cohortYear={labels.cohortYear}
            isProfileComplete={entity.isProfileComplete}
            role={labels.role}
          />

          <CardBodyRow>
            <CompactAvatarSlot
              entity={entity}
              displayName={labels.displayName}
              role={labels.role}
            />
            <CompactStudentDetailsSlot
              entity={entity}
              displayName={labels.displayName}
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
