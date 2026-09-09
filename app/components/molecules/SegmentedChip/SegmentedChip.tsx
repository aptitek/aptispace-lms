import React, { forwardRef, useState, useEffect, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import Tooltip from "@mui/material/Tooltip";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
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
import { SegmentEditableContent } from "./SegmentEditableContent";
import {
  resolveChipIdentifiers,
  resolveSegmentsFromProps,
  createKeyboardHandler,
  resolveDataAttributes,
  createSpecialtyResolver,
  normalizeChipConfig,
} from "./SegmentedChip.resolvers";

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

interface RenderSegmentProps {
  segment: ChipSegment;
  size: SegmentedChipSize;
  testId: string;
  isColumn?: boolean;
  isEditable: boolean;
  editTrigger?: "click" | "doubleClick";
  onCommit: (newLabel: string) => void;
  disabled?: boolean;
}

function RenderSegmentItem({
  segment,
  size,
  testId,
  isColumn,
  isEditable,
  editTrigger,
  onCommit,
  disabled,
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
      $isEditable={isEditable}
      $isColumn={isColumn}
      onClick={segment.onClick}
      className={segment.className}
      data-testid={resolvedId}
    >
      <SegmentEditableContent
        segment={segment}
        size={size}
        testId={resolvedId}
        isEditable={isEditable}
        editTrigger={editTrigger}
        onCommit={onCommit}
        disabled={disabled}
      />
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
  isChipEditable: boolean;
  editTrigger?: "click" | "doubleClick";
  editedLabels: Record<number, string>;
  onSegmentCommit: (
    segmentIndex: number,
    newLabel: string,
    targetSegment: ChipSegment,
  ) => void;
  disabled?: boolean;
}

function RenderSegmentsList(listOptions: RenderSegmentsListOptions) {
  const {
    segments,
    showDividers,
    divider,
    size,
    resolvedTestId,
    orientation = "horizontal",
    isChipEditable,
    editTrigger,
    editedLabels,
    onSegmentCommit,
    disabled,
  } = listOptions;

  const isVertical = orientation === "vertical" || orientation === "responsive";
  const defaultDivider = (
    <SegmentDivider
      orientation={isVertical ? "horizontal" : "vertical"}
      flexItem={!isVertical}
    />
  );

  return (
    <>
      {segments.map((segmentEntry, segmentIndex) => {
        const isEditable =
          !disabled &&
          (segmentEntry.editable !== undefined
            ? segmentEntry.editable
            : isChipEditable);

        const activeLabel =
          editedLabels[segmentIndex] !== undefined
            ? editedLabels[segmentIndex]
            : segmentEntry.label;

        const effectiveSegment: ChipSegment = {
          ...segmentEntry,
          label: activeLabel,
        };

        return (
          <React.Fragment key={segmentEntry.id ?? `seg-${segmentIndex}`}>
            {segmentIndex > 0 && showDividers && (divider ?? defaultDivider)}
            <RenderSegmentItem
              segment={effectiveSegment}
              size={size}
              testId={`${resolvedTestId}-seg-${segmentIndex}`}
              isColumn={isVertical}
              isEditable={isEditable}
              editTrigger={editTrigger}
              onCommit={(newLabel) =>
                onSegmentCommit(segmentIndex, newLabel, segmentEntry)
              }
              disabled={disabled}
            />
          </React.Fragment>
        );
      })}
    </>
  );
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
 * - In-place text editing (single click or double click)
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
      editable,
      editTrigger,
      onSegmentEdit,
      ...restProps
    } = props;

    const config = normalizeChipConfig(props);
    const { t } = useTranslation("common");
    const [editedLabels, setEditedLabels] = useState<Record<number, string>>(
      {},
    );

    useEffect(() => {
      setEditedLabels({});
    }, [rawSegments, cohort, leading, items]);

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

    const handleSegmentCommit = (
      segmentIndex: number,
      newLabel: string,
      targetSegment: ChipSegment,
    ) => {
      setEditedLabels((previousState) => ({
        ...previousState,
        [segmentIndex]: newLabel,
      }));
      targetSegment.onEdit?.(newLabel);
      onSegmentEdit?.(segmentIndex, newLabel, targetSegment);
    };

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
        {...restProps}
      >
        <RenderSegmentsList
          segments={segments}
          showDividers={config.showDividers}
          divider={divider}
          size={config.size}
          resolvedTestId={resolvedTestId}
          orientation={config.orientation}
          isChipEditable={editable ?? config.editable}
          editTrigger={editTrigger ?? config.editTrigger}
          editedLabels={editedLabels}
          onSegmentCommit={handleSegmentCommit}
          disabled={config.disabled}
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
