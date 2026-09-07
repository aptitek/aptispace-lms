import React, { forwardRef, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import Tooltip from "@mui/material/Tooltip";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
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
import {
  SegmentedChipRoot,
  SegmentItem,
  SegmentDivider,
  SegmentDeleteButton,
} from "./SegmentedChip.styles";

function resolveDiploma(cohort: SegmentedChipProps["cohort"]): string | null {
  if (cohort?.diploma) return cohort.diploma;
  if (!cohort?.name) return null;
  return parseCohortName(cohort.name).diploma;
}

function resolveYear(cohort: SegmentedChipProps["cohort"]): number | null {
  if (cohort?.year !== undefined && cohort.year !== null) {
    return Number(cohort.year);
  }
  if (!cohort?.name) return null;
  return parseCohortName(cohort.name).year;
}

function resolveTags(cohort: SegmentedChipProps["cohort"]): string[] {
  if (cohort?.tags && cohort.tags.length > 0) return cohort.tags;
  if (!cohort?.name) return [];
  return parseCohortName(cohort.name).tags;
}

function computeDiplomaBadgeText(
  diploma: string | null,
  year: number | null,
): string {
  const letter = diploma ? diploma.trim().charAt(0).toUpperCase() : "";
  const yearStr = year && year > 0 ? String(year) : "";
  if (letter) return `${letter}${yearStr}`;
  if (yearStr) return `Y${yearStr}`;
  return "COHORT";
}

function normalizeSegment(
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

interface SegmentExtractionSource {
  cohort?: SegmentedChipProps["cohort"];
  segments?: (ChipSegment | string | ReactNode)[];
  leading?: ChipSegment | string | ReactNode;
  items?: (ChipSegment | string | ReactNode)[];
}

function resolveSegmentsFromProps(
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
    rawSegments.forEach((seg, index) => {
      result.push(normalizeSegment(seg, `seg-${index}`));
    });
  }

  if (items && items.length > 0) {
    items.forEach((secondaryItem, index) => {
      result.push(normalizeSegment(secondaryItem, `item-${index}`));
    });
  }

  return { segments: result };
}

function resolveChipIdentifiers(
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

interface RenderDeleteSegmentOptions {
  onDelete?: () => void;
  disabled: boolean;
  size: SegmentedChipSize;
  deleteLabel: string;
  testId: string;
  showDividers: boolean;
  divider?: ReactNode;
}

function renderDeleteSegment(options: RenderDeleteSegmentOptions) {
  const {
    onDelete,
    disabled,
    size,
    deleteLabel,
    testId,
    showDividers,
    divider,
  } = options;
  if (!onDelete) return null;

  const handleDelete = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (!disabled) {
      onDelete();
    }
  };

  const iconSize = size === "small" ? 14 : size === "large" ? 18 : 16;

  return (
    <>
      {showDividers &&
        (divider ?? <SegmentDivider orientation="vertical" flexItem />)}
      <SegmentDeleteButton
        onClick={handleDelete}
        data-testid={`${testId}-delete`}
        title={deleteLabel}
        role="button"
        aria-label={deleteLabel}
      >
        <CloseRoundedIcon sx={{ fontSize: iconSize }} />
      </SegmentDeleteButton>
    </>
  );
}

function createKeyboardHandler(
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

interface RenderSegmentProps {
  segment: ChipSegment;
  size: SegmentedChipSize;
  testId: string;
  isColumn?: boolean;
}

function RenderSegmentItem({
  segment,
  size,
  testId,
  isColumn,
}: RenderSegmentProps) {
  const resolvedId = segment["data-testid"] || segment.testId || testId;
  const content = (
    <SegmentItem
      $size={size}
      $bold={
        segment.bold ||
        Boolean(segment.fontWeight && Number(segment.fontWeight) >= 700)
      }
      $mono={segment.mono}
      $background={segment.background}
      $color={segment.color}
      $isClickable={Boolean(segment.onClick)}
      $isColumn={isColumn}
      onClick={segment.onClick}
      className={segment.className}
      data-testid={resolvedId}
    >
      {segment.icon}
      {segment.label}
    </SegmentItem>
  );

  if (segment.tooltip) {
    return (
      <Tooltip title={segment.tooltip} arrow>
        {content}
      </Tooltip>
    );
  }

  return content;
}

interface RenderSegmentsListOptions {
  segments: ChipSegment[];
  showDividers: boolean;
  divider?: ReactNode;
  size: SegmentedChipSize;
  resolvedTestId: string;
  orientation?: SegmentedChipOrientation;
}

function RenderSegmentsList({
  segments,
  showDividers,
  divider,
  size,
  resolvedTestId,
  orientation = "horizontal",
}: RenderSegmentsListOptions) {
  const isVertical = orientation === "vertical" || orientation === "responsive";
  const defaultDivider = (
    <SegmentDivider
      orientation={isVertical ? "horizontal" : "vertical"}
      flexItem={!isVertical}
    />
  );

  return (
    <>
      {segments.map((seg, idx) => (
        <React.Fragment key={seg.id ?? `seg-${idx}`}>
          {idx > 0 && showDividers && (divider ?? defaultDivider)}
          <RenderSegmentItem
            segment={seg}
            size={size}
            testId={`${resolvedTestId}-seg-${idx}`}
            isColumn={isVertical}
          />
        </React.Fragment>
      ))}
    </>
  );
}

interface DataAttributesOptions {
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

function resolveDataAttributes(options: DataAttributesOptions) {
  return {
    "data-size": options.dataSize ?? options.size,
    "data-shape": options.dataShape ?? options.shapeAttr,
    "data-diploma": options.dataDiploma ?? options.diplomaAttr,
    "data-year": options.dataYear ?? options.yearAttr,
    "data-orientation": options.orientation,
  };
}

function createSpecialtyResolver(t: TFunction) {
  return (tag: string) => {
    const slug = getSpecialtySlug(tag);
    const translated = t(`specialties.${slug}`, { defaultValue: tag });
    return translated !== tag ? translated : undefined;
  };
}

function normalizeChipConfig(props: SegmentedChipProps) {
  return {
    size: props.size ?? "medium",
    variant: props.variant ?? "outlined",
    orientation: props.orientation ?? "horizontal",
    disabled: props.disabled ?? false,
    showDividers: props.showDividers ?? true,
  };
}

/**
 * Generic SegmentedChip Molecule Component
 *
 * Renders a multi-segment compound chip:
 * `( Segment 1 | Segment 2 | ... | ✕ )`
 *
 * Supports:
 * - Arbitrary segments, leading segment, or structured cohort objects
 * - Per-segment custom colors, bolding, monospace typography, and tooltips
 * - Dividers between segments
 * - Deletable close button with accessible callback
 * - All 35 M3 expressive shapes (defaults to "pill")
 * - Small, Medium, Large sizes
 */
export const SegmentedChip = forwardRef<HTMLDivElement, SegmentedChipProps>(
  function SegmentedChip(props, ref) {
    const {
      cohort,
      shape,
      onClick,
      onDelete,
      deleteLabel,
      divider,
      className,
      sx,
      testId,
      "data-testid": dataTestId,
      "data-diploma": dataDiploma,
      "data-year": dataYear,
      "data-size": dataSize,
      "data-shape": dataShape,
      segments: rawSegments,
      leading,
      items,
      borderColor,
      bgColor,
      ...rest
    } = props;

    const config = normalizeChipConfig(props);
    const { t } = useTranslation("common");
    const isClickable = Boolean(onClick && !config.disabled);
    const { resolvedTestId, resolvedShape, shapeAttr } = resolveChipIdentifiers(
      dataTestId,
      testId,
      cohort,
      shape,
    );

    const getSpecialtyLabel = createSpecialtyResolver(t);
    const { segments, diplomaColorBorder, diplomaAttr, yearAttr } =
      resolveSegmentsFromProps(
        { cohort, segments: rawSegments, leading, items },
        getSpecialtyLabel,
        resolvedTestId,
      );

    const handleKeyDown = createKeyboardHandler(isClickable, onClick);
    const resolvedDeleteLabel = deleteLabel || t("common:delete", "Delete");
    const dataAttributes = resolveDataAttributes({
      dataDiploma,
      dataYear,
      dataSize,
      dataShape,
      diplomaAttr,
      yearAttr,
      shapeAttr,
      size: config.size,
      orientation: config.orientation,
    });

    return (
      <SegmentedChipRoot
        ref={ref}
        $size={config.size}
        $isClickable={isClickable}
        $variant={config.variant}
        $shape={resolvedShape}
        $borderColor={borderColor || diplomaColorBorder}
        $bgColor={bgColor}
        $orientation={config.orientation}
        onClick={isClickable ? onClick : undefined}
        onKeyDown={handleKeyDown}
        tabIndex={isClickable ? 0 : undefined}
        role={isClickable ? "button" : "status"}
        className={className}
        sx={sx}
        data-testid={resolvedTestId}
        {...dataAttributes}
        {...rest}
      >
        <RenderSegmentsList
          segments={segments}
          showDividers={config.showDividers}
          divider={divider}
          size={config.size}
          resolvedTestId={resolvedTestId}
          orientation={config.orientation}
        />

        {renderDeleteSegment({
          onDelete,
          disabled: config.disabled,
          size: config.size,
          deleteLabel: resolvedDeleteLabel,
          testId: resolvedTestId,
          showDividers: config.showDividers,
          divider,
        })}
      </SegmentedChipRoot>
    );
  },
);

SegmentedChip.displayName = "SegmentedChip";
export default SegmentedChip;
