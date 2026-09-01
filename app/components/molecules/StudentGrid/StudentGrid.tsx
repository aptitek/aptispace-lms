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
import ProfileCardSkeleton from "../ProfileCardCompact/ProfileCardSkeleton";
import type { StudentGridProps } from "./StudentGrid.types";
import type { CompactStudentData } from "../ProfileCardCompact/ProfileCardCompact.types";
import type { SchoolConfig, CohortConfig } from "~/types/institution";
import {
  useStudentGridLogic,
  STATIC_PLACEHOLDER_KEYS,
  SKELETON_SLOT_KEYS,
} from "./StudentGrid.helpers";
import {
  GridContainer,
  ControlsHeader,
  ControlsLeft,
  CollectionTitle,
  ControlsRight,
  GridSearchField,
  ZoneWrapper,
  EmptyGridContainer,
  EmptyStateWrapper,
  EmptyPlaceholderGrid,
  LoadingSentinel,
} from "./StudentGrid.styles";

interface GridSearchInputProps {
  query: string;
  placeholder?: string;
  ariaLabel?: string;
  onChange: (nextQuery: string) => void;
  onClear: () => void;
}

function GridSearchInput({
  query,
  placeholder,
  ariaLabel,
  onChange,
  onClear,
}: GridSearchInputProps) {
  const { t } = useTranslation(["common", "auth"]);

  const resolvedPlaceholder =
    placeholder ||
    t(
      "common:studentGrid.searchPlaceholder",
      "Search by name, email, github...",
    );
  const resolvedAriaLabel =
    ariaLabel || t("common:studentGrid.searchAria", "Search directory");

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
      placeholder={resolvedPlaceholder}
      value={query}
      onChange={(event) => onChange(event.target.value)}
      slotProps={{
        htmlInput: {
          "aria-label": resolvedAriaLabel,
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
  icon?: React.ReactNode;
  countLabel: string;
  showSearch: boolean;
  activeQuery: string;
  searchPlaceholder?: string;
  searchAriaLabel?: string;
  onQueryChange: (query: string) => void;
  onClear: () => void;
}

function ControlsHeaderSlot({
  title,
  icon,
  countLabel,
  showSearch,
  activeQuery,
  searchPlaceholder,
  searchAriaLabel,
  onQueryChange,
  onClear,
}: ControlsHeaderSlotProps) {
  const resolvedIcon = icon || (
    <PeopleAltIcon sx={{ fontSize: 20, color: "primary.main" }} />
  );

  return (
    <ControlsHeader>
      <ControlsLeft>
        {title && (
          <CollectionTitle data-testid="student-grid-title">
            {resolvedIcon}
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
            placeholder={searchPlaceholder}
            ariaLabel={searchAriaLabel}
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
  placeholderCount: number;
  onReset: () => void;
}

function EmptyGridState({
  message,
  hasQuery,
  placeholderCount,
  onReset,
}: EmptyGridProps) {
  const { t } = useTranslation(["common", "auth"]);
  const placeholderKeys = STATIC_PLACEHOLDER_KEYS.slice(0, placeholderCount);

  return (
    <EmptyStateWrapper data-testid="student-grid-empty-state">
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

      {placeholderCount > 0 && (
        <EmptyPlaceholderGrid data-testid="static-skeleton-placeholders">
          {placeholderKeys.map((slotKey) => (
            <ProfileCardSkeleton
              key={slotKey}
              variant="static"
              animated={false}
              opacity={0.35}
              testId={slotKey}
            />
          ))}
        </EmptyPlaceholderGrid>
      )}
    </EmptyStateWrapper>
  );
}

interface LoadingSkeletonZoneProps {
  count: number;
  columns: number;
  gap: number;
}

function LoadingSkeletonZone({
  count,
  columns,
  gap,
}: LoadingSkeletonZoneProps) {
  const keys = SKELETON_SLOT_KEYS.slice(0, count);

  return (
    <ZoneWrapper data-testid="grid-skeleton-loading-zone">
      <CardZone
        layout="grid"
        columns={columns}
        gap={gap}
        zoneId="skeleton-collection"
      >
        {keys.map((slotKey) => (
          <ProfileCardSkeleton
            key={slotKey}
            variant="shimmer"
            animated={true}
            testId={slotKey}
          />
        ))}
      </CardZone>
    </ZoneWrapper>
  );
}

interface StudentCardsZoneProps {
  students: CompactStudentData[];
  school?: SchoolConfig;
  cohort?: CohortConfig;
  columns: number;
  gap: number;
  zoneId?: string;
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
  zoneId = "students-collection",
  onStudentClick,
  onImpersonate,
  showImpersonate,
}: StudentCardsZoneProps) {
  const isInteractive = Boolean(onStudentClick);

  return (
    <ZoneWrapper data-testid="student-zone-wrapper">
      <CardZone layout="grid" columns={columns} gap={gap} zoneId={zoneId}>
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

interface GridBodyProps {
  filteredStudents: CompactStudentData[];
  displayedStudents: CompactStudentData[];
  resolvedEmptyMessage: string;
  hasQuery: boolean;
  emptyPlaceholderCount: number;
  lazy: boolean;
  visibleCount: number;
  isInstructor: boolean;
  school?: SchoolConfig;
  cohort?: CohortConfig;
  columns: number;
  gap: number;
  onStudentClick?: (student: CompactStudentData) => void;
  onImpersonate?: (student: CompactStudentData) => void;
  showImpersonate?: boolean;
  sentinelRef: React.RefObject<HTMLDivElement | null>;
  onClear: () => void;
}

function GridBody({
  filteredStudents,
  displayedStudents,
  resolvedEmptyMessage,
  hasQuery,
  emptyPlaceholderCount,
  lazy,
  visibleCount,
  isInstructor,
  school,
  cohort,
  columns,
  gap,
  onStudentClick,
  onImpersonate,
  showImpersonate,
  sentinelRef,
  onClear,
}: GridBodyProps) {
  if (filteredStudents.length === 0) {
    return (
      <EmptyGridState
        message={resolvedEmptyMessage}
        hasQuery={hasQuery}
        placeholderCount={emptyPlaceholderCount}
        onReset={onClear}
      />
    );
  }

  const zoneId = isInstructor
    ? "instructors-collection"
    : "students-collection";

  return (
    <>
      <StudentCardsZone
        students={displayedStudents}
        school={school}
        cohort={cohort}
        columns={columns}
        gap={gap}
        zoneId={zoneId}
        onStudentClick={onStudentClick}
        onImpersonate={onImpersonate}
        showImpersonate={showImpersonate}
      />
      {lazy && visibleCount < filteredStudents.length && (
        <LoadingSentinel
          ref={sentinelRef}
          data-testid="lazy-loading-sentinel"
        />
      )}
    </>
  );
}

export function StudentGrid(props: StudentGridProps) {
  const logic = useStudentGridLogic(props);

  return (
    <GridContainer className={props.className} data-testid={logic.testId}>
      <ControlsHeaderSlot
        title={logic.resolvedTitle}
        icon={props.icon}
        countLabel={logic.isLoading ? "…" : logic.countBadge}
        showSearch={logic.showSearch}
        activeQuery={logic.activeQuery}
        searchPlaceholder={props.searchPlaceholder}
        searchAriaLabel={props.searchAriaLabel}
        onQueryChange={logic.handleQueryChange}
        onClear={() => logic.handleQueryChange("")}
      />

      {logic.isLoading ? (
        <LoadingSkeletonZone
          count={logic.skeletonCount}
          columns={logic.columns}
          gap={logic.gap}
        />
      ) : (
        <GridBody
          filteredStudents={logic.filteredStudents}
          displayedStudents={logic.displayedStudents}
          resolvedEmptyMessage={logic.resolvedEmptyMessage}
          hasQuery={Boolean(logic.activeQuery)}
          emptyPlaceholderCount={logic.emptyPlaceholderCount}
          lazy={logic.lazy}
          visibleCount={logic.visibleCount}
          isInstructor={logic.isInstructor}
          school={props.school}
          cohort={props.cohort}
          columns={logic.columns}
          gap={logic.gap}
          onStudentClick={props.onStudentClick}
          onImpersonate={props.onImpersonate}
          showImpersonate={props.showImpersonate}
          sentinelRef={logic.sentinelRef}
          onClear={() => logic.handleQueryChange("")}
        />
      )}
    </GridContainer>
  );
}

export default StudentGrid;
