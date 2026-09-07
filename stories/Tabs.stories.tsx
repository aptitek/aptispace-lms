import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import AdminPanelSettingsRoundedIcon from "@mui/icons-material/AdminPanelSettingsRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import Chip from "~/components/atoms/Chip/Chip";
import { Tabs, Tab } from "~/components/atoms/Tabs";

const meta: Meta<typeof Tabs> = {
  title: "Atoms/Tabs",
  component: Tabs,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Unified Tab navigation system based on Material Design 3 and MUI Tab. Supports standard horizontal tabs (admin style with bottom 3px indicator) and vertical tab variants (stationary icon anchor that expands horizontally on hover).",
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Tabs>;

function HorizontalTabsDemo() {
  const [tab, setTab] = useState("users");

  return (
    <Box
      sx={{
        width: 600,
        p: 2,
        borderRadius: "16px",
        bgcolor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      <Tabs
        value={tab}
        onChange={(_, next) => setTab(next)}
        aria-label="Horizontal tabs demo"
      >
        <Tab
          value="users"
          icon={<SchoolRoundedIcon sx={{ fontSize: 18, mr: 0.5 }} />}
          label="Users"
          badge={
            <Chip
              label={42}
              size="small"
              color="primary"
              sx={{ height: 18, fontSize: "0.65rem", fontWeight: 800 }}
            />
          }
        />
        <Tab
          value="cohorts"
          icon={<CalendarMonthRoundedIcon sx={{ fontSize: 18, mr: 0.5 }} />}
          label="Cohorts"
        />
        <Tab
          value="settings"
          icon={<SettingsRoundedIcon sx={{ fontSize: 18, mr: 0.5 }} />}
          label="Settings"
        />
      </Tabs>
      <Box sx={{ p: 3 }}>
        <Typography variant="body2" color="text.secondary">
          Active tab: <strong>{tab}</strong>
        </Typography>
      </Box>
    </Box>
  );
}

function VerticalTabsDemo() {
  const [tab, setTab] = useState("planning");

  return (
    <Box
      sx={{
        width: 72,
        minHeight: 350,
        py: 2,
        borderRadius: "16px",
        bgcolor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
        position: "relative",
      }}
    >
      <Tabs
        orientation="vertical"
        value={tab}
        onChange={(_, next) => setTab(next)}
        aria-label="Vertical tabs demo"
      >
        <Tab value="home" label="Home" icon={<HomeRoundedIcon />} />
        <Tab
          value="planning"
          label="Planning"
          icon={<CalendarMonthRoundedIcon />}
          badge={
            <Chip
              label="3"
              size="small"
              color="error"
              sx={{ height: 18, fontSize: "0.65rem", fontWeight: 800 }}
            />
          }
        />
        <Tab value="courses" label="Courses" icon={<SchoolRoundedIcon />} />
        <Tab
          value="admin"
          label="Administration"
          icon={<AdminPanelSettingsRoundedIcon />}
        />
        <Tab value="settings" label="Settings" icon={<SettingsRoundedIcon />} />
      </Tabs>
    </Box>
  );
}

export const Horizontal: Story = {
  render: () => <HorizontalTabsDemo />,
};

export const Vertical: Story = {
  render: () => <VerticalTabsDemo />,
};
