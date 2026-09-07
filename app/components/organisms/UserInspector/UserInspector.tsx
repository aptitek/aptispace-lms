import { useTranslation } from "react-i18next";
import Box from "@mui/material/Box";

import type {
  UserInspectorProps,
  CohortWithInstitution,
} from "./UserInspector.types";
import type {
  UserCardData,
  CompactCohortItem,
} from "../../molecules/UserCard/UserCard.types";
import type { SchoolConfig } from "../../../types/institution";
import { AssignmentSection } from "./UserInspector.styles";
import {
  StudentCohortAssignmentSection,
  FacultyAccessPanel,
  AdminAccessPanel,
  InspectorActionGroup,
} from "./UserInspector.components";
import { useInspectorCohortsState } from "./UserInspector.hooks";
import { Inspector } from "../Inspector";
import UserCard from "../../molecules/UserCard/UserCard";

interface UserRoleAssignmentPanelProps {
  targetUser: UserCardData;
  assignedCohorts: CompactCohortItem[];
  availableToAdd: CohortWithInstitution[];
  schoolMap: Map<string, SchoolConfig>;
  selectedCohortToAdd: string;
  setSelectedCohortToAdd: (cohortId: string) => void;
  handleAdd: (cohortId?: string) => void;
  onRemoveCohort?: (payload: {
    studentId: string;
    cohortId: string;
  }) => void | Promise<void>;
  isSubmitting: boolean;
}

function UserRoleAssignmentPanel({
  targetUser,
  assignedCohorts,
  availableToAdd,
  schoolMap,
  selectedCohortToAdd,
  setSelectedCohortToAdd,
  handleAdd,
  onRemoveCohort,
  isSubmitting,
}: UserRoleAssignmentPanelProps) {
  if (targetUser.role === "instructor") {
    return <FacultyAccessPanel />;
  }
  if (targetUser.role === "admin") {
    return <AdminAccessPanel />;
  }
  return (
    <StudentCohortAssignmentSection
      targetStudent={targetUser}
      assignedCohorts={assignedCohorts}
      availableToAdd={availableToAdd}
      schoolMap={schoolMap}
      selectedCohortToAdd={selectedCohortToAdd}
      setSelectedCohortToAdd={setSelectedCohortToAdd}
      handleAdd={handleAdd}
      onRemoveCohort={onRemoveCohort ?? (() => {})}
      isSubmitting={isSubmitting}
    />
  );
}

export default function UserInspector({
  student,
  user,
  schools = [],
  cohorts = [],
  onClose,
  onAddCohort,
  onRemoveCohort,
  onImpersonate,
  onDelete,
  onUpdateGithub,
  isSubmitting = false,
  className,
  "data-testid": dataTestId = "user-inspector",
}: UserInspectorProps) {
  const { t } = useTranslation(["common", "auth"]);
  const targetUser = user ?? student;

  const {
    selectedCohortToAdd,
    setSelectedCohortToAdd,
    schoolMap,
    assignedCohorts,
    availableToAdd,
    activeSchool,
    activeCohort,
    handleAdd,
  } = useInspectorCohortsState(
    targetUser ?? null,
    schools,
    cohorts,
    onAddCohort,
  );

  if (!targetUser) return null;

  return (
    <Inspector
      title={t("common:inspector.editProfile", "Edit Profile")}
      onClose={onClose}
      className={className}
      data-testid={dataTestId}
    >
      <Inspector.Body>
        <UserCard
          user={targetUser}
          school={activeSchool}
          cohort={activeCohort}
          isNested={true}
          variant="outlined"
          interactive={false}
          editableGithub={true}
          onUpdateGithub={onUpdateGithub}
          showImpersonate={false}
          showDelete={false}
          testId="inspector-user-card"
        />

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <AssignmentSection data-testid="inspector-assignment-section">
            <UserRoleAssignmentPanel
              targetUser={targetUser}
              assignedCohorts={assignedCohorts}
              availableToAdd={availableToAdd}
              schoolMap={schoolMap}
              selectedCohortToAdd={selectedCohortToAdd}
              setSelectedCohortToAdd={setSelectedCohortToAdd}
              handleAdd={handleAdd}
              onRemoveCohort={onRemoveCohort}
              isSubmitting={isSubmitting}
            />
          </AssignmentSection>

          <InspectorActionGroup
            targetStudent={targetUser}
            onImpersonate={onImpersonate}
            onDelete={onDelete}
          />
        </Box>
      </Inspector.Body>
    </Inspector>
  );
}

export { SchoolBadgeInline } from "./UserInspector.components";
