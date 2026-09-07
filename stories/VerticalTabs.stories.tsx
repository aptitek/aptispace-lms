import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import AdminPanelSettingsRoundedIcon from "@mui/icons-material/AdminPanelSettingsRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import Chip from "~/components/atoms/Chip/Chip";
import { VerticalTabs, VerticalTab } from "~/components/atoms/VerticalTabs";

const meta: Meta<typeof VerticalTabs> = {
  title: "Atoms/VerticalTabs",
  component: VerticalTabs,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Vertical tab navigation system based on MUI's Tab. Includes a compact variant that shows only the icon when collapsed with tooltips, and extends horizontally into full text just like the logout button in ProfileButton.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "radio",
      options: ["default", "compact"],
      description: "Tab display variant",
    },
    extended: {
      control: "boolean",
      description: "Whether compact tabs are extended into full text labels",
    },
    size: {
      control: { type: "number", min: 32, max: 56, step: 4 },
      description: "Height/diameter in pixels",
    },
  },
};

export default meta;
type Story = StoryObj<typeof VerticalTabs>;

function DefaultTabsDemo() {
  const [tab, setTab] = useState("planning");

  return (
    <Box
      sx={{
        width: 260,
        p: 2,
        borderRadius: "16px",
        bgcolor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      <Typography
        variant="subtitle2"
        sx={{ mb: 1.5, px: 1, color: "text.secondary" }}
      >
        Navigation
      </Typography>
      <VerticalTabs
        value={tab}
        onChange={(_, next) => setTab(next)}
        variant="default"
      >
        <VerticalTab value="home" label="Home" icon={<HomeRoundedIcon />} />
        <VerticalTab
          value="planning"
          label="Planning"
          icon={<CalendarMonthRoundedIcon />}
          badge={<Chip label="Live" color="success" size="small" />}
        />
        <VerticalTab
          value="schools"
          label="Schools"
          icon={<SchoolRoundedIcon />}
        />
        <VerticalTab
          value="admin"
          label="Administration"
          icon={<AdminPanelSettingsRoundedIcon />}
        />
        <VerticalTab
          value="settings"
          label="Settings"
          icon={<SettingsRoundedIcon />}
        />
      </VerticalTabs>
    </Box>
  );
}

export const Default: Story = {
  render: () => <DefaultTabsDemo />,
};

function CompactCollapsedDemo() {
  const [tab, setTab] = useState("planning");

  return (
    <Box
      sx={{
        width: 64,
        py: 2,
        borderRadius: "16px",
        bgcolor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <VerticalTabs
        value={tab}
        onChange={(_, next) => setTab(next)}
        variant="compact"
        extended={false}
      >
        <VerticalTab value="home" label="Home" icon={<HomeRoundedIcon />} />
        <VerticalTab
          value="planning"
          label="Planning"
          icon={<CalendarMonthRoundedIcon />}
        />
        <VerticalTab
          value="schools"
          label="Schools"
          icon={<SchoolRoundedIcon />}
        />
        <VerticalTab
          value="admin"
          label="Administration"
          icon={<AdminPanelSettingsRoundedIcon />}
        />
        <VerticalTab
          value="settings"
          label="Settings"
          icon={<SettingsRoundedIcon />}
        />
      </VerticalTabs>
    </Box>
  );
}

export const CompactCollapsed: Story = {
  render: () => <CompactCollapsedDemo />,
};

function CompactExtendedDemo() {
  const [tab, setTab] = useState("planning");

  return (
    <Box
      sx={{
        width: 240,
        p: 2,
        borderRadius: "16px",
        bgcolor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      <VerticalTabs
        value={tab}
        onChange={(_, next) => setTab(next)}
        variant="compact"
        extended={true}
      >
        <VerticalTab value="home" label="Home" icon={<HomeRoundedIcon />} />
        <VerticalTab
          value="planning"
          label="Planning"
          icon={<CalendarMonthRoundedIcon />}
          badge={<Chip label="Live" color="success" size="small" />}
        />
        <VerticalTab
          value="schools"
          label="Schools"
          icon={<SchoolRoundedIcon />}
        />
        <VerticalTab
          value="admin"
          label="Administration"
          icon={<AdminPanelSettingsRoundedIcon />}
        />
        <VerticalTab
          value="settings"
          label="Settings"
          icon={<SettingsRoundedIcon />}
        />
      </VerticalTabs>
    </Box>
  );
}

export const CompactExtended: Story = {
  render: () => <CompactExtendedDemo />,
};

function InteractiveRailDemo() {
  const [tab, setTab] = useState("planning");
  const [isExtended, setIsExtended] = useState(false);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        alignItems: "center",
      }}
    >
      <Button
        variant="outlined"
        size="small"
        onClick={() => setIsExtended((prev) => !prev)}
        sx={{ borderRadius: "9999px" }}
      >
        {isExtended ? "Collapse to Icons Only" : "Extend to Full Text"}
      </Button>

      <Box
        sx={{
          width: isExtended ? 240 : 64,
          minHeight: 280,
          p: isExtended ? 2 : 1,
          borderRadius: "20px",
          bgcolor: "background.paper",
          border: "1px solid",
          borderColor: "divider",
          boxShadow: 2,
          transition:
            "width 250ms cubic-bezier(0.2, 0, 0, 1), padding 250ms ease",
          display: "flex",
          flexDirection: "column",
          alignItems: isExtended ? "stretch" : "center",
          overflow: "hidden",
        }}
      >
        <VerticalTabs
          value={tab}
          onChange={(_, next) => setTab(next)}
          variant="compact"
          extended={isExtended}
        >
          <VerticalTab value="home" label="Home" icon={<HomeRoundedIcon />} />
          <VerticalTab
            value="planning"
            label="Planning"
            icon={<CalendarMonthRoundedIcon />}
            badge={
              isExtended ? (
                <Chip label="New" color="primary" size="small" />
              ) : undefined
            }
          />
          <VerticalTab
            value="schools"
            label="Schools"
            icon={<SchoolRoundedIcon />}
          />
          <VerticalTab
            value="admin"
            label="Administration"
            icon={<AdminPanelSettingsRoundedIcon />}
          />
          <VerticalTab
            value="settings"
            label="Settings"
            icon={<SettingsRoundedIcon />}
          />
        </VerticalTabs>
      </Box>
    </Box>
  );
}

export const InteractiveRail: Story = {
  render: () => <InteractiveRailDemo />,
};
