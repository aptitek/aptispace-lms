import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import Card from "@mui/material/Card";
import TextField from "@mui/material/TextField";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import type { CohortConfig } from "~/types/institution";
import {
  type AcademicPeriodType,
  getAcademicYearDates,
  getAcademicYearOptions,
} from "~/utils/academicYear";
import {
  CohortInspectorHeader,
  CohortAcademicShortcuts,
  CohortDurationBanner,
  CohortDatePickerFields,
  CohortInspectorActions,
  CohortStructuredFields,
} from "./CohortInspector.components";
import { formatCohortName, parseCohortName } from "~/utils/cohortFormat";

function formatDateForInput(dateInput?: string | Date | null): string {
  if (!dateInput) return "";
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return "";
  return d.toISOString().split("T")[0];
}

function detectActiveYear(startDate?: string): number | null {
  if (!startDate) return null;
  const d = new Date(startDate);
  if (isNaN(d.getTime())) return null;
  const year = d.getFullYear();
  const month = d.getMonth() + 1; // 1-12
  // If month is before Sep (e.g. spring semester in Feb), start year was year - 1
  return month < 8 ? year - 1 : year;
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

interface CohortInspectorProps {
  cohort: CohortConfig | null;
  onClose: () => void;
  onSave: (payload: {
    id?: string;
    name: string;
    description?: string;
    startDate?: string;
    endDate?: string;
    diploma?: string;
    year?: number | null;
    tags?: string[];
  }) => void;
  isSubmitting?: boolean;
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
    useState<AcademicPeriodType>("fullAcademic");

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
    if (cohort) {
      // If fields are not explicitly set on cohort, attempt reverse-parse from name
      const parsed = parseCohortName(cohort.name);
      const initDiploma = cohort.diploma || parsed.diploma || "";
      const initYear =
        cohort.year !== undefined && cohort.year !== null
          ? cohort.year
          : parsed.year !== null
            ? parsed.year
            : 0;
      const initTags =
        cohort.tags && cohort.tags.length > 0 ? cohort.tags : parsed.tags;

      const autoName = formatCohortName({
        diploma: initDiploma,
        year: initYear,
        tags: initTags,
      });

      const initial: CohortFormValues = {
        name: autoName,
        description: cohort.description || "",
        startDate: formatDateForInput(cohort.startDate),
        endDate: formatDateForInput(cohort.endDate),
        diploma: initDiploma,
        year: initYear,
        tags: initTags,
      };

      setDescription(initial.description);
      setStartDate(initial.startDate);
      setEndDate(initial.endDate);
      setDiploma(initial.diploma);
      setYear(initial.year);
      setTags(initial.tags);
      savedValuesRef.current = initial;
    }
  }, [cohort]);

  const activeYear = detectActiveYear(startDate);

  const triggerSave = (updates?: Partial<CohortFormValues>) => {
    if (!isEditing || !cohort?.id) return;
    const next: CohortFormValues = {
      name: formatCohortName({ diploma, year, tags }),
      description,
      startDate,
      endDate,
      diploma,
      year,
      tags,
      ...updates,
    };
    // Ensure computed name matches updated fields
    next.name = formatCohortName({
      diploma: next.diploma,
      year: next.year,
      tags: next.tags,
    });

    if (!hasFormChanged(savedValuesRef.current, next)) return;

    savedValuesRef.current = next;
    onSave({
      id: cohort.id,
      name: next.name,
      description: next.description.trim() || undefined,
      startDate: next.startDate || undefined,
      endDate: next.endDate || undefined,
      diploma: next.diploma || undefined,
      year: next.year,
      tags: next.tags,
    });
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
    const dates = getAcademicYearDates(selectedYr, selectedPeriod);
    setStartDate(dates.startDate);
    setEndDate(dates.endDate);
    triggerSave({ startDate: dates.startDate, endDate: dates.endDate });
  };

  const handleSelectPeriod = (period: AcademicPeriodType) => {
    setSelectedPeriod(period);
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
      description: description.trim() || undefined,
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
          gap: 2.5,
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
          onChange={(e) => setDescription(e.target.value)}
          onBlur={() => triggerSave({ description })}
          fullWidth
          disabled={isSubmitting}
          multiline
          rows={3}
          data-testid="cohort-description-input"
        />

        <CohortAcademicShortcuts
          selectedPeriod={selectedPeriod}
          onSelectPeriod={handleSelectPeriod}
          onSelectYear={handleSelectYear}
          activeYear={activeYear}
        />

        <CohortDatePickerFields
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={(newStart) => {
            setStartDate(newStart);
            triggerSave({ startDate: newStart });
          }}
          onEndDateChange={(newEnd) => {
            setEndDate(newEnd);
            triggerSave({ endDate: newEnd });
          }}
          disabled={isSubmitting}
        />

        <CohortDurationBanner startDate={startDate} endDate={endDate} />

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
