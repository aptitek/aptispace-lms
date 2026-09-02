import React, { forwardRef, type ReactNode, type ReactElement } from "react";
import { useTranslation } from "react-i18next";
import Chip from "../Chip/Chip";
import { getInstitutionConfig } from "~/tokens/institutions";
import type { InstitutionChipProps } from "./InstitutionChip.types";

interface ResolvedVisuals {
  resolvedLabel: ReactNode;
  resolvedIcon?: ReactElement;
  resolvedShape?: InstitutionChipProps["shape"];
  resolvedColor?: InstitutionChipProps["color"];
  resolvedTestId: string;
}

function resolveInstitutionIcon(
  propsIcon: ReactNode | undefined,
  showIcon: boolean,
  defaultIcon: ReactElement,
): ReactElement | undefined {
  if (propsIcon !== undefined) {
    return propsIcon as ReactElement | undefined;
  }
  return showIcon ? defaultIcon : undefined;
}

function resolveInstitutionVisuals(
  rawType: string,
  props: {
    label?: ReactNode;
    showIcon?: boolean;
    icon?: ReactNode;
    shape?: InstitutionChipProps["shape"];
    color?: InstitutionChipProps["color"];
    testId?: string;
  },
  defaultAllLabel: string,
  defaultTypeLabel: string,
): ResolvedVisuals {
  if (rawType === "all") {
    return {
      resolvedLabel: props.label ?? defaultAllLabel,
      resolvedIcon: props.icon as ReactElement | undefined,
      resolvedShape: props.shape ?? "pill",
      resolvedColor: props.color ?? "default",
      resolvedTestId: props.testId || "institution-chip-all",
    };
  }

  const instConfig = getInstitutionConfig(rawType);
  const resolvedIcon = resolveInstitutionIcon(
    props.icon,
    props.showIcon !== false,
    instConfig.icon,
  );

  return {
    resolvedLabel: props.label ?? defaultTypeLabel,
    resolvedIcon,
    resolvedShape: props.shape ?? instConfig.chipShape,
    resolvedColor: props.color ?? instConfig.chipColor,
    resolvedTestId: props.testId || `institution-chip-${instConfig.key}`,
  };
}

/**
 * InstitutionChip Atom Component
 *
 * Inherits and extends the Chip atom with institution category design tokens:
 * - Schools: Cyan clamshell shape with School icon
 * - Institutions / Companies: Yellow semicircle shape with Business icon
 * - Internationalized institution category labels
 */
export const InstitutionChip = forwardRef<HTMLDivElement, InstitutionChipProps>(
  function InstitutionChip(props, ref) {
    const {
      institutionType,
      type,
      showIcon = true,
      icon,
      label,
      shape,
      color,
      testId,
      "data-testid": dataTestId,
      ...rest
    } = props;

    const { t } = useTranslation("common");
    const rawType = (institutionType ?? type ?? "school") || "school";
    const instConfig = getInstitutionConfig(rawType);
    const defaultAllLabel = t("institutions.all", "All Institutions");
    const defaultTypeLabel = t(
      `institutions.${instConfig.key}`,
      instConfig.label,
    );

    const visuals = resolveInstitutionVisuals(
      rawType,
      {
        label,
        showIcon,
        icon,
        shape,
        color,
        testId: dataTestId || testId,
      },
      defaultAllLabel,
      defaultTypeLabel,
    );

    return (
      <Chip
        ref={ref}
        icon={visuals.resolvedIcon}
        label={visuals.resolvedLabel}
        color={visuals.resolvedColor}
        shape={visuals.resolvedShape}
        testId={visuals.resolvedTestId}
        {...rest}
      />
    );
  },
);

InstitutionChip.displayName = "InstitutionChip";
export default InstitutionChip;
