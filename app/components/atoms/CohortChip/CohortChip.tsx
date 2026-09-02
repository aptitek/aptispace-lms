import React, { forwardRef } from "react";
import { useTranslation } from "react-i18next";
import Tooltip from "@mui/material/Tooltip";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import {
  getDiplomaColor,
  parseCohortName,
  getSpecialtySlug,
} from "~/utils/cohortFormat";
import type { CohortChipProps, CohortChipSize } from "./CohortChip.types";
import {
  CohortChipRoot,
  CohortDiplomaSegment,
  CohortDivider,
  CohortTagSegment,
  CohortDeleteIconContainer,
} from "./CohortChip.styles";

function resolveDiploma(cohort: CohortChipProps["cohort"]): string | null {
  if (cohort?.diploma) return cohort.diploma;
  if (!cohort?.name) return null;
  return parseCohortName(cohort.name).diploma;
}

function resolveYear(cohort: CohortChipProps["cohort"]): number | null {
  if (cohort?.year !== undefined && cohort.year !== null) {
    return Number(cohort.year);
  }
  if (!cohort?.name) return null;
  return parseCohortName(cohort.name).year;
}

function resolveTags(cohort: CohortChipProps["cohort"]): string[] {
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

function resolveTestId(dataTestId?: string, testId?: string): string {
  if (dataTestId) return dataTestId;
  if (testId) return testId;
  return "cohort-chip";
}

function resolveDiplomaAttr(diploma: string | null): string | undefined {
  if (!diploma) return undefined;
  return diploma.trim().charAt(0).toUpperCase();
}

function createKeyboardHandler(isClickable: boolean, onClick?: () => void) {
  if (!isClickable || !onClick) return undefined;
  return (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onClick();
    }
  };
}

interface TagItemProps {
  tag: string;
  size: CohortChipSize;
  testId: string;
}

function CohortTagItem({ tag, size, testId }: TagItemProps) {
  const { t } = useTranslation("common");
  const slug = getSpecialtySlug(tag);
  const translated = t(`specialties.${slug}`, tag);
  const tooltipTitle = translated !== tag ? translated : undefined;

  return (
    <React.Fragment key={tag}>
      <CohortDivider orientation="vertical" flexItem />
      <Tooltip title={tooltipTitle} disableHoverListener={!tooltipTitle}>
        <CohortTagSegment $size={size} data-testid={`${testId}-tag-${tag}`}>
          {tag}
        </CohortTagSegment>
      </Tooltip>
    </React.Fragment>
  );
}

interface DeleteButtonProps {
  onDelete?: () => void;
  disabled?: boolean;
  size: CohortChipSize;
  testId: string;
}

function CohortDeleteButton({
  onDelete,
  disabled,
  size,
  testId,
}: DeleteButtonProps) {
  const { t } = useTranslation("common");
  if (!onDelete) return null;

  const handleDelete = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (!disabled) onDelete();
  };

  const iconSize = size === "small" ? 14 : size === "large" ? 18 : 16;

  return (
    <>
      <CohortDivider orientation="vertical" flexItem />
      <CohortDeleteIconContainer
        onClick={handleDelete}
        data-testid={`${testId}-delete`}
        title={t("common:delete", "Delete")}
      >
        <CloseRoundedIcon sx={{ fontSize: iconSize }} />
      </CohortDeleteIconContainer>
    </>
  );
}

/**
 * MD3 Cohort Chip Component
 *
 * Renders a structured cohort as a compound chip:
 * `( M1 | AI | Dev )`
 */
export const CohortChip = forwardRef<HTMLDivElement, CohortChipProps>(
  function CohortChip(
    {
      cohort,
      size = "medium",
      variant = "outlined",
      onClick,
      onDelete,
      disabled = false,
      className,
      testId,
      "data-testid": dataTestId,
    },
    ref,
  ) {
    const diploma = resolveDiploma(cohort);
    const year = resolveYear(cohort);
    const tags = resolveTags(cohort);
    const diplomaColor = getDiplomaColor(diploma);
    const diplomaLabel = computeDiplomaBadgeText(diploma, year);
    const isClickable = Boolean(onClick && !disabled);
    const resolvedTestId = resolveTestId(dataTestId, testId);
    const handleKeyDown = createKeyboardHandler(isClickable, onClick);
    const handleClick = isClickable ? onClick : undefined;

    return (
      <CohortChipRoot
        ref={ref}
        $size={size}
        $diplomaColor={diplomaColor}
        $isClickable={isClickable}
        $variant={variant}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        tabIndex={isClickable ? 0 : undefined}
        role={isClickable ? "button" : "status"}
        className={className}
        data-testid={resolvedTestId}
        data-size={size}
        data-diploma={resolveDiplomaAttr(diploma)}
        data-year={year ?? undefined}
      >
        <CohortDiplomaSegment
          $size={size}
          $diplomaColor={diplomaColor}
          data-testid={`${resolvedTestId}-diploma`}
        >
          {diplomaLabel}
        </CohortDiplomaSegment>

        {tags.map((tag) => (
          <CohortTagItem
            key={tag}
            tag={tag}
            size={size}
            testId={resolvedTestId}
          />
        ))}

        <CohortDeleteButton
          onDelete={onDelete}
          disabled={disabled}
          size={size}
          testId={resolvedTestId}
        />
      </CohortChipRoot>
    );
  },
);

CohortChip.displayName = "CohortChip";
export default CohortChip;
