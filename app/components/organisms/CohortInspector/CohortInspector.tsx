import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import Card from "@mui/material/Card";
import TextField from "@mui/material/TextField";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import type { CohortConfig } from "~/types/institution";
import {
  ACADEMIC_PERIODS,
  getAcademicYearDates,
  getAcademicYearOptions,
  type AcademicPeriodType,
} from "~/utils/academicYear";
import { formatCohortName, parseCohortName } from "~/utils/cohortFormat";

function formatDateForInput(dateValue?: string | Date): string {
  if (!dateValue) return "";
  try {
    const d = new Date(dateValue);
    return isNaN(d.getTime()) ? "" : d.toISOString().slice(0, 10);
  } catch {
    return "";
  }
}

function detectActiveYear(startDate?: string): number | null {
  if (!startDate) return null;
  const d = new Date(startDate);
  return isNaN(d.getTime()) ? null : d.getFullYear();
}

function detectPeriodFromDates(
  startDate?: string,
  endDate?: string,
): AcademicPeriodSelection {
  if (!startDate || !endDate) return "fullAcademic";
  const startYear = new Date(startDate).getFullYear();
  if (isNaN(startYear)) return "fullAcademic";
  for (const candidateYear of [startYear - 1, startYear]) {
    for (const key of Object.keys(ACADEMIC_PERIODS) as AcademicPeriodType[]) {
      const dates = getAcademicYearDates(candidateYear, key);
      if (dates.startDate === startDate && dates.endDate === endDate) {
        return key;
      }
    }
  }
  return "custom";
}

import {
  CohortInspectorHeader,
  CohortStructuredFields,
  CohortScheduleCard,
  CohortInspectorActions,
  type AcademicPeriodSelection,
} from "./CohortInspector.components";

export interface CohortSavePayload {
  id?: string;
  name?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  diploma?: string;
  year?: number | null;
  tags?: string[];
  institutionId?: string;
}

export interface CohortInspectorProps {
  cohort: CohortConfig | null;
  onClose: () => void;
  onSave: (payload: CohortSavePayload) => void;
  isSubmitting?: boolean;
}

interface CohortFormValues {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  diploma: string;
  year: number;
  tags: string[];
}

function hasFormChanged(a: CohortFormValues, b: CohortFormValues): boolean {
  return (
    a.name !== b.name ||
    a.description !== b.description ||
    a.startDate !== b.startDate ||
    a.endDate !== b.endDate ||
    a.diploma !== b.diploma ||
    a.year !== b.year ||
    JSON.stringify(a.tags) !== JSON.stringify(b.tags)
  );
}

function buildNextCohortFormValues(
  current: CohortFormValues,
  updates?: Partial<CohortFormValues>,
): CohortFormValues {
  const merged: CohortFormValues = Object.assign({}, current, updates);
  merged.name = formatCohortName({
    diploma: merged.diploma,
    year: merged.year,
    tags: merged.tags,
  });
  return merged;
}

export default function CohortInspector({
  cohort,
  onClose,
  onSave,
  isSubmitting = false,
}: CohortInspectorProps) {
  const { t } = useTranslation("common");
  const isEditing = Boolean(cohort?.id);

  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [diploma, setDiploma] = useState("");
  const [year, setYear] = useState<number>(0);
  const [tags, setTags] = useState<string[]>([]);
  const [selectedPeriod, setSelectedPeriod] =
    useState<AcademicPeriodSelection>("fullAcademic");

  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const currentCohortIdRef = useRef<string | undefined>(cohort?.id);

  const savedValuesRef = useRef<CohortFormValues>({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    diploma: "",
    year: 0,
    tags: [],
  });

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  function computeInitialCohortFormValues(
    cohort: CohortConfig,
  ): CohortFormValues {
    const parsed = parseCohortName(cohort.name);
    const initDiploma = cohort.diploma || parsed.diploma || "";
    const initYear =
      cohort.year !== undefined && cohort.year !== null
        ? cohort.year
        : (parsed.year ?? 0);
    const initTags =
      cohort.tags && cohort.tags.length > 0 ? cohort.tags : parsed.tags;

    const autoName = formatCohortName({
      diploma: initDiploma,
      year: initYear,
      tags: initTags,
    });

    return {
      name: autoName,
      description: cohort.description || "",
      startDate: formatDateForInput(cohort.startDate),
      endDate: formatDateForInput(cohort.endDate),
      diploma: initDiploma,
      year: initYear,
      tags: initTags,
    };
  }

  useEffect(() => {
    if (!cohort) return;
    const isDifferentCohort = cohort.id !== currentCohortIdRef.current;
    currentCohortIdRef.current = cohort.id;

    const initial = computeInitialCohortFormValues(cohort);

    if (isDifferentCohort) {
      setDescription(initial.description);
      setStartDate(initial.startDate);
      setEndDate(initial.endDate);
      setDiploma(initial.diploma);
      setYear(initial.year);
      setTags(initial.tags);
      setSelectedPeriod(
        detectPeriodFromDates(initial.startDate, initial.endDate),
      );
      savedValuesRef.current = initial;
    } else {
      savedValuesRef.current = {
        ...initial,
        description: description || initial.description,
      };
    }
  }, [cohort, description]);

  const activeYear = detectActiveYear(startDate);

  const triggerSave = (updates?: Partial<CohortFormValues>) => {
    if (!isEditing || !cohort?.id) return;
    const current: CohortFormValues = {
      name: "",
      description,
      startDate,
      endDate,
      diploma,
      year,
      tags,
    };
    const next = buildNextCohortFormValues(current, updates);

    if (!hasFormChanged(savedValuesRef.current, next)) return;

    savedValuesRef.current = next;
    onSave({
      id: cohort.id,
      name: next.name,
      description: next.description.trim(),
      startDate: next.startDate || undefined,
      endDate: next.endDate || undefined,
      diploma: next.diploma.trim(),
      year: next.year,
      tags: next.tags,
    });
  };

  const handleDescriptionChange = (newDescription: string) => {
    setDescription(newDescription);
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      triggerSave({ description: newDescription });
    }, 500);
  };

  const handleDescriptionBlur = () => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
    triggerSave({ description });
  };

  const handleDiplomaChange = (newDiploma: string) => {
    setDiploma(newDiploma);
    triggerSave({ diploma: newDiploma });
  };

  const handleYearChange = (newYear: number) => {
    setYear(newYear);
    triggerSave({ year: newYear });
  };

  const handleTagsChange = (newTags: string[]) => {
    setTags(newTags);
    triggerSave({ tags: newTags });
  };

  const handleSelectYear = (selectedYr: number) => {
    if (selectedPeriod === "custom") {
      return;
    }
    const dates = getAcademicYearDates(selectedYr, selectedPeriod);
    setStartDate(dates.startDate);
    setEndDate(dates.endDate);
    triggerSave({ startDate: dates.startDate, endDate: dates.endDate });
  };

  const handleSelectPeriod = (period: AcademicPeriodSelection) => {
    setSelectedPeriod(period);
    if (period === "custom") {
      return;
    }
    const targetYear =
      activeYear || getAcademicYearOptions()[1] || new Date().getFullYear();
    const dates = getAcademicYearDates(targetYear, period);
    setStartDate(dates.startDate);
    setEndDate(dates.endDate);
    triggerSave({ startDate: dates.startDate, endDate: dates.endDate });
  };

  const handleCreate = () => {
    if (!diploma.trim()) return;
    const computedName = formatCohortName({ diploma, year, tags });
    onSave({
      name: computedName,
      description: description.trim(),
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      diploma: diploma.trim(),
      year,
      tags,
    });
  };

  if (!cohort) return null;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Card
        sx={{
          p: 3,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          height: "calc(100vh - 200px)",
          maxHeight: "850px",
          overflowY: "auto",
          position: "sticky",
          top: 24,
        }}
        variant="outlined"
        data-testid="cohort-inspector-card"
      >
        <CohortInspectorHeader isEditing={isEditing} onClose={onClose} />

        <CohortStructuredFields
          diploma={diploma}
          onDiplomaChange={handleDiplomaChange}
          year={year}
          onYearChange={handleYearChange}
          tags={tags}
          onTagsChange={handleTagsChange}
          disabled={isSubmitting}
        />

        <TextField
          label={t("inspector.description", "Description")}
          value={description}
          onChange={(e) => handleDescriptionChange(e.target.value)}
          onBlur={handleDescriptionBlur}
          fullWidth
          disabled={isSubmitting}
          multiline
          rows={3}
          data-testid="cohort-description-input"
        />

        <CohortScheduleCard
          selectedPeriod={selectedPeriod}
          onSelectPeriod={handleSelectPeriod}
          onSelectYear={handleSelectYear}
          activeYear={activeYear}
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={(newStart) => {
            setSelectedPeriod("custom");
            setStartDate(newStart);
            triggerSave({ startDate: newStart });
          }}
          onEndDateChange={(newEnd) => {
            setSelectedPeriod("custom");
            setEndDate(newEnd);
            triggerSave({ endDate: newEnd });
          }}
          disabled={isSubmitting}
        />

        <CohortInspectorActions
          onClose={onClose}
          onCreate={handleCreate}
          isEditing={isEditing}
          disabled={isSubmitting}
          isSaveDisabled={!diploma.trim()}
        />
      </Card>
    </LocalizationProvider>
  );
}
