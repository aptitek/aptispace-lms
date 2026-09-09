import React, { type ReactNode } from "react";
import type { TFunction } from "i18next";
import {
  getDiplomaColor,
  parseCohortName,
  getSpecialtySlug,
} from "~/utils/cohortFormat";
import { getSegmentedChipShape, type ChipShape } from "~/tokens/shapes";
import type {
  SegmentedChipProps,
  SegmentedChipSize,
  SegmentedChipOrientation,
  ChipSegment,
} from "./SegmentedChip.types";

export function resolveDiploma(cohort: SegmentedChipProps["cohort"]): string | null {
  if (cohort?.diploma) return cohort.diploma;
  if (!cohort?.name) return null;
  return parseCohortName(cohort.name).diploma;
}

export function resolveYear(cohort: SegmentedChipProps["cohort"]): number | null {
  if (cohort?.year !== undefined && cohort.year !== null) {
    return Number(cohort.year);
  }
  if (!cohort?.name) return null;
  return parseCohortName(cohort.name).year;
}

export function resolveTags(cohort: SegmentedChipProps["cohort"]): string[] {
  if (cohort?.tags && cohort.tags.length > 0) return cohort.tags;
  if (!cohort?.name) return [];
  return parseCohortName(cohort.name).tags;
}

export function computeDiplomaBadgeText(
  diploma: string | null,
  year: number | null,
): string {
  const letter = diploma ? diploma.trim().charAt(0).toUpperCase() : "";
  const yearStr = year && year > 0 ? String(year) : "";
  if (letter) return `${letter}${yearStr}`;
  if (yearStr) return `Y${yearStr}`;
  return "COHORT";
}

export function normalizeSegment(
  raw: ChipSegment | string | ReactNode,
  defaultId: string,
): ChipSegment {
  if (typeof raw === "string" || typeof raw === "number") {
    return { id: defaultId, label: raw };
  }
  if (React.isValidElement(raw)) {
    return { id: defaultId, label: raw };
  }
  if (
    raw &&
    typeof raw === "object" &&
    ("label" in raw || "icon" in raw || "id" in raw)
  ) {
    return raw as ChipSegment;
  }
  return { id: defaultId, label: String(raw ?? "") };
}

export interface SegmentExtractionSource {
  cohort?: SegmentedChipProps["cohort"];
  segments?: (ChipSegment | string | ReactNode)[];
  leading?: ChipSegment | string | ReactNode;
  items?: (ChipSegment | string | ReactNode)[];
}

export function resolveSegmentsFromProps(
  source: SegmentExtractionSource,
  getSpecialtyLabel: (tag: string) => string | undefined,
  resolvedTestId: string,
): {
  segments: ChipSegment[];
  diplomaColorMain?: string;
  diplomaColorBorder?: string;
  diplomaAttr?: string;
  yearAttr?: number | string;
} {
  const { cohort, segments: rawSegments, leading, items } = source;

  if (cohort) {
    const diploma = resolveDiploma(cohort);
    const year = resolveYear(cohort);
    const tags = resolveTags(cohort);
    const diplomaColor = getDiplomaColor(diploma);
    const diplomaLabel = computeDiplomaBadgeText(diploma, year);

    const cohortSegments: ChipSegment[] = [
      {
        id: "diploma",
        label: diplomaLabel,
        background: diplomaColor.main,
        color: diplomaColor.text,
        bold: true,
        testId: `${resolvedTestId}-diploma`,
      },
      ...tags.map((tag) => {
        const tooltip = getSpecialtyLabel(tag);
        return {
          id: tag,
          label: tag,
          tooltip,
          testId: `${resolvedTestId}-tag-${tag}`,
        };
      }),
    ];

    return {
      segments: cohortSegments,
      diplomaColorMain: diplomaColor.main,
      diplomaColorBorder: diplomaColor.border,
      diplomaAttr: diploma ? diploma.trim().charAt(0).toUpperCase() : undefined,
      yearAttr: year === null ? undefined : year,
    };
  }

  const result: ChipSegment[] = [];

  if (leading) {
    result.push(normalizeSegment(leading, "leading"));
  }

  if (rawSegments && rawSegments.length > 0) {
    rawSegments.forEach((segmentEntry, index) => {
      result.push(normalizeSegment(segmentEntry, `seg-${index}`));
    });
  }

  if (items && items.length > 0) {
    items.forEach((secondaryEntry, index) => {
      result.push(normalizeSegment(secondaryEntry, `item-${index}`));
    });
  }

  return { segments: result };
}

export function resolveChipIdentifiers(
  dataTestId?: string,
  testId?: string,
  cohort?: unknown,
  shape?: ChipShape,
) {
  const resolvedTestId =
    dataTestId || testId || (cohort ? "cohort-chip" : "segmented-chip");
  const resolvedShape =
    shape ?? (cohort ? getSegmentedChipShape(cohort) : "pill");
  const shapeAttr =
    typeof resolvedShape === "string" ? resolvedShape : undefined;

  return { resolvedTestId, resolvedShape, shapeAttr };
}

export function createKeyboardHandler(
  isClickable: boolean,
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void,
) {
  if (!isClickable || !onClick) return undefined;
  return (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onClick(event as unknown as React.MouseEvent<HTMLDivElement>);
    }
  };
}

export interface DataAttributesOptions {
  dataDiploma?: string;
  dataYear?: number | string;
  dataSize?: string;
  dataShape?: string;
  diplomaAttr?: string;
  yearAttr?: number | string;
  shapeAttr?: string;
  size: SegmentedChipSize;
  orientation?: SegmentedChipOrientation;
}

export function resolveDataAttributes(options: DataAttributesOptions) {
  return {
    "data-size": options.dataSize ?? options.size,
    "data-shape": options.dataShape ?? options.shapeAttr,
    "data-diploma": options.dataDiploma ?? options.diplomaAttr,
    "data-year": options.dataYear ?? options.yearAttr,
    "data-orientation": options.orientation,
  };
}

export function createSpecialtyResolver(translationFn: TFunction) {
  return (tag: string) => {
    const slug = getSpecialtySlug(tag);
    const translated = translationFn(`specialties.${slug}`, { defaultValue: tag });
    return translated !== tag ? translated : undefined;
  };
}

export function normalizeChipConfig(props: SegmentedChipProps) {
  return {
    size: props.size ?? "medium",
    variant: props.variant ?? "outlined",
    orientation: props.orientation ?? "horizontal",
    disabled: props.disabled ?? false,
    editable: props.editable ?? false,
    editTrigger: props.editTrigger ?? "click",
    showDividers: props.showDividers ?? true,
  };
}
