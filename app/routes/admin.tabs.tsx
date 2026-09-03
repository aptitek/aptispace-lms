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

export interface AdminTabsSectionProps {
  activeTab: number;
  totalUsers: number;
  openIssuesCount?: number;
  onChange: (event: React.SyntheticEvent, newValue: number) => void;
}

export function AdminTabsSection({
  activeTab,
  totalUsers,
  openIssuesCount,
  onChange,
}: AdminTabsSectionProps) {
  const { t } = useTranslation(["common", "auth"]);

  return (
    <StyledTabsContainer>
      <Tabs
        value={activeTab}
        onChange={onChange}
        aria-label={t(
          "common:admin.tabs.aria",
          "Admin management navigation tabs",
        )}
        data-testid="admin-tabs"
      >
        <StyledTab
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
          id="admin-tab-0"
          aria-controls="admin-tabpanel-0"
          data-testid="tab-users"
        />

        <StyledTab
          icon={<ClassIcon sx={{ fontSize: 18, mr: 0.5 }} />}
          iconPosition="start"
          label={t("common:admin.tabs.cohorts", "Cohorts")}
          id="admin-tab-1"
          aria-controls="admin-tabpanel-1"
          data-testid="tab-cohorts"
        />

        <StyledTab
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
          id="admin-tab-2"
          aria-controls="admin-tabpanel-2"
          data-testid="tab-mission-center"
        />

        <StyledTab
          icon={<MenuBookIcon sx={{ fontSize: 18, mr: 0.5 }} />}
          iconPosition="start"
          label={t("common:admin.tabs.courses", "Courses")}
          id="admin-tab-3"
          aria-controls="admin-tabpanel-3"
          disabled
          data-testid="tab-courses"
        />
      </Tabs>
    </StyledTabsContainer>
  );
}

export default AdminTabsSection;
