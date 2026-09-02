import React, { forwardRef, type ReactNode, type ReactElement } from "react";
import { useTranslation } from "react-i18next";
import Chip from "../Chip/Chip";
import { getRoleConfig } from "~/tokens/roles";
import type { RoleChipProps } from "./RoleChip.types";

interface ResolvedVisuals {
  resolvedLabel: ReactNode;
  resolvedIcon?: ReactElement;
  resolvedShape?: RoleChipProps["shape"];
  resolvedColor?: RoleChipProps["color"];
  resolvedTestId: string;
}

function resolveRoleIcon(
  propsIcon: ReactNode | undefined,
  showIcon: boolean,
  defaultIcon: ReactElement,
): ReactElement | undefined {
  if (propsIcon !== undefined) {
    return propsIcon as ReactElement | undefined;
  }
  return showIcon ? defaultIcon : undefined;
}

function resolveRoleVisuals(
  rawRole: string,
  props: {
    label?: ReactNode;
    showIcon?: boolean;
    icon?: ReactNode;
    shape?: RoleChipProps["shape"];
    color?: RoleChipProps["color"];
    testId?: string;
  },
  defaultAllLabel: string,
  defaultRoleLabel: string,
): ResolvedVisuals {
  if (rawRole === "all") {
    return {
      resolvedLabel: props.label ?? defaultAllLabel,
      resolvedIcon: props.icon as ReactElement | undefined,
      resolvedShape: props.shape,
      resolvedColor: props.color ?? "default",
      resolvedTestId: props.testId || "role-chip-all",
    };
  }

  const roleConfig = getRoleConfig(rawRole);
  const resolvedIcon = resolveRoleIcon(
    props.icon,
    props.showIcon !== false,
    roleConfig.icon,
  );

  return {
    resolvedLabel: props.label ?? defaultRoleLabel,
    resolvedIcon,
    resolvedShape: props.shape ?? roleConfig.statusChipShape,
    resolvedColor: props.color ?? roleConfig.chipColor,
    resolvedTestId: props.testId || `role-chip-${roleConfig.key}`,
  };
}

/**
 * RoleChip Atom Component
 *
 * Inherits and extends the Chip atom with role-based design tokens:
 * - Expressive M3 chip shapes (asymmetric, arch, bun)
 * - Semantic role colors (success for student, info for instructor, secondary for admin)
 * - Role-specific icon adornments (school, supervisor, admin settings)
 * - Internationalized role labels
 */
export const RoleChip = forwardRef<HTMLDivElement, RoleChipProps>(
  function RoleChip(props, ref) {
    const {
      userRole,
      role,
      showIcon = true,
      icon,
      label,
      shape,
      color,
      testId,
      "data-testid": dataTestId,
      ...rest
    } = props;

    const { t } = useTranslation(["auth", "common"]);
    const rawRole = (userRole ?? role ?? "student") || "student";
    const roleConfig = getRoleConfig(rawRole);
    const defaultAllLabel = t("common:filterBar.allRoles", "All Roles");
    const defaultRoleLabel = t(
      `auth:devTool.roles.${roleConfig.key}`,
      roleConfig.label,
    ).toUpperCase();

    const visuals = resolveRoleVisuals(
      rawRole,
      {
        label,
        showIcon,
        icon,
        shape,
        color,
        testId: dataTestId || testId,
      },
      defaultAllLabel,
      defaultRoleLabel,
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

RoleChip.displayName = "RoleChip";
export default RoleChip;
