import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type { SchoolConfig, CohortConfig } from "~/types/institution";
import type { CohortWithInstitution } from "~/components/organisms/StudentInspector/StudentInspector.types";
import InstitutionCard, {
  InstitutionCardSkeleton,
} from "~/components/molecules/InstitutionCard/InstitutionCard";
import CohortCard, {
  CohortCardSkeleton,
} from "~/components/molecules/CohortCard/CohortCard";
import Filter from "~/components/molecules/Filter/Filter";
import Chip from "~/components/atoms/Chip/Chip";
import InstitutionInspector from "~/components/organisms/InstitutionInspector/InstitutionInspector";
import CohortInspector from "~/components/organisms/CohortInspector/CohortInspector";
import {
  parseCohortName,
  DIPLOMA_OPTIONS,
  COMMON_SPECIALTY_TAGS,
} from "~/utils/cohortFormat";
import { normalizeInstitutionType } from "~/tokens/institutions";
import {
  matchesCohortFilter,
  isCohortCardSelected,
  renderDiplomaFilterChip,
  renderSpecialtyFilterChip,
} from "./admin.cohorts-tab.helpers";
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
    type?: string;
    logoUrl?: string;
    emailDomain?: string;
    usernamePattern?: string;
  }) => void;
  onSaveCohort: (payload: {
    id?: string;
    name?: string;
    description?: string;
    startDate?: string;
    endDate?: string;
    diploma?: string;
    year?: number | null;
    tags?: string[];
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
  const { t } = useTranslation("common");
  const [institutionQuery, setInstitutionQuery] = useState("");
  const [institutionTypeFilter, setInstitutionTypeFilter] = useState("all");

  const [cohortStartYearMin, setCohortStartYearMin] = useState<number | null>(
    null,
  );
  const [cohortStartYearMax, setCohortStartYearMax] = useState<number | null>(
    null,
  );

  // Cohort Grid Filter State
  const [cohortDiplomaFilter, setCohortDiplomaFilter] = useState<string>("all");
  const [cohortYearFilter, setCohortYearFilter] = useState<string | number>(
    "all",
  );
  const [cohortTagFilter, setCohortTagFilter] = useState<string>("all");
  const [cohortSearchQuery, setCohortSearchQuery] = useState<string>("");

  const hasCohortsInspectorOpen = Boolean(
    selectedSchoolForEdit || selectedCohortForEdit,
  );

  const filteredSchools = useMemo(() => {
    return schools.filter((school) => {
      if (institutionTypeFilter !== "all") {
        const normType = normalizeInstitutionType(school.type);
        const targetNorm = normalizeInstitutionType(institutionTypeFilter);
        if (normType !== targetNorm) return false;
      }
      if (institutionQuery.trim()) {
        const q = institutionQuery.toLowerCase().trim();
        const nameMatch = school.name.toLowerCase().includes(q);
        const slugMatch = school.slug?.toLowerCase().includes(q);
        if (!nameMatch && !slugMatch) return false;
      }
      return true;
    });
  }, [schools, institutionQuery, institutionTypeFilter]);

  const schoolCohorts = useMemo(() => {
    if (!selectedSchool) return [];
    return cohorts.filter((c) => c.institutionId === selectedSchool.id);
  }, [cohorts, selectedSchool]);

  const availableSchoolTags = useMemo(() => {
    const tagSet = new Set<string>();
    schoolCohorts.forEach((c) => {
      const parsed = parseCohortName(c.name);
      const tags = c.tags && c.tags.length > 0 ? c.tags : parsed.tags;
      tags.forEach((tag) => tagSet.add(tag));
    });
    return Array.from(tagSet);
  }, [schoolCohorts]);

  const filteredCohorts = useMemo(() => {
    if (!selectedSchool) return [];
    return schoolCohorts.filter((c) =>
      matchesCohortFilter(c, {
        cohortStartYearMin,
        cohortStartYearMax,
        cohortDiplomaFilter,
        cohortYearFilter,
        cohortTagFilter,
        cohortSearchQuery,
      }),
    );
  }, [
    schoolCohorts,
    selectedSchool,
    cohortStartYearMin,
    cohortStartYearMax,
    cohortDiplomaFilter,
    cohortYearFilter,
    cohortTagFilter,
    cohortSearchQuery,
  ]);

  const allCohortTags = useMemo(() => {
    return Array.from(
      new Set([...availableSchoolTags, ...COMMON_SPECIALTY_TAGS]),
    );
  }, [availableSchoolTags]);

  const hasActiveCohortFilters = useMemo(() => {
    if (cohortSearchQuery.trim().length > 0) return true;
    if (cohortDiplomaFilter !== "all") return true;
    if (cohortYearFilter !== "all" && cohortYearFilter !== "") return true;
    if (cohortTagFilter !== "all") return true;
    return cohortStartYearMin !== null || cohortStartYearMax !== null;
  }, [
    cohortSearchQuery,
    cohortDiplomaFilter,
    cohortYearFilter,
    cohortTagFilter,
    cohortStartYearMin,
    cohortStartYearMax,
  ]);

  const handleClearCohortFilters = () => {
    setCohortSearchQuery("");
    setCohortDiplomaFilter("all");
    setCohortYearFilter("all");
    setCohortTagFilter("all");
    setCohortStartYearMin(null);
    setCohortStartYearMax(null);
  };

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
            {t("admin.schoolsTitle", "Schools & Institutions")}
          </Typography>

          <Filter testId="institution-filter-bar">
            <Filter.Select
              label={t("filterBar.institutionType", "Institution Type")}
              value={institutionTypeFilter}
              onChange={setInstitutionTypeFilter}
              minWidth={180}
              testId="institution-type-filter"
              renderValue={(selectedType) => (
                <Chip institutionType={String(selectedType)} size="small" />
              )}
              options={[
                {
                  value: "all",
                  chip: <Chip institutionType="all" size="small" />,
                },
                {
                  value: "academic",
                  chip: <Chip institutionType="school" size="small" />,
                },
                {
                  value: "company",
                  chip: <Chip institutionType="company" size="small" />,
                },
              ]}
            />
            <Filter.Spacer />
            <Filter.Search
              value={institutionQuery}
              onChange={setInstitutionQuery}
              placeholder={t(
                "filterBar.searchInstitutionsPlaceholder",
                "Search institutions (name, slug)...",
              )}
              minWidth={260}
              testId="institution-search-input"
            />
          </Filter>

          <MD3CollectionGrid data-testid="schools-zone">
            {filteredSchools.map((school) => (
              <InstitutionCard
                key={school.id || school.name}
                school={school}
                studentCount={
                  school.id ? schoolStudentCounts[school.id] || 0 : 0
                }
                isSelected={Boolean(
                  (selectedSchool?.id && selectedSchool.id === school.id) ||
                  (selectedSchoolForEdit?.id &&
                    selectedSchoolForEdit.id === school.id),
                )}
                onClick={onSchoolClick}
              />
            ))}
            <InstitutionCardSkeleton
              variant="ghost"
              onClick={onCreateNewSchool}
            />
          </MD3CollectionGrid>
        </Box>

        {selectedSchool && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
              {t("admin.cohortsForSchool", {
                school: selectedSchool.name,
                defaultValue: `Cohorts for ${selectedSchool.name}`,
              })}
            </Typography>

            <Filter testId="cohort-filter-bar">
              <Filter.Select
                label={t("diplomas.title", "Diploma")}
                value={cohortDiplomaFilter}
                onChange={setCohortDiplomaFilter}
                minWidth={180}
                testId="cohort-diploma-filter"
                renderValue={(selectedDiploma) =>
                  renderDiplomaFilterChip(selectedDiploma, t)
                }
                options={[
                  {
                    value: "all",
                    chip: renderDiplomaFilterChip("all", t),
                  },
                  ...DIPLOMA_OPTIONS.map((opt) => ({
                    value: opt.code,
                    chip: renderDiplomaFilterChip(opt.code, t),
                  })),
                ]}
              />

              <Filter.Number
                label={t("cohortYear.title", "Year")}
                placeholder={t("cohortYear.all", "All")}
                value={cohortYearFilter}
                onChange={setCohortYearFilter}
                min={0}
                max={20}
                testId="cohort-year-filter"
              />

              <Filter.Select
                label={t("filterBar.tag", "Specialty")}
                value={cohortTagFilter}
                onChange={setCohortTagFilter}
                minWidth={180}
                testId="cohort-tag-filter"
                renderValue={(selectedTag) =>
                  renderSpecialtyFilterChip(selectedTag, t)
                }
                options={[
                  {
                    value: "all",
                    chip: renderSpecialtyFilterChip("all", t),
                  },
                  ...allCohortTags.map((tag) => ({
                    value: tag,
                    chip: renderSpecialtyFilterChip(tag, t),
                  })),
                ]}
              />

              <Filter.Range
                startYearMin={cohortStartYearMin}
                startYearMax={cohortStartYearMax}
                onStartYearMinChange={setCohortStartYearMin}
                onStartYearMaxChange={setCohortStartYearMax}
                testId="cohort-year-range"
              />

              {hasActiveCohortFilters && (
                <Filter.Clear
                  onClear={handleClearCohortFilters}
                  testId="cohort-clear-filters"
                  label={t("clearFilters", "Reset")}
                />
              )}

              <Filter.Spacer />

              <Filter.Search
                placeholder={t(
                  "filterBar.searchCohortsPlaceholder",
                  "Search cohorts (name, tag, year)...",
                )}
                value={cohortSearchQuery}
                onChange={setCohortSearchQuery}
                minWidth={260}
                testId="cohort-search-input"
              />
            </Filter>

            <MD3CollectionGrid data-testid="cohorts-zone">
              {filteredCohorts.map((cohort) => (
                <CohortCard
                  key={cohort.id || cohort.name}
                  cohort={cohort}
                  studentCount={
                    cohort.id ? cohortStudentCounts[cohort.id] || 0 : 0
                  }
                  isSelected={isCohortCardSelected(
                    cohort,
                    selectedCohortForEdit,
                  )}
                  onClick={onCohortClick}
                />
              ))}
              <CohortCardSkeleton variant="ghost" onClick={onCreateNewCohort} />
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
