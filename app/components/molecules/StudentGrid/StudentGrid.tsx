import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import { CardZone } from "deckfx";
import ProfileCardCompact from "../ProfileCardCompact/ProfileCardCompact";
import type { StudentGridProps } from "./StudentGrid.types";
import type { CompactStudentData } from "../ProfileCardCompact/ProfileCardCompact.types";
import type { SchoolConfig, CohortConfig } from "~/types/institution";
import {
  GridContainer,
  ControlsHeader,
  ControlsLeft,
  CollectionTitle,
  ControlsRight,
  GridSearchField,
  ZoneWrapper,
  EmptyGridContainer,
} from "./StudentGrid.styles";

function matchesStudentSearch(
  student: CompactStudentData,
  query: string,
): boolean {
  const name =
    `${student.firstName} ${student.familyName} ${student.displayName || ""}`.toLowerCase();
  const email = (student.email || "").toLowerCase();
  const github = (student.githubUsername || "").toLowerCase();
  const cohortName = (student.cohortName || "").toLowerCase();

  return (
    name.includes(query) ||
    email.includes(query) ||
    github.includes(query) ||
    cohortName.includes(query)
  );
}

function filterStudents(
  students: CompactStudentData[],
  rawQuery: string,
): CompactStudentData[] {
  const query = rawQuery.toLowerCase().trim();
  if (!query) return students;
  return students.filter((student) => matchesStudentSearch(student, query));
}

interface GridSearchInputProps {
  query: string;
  onChange: (nextQuery: string) => void;
  onClear: () => void;
}

function GridSearchInput({ query, onChange, onClear }: GridSearchInputProps) {
  const { t } = useTranslation(["common", "auth"]);

  const endAdornment = query ? (
    <InputAdornment position="end">
      <Button
        size="small"
        onClick={onClear}
        sx={{ minWidth: "auto", p: 0.5 }}
        aria-label={t("common:studentGrid.clearSearchAria", "Clear search")}
        data-testid="clear-search-btn"
      >
        <ClearIcon sx={{ fontSize: 16 }} />
      </Button>
    </InputAdornment>
  ) : null;

  return (
    <GridSearchField
      size="small"
      placeholder={t(
        "common:studentGrid.searchPlaceholder",
        "Search by name, email, github...",
      )}
      value={query}
      onChange={(event) => onChange(event.target.value)}
      slotProps={{
        htmlInput: {
          "aria-label": t("common:studentGrid.searchAria", "Search students"),
          "data-testid": "student-grid-search",
        },
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ fontSize: 18, color: "text.secondary" }} />
            </InputAdornment>
          ),
          endAdornment,
        },
      }}
    />
  );
}

interface ControlsHeaderSlotProps {
  title?: React.ReactNode;
  countLabel: string;
  showSearch: boolean;
  activeQuery: string;
  onQueryChange: (query: string) => void;
  onClear: () => void;
}

function ControlsHeaderSlot({
  title,
  countLabel,
  showSearch,
  activeQuery,
  onQueryChange,
  onClear,
}: ControlsHeaderSlotProps) {
  return (
    <ControlsHeader>
      <ControlsLeft>
        {title && (
          <CollectionTitle data-testid="student-grid-title">
            <PeopleAltIcon sx={{ fontSize: 20, color: "primary.main" }} />
            <span>{title}</span>
          </CollectionTitle>
        )}

        <Chip
          label={countLabel}
          size="small"
          color="primary"
          variant="filled"
          sx={{ fontWeight: 700 }}
          data-testid="student-count-badge"
        />
      </ControlsLeft>

      {showSearch && (
        <ControlsRight>
          <GridSearchInput
            query={activeQuery}
            onChange={onQueryChange}
            onClear={onClear}
          />
        </ControlsRight>
      )}
    </ControlsHeader>
  );
}

interface EmptyGridProps {
  message: string;
  hasQuery: boolean;
  onReset: () => void;
}

function EmptyGridState({ message, hasQuery, onReset }: EmptyGridProps) {
  const { t } = useTranslation(["common", "auth"]);

  return (
    <EmptyGridContainer data-testid="student-grid-empty">
      <PeopleAltIcon sx={{ fontSize: 44, opacity: 0.4 }} />
      <Typography variant="body1" sx={{ fontWeight: 600 }}>
        {message}
      </Typography>
      {hasQuery && (
        <Button
          variant="outlined"
          size="small"
          onClick={onReset}
          data-testid="reset-filter-btn"
        >
          {t("common:studentGrid.clearFilter", "Clear filter")}
        </Button>
      )}
    </EmptyGridContainer>
  );
}

interface StudentCardsZoneProps {
  students: CompactStudentData[];
  school?: SchoolConfig;
  cohort?: CohortConfig;
  columns: number;
  gap: number;
  onStudentClick?: (student: CompactStudentData) => void;
  onImpersonate?: (student: CompactStudentData) => void;
  showImpersonate?: boolean;
}

function StudentCardsZone({
  students,
  school,
  cohort,
  columns,
  gap,
  onStudentClick,
  onImpersonate,
  showImpersonate,
}: StudentCardsZoneProps) {
  const isInteractive = Boolean(onStudentClick);

  return (
    <ZoneWrapper data-testid="student-zone-wrapper">
      <CardZone
        layout="grid"
        columns={columns}
        gap={gap}
        zoneId="students-collection"
      >
        {students.map((student: CompactStudentData) => (
          <ProfileCardCompact
            key={student.id}
            student={student}
            school={school}
            cohort={cohort}
            onClick={onStudentClick}
            onImpersonate={onImpersonate}
            showImpersonate={showImpersonate}
            interactive={isInteractive}
            testId={`student-card-${student.id}`}
          />
        ))}
      </CardZone>
    </ZoneWrapper>
  );
}

export function StudentGrid(props: StudentGridProps) {
  const { t } = useTranslation(["common", "auth"]);
  const {
    students,
    school,
    cohort,
    onStudentClick,
    onImpersonate,
    showImpersonate,
    searchQuery: controlledQuery,
    onSearchChange,
    showSearch = true,
    columns = 3,
    gap = 4,
    className,
    testId = "student-grid",
    emptyMessage,
    title,
  } = props;

  const [internalQuery, setInternalQuery] = useState("");
  const activeQuery = controlledQuery ?? internalQuery;

  const resolvedEmptyMessage =
    emptyMessage ||
    t("common:studentGrid.emptyMessage", "No students found in directory");

  const resolvedTitle =
    title !== undefined
      ? title
      : t("common:studentGrid.title", "Registered Students");

  const handleQueryChange = (searchQueryText: string) => {
    if (onSearchChange) {
      onSearchChange(searchQueryText);
    } else {
      setInternalQuery(searchQueryText);
    }
  };

  const handleClear = () => {
    handleQueryChange("");
  };

  const filteredStudents = useMemo(() => {
    return filterStudents(students, activeQuery);
  }, [students, activeQuery]);

  const countLabel = t("common:studentGrid.countBadge", {
    count: filteredStudents.length,
    defaultValue: `${filteredStudents.length} students`,
  });

  return (
    <GridContainer className={className} data-testid={testId}>
      <ControlsHeaderSlot
        title={resolvedTitle}
        countLabel={countLabel}
        showSearch={showSearch}
        activeQuery={activeQuery}
        onQueryChange={handleQueryChange}
        onClear={handleClear}
      />

      {filteredStudents.length === 0 ? (
        <EmptyGridState
          message={resolvedEmptyMessage}
          hasQuery={Boolean(activeQuery)}
          onReset={handleClear}
        />
      ) : (
        <StudentCardsZone
          students={filteredStudents}
          school={school}
          cohort={cohort}
          columns={columns}
          gap={gap}
          onStudentClick={onStudentClick}
          onImpersonate={onImpersonate}
          showImpersonate={showImpersonate}
        />
      )}
    </GridContainer>
  );
}

export default StudentGrid;
