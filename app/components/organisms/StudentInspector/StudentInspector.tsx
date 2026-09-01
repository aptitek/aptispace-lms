import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import InputLabel from "@mui/material/InputLabel";
import Select, { type SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import CircularProgress from "@mui/material/CircularProgress";
import Tooltip from "@mui/material/Tooltip";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import LoginRoundedIcon from "@mui/icons-material/LoginRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

import OnboardingCard from "../OnboardingCard/OnboardingCard";
import FullScreenModal from "../../molecules/FullScreenModal/FullScreenModal";
import type { CompactStudentData } from "../../molecules/ProfileCardCompact/ProfileCardCompact.types";
import type { StudentInspectorProps } from "./StudentInspector.types";
import type {
  OnboardingProfile,
  SchoolConfig,
  CohortConfig,
} from "../OnboardingCard/OnboardingCard.types";
import {
  HeaderTitleRow,
  ContentSplit,
  LeftPanel,
  RightPanel,
  AssignmentSection,
  SectionHeader,
  CohortChipsList,
  ActiveCohortChip,
  EmptyCohortsMessage,
  QuickAddRow,
  StyledFormControl,
  AddCohortButton,
  CohortOptionRow,
  CohortOptionLeft,
} from "./StudentInspector.styles";
import {
  SchoolBadgeInline,
  SaveStatusIndicator,
  type ProfileSaveStatus,
} from "./StudentInspector.components";
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

  const [activeStudent, setActiveStudent] = useState<CompactStudentData | null>(
    student,
  );
  const targetStudent = student || activeStudent;

  useEffect(() => {
    if (student) {
      setActiveStudent(student);
      const initial = studentToProfile(student);
      setCurrentProfile(initial);
      lastSavedProfileRef.current = initial;
      setSaveStatus("idle");
    }
  }, [student]);

  const performSave = useCallback(
    async (profileToSave: OnboardingProfile) => {
      if (
        !targetStudent ||
        isProfileIdentical(lastSavedProfileRef.current, profileToSave)
      ) {
        return;
      }
      setSaveStatus("saving");
      try {
        const payload = await saveStudentProfileApi(
          targetStudent.id,
          profileToSave,
        );
        lastSavedProfileRef.current = { ...profileToSave };
        setSaveStatus("saved");
        if (onStudentUpdated) {
          onStudentUpdated(
            resolveUpdatedAuthUser(
              targetStudent,
              profileToSave,
              payload.account,
            ),
          );
        }
      } catch {
        setSaveStatus("error");
      }
    },
    [targetStudent, onStudentUpdated],
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
    if (!targetStudent) return [];
    return resolveAssignedCohorts(targetStudent);
  }, [targetStudent]);

  const assignedCohortIds = useMemo(() => {
    return new Set(assignedCohorts.map((c) => c.id));
  }, [assignedCohorts]);

  const availableToAdd = useMemo(() => {
    return sortedCohorts.filter((c) => c.id && !assignedCohortIds.has(c.id));
  }, [sortedCohorts, assignedCohortIds]);

  const activeSchool: SchoolConfig = useMemo(() => {
    if (!targetStudent) return DEFAULT_FALLBACK_SCHOOL;
    const found = schools.find((s) => s.id === targetStudent.institutionId);
    return found || schools[0] || DEFAULT_FALLBACK_SCHOOL;
  }, [targetStudent, schools]);

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

  const handleAdd = () => {
    if (!selectedCohortToAdd || !targetStudent) return;
    void onAddCohort({
      studentId: targetStudent.id,
      cohortId: selectedCohortToAdd,
    });
    setSelectedCohortToAdd("");
  };

  return (
    <FullScreenModal
      isOpen={Boolean(student)}
      onClose={onClose}
      maxWidth={1000}
      asCard={false}
      className={className}
      testId={dataTestId}
    >
      <ContentSplit>
        <LeftPanel data-testid="inspector-card-preview">
          <OnboardingCard
            school={activeSchool}
            cohort={activeCohort}
            profile={currentProfile}
            onProfileChange={handleProfileChange}
            onFieldBlur={handleFieldBlur}
            readOnly={false}
            flipOnClick={true}
            size="lg"
            transparent={true}
            holoVariant="rainbow"
            testId="inspector-onboarding-card"
          />
        </LeftPanel>

        <RightPanel>
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
              <SaveStatusIndicator status={saveStatus} />
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
                      label={
                        c.startYear ? `${c.name} (${c.startYear})` : c.name
                      }
                      onDelete={() => {
                        if (!targetStudent) return;
                        void onRemoveCohort({
                          studentId: targetStudent.id,
                          cohortId: c.id,
                        });
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
                    const selected = sortedCohorts.find(
                      (c) => c.id === selectedId,
                    );
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
                    const year = extractCohortYear(
                      cohort.startDate,
                      cohort.name,
                    );
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

          {onImpersonate && targetStudent && (
            <Button
              variant="outlined"
              color="secondary"
              size="large"
              startIcon={<LoginRoundedIcon />}
              onClick={() => onImpersonate(targetStudent)}
              data-testid="inspector-impersonate-btn-standalone"
              sx={{
                mt: 2,
                alignSelf: "flex-start",
                borderRadius: "12px",
                borderWidth: "2px",
                fontWeight: 700,
                "&:hover": {
                  borderWidth: "2px",
                },
              }}
            >
              {t("common:inspector.impersonate", "Impersonate Student")}
            </Button>
          )}
        </RightPanel>
      </ContentSplit>
    </FullScreenModal>
  );
}
