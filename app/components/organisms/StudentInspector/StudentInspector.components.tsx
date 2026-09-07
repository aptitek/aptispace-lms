import { useState } from "react";
import { useTranslation } from "react-i18next";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Chip from "~/components/atoms/Chip/Chip";
import InputLabel from "@mui/material/InputLabel";
import Select, { type SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { alpha } from "@mui/material/styles";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import SupervisorAccountRoundedIcon from "@mui/icons-material/SupervisorAccountRounded";
import AdminPanelSettingsRoundedIcon from "@mui/icons-material/AdminPanelSettingsRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

import type {
  UserCardData,
  CompactCohortItem,
} from "../../molecules/UserCard/UserCard.types";
import type { SchoolConfig } from "../../../types/institution";
import type { CohortWithInstitution } from "./StudentInspector.types";
import {
  HeaderTitleRow,
  SectionHeader,
  CohortChipsList,
  ActiveCohortChip,
  EmptyCohortsMessage,
  QuickAddRow,
  StyledFormControl,
  CohortOptionRow,
  CohortOptionLeft,
  SchoolLogoMini,
  SchoolNameFallbackBadge,
} from "./StudentInspector.styles";
import { extractCohortYear } from "./StudentInspector.helpers";

export type ProfileSaveStatus = "idle" | "saving" | "saved" | "error";

export interface SchoolBadgeInlineProps {
  school?: SchoolConfig;
  schoolName?: string;
  testId?: string;
}

export function SchoolBadgeInline({
  school,
  schoolName,
  testId = "school-badge-inline",
}: SchoolBadgeInlineProps) {
  const [imgError, setImgError] = useState(false);
  const displayName = school?.name || schoolName || "Aptitek";
  const logoUrl = school?.logoUrl;

  if (logoUrl && !imgError) {
    return (
      <SchoolLogoMini
        src={logoUrl}
        alt={displayName}
        onError={() => setImgError(true)}
        data-testid={`${testId}-logo`}
      />
    );
  }

  return (
    <SchoolNameFallbackBadge data-testid={`${testId}-name`}>
      {displayName}
    </SchoolNameFallbackBadge>
  );
}

export function SaveStatusIndicator({ status }: { status: ProfileSaveStatus }) {
  const { t } = useTranslation("common");

  if (status === "saving") {
    return (
      <Tooltip title={t("inspector.saving", "Saving...")}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <CircularProgress size={14} color="primary" />
          <Typography variant="caption" color="text.secondary">
            {t("inspector.saving", "Saving...")}
          </Typography>
        </Box>
      </Tooltip>
    );
  }

  if (status === "saved") {
    return (
      <Tooltip title={t("inspector.assignmentSaved", "Saved")}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            color: "success.main",
          }}
        >
          <CheckCircleOutlineRoundedIcon sx={{ fontSize: 16 }} />
        </Box>
      </Tooltip>
    );
  }

  if (status === "error") {
    return (
      <Tooltip
        title={t("inspector.saveError", "Failed to save profile changes")}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            color: "error.main",
          }}
        >
          <ErrorOutlineRoundedIcon sx={{ fontSize: 16 }} />
        </Box>
      </Tooltip>
    );
  }

  return null;
}

export function FacultyAccessPanel() {
  const { t } = useTranslation(["common", "auth"]);

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}
      data-testid="inspector-faculty-access-panel"
    >
      <SectionHeader>
        <HeaderTitleRow>
          <SupervisorAccountRoundedIcon
            color="info"
            sx={{ fontSize: 20 }}
            data-testid="inspector-faculty-icon"
          />
          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
            {t("auth:roles.facultyAccess", "Faculty Access • All Cohorts")}
          </Typography>
        </HeaderTitleRow>
      </SectionHeader>
      <Box
        sx={{
          p: 2,
          borderRadius: (theme) => theme.shape.corners.medium,
          bgcolor: (theme) => alpha(theme.palette.info.main, 0.08),
          border: "1px solid",
          borderColor: (theme) => alpha(theme.palette.info.main, 0.2),
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        <Box sx={{ display: "flex", gap: 1 }}>
          <Chip
            userRole="instructor"
            size="small"
            sx={{ fontWeight: 700 }}
            testId="inspector-instructor-chip"
          />
          <Chip
            label={t("auth:roles.allCohorts", "All Cohorts")}
            size="small"
            variant="outlined"
            sx={{ fontWeight: 700 }}
            data-testid="inspector-all-cohorts-chip"
          />
        </Box>
        <Typography variant="body2" color="text.secondary">
          {t(
            "common:inspector.instructorCohortScope",
            "Instructors have teaching, mentoring, and grading access across all active cohorts.",
          )}
        </Typography>
      </Box>
    </Box>
  );
}

export function AdminAccessPanel() {
  const { t } = useTranslation(["common", "auth"]);

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}
      data-testid="inspector-admin-access-panel"
    >
      <SectionHeader>
        <HeaderTitleRow>
          <AdminPanelSettingsRoundedIcon
            sx={{
              fontSize: 20,
              color: (theme) =>
                theme.palette.roles?.admin || theme.palette.secondary.main,
            }}
            data-testid="inspector-admin-icon"
          />
          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
            {t("auth:roles.adminAccess", "Administrative Access • Global")}
          </Typography>
        </HeaderTitleRow>
      </SectionHeader>
      <Box
        sx={{
          p: 2,
          borderRadius: (theme) => theme.shape.corners.medium,
          bgcolor: (theme) =>
            alpha(
              theme.palette.roles?.admin || theme.palette.secondary.main,
              0.08,
            ),
          border: "1px solid",
          borderColor: (theme) =>
            alpha(
              theme.palette.roles?.admin || theme.palette.secondary.main,
              0.2,
            ),
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        <Box sx={{ display: "flex", gap: 1 }}>
          <Chip
            userRole="admin"
            size="small"
            sx={{ fontWeight: 700 }}
            testId="inspector-admin-chip"
          />
          <Chip
            label={t("auth:roles.globalAccess", "Global Access")}
            size="small"
            variant="outlined"
            sx={{ fontWeight: 700 }}
            data-testid="inspector-global-chip"
          />
        </Box>
        <Typography variant="body2" color="text.secondary">
          {t(
            "common:inspector.adminCohortScope",
            "Administrators have full administrative authority across all institutions and cohorts.",
          )}
        </Typography>
      </Box>
    </Box>
  );
}

export interface StudentCohortAssignmentSectionProps {
  targetStudent: UserCardData;
  assignedCohorts: CompactCohortItem[];
  availableToAdd: CohortWithInstitution[];
  schoolMap: Map<string, SchoolConfig>;
  selectedCohortToAdd: string;
  setSelectedCohortToAdd: (cohortId: string) => void;
  handleAdd: (cohortId?: string) => void;
  onRemoveCohort: (payload: {
    studentId: string;
    cohortId: string;
  }) => void | Promise<void>;
  isSubmitting: boolean;
}

export function StudentCohortAssignmentSection({
  targetStudent,
  assignedCohorts,
  availableToAdd,
  schoolMap,
  selectedCohortToAdd,
  setSelectedCohortToAdd: _setSelectedCohortToAdd,
  handleAdd,
  onRemoveCohort,
  isSubmitting,
}: StudentCohortAssignmentSectionProps) {
  const { t } = useTranslation(["common", "auth"]);

  return (
    <>
      <SectionHeader>
        <HeaderTitleRow>
          <SchoolRoundedIcon
            color="primary"
            sx={{ fontSize: 20 }}
            data-testid="inspector-school-icon"
          />
          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
            {t("common:inspector.assignedCohorts", "Assigned Cohorts")}
          </Typography>
        </HeaderTitleRow>
      </SectionHeader>

      <CohortChipsList data-testid="inspector-cohort-chips">
        {assignedCohorts.length === 0 ? (
          <EmptyCohortsMessage data-testid="inspector-empty-cohorts">
            {t("common:inspector.noCohorts", "No cohorts assigned yet")}
          </EmptyCohortsMessage>
        ) : (
          assignedCohorts.map((c) => {
            const chipSchool = c.institutionId
              ? schoolMap.get(c.institutionId)
              : undefined;
            return (
              <ActiveCohortChip
                key={c.id}
                avatar={
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      pl: 0.5,
                    }}
                  >
                    <SchoolBadgeInline
                      school={chipSchool}
                      schoolName={c.institutionName}
                      testId={`assigned-school-${c.id}`}
                    />
                  </Box>
                }
                label={c.startYear ? `${c.name} (${c.startYear})` : c.name}
                onDelete={() => {
                  if (c.id) {
                    void onRemoveCohort({
                      studentId: targetStudent.id,
                      cohortId: c.id,
                    });
                  }
                }}
                disabled={isSubmitting}
                deleteIcon={
                  <Tooltip
                    title={t("common:inspector.removeCohortTooltip", {
                      cohort: c.name,
                      defaultValue: `Remove from ${c.name}`,
                    })}
                  >
                    <CloseRoundedIcon />
                  </Tooltip>
                }
                data-testid={`assigned-cohort-chip-${c.id}`}
              />
            );
          })
        )}
      </CohortChipsList>

      <QuickAddRow>
        <StyledFormControl size="small" fullWidth>
          <InputLabel id="cohort-add-select-label">
            {t("common:inspector.addCohort", "Add to Cohort")}
          </InputLabel>
          <Select
            labelId="cohort-add-select-label"
            id="cohort-add-select"
            value={selectedCohortToAdd}
            label={t("common:inspector.addCohort", "Add to Cohort")}
            onChange={(e: SelectChangeEvent<string>) => {
              const nextCohortId = e.target.value;
              if (nextCohortId) {
                handleAdd(nextCohortId);
              }
            }}
            disabled={isSubmitting || availableToAdd.length === 0}
            data-testid="inspector-cohort-add-select"
          >
            {availableToAdd.map((cohort) => {
              const school = cohort.institutionId
                ? schoolMap.get(cohort.institutionId)
                : undefined;
              const year = extractCohortYear(cohort.startDate, cohort.name);
              return (
                <MenuItem
                  key={cohort.id}
                  value={cohort.id}
                  data-testid={`cohort-option-${cohort.id}`}
                >
                  <CohortOptionRow>
                    <CohortOptionLeft>
                      <SchoolBadgeInline
                        school={school}
                        schoolName={cohort.institutionName}
                        testId={`cohort-opt-school-${cohort.id}`}
                      />
                      <Typography
                        component="span"
                        sx={{ fontWeight: 600, fontSize: "0.85rem" }}
                      >
                        {cohort.name}
                      </Typography>
                    </CohortOptionLeft>
                    {year && (
                      <Chip
                        label={year}
                        size="small"
                        variant="outlined"
                        color="secondary"
                        sx={{
                          height: 18,
                          fontSize: "0.625rem",
                          fontWeight: 800,
                          "& .MuiChip-label": { px: 0.5 },
                        }}
                      />
                    )}
                  </CohortOptionRow>
                </MenuItem>
              );
            })}
          </Select>
        </StyledFormControl>
      </QuickAddRow>
    </>
  );
}

export * from "./StudentInspector.actions";
export * from "./StudentInspector.account";
