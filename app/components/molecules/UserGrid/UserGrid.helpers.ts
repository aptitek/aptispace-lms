import { useState, useMemo, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import type { TFunction } from "i18next";
import type { UserGridProps } from "./UserGrid.types";
import type { EntityCardData } from "../EntityCard/EntityCard.types";

export function matchesStudentSearch(
  student: EntityCardData,
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

export function filterStudents(
  students: EntityCardData[],
  rawQuery: string,
): EntityCardData[] {
  const query = rawQuery.toLowerCase().trim();
  if (!query) return students;
  return students.filter((student) => matchesStudentSearch(student, query));
}

export const STATIC_PLACEHOLDER_KEYS = [
  "static-slot-1",
  "static-slot-2",
  "static-slot-3",
  "static-slot-4",
  "static-slot-5",
  "static-slot-6",
];

export const SKELETON_SLOT_KEYS = [
  "sk-slot-1",
  "sk-slot-2",
  "sk-slot-3",
  "sk-slot-4",
  "sk-slot-5",
  "sk-slot-6",
  "sk-slot-7",
  "sk-slot-8",
];

export interface LazySentinelOptions {
  lazy: boolean;
  isLoading: boolean;
  visibleCount: number;
  totalCount: number;
  pageSize: number;
  onLoadMore: (increment: number) => void;
}

export function useLazySentinel(options: LazySentinelOptions) {
  const { lazy, isLoading, visibleCount, totalCount, pageSize, onLoadMore } =
    options;
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!lazy || isLoading || visibleCount >= totalCount) return;

    const currentSentinel = sentinelRef.current;
    if (!currentSentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          onLoadMore(pageSize);
        }
      },
      { rootMargin: "150px" },
    );

    observer.observe(currentSentinel);
    return () => observer.disconnect();
  }, [lazy, isLoading, visibleCount, totalCount, pageSize, onLoadMore]);

  return sentinelRef;
}

export function resolveGridMeta(
  isInstructor: boolean,
  filteredCount: number,
  t: TFunction,
) {
  const defaultEmptyMsg = isInstructor
    ? t(
        "common:instructorGrid.emptyMessage",
        "No instructors found in directory",
      )
    : t("common:studentGrid.emptyMessage", "No students found in directory");

  const defaultTitle = isInstructor
    ? t("common:instructorGrid.title", "Registered Instructors")
    : t("common:studentGrid.title", "Registered Students");

  const countBadge = isInstructor
    ? t("common:instructorGrid.countBadge", {
        count: filteredCount,
        defaultValue: `${filteredCount} instructors`,
      })
    : t("common:studentGrid.countBadge", {
        count: filteredCount,
        defaultValue: `${filteredCount} students`,
      });

  return { defaultEmptyMsg, defaultTitle, countBadge };
}

function extractGridOptions(props: UserGridProps) {
  return {
    userType: props.userType || "student",
    isLoading: Boolean(props.isLoading),
    lazy: props.lazy !== false,
    pageSize: props.pageSize || 6,
    columns: props.columns || 3,
    gap: props.gap || 4,
    testId: props.testId || "student-grid",
    showSearch: props.showSearch !== false,
    skeletonCount: props.skeletonCount || 6,
    emptyPlaceholderCount: props.emptyPlaceholderCount ?? 3,
  };
}

export function useUserGridLogic(props: UserGridProps) {
  const { t } = useTranslation(["common", "auth"]);
  const options = extractGridOptions(props);

  const [internalQuery, setInternalQuery] = useState("");
  const activeQuery = props.searchQuery ?? internalQuery;
  const [visibleCount, setVisibleCount] = useState<number>(options.pageSize);

  const handleQueryChange = (q: string) => {
    if (props.onSearchChange) props.onSearchChange(q);
    else setInternalQuery(q);
  };

  const filteredStudents = useMemo(() => {
    return filterStudents(props.students, activeQuery);
  }, [props.students, activeQuery]);

  useEffect(() => {
    setVisibleCount(options.pageSize);
  }, [activeQuery, props.students, options.pageSize]);

  const sentinelRef = useLazySentinel({
    lazy: options.lazy,
    isLoading: options.isLoading,
    visibleCount,
    totalCount: filteredStudents.length,
    pageSize: options.pageSize,
    onLoadMore: (inc) =>
      setVisibleCount((prev) => Math.min(prev + inc, filteredStudents.length)),
  });

  const displayedStudents = useMemo(() => {
    return options.lazy
      ? filteredStudents.slice(0, visibleCount)
      : filteredStudents;
  }, [filteredStudents, options.lazy, visibleCount]);

  const isInstructor = options.userType === "instructor";
  const { defaultEmptyMsg, defaultTitle, countBadge } = resolveGridMeta(
    isInstructor,
    filteredStudents.length,
    t,
  );

  return {
    activeQuery,
    handleQueryChange,
    filteredStudents,
    displayedStudents,
    sentinelRef,
    visibleCount,
    resolvedEmptyMessage: props.emptyMessage || defaultEmptyMsg,
    resolvedTitle: props.title !== undefined ? props.title : defaultTitle,
    countBadge,
    isInstructor,
    ...options,
  };
}
