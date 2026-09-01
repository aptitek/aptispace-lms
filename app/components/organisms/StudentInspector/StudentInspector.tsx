import { useTranslation } from "react-i18next";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import InputLabel from "@mui/material/InputLabel";
import Select, { type SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import CircularProgress from "@mui/material/CircularProgress";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import LoginRoundedIcon from "@mui/icons-material/LoginRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

import { HoldButton } from "../../atoms/HoldButton";
import type { EntityCardData } from "../../molecules/EntityCard/EntityCard.types";
import type { StudentInspectorProps } from "./StudentInspector.types";

import {
  HeaderTitleRow,
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
import { SchoolBadgeInline } from "./StudentInspector.components";
import { extractCohortYear } from "./StudentInspector.helpers";
import { useInspectorCohortsState } from "./StudentInspector.hooks";

export default function StudentInspector({
  student,
  schools,
  cohorts,
  onClose,
  onAddCohort,
  onRemoveCohort,
  onImpersonate,
  onDelete,
  isSubmitting = false,
  className,
  "data-testid": dataTestId = "student-inspector",
}: StudentInspectorProps) {
  const { t } = useTranslation(["common", "auth"]);
  const targetStudent = student;
  const {
    selectedCohortToAdd,
    setSelectedCohortToAdd,
    schoolMap,
    sortedCohorts,
    assignedCohorts,
    availableToAdd,
    handleAdd,
  } = useInspectorCohortsState(targetStudent, schools, cohorts, onAddCohort);

  if (!student) return null;

  return (
    <Card
      sx={{
        p: 2,
        display: "flex",
        flexDirection: "column",
        gap: 3,
        height: "calc(100vh - 200px)",
        maxHeight: "900px",
        overflowY: "auto",
        position: "sticky",
        top: 24,
      }}
      variant="outlined"
      className={className}
      data-testid={dataTestId}
    >
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <IconButton onClick={onClose} size="small" aria-label="Close inspector">
          <CloseRoundedIcon />
        </IconButton>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
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

          <InspectorActionGroup
            targetStudent={targetStudent}
            onImpersonate={onImpersonate}
            onDelete={onDelete}
          />
        </Box>
      </Box>
    </Card>
  );
}

interface InspectorActionGroupProps {
  targetStudent?: EntityCardData | null;
  onImpersonate?: (student: EntityCardData) => void;
  onDelete?: (student: EntityCardData) => void;
}

function InspectorActionGroup({
  targetStudent,
  onImpersonate,
  onDelete,
}: InspectorActionGroupProps) {
  if (!targetStudent || (!onImpersonate && !onDelete)) return null;

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns:
          onImpersonate && onDelete ? "repeat(2, minmax(0, 1fr))" : "1fr",
        gap: 2,
        mt: 2,
        width: "100%",
      }}
    >
      {onImpersonate && (
        <InspectorImpersonateButton
          targetStudent={targetStudent}
          onImpersonate={onImpersonate}
        />
      )}
      {onDelete && (
        <InspectorDeleteButton
          targetStudent={targetStudent}
          onDelete={onDelete}
        />
      )}
    </Box>
  );
}

interface InspectorImpersonateButtonProps {
  targetStudent: EntityCardData;
  onImpersonate: (student: EntityCardData) => void;
}

function InspectorImpersonateButton({
  targetStudent,
  onImpersonate,
}: InspectorImpersonateButtonProps) {
  const { t } = useTranslation(["common", "auth"]);
  const isInstructor = targetStudent.role === "instructor";
  const label = isInstructor
    ? t("common:inspector.impersonateInstructor", "Impersonate Instructor")
    : t("common:inspector.impersonate", "Impersonate Student");

  return (
    <Button
      variant="outlined"
      color="secondary"
      size="large"
      startIcon={<LoginRoundedIcon />}
      onClick={() => onImpersonate(targetStudent)}
      data-testid="inspector-impersonate-btn-standalone"
      sx={{
        width: "100%",
        height: "44px",
        minHeight: "44px",
        borderRadius: "12px",
        borderWidth: "2px",
        fontWeight: 700,
        textTransform: "none",
        whiteSpace: "nowrap",
        "&:hover": {
          borderWidth: "2px",
        },
      }}
    >
      {label}
    </Button>
  );
}

interface InspectorDeleteButtonProps {
  targetStudent: EntityCardData;
  onDelete: (student: EntityCardData) => void;
}

function InspectorDeleteButton({
  targetStudent,
  onDelete,
}: InspectorDeleteButtonProps) {
  const { t } = useTranslation(["common", "auth"]);
  const isInstructor = targetStudent.role === "instructor";
  const label = isInstructor
    ? t("common:inspector.deleteInstructor", "Hold to Delete Instructor")
    : t("common:inspector.deleteStudent", "Hold to Delete Student");

  return (
    <HoldButton
      variant="outlined"
      color="error"
      size="large"
      holdTime={1000}
      borderThickness={2}
      outlineGap={3.5}
      startIcon={<DeleteOutlineRoundedIcon />}
      onHoldComplete={() => onDelete(targetStudent)}
      data-testid="inspector-delete-btn-standalone"
      wrapperSx={{
        width: "100%",
      }}

      sx={{
        width: "100%",
        height: "44px",
        minHeight: "44px",
        borderRadius: "12px",
        borderWidth: "2px",
        fontWeight: 700,
        textTransform: "none",
        whiteSpace: "nowrap",
        "&:hover": {
          borderWidth: "2px",
        },
      }}
    >
      {label}
    </HoldButton>
  );
}
