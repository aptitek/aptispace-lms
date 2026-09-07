import { useTranslation } from "react-i18next";
import Chip from "~/components/atoms/Chip/Chip";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import InputAdornment from "@mui/material/InputAdornment";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import UserCard from "~/components/molecules/UserCard/UserCard";
import UserCardSkeleton from "~/components/molecules/UserCard/UserCardSkeleton";
import type { UserGridProps } from "./UserGrid.types";
import type { UserCardData } from "~/components/molecules/UserCard/UserCard.types";
import type { SchoolConfig, CohortConfig } from "~/types/institution";
import UserGridSkeleton, {
  type UserGridSkeletonProps,
} from "./UserGridSkeleton";

export { UserGridSkeleton };
export type { UserGridSkeletonProps };
import { useUserGridLogic, STATIC_PLACEHOLDER_KEYS } from "./UserGrid.helpers";
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
        <ClearRoundedIcon sx={{ fontSize: 16 }} />
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
              <SearchRoundedIcon
                sx={{ fontSize: 18, color: "text.secondary" }}
              />
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
    <PeopleAltRoundedIcon sx={{ fontSize: 20, color: "primary.main" }} />
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
        <PeopleAltRoundedIcon sx={{ fontSize: 44, opacity: 0.4 }} />
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
            <UserCardSkeleton
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

interface UserCardsZoneProps {
  students: UserCardData[];
  selectedStudentId?: string | null;
  school?: SchoolConfig;
  cohort?: CohortConfig;
  zoneId?: string;
  onStudentClick?: (student: UserCardData) => void;
  onImpersonate?: (student: UserCardData) => void;
  showImpersonate?: boolean;
  onDelete?: (student: UserCardData) => void;
  showDelete?: boolean;
  onAddUser?: () => void;
  showAddUser?: boolean;
  addUserTooltip?: string;
}

function UserCardsZone({
  students,
  selectedStudentId,
  school,
  cohort,
  zoneId = "users-collection",
  onStudentClick,
  onImpersonate,
  showImpersonate,
  onDelete,
  showDelete,
  onAddUser,
  showAddUser,
  addUserTooltip,
}: UserCardsZoneProps) {
  const isInteractive = Boolean(onStudentClick);
  const shouldRenderGhost = Boolean(showAddUser ?? Boolean(onAddUser));

  return (
    <MD3CollectionGrid data-testid="user-zone-wrapper" id={zoneId}>
      {students.map((student: UserCardData) => (
        <UserCard
          key={student.id}
          user={student}
          school={school}
          cohort={cohort}
          isSelected={Boolean(
            selectedStudentId && selectedStudentId === student.id,
          )}
          onClick={onStudentClick}
          onImpersonate={onImpersonate}
          showImpersonate={showImpersonate}
          onDelete={onDelete}
          showDelete={showDelete}
          interactive={isInteractive}
          testId={`user-card-${student.id}`}
        />
      ))}
      {shouldRenderGhost && (
        <UserCardSkeleton
          variant="ghost"
          isGhost
          onClick={onAddUser}
          tooltipTitle={addUserTooltip}
          testId="user-card-skeleton-ghost"
        />
      )}
    </MD3CollectionGrid>
  );
}

interface GridBodyProps {
  filteredStudents: UserCardData[];
  displayedStudents: UserCardData[];
  selectedStudentId?: string | null;
  resolvedEmptyMessage: string;
  hasQuery: boolean;
  emptyPlaceholderCount: number;
  lazy: boolean;
  visibleCount: number;
  isInstructor: boolean;
  school?: SchoolConfig;
  cohort?: CohortConfig;
  onStudentClick?: (student: UserCardData) => void;
  onImpersonate?: (student: UserCardData) => void;
  showImpersonate?: boolean;
  onDelete?: (student: UserCardData) => void;
  showDelete?: boolean;
  onAddUser?: () => void;
  showAddUser?: boolean;
  addUserTooltip?: string;
  sentinelRef: React.RefObject<HTMLDivElement | null>;
  onClear: () => void;
}

function GridBody({
  filteredStudents,
  displayedStudents,
  selectedStudentId,
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
  onAddUser,
  showAddUser,
  addUserTooltip,
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
        selectedStudentId={selectedStudentId}
        school={school}
        cohort={cohort}
        zoneId={zoneId}
        onStudentClick={onStudentClick}
        onImpersonate={onImpersonate}
        showImpersonate={showImpersonate}
        onDelete={onDelete}
        showDelete={showDelete}
        onAddUser={onAddUser}
        showAddUser={showAddUser}
        addUserTooltip={addUserTooltip}
      />
      {lazy && visibleCount < filteredStudents.length && (
        <UserGridSkeleton isLazy count={0} sentinelRef={sentinelRef} />
      )}
    </>
  );
}

export function UserGrid(props: UserGridProps) {
  const { t } = useTranslation(["common", "admin"]);
  const logic = useUserGridLogic(props);
  const resolvedAddUserTooltip =
    props.addUserTooltip ||
    (props.userType === "instructor"
      ? t("common:admin.addInstructor", "Add Instructor")
      : props.userType === "student"
        ? t("common:admin.addStudent", "Add Student")
        : t("common:admin.addUser", "Add User"));

  return (
    <GridContainer className={props.className} data-testid={logic.testId}>
      {logic.showHeader && (
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
      )}

      {logic.isLoading ? (
        <UserGridSkeleton
          count={logic.skeletonCount}
          showHeader={false}
          testId="user-grid-loading-skeletons"
        />
      ) : (
        <GridBody
          filteredStudents={logic.filteredStudents}
          displayedStudents={logic.displayedStudents}
          selectedStudentId={props.selectedStudentId}
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
          onAddUser={props.onAddUser}
          showAddUser={props.showAddUser}
          addUserTooltip={resolvedAddUserTooltip}
          sentinelRef={logic.sentinelRef}
          onClear={() => logic.handleQueryChange("")}
        />
      )}
    </GridContainer>
  );
}

export default UserGrid;
