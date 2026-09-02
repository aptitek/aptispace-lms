export type AcademicPeriodType =
  | "fullAcademic" // Sep 1 -> Aug 31 (12 months)
  | "fall" // Sep 1 -> Jan 31 (5 months)
  | "spring" // Feb 1 -> Aug 31 (7 months)
  | "calendar"; // Jan 1 -> Dec 31 (12 months)

export interface AcademicPeriodConfig {
  id: AcademicPeriodType;
  labelKey: string;
  defaultLabel: string;
  shortLabel: string;
  startMonth: number; // 1-12
  startDay: number;
  endMonth: number; // 1-12
  endDay: number;
  endYearOffset: number; // 0 for same year, 1 for next year
  startYearOffset: number; // 0 for startYear, 1 for next year (e.g. spring)
}

export const ACADEMIC_PERIODS: Record<
  AcademicPeriodType,
  AcademicPeriodConfig
> = {
  fullAcademic: {
    id: "fullAcademic",
    labelKey: "inspector.periodFullAcademic",
    defaultLabel: "Academic Year (Sep – Aug)",
    shortLabel: "Sep – Aug",
    startMonth: 9,
    startDay: 1,
    endMonth: 8,
    endDay: 31,
    endYearOffset: 1,
    startYearOffset: 0,
  },
  fall: {
    id: "fall",
    labelKey: "inspector.periodFall",
    defaultLabel: "Fall Semester (Sep – Jan)",
    shortLabel: "Fall (S1)",
    startMonth: 9,
    startDay: 1,
    endMonth: 1,
    endDay: 31,
    endYearOffset: 1,
    startYearOffset: 0,
  },
  spring: {
    id: "spring",
    labelKey: "inspector.periodSpring",
    defaultLabel: "Spring Semester (Feb – Aug)",
    shortLabel: "Spring (S2)",
    startMonth: 2,
    startDay: 1,
    endMonth: 8,
    endDay: 31,
    endYearOffset: 1,
    startYearOffset: 1,
  },
  calendar: {
    id: "calendar",
    labelKey: "inspector.periodCalendar",
    defaultLabel: "Calendar Year (Jan – Dec)",
    shortLabel: "Jan – Dec",
    startMonth: 1,
    startDay: 1,
    endMonth: 12,
    endDay: 31,
    endYearOffset: 0,
    startYearOffset: 0,
  },
};

function pad(num: number): string {
  return String(num).padStart(2, "0");
}

export function formatISODateString(
  year: number,
  month: number,
  day: number,
): string {
  return `${year}-${pad(month)}-${pad(day)}`;
}

export function getAcademicYearDates(
  startYear: number,
  periodType: AcademicPeriodType = "fullAcademic",
): { startDate: string; endDate: string; label: string } {
  const config = ACADEMIC_PERIODS[periodType] || ACADEMIC_PERIODS.fullAcademic;
  const actualStartYear = startYear + config.startYearOffset;
  const actualEndYear = startYear + config.endYearOffset;

  const startDate = formatISODateString(
    actualStartYear,
    config.startMonth,
    config.startDay,
  );
  const endDate = formatISODateString(
    actualEndYear,
    config.endMonth,
    config.endDay,
  );

  return {
    startDate,
    endDate,
    label: `${startYear}–${startYear + 1}`,
  };
}

export function getAcademicYearOptions(
  referenceDate: Date = new Date(),
  spanBefore = 1,
  spanAfter = 3,
): number[] {
  const currentYear = referenceDate.getFullYear();
  // If we are before September, current academic year started in previous year
  const currentAcademicStartYear =
    referenceDate.getMonth() < 8 ? currentYear - 1 : currentYear;

  const years: number[] = [];
  for (
    let y = currentAcademicStartYear - spanBefore;
    y <= currentAcademicStartYear + spanAfter;
    y++
  ) {
    years.push(y);
  }
  return years;
}

export function calculateDurationMonths(
  startDateStr?: string,
  endDateStr?: string,
): number | null {
  if (!startDateStr || !endDateStr) return null;
  const start = new Date(startDateStr);
  const end = new Date(endDateStr);
  if (isNaN(start.getTime()) || isNaN(end.getTime()) || end < start) {
    return null;
  }

  const months =
    (end.getFullYear() - start.getFullYear()) * 12 +
    (end.getMonth() - start.getMonth()) +
    (end.getDate() >= start.getDate() ? 1 : 0);

  return Math.max(1, months);
}
