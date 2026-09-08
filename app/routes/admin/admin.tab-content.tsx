import React from "react";
import type { AdminTabKey } from "./admin.tabs";
import AdminCohortsTabPanel from "./admin.cohorts-tab";
import { AdminMissionCenterTabPanel } from "./admin.mission-tab";
import { AdminUsersTabPanel } from "./admin.users-tab";
import { AdminCoursesTabPanel } from "./admin.courses-tab";

export interface AdminTabContentProps {
  activeTab: AdminTabKey;
  usersProps: React.ComponentProps<typeof AdminUsersTabPanel>;
  cohortsProps: React.ComponentProps<typeof AdminCohortsTabPanel>;
  missionCenterProps?: React.ComponentProps<typeof AdminMissionCenterTabPanel>;
}

export function AdminTabContent({
  activeTab,
  usersProps,
  cohortsProps,
  missionCenterProps,
}: AdminTabContentProps) {
  if (activeTab === "cohorts") {
    return <AdminCohortsTabPanel {...cohortsProps} />;
  }
  if (activeTab === "mission-center" && missionCenterProps) {
    return <AdminMissionCenterTabPanel {...missionCenterProps} />;
  }
  if (activeTab === "courses") {
    return <AdminCoursesTabPanel />;
  }
  return <AdminUsersTabPanel {...usersProps} />;
}

export default AdminTabContent;
