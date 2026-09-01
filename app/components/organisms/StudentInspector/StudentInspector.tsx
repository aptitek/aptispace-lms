import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import InputLabel from "@mui/material/InputLabel";
import Select, { type SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import CircularProgress from "@mui/material/CircularProgress";
import Tooltip from "@mui/material/Tooltip";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import LoginRoundedIcon from "@mui/icons-material/LoginRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";

import OnboardingCard from "../OnboardingCard/OnboardingCard";
import RoleBadge from "../../atoms/RoleBadge/RoleBadge";
import type { StudentInspectorProps } from "./StudentInspector.types";
import type {
  OnboardingProfile,
  SchoolConfig,
  CohortConfig,
} from "../OnboardingCard/OnboardingCard.types";
import {
  InspectorRoot,
  InspectorHeader,
  HeaderTitleRow,
  CardPreviewSlot,
  AssignmentSection,
  SectionHeader,
  CohortChipsList,
  ActiveCohortChip,
  EmptyCohortsMessage,
  QuickAddRow,
  StyledFormControl,
  AddCohortButton,
  SchoolLogoMini,
  SchoolNameFallbackBadge,
  CohortOptionRow,
  CohortOptionLeft,
} from "./StudentInspector.styles";
import {
  DEFAULT_FALLBACK_SCHOOL,
  studentToProfile,
  isProfileIdentical,
  resolveUpdatedAuthUser,
  saveStudentProfileApi,
  extractCohortYear,
  sortCohortsBySchoolAndDate,
  resolveAssignedCohorts,
} from "./StudentInspector.helpers";

type ProfileSaveStatus = "idle" | "saving" | "saved" | "error";

interface SchoolBadgeInlineProps {
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

function SaveStatusIndicator({ status }: { status: ProfileSaveStatus }) {
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
          <CheckCircleRoundedIcon sx={{ fontSize: 16 }} />
        </Box>
      </Tooltip>
    );
  }

  if (status === "error") {
    return (
      <Tooltip title="Failed to save profile changes">
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

export default function StudentInspector({
  student,
  schools,
  cohorts,
  onClose,
  onAddCohort,
  onRemoveCohort,
  onImpersonate,
  onStudentUpdated,
  isSubmitting = false,
  className,
  "data-testid": dataTestId = "student-inspector",
}: StudentInspectorProps) {
  const { t } = useTranslation(["common", "auth"]);
  const [selectedCohortToAdd, setSelectedCohortToAdd] = useState<string>("");
  const [currentProfile, setCurrentProfile] = useState<OnboardingProfile>(() =>
    student
      ? studentToProfile(student)
      : studentToProfile({ id: "", firstName: "", familyName: "", email: "" }),
  );
  const [saveStatus, setSaveStatus] = useState<ProfileSaveStatus>("idle");
  const lastSavedProfileRef = useRef<OnboardingProfile>(currentProfile);

  useEffect(() => {
    if (student) {
      const initial = studentToProfile(student);
      setCurrentProfile(initial);
      lastSavedProfileRef.current = initial;
      setSaveStatus("idle");
    }
  }, [student]);

  const performSave = useCallback(
    async (profileToSave: OnboardingProfile) => {
      if (
        !student ||
        isProfileIdentical(lastSavedProfileRef.current, profileToSave)
      ) {
        return;
      }
      setSaveStatus("saving");
      try {
        const payload = await saveStudentProfileApi(student.id, profileToSave);
        lastSavedProfileRef.current = { ...profileToSave };
        setSaveStatus("saved");
        if (onStudentUpdated) {
          onStudentUpdated(
            resolveUpdatedAuthUser(student, profileToSave, payload.account),
          );
        }
      } catch {
        setSaveStatus("error");
      }
    },
    [student, onStudentUpdated],
  );

  const handleProfileChange = (nextProfile: OnboardingProfile) => {
    const avatarChanged = nextProfile.avatarUrl !== currentProfile.avatarUrl;
    setCurrentProfile(nextProfile);
    if (avatarChanged) {
      void performSave(nextProfile);
    }
  };

  const handleFieldBlur = (blurredProfile: OnboardingProfile) => {
    void performSave(blurredProfile);
  };

  const schoolMap = useMemo(() => {
    const map = new Map<string, SchoolConfig>();
    for (const school of schools) {
      map.set(school.id, school);
    }
    return map;
  }, [schools]);

  const sortedCohorts = useMemo(() => {
    return sortCohortsBySchoolAndDate(cohorts, schoolMap);
  }, [cohorts, schoolMap]);

  const assignedCohorts = useMemo(() => {
    if (!student) return [];
    return resolveAssignedCohorts(student);
  }, [student]);

  const assignedCohortIds = useMemo(() => {
    return new Set(assignedCohorts.map((c) => c.id));
  }, [assignedCohorts]);

  const availableToAdd = useMemo(() => {
    return sortedCohorts.filter((c) => c.id && !assignedCohortIds.has(c.id));
  }, [sortedCohorts, assignedCohortIds]);

  const activeSchool: SchoolConfig = useMemo(() => {
    if (!student) return DEFAULT_FALLBACK_SCHOOL;
    const found = schools.find((s) => s.id === student.institutionId);
    return found || schools[0] || DEFAULT_FALLBACK_SCHOOL;
  }, [student, schools]);

  const activeCohort: CohortConfig | undefined = useMemo(() => {
    const primary = assignedCohorts[0];
    if (!primary) return undefined;
    const matched = cohorts.find((c) => c.id === primary.id);
    return (
      matched || {
        id: primary.id,
        name: primary.name,
        startDate: primary.startDate ? String(primary.startDate) : undefined,
      }
    );
  }, [assignedCohorts, cohorts]);

  if (!student) {
    return null;
  }

  const handleAdd = () => {
    if (!selectedCohortToAdd) return;
    void onAddCohort({ studentId: student.id, cohortId: selectedCohortToAdd });
    setSelectedCohortToAdd("");
  };

  return (
    <InspectorRoot className={className} data-testid={dataTestId}>
      <InspectorHeader>
        <HeaderTitleRow>
          <Typography variant="h6" sx={{ fontWeight: 700, fontSize: "1.1rem" }}>
            {t("common:inspector.title", "Student Inspector")}
          </Typography>
          <RoleBadge
            role={student.role || "student"}
            variant="icon-only"
            size="small"
          />
        </HeaderTitleRow>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <SaveStatusIndicator status={saveStatus} />
          <Tooltip title={t("common:inspector.closeAria", "Close Inspector")}>
            <IconButton
              size="small"
              onClick={onClose}
              aria-label={t("common:inspector.closeAria", "Close Inspector")}
              data-testid="inspector-close-btn"
            >
              <CloseRoundedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </InspectorHeader>

      <CardPreviewSlot data-testid="inspector-card-preview">
        <OnboardingCard
          school={activeSchool}
          cohort={activeCohort}
          profile={currentProfile}
          onProfileChange={handleProfileChange}
          onFieldBlur={handleFieldBlur}
          readOnly={false}
          flipOnClick={true}
          size="md"
          transparent={true}
          holoVariant="rainbow"
          testId="inspector-onboarding-card"
        />
      </CardPreviewSlot>

      <AssignmentSection data-testid="inspector-assignment-section">
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

          {onImpersonate && (
            <Tooltip
              title={t("common:inspector.impersonate", "Impersonate Student")}
            >
              <IconButton
                size="small"
                color="secondary"
                onClick={() => onImpersonate(student)}
                data-testid="inspector-impersonate-btn"
                aria-label={t(
                  "common:inspector.impersonate",
                  "Impersonate Student",
                )}
                sx={{
                  border: "1px solid",
                  borderColor: "secondary.main",
                  borderRadius: "8px",
                  p: 0.5,
                }}
              >
                <LoginRoundedIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
          )}
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
                  onDelete={() =>
                    void onRemoveCohort({
                      studentId: student.id,
                      cohortId: c.id,
                    })
                  }
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
          <StyledFormControl size="small">
            <InputLabel id="cohort-add-select-label">
              {t("common:inspector.addCohort", "Add to Cohort")}
            </InputLabel>
            <Select
              labelId="cohort-add-select-label"
              id="cohort-add-select"
              value={selectedCohortToAdd}
              label={t("common:inspector.addCohort", "Add to Cohort")}
              onChange={(e: SelectChangeEvent<string>) =>
                setSelectedCohortToAdd(e.target.value)
              }
              disabled={isSubmitting || availableToAdd.length === 0}
              renderValue={(selectedId) => {
                if (!selectedId) return "";
                const selected = sortedCohorts.find((c) => c.id === selectedId);
                if (!selected) return selectedId;
                const school = selected.institutionId
                  ? schoolMap.get(selected.institutionId)
                  : undefined;
                return (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      overflow: "hidden",
                    }}
                  >
                    <SchoolBadgeInline
                      school={school}
                      schoolName={selected.institutionName}
                      testId="selected-cohort-school"
                    />
                    <Typography
                      component="span"
                      sx={{
                        fontWeight: 600,
                        fontSize: "0.85rem",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {selected.name}
                    </Typography>
                  </Box>
                );
              }}
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

          <AddCohortButton
            variant="contained"
            onClick={handleAdd}
            disabled={isSubmitting || !selectedCohortToAdd}
            startIcon={
              isSubmitting ? (
                <CircularProgress size={14} color="inherit" />
              ) : (
                <AddRoundedIcon fontSize="small" />
              )
            }
            data-testid="inspector-add-cohort-btn"
          >
            {t("common:inspector.addButton", "Add")}
          </AddCohortButton>
        </QuickAddRow>
      </AssignmentSection>
    </InspectorRoot>
  );
}
