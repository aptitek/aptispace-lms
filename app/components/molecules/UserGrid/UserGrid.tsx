import { useTranslation } from "react-i18next";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import EntityCard from "../EntityCard/EntityCard";
import EntityCardSkeleton from "../EntityCard/EntityCardSkeleton";
import type { UserGridProps } from "./UserGrid.types";
import type { EntityCardData } from "../EntityCard/EntityCard.types";
import type { SchoolConfig, CohortConfig } from "~/types/institution";
import {
  useUserGridLogic,
  STATIC_PLACEHOLDER_KEYS,
  SKELETON_SLOT_KEYS,
} from "./UserGrid.helpers";
import {
  GridContainer,
  ControlsHeader,
  ControlsLeft,
  CollectionTitle,
  ControlsRight,
  GridSearchField,
  MD3CollectionGrid,
  EmptyGridContainer,
  EmptyStateWrapper,
  EmptyPlaceholderGrid,
  LoadingSentinel,
} from "./UserGrid.styles";

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
    t("common:userGrid.searchPlaceholder", "Search by name, email, github...");
  const resolvedAriaLabel =
    ariaLabel || t("common:userGrid.searchAria", "Search directory");

  const endAdornment = query ? (
    <InputAdornment position="end">
      <Button
        size="small"
        onClick={onClear}
        sx={{ minWidth: "auto", p: 0.5 }}
        aria-label={t("common:userGrid.clearSearchAria", "Clear search")}
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
          "data-testid": "user-grid-search",
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
          <CollectionTitle data-testid="user-grid-title">
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
          data-testid="user-count-badge"
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
    <EmptyStateWrapper data-testid="user-grid-empty-state">
      <EmptyGridContainer data-testid="user-grid-empty">
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
            {t("common:userGrid.clearFilter", "Clear filter")}
          </Button>
        )}
      </EmptyGridContainer>

      {placeholderCount > 0 && (
        <EmptyPlaceholderGrid data-testid="static-skeleton-placeholders">
          {placeholderKeys.map((slotKey) => (
            <EntityCardSkeleton
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
}

function LoadingSkeletonZone({ count }: LoadingSkeletonZoneProps) {
  const keys = SKELETON_SLOT_KEYS.slice(0, count);

  return (
    <MD3CollectionGrid data-testid="grid-skeleton-loading-zone">
      {keys.map((slotKey) => (
        <EntityCardSkeleton
          key={slotKey}
          variant="shimmer"
          animated={true}
          testId={slotKey}
        />
      ))}
    </MD3CollectionGrid>
  );
}

interface UserCardsZoneProps {
  students: EntityCardData[];
  school?: SchoolConfig;
  cohort?: CohortConfig;
  zoneId?: string;
  onStudentClick?: (student: EntityCardData) => void;
  onImpersonate?: (student: EntityCardData) => void;
  showImpersonate?: boolean;
  onDelete?: (student: EntityCardData) => void;
  showDelete?: boolean;
}

function UserCardsZone({
  students,
  school,
  cohort,
  zoneId = "users-collection",
  onStudentClick,
  onImpersonate,
  showImpersonate,
  onDelete,
  showDelete,
}: UserCardsZoneProps) {
  const isInteractive = Boolean(onStudentClick);

  return (
    <MD3CollectionGrid data-testid="user-zone-wrapper" id={zoneId}>
      {students.map((student: EntityCardData) => (
        <EntityCard
          key={student.id}
          entity={student}
          school={school}
          cohort={cohort}
          onClick={onStudentClick}
          onImpersonate={onImpersonate}
          showImpersonate={showImpersonate}
          onDelete={onDelete}
          showDelete={showDelete}
          interactive={isInteractive}
          testId={`user-card-${student.id}`}
        />
      ))}
    </MD3CollectionGrid>
  );
}

interface GridBodyProps {
  filteredStudents: EntityCardData[];
  displayedStudents: EntityCardData[];
  resolvedEmptyMessage: string;
  hasQuery: boolean;
  emptyPlaceholderCount: number;
  lazy: boolean;
  visibleCount: number;
  isInstructor: boolean;
  school?: SchoolConfig;
  cohort?: CohortConfig;
  onStudentClick?: (student: EntityCardData) => void;
  onImpersonate?: (student: EntityCardData) => void;
  showImpersonate?: boolean;
  onDelete?: (student: EntityCardData) => void;
  showDelete?: boolean;
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
  onStudentClick,
  onImpersonate,
  showImpersonate,
  onDelete,
  showDelete,
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

  const zoneId = isInstructor ? "instructors-collection" : "users-collection";

  return (
    <>
      <UserCardsZone
        students={displayedStudents}
        school={school}
        cohort={cohort}
        zoneId={zoneId}
        onStudentClick={onStudentClick}
        onImpersonate={onImpersonate}
        showImpersonate={showImpersonate}
        onDelete={onDelete}
        showDelete={showDelete}
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

export function UserGrid(props: UserGridProps) {
  const logic = useUserGridLogic(props);

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
        <LoadingSkeletonZone count={logic.skeletonCount} />
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
          onStudentClick={props.onStudentClick}
          onImpersonate={props.onImpersonate}
          showImpersonate={props.showImpersonate}
          onDelete={props.onDelete}
          showDelete={props.showDelete}
          sentinelRef={logic.sentinelRef}
          onClear={() => logic.handleQueryChange("")}
        />
      )}
    </GridContainer>
  );
}

export default UserGrid;
