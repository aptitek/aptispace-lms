import React from "react";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import AdminPanelSettingsRoundedIcon from "@mui/icons-material/AdminPanelSettingsRounded";
import type { AuthUser } from "~/utils/auth";
import type { HeaderTabItem } from "./HeaderTabs.types";

export const DEFAULT_HEADER_TABS: HeaderTabItem[] = [
  {
    id: "planning",
    labelKey: "common:nav.planning",
    fallbackLabel: "Planning",
    to: "/planning",
    icon: <CalendarMonthRoundedIcon sx={{ fontSize: 18 }} />,
    matchPaths: ["/", "/planning"],
    testId: "header-tab-planning",
  },
  {
    id: "admin",
    labelKey: "common:nav.admin",
    fallbackLabel: "Admin",
    to: "/admin",
    icon: <AdminPanelSettingsRoundedIcon sx={{ fontSize: 18 }} />,
    matchPaths: ["/admin"],
    allowedRoles: ["admin"],
    testId: "header-tab-admin",
  },
];

export function isTabPermitted(
  tab: HeaderTabItem,
  user?: AuthUser | null,
): boolean {
  if (!tab.allowedRoles) {
    return true;
  }
  if (!user) {
    return false;
  }
  if (user.impersonating) {
    return true;
  }
  return tab.allowedRoles.includes(user.role);
}

export function resolveVisibleTabs(
  tabs: HeaderTabItem[] = DEFAULT_HEADER_TABS,
  user?: AuthUser | null,
): HeaderTabItem[] {
  return tabs.filter((tab) => isTabPermitted(tab, user));
}
