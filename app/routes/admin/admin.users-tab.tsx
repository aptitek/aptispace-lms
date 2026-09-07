import { useTranslation } from "react-i18next";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type { SchoolConfig, CohortConfig } from "~/types/institution";
import type { UserCardData } from "~/components/molecules/UserCard/UserCard.types";
import type { AuthUser } from "~/utils/auth";
import Filter from "~/components/molecules/Filter/Filter";
import RoleChip from "~/components/molecules/RoleChip/RoleChip";
import InstitutionLogo from "~/components/molecules/InstitutionLogo/InstitutionLogo";
import UserGrid from "~/components/organisms/UserGrid/UserGrid";
import UserInspector from "~/components/organisms/UserInspector/UserInspector";
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
  filteredUsers: UserCardData[];
  selectedUser: UserCardData | null;
  onUserClick: (user: UserCardData) => void;
  onCreateNewUser: () => void;
  onImpersonate: (user: UserCardData) => void;
  onDeleteUser: (user: UserCardData) => void;
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
  const { t } = useTranslation(["common"]);

  const schoolOptions = [
    {
      value: "all",
      label: t("filterBar.allSchools", "All Schools"),
    },
    ...schools.map((school) => ({
      value: school.id,
      label: (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {school.logoUrl && (
            <InstitutionLogo
              logoUrl={school.logoUrl}
              name={school.name}
              height={18}
              maxWidth={80}
              fallback={null}
            />
          )}
          <Typography variant="body2">{school.name}</Typography>
        </Box>
      ),
    })),
  ];

  const cohortOptions = [
    {
      value: "all",
      label: t("filterBar.allCohorts", "All Cohorts"),
    },
    ...cohorts
      .filter(
        (c) =>
          schoolFilter === "all" ||
          !schoolFilter ||
          c.institutionId === schoolFilter,
      )
      .map((cohort) => ({
        value: cohort.id ?? "",
        label: cohort.name ?? "",
      })),
  ];

  return (
    <TabPanelContainer
      hasSidePanel={hasInspectorOpen}
      role="tabpanel"
      id="admin-tabpanel-0"
      aria-labelledby="admin-tab-0"
      data-testid="admin-tabpanel-users"
    >
      <MainColumn>
        <Filter testId="generic-filter-bar">
          <Filter.Select
            label={t("filterBar.role", "Role")}
            value={roleFilter}
            onChange={onRoleFilterChange}
            minWidth={170}
            testId="filter-role-select"
            options={[
              { value: "all", chip: <RoleChip userRole="all" size="small" /> },
              {
                value: "student",
                chip: <RoleChip userRole="student" size="small" />,
              },
              {
                value: "instructor",
                chip: <RoleChip userRole="instructor" size="small" />,
              },
              {
                value: "admin",
                chip: <RoleChip userRole="admin" size="small" />,
              },
            ]}
          />
          <Filter.Select
            label={t("filterBar.school", "School")}
            value={schoolFilter}
            onChange={onSchoolFilterChange}
            minWidth={200}
            testId="filter-school-select"
            renderValue={(selectedId) => {
              if (selectedId === "all") {
                return t("filterBar.allSchools", "All Schools");
              }
              const found = schools.find((s) => s.id === selectedId);
              return (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  {found?.logoUrl && (
                    <InstitutionLogo
                      logoUrl={found.logoUrl}
                      name={found.name}
                      height={18}
                      maxWidth={80}
                      fallback={null}
                    />
                  )}
                  <Typography variant="body2">
                    {found?.name || selectedId}
                  </Typography>
                </Box>
              );
            }}
            options={schoolOptions}
          />
          <Filter.Select
            label={t("filterBar.cohort", "Cohort")}
            value={cohortFilter}
            onChange={onCohortFilterChange}
            minWidth={200}
            testId="filter-cohort-select"
            options={cohortOptions}
          />
          <Filter.Range
            startYearMin={startYearMin}
            startYearMax={startYearMax}
            onStartYearMinChange={onStartYearMinChange}
            onStartYearMaxChange={onStartYearMaxChange}
            testId="filter-year-range"
          />
          <Filter.Spacer />
          <Filter.Search
            value={searchQuery}
            onChange={onQueryChange}
            placeholder={t("filterBar.searchPlaceholder", "Search users...")}
            testId="filter-search-input"
          />
        </Filter>
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
          <UserInspector
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
