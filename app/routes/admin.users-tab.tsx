import type { SchoolConfig, CohortConfig } from "~/types/institution";
import type { EntityCardData } from "~/components/molecules/EntityCard/EntityCard.types";
import type { AuthUser } from "~/utils/auth";
import FilterBar from "~/components/molecules/FilterBar/FilterBar";
import UserGrid from "~/components/molecules/UserGrid/UserGrid";
import StudentInspector from "~/components/organisms/StudentInspector/StudentInspector";
import { TabPanelContainer, MainColumn, SideColumn } from "./admin.styles";

export interface AdminUsersTabPanelProps {
  searchQuery: string;
  onQueryChange: (query: string) => void;
  roleFilter: string;
  onRoleFilterChange: (role: string) => void;
  schoolFilter: string;
  onSchoolFilterChange: (school: string) => void;
  schools: SchoolConfig[];
  cohortFilter: string;
  onCohortFilterChange: (cohort: string) => void;
  cohorts: CohortConfig[];
  startYearMin: number | null;
  onStartYearMinChange: (year: number | null) => void;
  startYearMax: number | null;
  onStartYearMaxChange: (year: number | null) => void;
  filteredUsers: EntityCardData[];
  selectedUser: EntityCardData | null;
  onUserClick: (user: EntityCardData) => void;
  onCreateNewUser: () => void;
  onImpersonate: (user: EntityCardData) => void;
  onDeleteUser: (user: EntityCardData) => void;
  hasInspectorOpen: boolean;
  onCloseInspector: () => void;
  onAddCohort: (params: { studentId: string; cohortId: string }) => void;
  onRemoveCohort: (params: { studentId: string; cohortId: string }) => void;
  onStudentUpdated: (updatedUser: AuthUser) => void;
  onUpdateGithub: (studentId: string, githubUsername: string) => void;
  isSubmitting: boolean;
}

export function AdminUsersTabPanel({
  searchQuery,
  onQueryChange,
  roleFilter,
  onRoleFilterChange,
  schoolFilter,
  onSchoolFilterChange,
  schools,
  cohortFilter,
  onCohortFilterChange,
  cohorts,
  startYearMin,
  onStartYearMinChange,
  startYearMax,
  onStartYearMaxChange,
  filteredUsers,
  selectedUser,
  onUserClick,
  onCreateNewUser,
  onImpersonate,
  onDeleteUser,
  hasInspectorOpen,
  onCloseInspector,
  onAddCohort,
  onRemoveCohort,
  onStudentUpdated,
  onUpdateGithub,
  isSubmitting,
}: AdminUsersTabPanelProps) {
  return (
    <TabPanelContainer
      hasSidePanel={hasInspectorOpen}
      role="tabpanel"
      id="admin-tabpanel-0"
      aria-labelledby="admin-tab-0"
      data-testid="admin-tabpanel-users"
    >
      <MainColumn>
        <FilterBar
          query={searchQuery}
          onQueryChange={onQueryChange}
          roleFilter={roleFilter}
          onRoleFilterChange={onRoleFilterChange}
          schoolFilter={schoolFilter}
          onSchoolFilterChange={onSchoolFilterChange}
          schools={schools}
          cohortFilter={cohortFilter}
          onCohortFilterChange={onCohortFilterChange}
          cohorts={cohorts}
          startYearMin={startYearMin}
          onStartYearMinChange={onStartYearMinChange}
          startYearMax={startYearMax}
          onStartYearMaxChange={onStartYearMaxChange}
        />
        <UserGrid
          students={filteredUsers}
          selectedStudentId={selectedUser?.id}
          onStudentClick={onUserClick}
          onAddUser={onCreateNewUser}
          onImpersonate={onImpersonate}
          onDelete={onDeleteUser}
          testId="admin-user-grid"
          showHeader={false}
        />
      </MainColumn>

      {hasInspectorOpen && (
        <SideColumn>
          <StudentInspector
            student={selectedUser}
            schools={schools}
            cohorts={cohorts}
            onClose={onCloseInspector}
            onAddCohort={onAddCohort}
            onRemoveCohort={onRemoveCohort}
            onStudentUpdated={onStudentUpdated}
            onUpdateGithub={onUpdateGithub}
            onImpersonate={onImpersonate}
            onDelete={onDeleteUser}
            isSubmitting={isSubmitting}
            data-testid="admin-student-inspector"
          />
        </SideColumn>
      )}
    </TabPanelContainer>
  );
}
