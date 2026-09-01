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
import type {
  ProfileCardCompactProps,
  CompactStudentData,
} from "./ProfileCardCompact.types";
import type { SchoolConfig, CohortConfig } from "~/types/institution";
import { loginAsAccount, type UserRole } from "~/utils/auth";
import {
  CompactCardContainer,
  CardHoloAura,
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
} from "./ProfileCardCompact.styles";

function resolveDisplayName(student: CompactStudentData): string {
  if (student.displayName) return student.displayName;
  const fullName = `${student.firstName} ${student.familyName}`.trim();
  return fullName || "Student";
}

function resolveCohortLabel(
  student: CompactStudentData,
  cohort?: CohortConfig,
): string {
  if (cohort?.name) return cohort.name;
  if (student.cohortName) return student.cohortName;
  return "Cohort 2026";
}

function parseDateYear(dateInput?: string | Date | null): string | null {
  if (!dateInput) return null;
  const d = new Date(dateInput);
  const yr = d.getFullYear();
  return isNaN(yr) ? null : String(yr);
}

function resolveCohortYear(
  student: CompactStudentData,
  cohort?: CohortConfig,
): string {
  if (cohort?.startYear) return String(cohort.startYear);
  const cohortDateYear = parseDateYear(cohort?.startDate);
  if (cohortDateYear) return cohortDateYear;

  if (student.cohortStartYear) return String(student.cohortStartYear);
  const studentDateYear = parseDateYear(student.cohortStartDate);
  if (studentDateYear) return studentDateYear;

  const match = student.cohortName?.match(/\b(20\d{2})\b/);
  return match ? match[1] : "2026";
}

function resolveInstitutionLabel(
  student: CompactStudentData,
  school?: SchoolConfig,
): string {
  if (school?.name) return school.name;
  if (student.institutionName) return student.institutionName;
  return "Aptitek";
}

const DEFAULT_SCHOOL: SchoolConfig = {
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
  student: CompactStudentData;
  displayName: string;
  role: UserRole;
}

function CompactAvatarSlot({
  student,
  displayName,
  role,
}: CompactAvatarSlotProps) {
  return (
    <AvatarContainer data-testid="compact-avatar-container">
      <Avatar
        name={displayName}
        src={student.avatarUrl}
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
  student: CompactStudentData;
  displayName: string;
  showImpersonate?: boolean;
  onImpersonate?: (student: CompactStudentData) => void;
  showDelete?: boolean;
  onDelete?: (student: CompactStudentData) => void;
}

function CompactStudentDetailsSlot({
  student,
  displayName,
  showImpersonate = true,
  onImpersonate,
  showDelete = true,
  onDelete,
}: CompactDetailsProps) {
  const { t } = useTranslation(["auth", "common"]);
  const firstName = student.firstName;
  const familyName = (student.familyName ?? "").toUpperCase();
  const emailText =
    student.email || t("auth:noInstitutionalEmail", "No institutional email");
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
      onImpersonate(student);
    } else {
      try {
        await loginAsAccount({
          id: student.id,
          name: displayName,
          email: student.email,
          role: student.role ?? "student",
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
          username={student.githubUsername}
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
                  onHoldComplete={() => onDelete?.(student)}
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
  onClick: ((student: CompactStudentData) => void) | undefined,
  student: CompactStudentData,
) {
  const isInteractive = Boolean(interactive && onClick);
  const handleClick = () => {
    if (isInteractive && onClick) {
      onClick(student);
    }
  };
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const isActivationKey = event.key === "Enter" || event.key === " ";
    if (isInteractive && isActivationKey) {
      event.preventDefault();
      onClick?.(student);
    }
  };
  return { isInteractive, handleClick, handleKeyDown };
}

export const ProfileCardCompact = forwardRef<
  HTMLDivElement,
  ProfileCardCompactProps
>((props, ref) => {
  const {
    student,
    school = DEFAULT_SCHOOL,
    cohort,
    variant = "elevated",
    onClick,
    onImpersonate,
    showImpersonate = true,
    onDelete,
    showDelete = true,
    interactive = true,
    className,
    testId = "profile-card-compact",
    style,
  } = props;

  const { isInteractive, handleClick, handleKeyDown } = useCardInteractivity(
    interactive,
    onClick,
    student,
  );
  const role: UserRole = student.role ?? "student";
  const displayName = resolveDisplayName(student);
  const cohortLabel = resolveCohortLabel(student, cohort);
  const cohortYear = resolveCohortYear(student, cohort);
  const institutionLabel = resolveInstitutionLabel(student, school);

  return (
    <CompactCardContainer
      ref={ref}
      isInteractive={isInteractive}
      cardVariant={variant}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={isInteractive ? 0 : undefined}
      role={isInteractive ? "button" : "article"}
      aria-label={`Student card for ${displayName}`}
      className={className}
      style={style}
      data-testid={testId}
      data-student-id={student.id}
    >
      <CardHoloAura aria-hidden="true" />

      <CompactHeaderSlot
        school={school}
        institutionLabel={institutionLabel}
        cohortLabel={cohortLabel}
        cohortYear={cohortYear}
        isProfileComplete={student.isProfileComplete}
      />

      <CardBodyRow>
        <CompactAvatarSlot
          student={student}
          displayName={displayName}
          role={role}
        />

        <CompactStudentDetailsSlot
          student={student}
          displayName={displayName}
          showImpersonate={showImpersonate}
          onImpersonate={onImpersonate}
          showDelete={showDelete}
          onDelete={onDelete}
        />
      </CardBodyRow>
    </CompactCardContainer>
  );
});

ProfileCardCompact.displayName = "ProfileCardCompact";

export default ProfileCardCompact;
