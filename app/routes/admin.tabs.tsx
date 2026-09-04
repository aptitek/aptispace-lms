import React from "react";
import { useTranslation } from "react-i18next";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Chip from "~/components/atoms/Chip/Chip";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import ClassIcon from "@mui/icons-material/Class";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import HubRoundedIcon from "@mui/icons-material/HubRounded";
import { StyledTabsContainer, StyledTab } from "./admin.styles";

export type AdminTabKey = "users" | "cohorts" | "mission-center" | "courses";

const TAB_INDEX_TO_KEY: Record<number, AdminTabKey> = {
  0: "users",
  1: "cohorts",
  2: "mission-center",
  3: "courses",
};

export interface AdminTabsSectionProps {
  activeTab: AdminTabKey | string | number;
  totalUsers: number;
  openIssuesCount?: number;
  onChange?: (event: React.SyntheticEvent, newValue: AdminTabKey) => void;
}

export function AdminTabsSection({
  activeTab,
  totalUsers,
  openIssuesCount,
  onChange,
}: AdminTabsSectionProps) {
  const { t } = useTranslation(["common", "auth"]);

  // Normalize string / number activeTab value
  const normalizedValue: AdminTabKey =
    typeof activeTab === "number"
      ? (TAB_INDEX_TO_KEY[activeTab] ?? "users")
      : (activeTab as AdminTabKey) || "users";

  const handleChange = (event: React.SyntheticEvent, val: AdminTabKey) => {
    if (onChange) {
      onChange(event, val);
    }
  };

  return (
    <StyledTabsContainer>
      <Tabs
        value={normalizedValue}
        onChange={handleChange}
        aria-label={t(
          "common:admin.tabs.aria",
          "Admin management navigation tabs",
        )}
        data-testid="admin-tabs"
      >
        <StyledTab
          value="users"
          icon={<SupervisorAccountIcon sx={{ fontSize: 18, mr: 0.5 }} />}
          iconPosition="start"
          label={
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <span>{t("common:admin.tabs.users", "Users")}</span>
              <Chip
                label={totalUsers}
                size="small"
                color="primary"
                sx={{ height: 18, fontSize: "0.65rem", fontWeight: 800 }}
                data-testid="tab-users-count"
              />
            </Box>
          }
          id="admin-tab-users"
          aria-controls="admin-tabpanel-users"
          data-testid="tab-users"
        />

        <StyledTab
          value="cohorts"
          icon={<ClassIcon sx={{ fontSize: 18, mr: 0.5 }} />}
          iconPosition="start"
          label={t("common:admin.tabs.cohorts", "Cohorts")}
          id="admin-tab-cohorts"
          aria-controls="admin-tabpanel-cohorts"
          data-testid="tab-cohorts"
        />

        <StyledTab
          value="mission-center"
          icon={<HubRoundedIcon sx={{ fontSize: 18, mr: 0.5 }} />}
          iconPosition="start"
          label={
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <span>
                {t("common:admin.tabs.missionCenter", "Mission Center")}
              </span>
              {openIssuesCount !== undefined && openIssuesCount > 0 ? (
                <Chip
                  label={openIssuesCount}
                  size="small"
                  color="error"
                  sx={{ height: 18, fontSize: "0.65rem", fontWeight: 800 }}
                  data-testid="tab-mission-center-count"
                />
              ) : (
                <Chip
                  label="Nominal"
                  size="small"
                  color="success"
                  sx={{ height: 18, fontSize: "0.65rem", fontWeight: 700 }}
                  data-testid="tab-mission-center-nominal"
                />
              )}
            </Box>
          }
          id="admin-tab-mission-center"
          aria-controls="admin-tabpanel-mission-center"
          data-testid="tab-mission-center"
        />

        <StyledTab
          value="courses"
          icon={<MenuBookIcon sx={{ fontSize: 18, mr: 0.5 }} />}
          iconPosition="start"
          label={t("common:admin.tabs.courses", "Courses")}
          id="admin-tab-courses"
          aria-controls="admin-tabpanel-courses"
          data-testid="tab-courses"
        />
      </Tabs>
    </StyledTabsContainer>
  );
}

export default AdminTabsSection;
