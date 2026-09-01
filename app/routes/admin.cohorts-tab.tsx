import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type { SchoolConfig, CohortConfig } from "~/types/institution";
import type { CohortWithInstitution } from "~/components/organisms/StudentInspector/StudentInspector.types";
import SchoolCard, {
  SchoolCardSkeleton,
} from "~/components/molecules/SchoolCard/SchoolCard";
import CohortCard, {
  CohortCardSkeleton,
} from "~/components/molecules/CohortCard/CohortCard";
import InstitutionInspector from "~/components/organisms/InstitutionInspector/InstitutionInspector";
import CohortInspector from "~/components/organisms/CohortInspector/CohortInspector";
import {
  TabPanelContainer,
  MainColumn,
  SideColumn,
  MD3CollectionGrid,
} from "./admin.styles";

export interface AdminCohortsTabPanelProps {
  schools: SchoolConfig[];
  cohorts: CohortWithInstitution[];
  schoolStudentCounts: Record<string, number>;
  cohortStudentCounts: Record<string, number>;
  selectedSchool: SchoolConfig | null;
  selectedSchoolForEdit: SchoolConfig | null;
  selectedCohortForEdit: CohortWithInstitution | null;
  onSchoolClick: (school: SchoolConfig) => void;
  onCohortClick: (cohort: CohortConfig) => void;
  onCreateNewSchool: () => void;
  onCreateNewCohort: () => void;
  onCloseSchoolEdit: () => void;
  onCloseCohortEdit: () => void;
  onSaveInstitution: (payload: {
    id?: string;
    name: string;
    slug: string;
    logoUrl?: string;
  }) => void;
  onSaveCohort: (payload: {
    id?: string;
    name: string;
    description?: string;
    startDate?: string;
    endDate?: string;
  }) => void;
  isSubmitting: boolean;
}

export function AdminCohortsTabPanel({
  schools,
  cohorts,
  schoolStudentCounts,
  cohortStudentCounts,
  selectedSchool,
  selectedSchoolForEdit,
  selectedCohortForEdit,
  onSchoolClick,
  onCohortClick,
  onCreateNewSchool,
  onCreateNewCohort,
  onCloseSchoolEdit,
  onCloseCohortEdit,
  onSaveInstitution,
  onSaveCohort,
  isSubmitting,
}: AdminCohortsTabPanelProps) {
  const hasCohortsInspectorOpen = Boolean(
    selectedSchoolForEdit || selectedCohortForEdit,
  );

  return (
    <TabPanelContainer
      hasSidePanel={hasCohortsInspectorOpen}
      role="tabpanel"
      id="admin-tabpanel-1"
      aria-labelledby="admin-tab-1"
      data-testid="admin-tabpanel-cohorts"
    >
      <MainColumn>
        <Box>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
            Schools & Institutions
          </Typography>
          <MD3CollectionGrid data-testid="schools-zone">
            {schools.map((school) => (
              <SchoolCard
                key={school.id || school.name}
                school={school}
                studentCount={
                  school.id ? schoolStudentCounts[school.id] || 0 : 0
                }
                isSelected={Boolean(
                  selectedSchool?.id && selectedSchool.id === school.id,
                )}
                onClick={onSchoolClick}
              />
            ))}
            <SchoolCardSkeleton onClick={onCreateNewSchool} />
          </MD3CollectionGrid>
        </Box>

        {selectedSchool && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
              Cohorts for {selectedSchool.name}
            </Typography>
            <MD3CollectionGrid data-testid="cohorts-zone">
              {cohorts
                .filter((c) => c.institutionId === selectedSchool.id)
                .map((cohort) => (
                  <CohortCard
                    key={cohort.id || cohort.name}
                    cohort={cohort}
                    studentCount={
                      cohort.id ? cohortStudentCounts[cohort.id] || 0 : 0
                    }
                    onClick={onCohortClick}
                  />
                ))}
              <CohortCardSkeleton onClick={onCreateNewCohort} />
            </MD3CollectionGrid>
          </Box>
        )}
      </MainColumn>

      {hasCohortsInspectorOpen && (
        <SideColumn>
          {selectedSchoolForEdit && (
            <InstitutionInspector
              institution={selectedSchoolForEdit}
              onClose={onCloseSchoolEdit}
              onSave={onSaveInstitution}
              isSubmitting={isSubmitting}
            />
          )}

          {selectedCohortForEdit && (
            <CohortInspector
              cohort={selectedCohortForEdit}
              onClose={onCloseCohortEdit}
              onSave={onSaveCohort}
              isSubmitting={isSubmitting}
            />
          )}
        </SideColumn>
      )}
    </TabPanelContainer>
  );
}
export default AdminCohortsTabPanel;
