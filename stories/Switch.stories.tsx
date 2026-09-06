import type { Meta, StoryObj } from "@storybook/react-vite";
import React, { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import BugReportRoundedIcon from "@mui/icons-material/BugReportRounded";
import Switch from "~/components/atoms/Switch/Switch";

const meta = {
  title: "Atoms/Switch",
  component: Switch,
  tags: ["autodocs"],
  argTypes: {
    checked: { control: "boolean" },
    disabled: { control: "boolean" },
  },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

function DefaultSwitchDemo() {
  const [checked, setChecked] = useState(false);
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
      <Switch
        checked={checked}
        onChange={setChecked}
        aria-label="Default Switch"
      />
      <Typography variant="body2">
        {checked ? "Switch is ON" : "Switch is OFF"}
      </Typography>
    </Box>
  );
}

function WithIconsDemo() {
  const [checked, setChecked] = useState(true);
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
      <Switch
        checked={checked}
        onChange={setChecked}
        aria-label="Switch with status icons"
        icon={(c) => (c ? <CheckRoundedIcon /> : <CloseRoundedIcon />)}
      />
      <Typography variant="body2">With Check / Close Icons</Typography>
    </Box>
  );
}

function DebugSwitchDemo() {
  const [checked, setChecked] = useState(false);
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
      <Switch
        checked={checked}
        onChange={setChecked}
        aria-label="Debug Switch"
        icon={<BugReportRoundedIcon />}
      />
      <Typography variant="body2">Debug Mode Switch</Typography>
    </Box>
  );
}

export const Default: Story = {
  render: () => <DefaultSwitchDemo />,
};

export const WithIcons: Story = {
  render: () => <WithIconsDemo />,
};

export const DebugThemeSwitch: Story = {
  render: () => <DebugSwitchDemo />,
};

export const Sizes: Story = {
  render: () => (
    <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 1,
        }}
      >
        <Switch size="small" defaultChecked aria-label="Small switch" />
        <Typography variant="caption" color="text.secondary">
          Small (46x26)
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 1,
        }}
      >
        <Switch size="medium" defaultChecked aria-label="Medium switch" />
        <Typography variant="caption" color="text.secondary">
          Medium (56x32)
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 1,
        }}
      >
        <Switch size="large" defaultChecked aria-label="Large switch" />
        <Typography variant="caption" color="text.secondary">
          Large (72x40)
        </Typography>
      </Box>
    </Box>
  ),
};

export const DisabledStates: Story = {
  render: () => (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Switch checked={false} disabled aria-label="Disabled off" />
        <Typography variant="body2" color="text.secondary">
          Disabled (Off)
        </Typography>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Switch checked={true} disabled aria-label="Disabled on" />
        <Typography variant="body2" color="text.secondary">
          Disabled (On)
        </Typography>
      </Box>
    </Box>
  ),
};
