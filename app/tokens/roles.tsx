import type { ReactElement } from "react";
import AdminPanelSettingsRoundedIcon from "@mui/icons-material/AdminPanelSettingsRounded";
import SupervisorAccountRoundedIcon from "@mui/icons-material/SupervisorAccountRounded";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import { MaterialShapes, type RoundedPolygon } from "material-shapes-ts";
import { ROLE_COLORS } from "./namedColors";
import type { ExpressiveShapeName } from "./shapes";

export type BadgeColor =
  | "primary"
  | "secondary"
  | "success"
  | "error"
  | "info"
  | "warning"
  | "default";

export type ChipShape = ExpressiveShapeName | string | number;

export type RoleType = "student" | "instructor" | "admin";

export interface RoleConfig {
  key: RoleType;
  label: string;
  color: string;
  badgeColor: BadgeColor;
  chipColor:
    | "primary"
    | "secondary"
    | "success"
    | "error"
    | "info"
    | "warning"
    | "default";
  avatarShape: ExpressiveShapeName;
  polygonShape: RoundedPolygon;
  badgeShape: ExpressiveShapeName;
  statusChipShape: ChipShape;
  icon: ReactElement;
}

export const ROLE_CONFIGS: Record<RoleType, RoleConfig> = {
  student: {
    key: "student",
    label: "Student",
    color: ROLE_COLORS.student,
    badgeColor: "success",
    chipColor: "success",
    avatarShape: "pill",
    polygonShape: MaterialShapes.Pill,
    badgeShape: "pill",
    statusChipShape: "asymmetric",
    icon: <SchoolRoundedIcon data-testid="role-icon-student" />,
  },
  instructor: {
    key: "instructor",
    label: "Instructor",
    color: ROLE_COLORS.instructor,
    badgeColor: "info",
    chipColor: "info",
    avatarShape: "ghost-ish",
    polygonShape: MaterialShapes.Ghostish,
    badgeShape: "ghost-ish",
    statusChipShape: "arch",
    icon: <SupervisorAccountRoundedIcon data-testid="role-icon-instructor" />,
  },
  admin: {
    key: "admin",
    label: "Admin",
    color: ROLE_COLORS.admin,
    badgeColor: "secondary",
    chipColor: "secondary",
    avatarShape: "9-sided-cookie",
    polygonShape: MaterialShapes.Cookie9Sided,
    badgeShape: "9-sided-cookie",
    statusChipShape: "bun",
    icon: <AdminPanelSettingsRoundedIcon data-testid="role-icon-admin" />,
  },
};

export function normalizeRole(role?: string | null): RoleType {
  const norm = (role || "").toLowerCase().trim();
  switch (norm) {
    case "admin":
    case "administrator":
      return "admin";
    case "instructor":
    case "teacher":
    case "editingteacher":
    case "faculty":
      return "instructor";
    case "student":
    default:
      return "student";
  }
}

export function getRoleConfig(role?: string | null): RoleConfig {
  const normalized = normalizeRole(role);
  return ROLE_CONFIGS[normalized];
}
