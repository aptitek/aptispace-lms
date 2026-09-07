import React, { forwardRef } from "react";
import { useTranslation } from "react-i18next";
import Box from "@mui/material/Box";
import LoginRoundedIcon from "@mui/icons-material/LoginRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import Avatar from "../../atoms/Avatar/Avatar";
import Chip from "../../atoms/Chip/Chip";
import SegmentedChip from "../SegmentedChip/SegmentedChip";
import Badge from "../../atoms/Badge/Badge";
import Tooltip from "../../atoms/Tooltip/Tooltip";
import { HoldButton } from "../../atoms/HoldButton";
import { CompactGithubChip } from "./UserCard.github";
import type { UserCardProps, UserCardData } from "./UserCard.types";
import type { SchoolConfig, CohortConfig } from "~/types/institution";
import { loginAsAccount, type UserRole } from "~/utils/auth";
import { getRoleConfig } from "~/tokens/roles";
import {
  DEFAULT_SCHOOL,
  resolveUserCardLabels,
  resolveCardInteractivity,
  resolveCardTestId,
  resolveCardAccessibility,
} from "./UserCard.helpers";
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
} from "./UserCard.styles";

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
            <SegmentedChip
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
              "& .MuiChip-label": { px: 0.5 },
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
  entity: UserCardData;
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
        width={56}
        height={56}
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
  entity: UserCardData;
  displayName: string;
  showImpersonate?: boolean;
  onImpersonate?: (entity: UserCardData) => void;
  showDelete?: boolean;
  onDelete?: (entity: UserCardData) => void;
  editableGithub?: boolean;
  onUpdateGithub?: (userId: string, newGithubUsername: string) => void;
}

function CompactStudentDetailsSlot({
  entity,
  displayName,
  showImpersonate = true,
  onImpersonate,
  showDelete = true,
  onDelete,
  editableGithub = false,
  onUpdateGithub,
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
        <CompactGithubChip
          entity={entity}
          editableGithub={editableGithub}
          onUpdateGithub={onUpdateGithub}
        />

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.5,
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
                <LoginRoundedIcon sx={{ fontSize: 13 }} />
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
      </CardFooterRow>
    </StudentDetails>
  );
}

function resolveUserCardTarget(
  user?: UserCardProps["user"],
  entity?: UserCardProps["entity"],
) {
  return user ?? entity;
}

function normalizeUserCardProps(props: UserCardProps) {
  return {
    targetUser: resolveUserCardTarget(props.user, props.entity),
    school: props.school ?? DEFAULT_SCHOOL,
    cohort: props.cohort,
    variant: props.variant ?? "elevation",
    onClick: props.onClick,
    onImpersonate: props.onImpersonate,
    showImpersonate: props.showImpersonate !== false,
    onDelete: props.onDelete,
    showDelete: props.showDelete !== false,
    interactive: props.interactive !== false,
    isSelected: Boolean(props.isSelected),
    isNested: Boolean(props.isNested),
    editableGithub: Boolean(props.editableGithub),
    onUpdateGithub: props.onUpdateGithub,
    className: props.className,
    testId: props.testId,
    style: props.style,
  };
}

export const UserCard = forwardRef<HTMLDivElement, UserCardProps>(
  (props, ref) => {
    const {
      targetUser,
      school,
      cohort,
      variant,
      onClick,
      onImpersonate,
      showImpersonate,
      onDelete,
      showDelete,
      interactive,
      isSelected,
      isNested,
      editableGithub,
      onUpdateGithub,
      className,
      testId,
      style,
    } = normalizeUserCardProps(props);

    const { isInteractive, handleClick, handleKeyDown } =
      resolveCardInteractivity(interactive, onClick, targetUser);

    if (!targetUser) return null;

    const resolvedTestId = resolveCardTestId(testId, Boolean(props.entity));
    const labels = resolveUserCardLabels(targetUser, school, cohort);
    const a11y = resolveCardAccessibility(isInteractive, labels.displayName);

    return (
      <StyledCard
        ref={ref}
        variant={variant}
        isInteractive={isInteractive}
        isSelected={isSelected}
        isNested={isNested}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        tabIndex={a11y.tabIndex}
        role={a11y.role}
        aria-label={a11y.ariaLabel}
        className={className}
        style={style}
        data-testid={resolvedTestId}
        data-student-id={targetUser.id}
      >
        <StyledCardContent>
          <CompactHeaderSlot
            school={school}
            institutionLabel={labels.institutionLabel}
            cohortConfig={labels.cohortConfig}
            cohortYear={labels.cohortYear}
            isProfileComplete={targetUser.isProfileComplete}
            role={labels.role}
          />

          <CardBodyRow>
            <CompactAvatarSlot
              entity={targetUser}
              displayName={labels.displayName}
              role={labels.role}
            />
            <CompactStudentDetailsSlot
              entity={targetUser}
              displayName={labels.displayName}
              showImpersonate={showImpersonate}
              onImpersonate={onImpersonate}
              showDelete={showDelete}
              onDelete={onDelete}
              editableGithub={editableGithub}
              onUpdateGithub={onUpdateGithub}
            />
          </CardBodyRow>
        </StyledCardContent>
      </StyledCard>
    );
  },
);

UserCard.displayName = "UserCard";
export default UserCard;
