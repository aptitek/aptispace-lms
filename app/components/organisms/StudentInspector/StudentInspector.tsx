import { useTranslation } from "react-i18next";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import IconButton from "@mui/material/IconButton";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

import type { StudentInspectorProps } from "./StudentInspector.types";
import { AssignmentSection } from "./StudentInspector.styles";
import {
  StudentCohortAssignmentSection,
  FacultyAccessPanel,
  AdminAccessPanel,
  InspectorActionGroup,
} from "./StudentInspector.components";
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
  const {
    selectedCohortToAdd,
    setSelectedCohortToAdd,
    schoolMap,
    assignedCohorts,
    availableToAdd,
    handleAdd,
  } = useInspectorCohortsState(student, schools, cohorts, onAddCohort);

  if (!student) return null;
  const targetStudent = student;

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
        <IconButton
          onClick={onClose}
          size="small"
          aria-label={t("common:inspector.closeAria", "Close inspector")}
        >
          <CloseRoundedIcon />
        </IconButton>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <AssignmentSection data-testid="inspector-assignment-section">
            {!targetStudent.role || targetStudent.role === "student" ? (
              <StudentCohortAssignmentSection
                targetStudent={targetStudent}
                assignedCohorts={assignedCohorts}
                availableToAdd={availableToAdd}
                schoolMap={schoolMap}
                selectedCohortToAdd={selectedCohortToAdd}
                setSelectedCohortToAdd={setSelectedCohortToAdd}
                handleAdd={handleAdd}
                onRemoveCohort={onRemoveCohort}
                isSubmitting={isSubmitting}
              />
            ) : targetStudent.role === "instructor" ? (
              <FacultyAccessPanel />
            ) : (
              <AdminAccessPanel />
            )}
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

export { SchoolBadgeInline } from "./StudentInspector.components";
