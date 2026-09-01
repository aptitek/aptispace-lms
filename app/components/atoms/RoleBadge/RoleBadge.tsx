import { forwardRef } from "react";
import { useTranslation } from "react-i18next";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import PsychologyRoundedIcon from "@mui/icons-material/PsychologyRounded";
import AdminPanelSettingsRoundedIcon from "@mui/icons-material/AdminPanelSettingsRounded";
import Tooltip from "../Tooltip/Tooltip";
import type { RoleBadgeProps } from "./RoleBadge.types";
import { RoleBadgeRoot } from "./RoleBadge.styles";
import type { UserRole } from "../../../utils/auth";

export function getRoleIcon(role?: UserRole | string) {
  switch (role) {
    case "admin":
      return <AdminPanelSettingsRoundedIcon data-testid="role-icon-admin" />;
    case "instructor":
      return <PsychologyRoundedIcon data-testid="role-icon-instructor" />;
    case "student":
    default:
      return <SchoolRoundedIcon data-testid="role-icon-student" />;
  }
}

export function getRoleLabelText(
  role: UserRole | string | undefined,
  t: (key: string, fallback: string) => string,
): string {
  switch (role) {
    case "admin":
      return t("auth:devTool.roles.admin", "Admin");
    case "instructor":
      return t("auth:devTool.roles.instructor", "Instructor");
    case "student":
    default:
      return t("auth:devTool.roles.student", "Student");
  }
}

/**
 * RoleBadge Atom Component
 *
 * Renders an accessible, theme-driven role badge with:
 * - Student: Theme Success (Green) + School Cap Icon
 * - Instructor: Theme Primary (Blue) + Mentor/Psychology Icon
 * - Admin: Theme Secondary (Magenta) + Admin Shield Icon
 * - Glassmorphism, subtle glow, and tooltips
 */
function resolveBadgeConfig(props: RoleBadgeProps) {
  const role = props.userRole || props.role || "student";
  const size = props.size || "small";
  const variant = props.variant || "icon-only";
  const showTooltip = props.showTooltip !== false;
  return { role, size, variant, showTooltip };
}

export const RoleBadge = forwardRef<HTMLSpanElement, RoleBadgeProps>(
  function RoleBadge(props, ref) {
    const { t } = useTranslation(["auth", "common"]);
    const config = resolveBadgeConfig(props);
    const roleLabel = getRoleLabelText(config.role, t);
    const roleIcon = getRoleIcon(config.role);
    const tooltip = props.tooltipText || roleLabel;
    const testId =
      props["data-testid"] || props.testId || `role-badge-${config.role}`;

    const badgeNode = (
      <RoleBadgeRoot
        ref={ref}
        userRole={config.role}
        roleVariant={config.variant}
        roleSize={config.size}
        className={props.className}
        role="status"
        aria-label={roleLabel}
        data-testid={testId}
      >
        {roleIcon}
        {config.variant !== "icon-only" && <span>{roleLabel}</span>}
      </RoleBadgeRoot>
    );

    if (config.showTooltip && tooltip) {
      return (
        <Tooltip title={tooltip} arrow placement="top">
          {badgeNode}
        </Tooltip>
      );
    }

    return badgeNode;
  },
);

RoleBadge.displayName = "RoleBadge";
export default RoleBadge;
