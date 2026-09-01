import { forwardRef } from "react";
import { useTranslation } from "react-i18next";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import SupervisorAccountRoundedIcon from "@mui/icons-material/SupervisorAccountRounded";
import AdminPanelSettingsRoundedIcon from "@mui/icons-material/AdminPanelSettingsRounded";
import Tooltip from "../Tooltip/Tooltip";
import type { RoleBadgeProps } from "./RoleBadge.types";
import { RoleBadgeRoot, getRoleBadgeShapeName } from "./RoleBadge.styles";
import ShapeDefs from "../Avatar/ShapeDefs";
import type { UserRole } from "../../../utils/auth";

export function getRoleIcon(role?: UserRole | string) {
  const normalized = (role || "").toLowerCase().trim();
  switch (normalized) {
    case "admin":
    case "administrator":
      return <AdminPanelSettingsRoundedIcon data-testid="role-icon-admin" />;
    case "instructor":
    case "teacher":
    case "editingteacher":
    case "faculty":
      return (
        <SupervisorAccountRoundedIcon data-testid="role-icon-instructor" />
      );
    case "student":
    default:
      return <SchoolRoundedIcon data-testid="role-icon-student" />;
  }
}

export function getRoleLabelText(
  role: UserRole | string | undefined,
  t: (key: string, fallback: string) => string,
): string {
  const normalized = (role || "").toLowerCase().trim();
  switch (normalized) {
    case "admin":
    case "administrator":
      return t("auth:devTool.roles.admin", "Admin");
    case "instructor":
    case "teacher":
    case "editingteacher":
    case "faculty":
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
    const shapeName = getRoleBadgeShapeName(config.role);
    const testId =
      props["data-testid"] || props.testId || `role-badge-${config.role}`;

    const badgeNode = (
      <RoleBadgeRoot
        ref={ref}
        userRole={config.role}
        roleVariant={config.variant}
        roleSize={config.size}
        className={props.className}
        style={props.style}
        role="status"
        tabIndex={0}
        aria-label={roleLabel}
        data-testid={testId}
        data-shape={shapeName}
      >
        <ShapeDefs />
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
