import React, { forwardRef, type ReactNode, type ReactElement } from "react";
import { useTranslation } from "react-i18next";
import type {
  ChipProps,
  ChipShape,
  InstitutionType,
  RoleType,
} from "./Chip.types";
import { StyledMuiChip, ChipImage, EndImageLabelWrapper } from "./Chip.styles";
import ShapeDefs from "../Avatar/ShapeDefs";
import { getInstitutionConfig } from "~/tokens/institutions";
import { getInstitutionChipShape } from "~/tokens/shapes";
import { getRoleConfig } from "~/tokens/roles";

interface ChipVisuals {
  image?: string | ReactNode;
  imageAlt?: string;
  imagePosition?: "start" | "end";
  imageHeight?: number | string;
  imageWidth?: number | string;
  icon?: ReactNode;
  label?: ReactNode;
}

interface PresetVisuals {
  label?: ReactNode;
  icon?: ReactElement;
  shape?: ChipShape;
  color?: ChipProps["color"];
  testId?: string;
}

interface PresetLabels {
  defaultAllInstLabel: string;
  defaultInstLabel: string;
  defaultAllRoleLabel: string;
  defaultRoleLabel: string;
}

interface PresetInputOptions {
  icon?: ReactNode;
  showIcon?: boolean;
  shape?: ChipShape;
  color?: ChipProps["color"];
  label?: ReactNode;
  testId?: string;
}

function resolvePresetIcon(
  icon: ReactNode | undefined,
  showIcon: boolean,
  defaultIcon: ReactElement,
): ReactElement | undefined {
  if (icon !== undefined) {
    return icon as ReactElement | undefined;
  }
  return showIcon ? defaultIcon : undefined;
}

function resolveInstitutionPreset(
  rawType: string,
  options: PresetInputOptions,
  labels: PresetLabels,
): PresetVisuals {
  const defaultShape = getInstitutionChipShape(rawType);

  if (rawType === "all") {
    return {
      label: options.label || labels.defaultAllInstLabel,
      icon: options.icon as ReactElement | undefined,
      shape: options.shape || defaultShape,
      color: options.color || "default",
      testId: options.testId || "institution-chip-all",
    };
  }

  const instConfig = getInstitutionConfig(rawType);
  const resolvedIcon = resolvePresetIcon(
    options.icon,
    options.showIcon !== false,
    instConfig.icon,
  );

  return {
    label: options.label || labels.defaultInstLabel,
    icon: resolvedIcon,
    shape: options.shape || defaultShape,
    color: options.color || instConfig.chipColor,
    testId: options.testId || `institution-chip-${instConfig.key}`,
  };
}

function resolveRolePreset(
  rawRole: string,
  options: PresetInputOptions,
  labels: PresetLabels,
): PresetVisuals {
  if (rawRole === "all") {
    return {
      label: options.label || labels.defaultAllRoleLabel,
      icon: options.icon as ReactElement | undefined,
      shape: options.shape,
      color: options.color || "default",
      testId: options.testId || "role-chip-all",
    };
  }

  const roleConfig = getRoleConfig(rawRole);
  const resolvedIcon = resolvePresetIcon(
    options.icon,
    options.showIcon !== false,
    roleConfig.icon,
  );

  return {
    label: options.label || labels.defaultRoleLabel,
    icon: resolvedIcon,
    shape: options.shape || roleConfig.statusChipShape,
    color: options.color || roleConfig.chipColor,
    testId: options.testId || `role-chip-${roleConfig.key}`,
  };
}

interface ResolvePresetsProps extends PresetInputOptions {
  institutionType?: InstitutionType | string | null;
  userRole?: RoleType | "all" | string | null;
}

function resolvePresets(
  props: ResolvePresetsProps,
  labels: PresetLabels,
): PresetVisuals | null {
  const { institutionType, userRole, ...options } = props;

  if (institutionType !== undefined && institutionType !== null) {
    return resolveInstitutionPreset(
      institutionType || "school",
      options,
      labels,
    );
  }

  if (userRole !== undefined && userRole !== null) {
    return resolveRolePreset(userRole || "student", options, labels);
  }

  return null;
}

function computePresetLabels(
  translate: (key: string, defaultValue: string) => string,
  institutionType?: string | null,
  userRole?: string | null,
): PresetLabels {
  const defaultAllInstLabel = translate(
    "common:institutions.all",
    "All Institutions",
  );
  const defaultAllRoleLabel = translate(
    "common:filterBar.allRoles",
    "All Roles",
  );
  const defaultInstLabel =
    institutionType && institutionType !== "all"
      ? translate(
          `common:institutions.${getInstitutionConfig(institutionType).key}`,
          getInstitutionConfig(institutionType).label,
        )
      : "";
  const defaultRoleLabel =
    userRole && userRole !== "all"
      ? translate(
          `auth:devTool.roles.${getRoleConfig(userRole).key}`,
          getRoleConfig(userRole).label,
        ).toUpperCase()
      : "";

  return {
    defaultAllInstLabel,
    defaultInstLabel,
    defaultAllRoleLabel,
    defaultRoleLabel,
  };
}

interface FinalChipPropsInput {
  shape?: ChipShape;
  color?: ChipProps["color"];
  testId?: string;
  icon?: ReactNode;
  label?: ReactNode;
}

function resolveFinalChipVisuals(
  presets: PresetVisuals | null,
  raw: FinalChipPropsInput,
) {
  if (!presets) {
    return {
      finalShape: raw.shape,
      finalColor: raw.color,
      resolvedTestId: raw.testId,
      intermediateIcon: raw.icon,
      intermediateLabel: raw.label,
    };
  }

  return {
    finalShape: presets.shape || raw.shape,
    finalColor: presets.color || raw.color,
    resolvedTestId: presets.testId || raw.testId,
    intermediateIcon: presets.icon || raw.icon,
    intermediateLabel: presets.label || raw.label,
  };
}

function resolveChipSlots(props: ChipVisuals) {
  const {
    image,
    imageAlt = "",
    imagePosition = "start",
    imageHeight,
    imageWidth,
    icon,
    label,
  } = props;

  if (!image) {
    return { icon, label };
  }

  const imageElement =
    typeof image === "string" ? (
      <ChipImage
        src={image}
        alt={imageAlt}
        $position={imagePosition}
        $customHeight={imageHeight}
        $customWidth={imageWidth}
        data-testid="chip-image"
      />
    ) : (
      image
    );

  if (imagePosition === "start" && !icon) {
    return { icon: imageElement, label };
  }

  if (imagePosition === "end") {
    return {
      icon,
      label: (
        <EndImageLabelWrapper>
          {label}
          {imageElement}
        </EndImageLabelWrapper>
      ),
    };
  }

  return { icon, label };
}

/**
 * Generic Chip Atom Component
 *
 * Extends MUI's Chip component with:
 * - Expressive M3 shapes & geometric radius presets
 * - Embedded image support (start / end positions)
 * - Monospace styling mode for technical tokens / handles
 * - Built-in presets for institution categories and user roles
 * - Micro-animations, subtle depth, and full dark mode support
 */
function resolveEffectiveChipInputs(props: ChipProps) {
  const {
    institutionType,
    institution,
    userRole,
    role,
    testId,
    "data-testid": dataTestId,
    ...rest
  } = props;

  return {
    effectiveInstitutionType: institutionType ?? institution,
    effectiveUserRole: userRole ?? role,
    effectiveTestId: dataTestId || testId,
    rest,
  };
}

function resolveDataShape(finalShape: ChipProps["shape"]) {
  return typeof finalShape === "string" ? finalShape : undefined;
}

export const Chip = forwardRef<HTMLDivElement, ChipProps>(
  function Chip(props, ref) {
    const {
      effectiveInstitutionType,
      effectiveUserRole,
      effectiveTestId,
      rest,
    } = resolveEffectiveChipInputs(props);

    const {
      shape,
      showIcon = true,
      image,
      imageAlt = "",
      imagePosition = "start",
      imageHeight,
      imageWidth,
      mono = false,
      icon,
      label,
      color,
      ...domProps
    } = rest;

    const { t } = useTranslation(["common", "auth"]);
    const translate = (key: string, defaultValue: string) =>
      String(t(key, defaultValue));

    const labels = computePresetLabels(
      translate,
      effectiveInstitutionType,
      effectiveUserRole,
    );

    const presets = resolvePresets(
      {
        institutionType: effectiveInstitutionType,
        userRole: effectiveUserRole,
        showIcon,
        icon,
        label,
        shape,
        color,
        testId: effectiveTestId,
      },
      labels,
    );

    const {
      finalShape,
      finalColor,
      resolvedTestId,
      intermediateIcon,
      intermediateLabel,
    } = resolveFinalChipVisuals(presets, {
      shape,
      color,
      testId: effectiveTestId,
      icon,
      label,
    });

    const { icon: finalIcon, label: finalLabel } = resolveChipSlots({
      image,
      imageAlt,
      imagePosition,
      imageHeight,
      imageWidth,
      icon: intermediateIcon,
      label: intermediateLabel,
    });

    return (
      <>
        {finalShape && <ShapeDefs />}
        <StyledMuiChip
          ref={ref}
          $chipShape={finalShape}
          $mono={mono}
          color={finalColor}
          icon={finalIcon as ReactElement | undefined}
          label={finalLabel}
          data-testid={resolvedTestId}
          data-shape={resolveDataShape(finalShape)}
          {...domProps}
        />
      </>
    );
  },
);

Chip.displayName = "Chip";
export default Chip;
