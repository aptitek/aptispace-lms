import type { Meta, StoryObj } from "@storybook/react-vite";
import Chip from "@mui/material/Chip";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import SchoolIcon from "@mui/icons-material/School";
import PersonIcon from "@mui/icons-material/Person";
import Box from "@mui/material/Box";

const meta = {
  title: "Atoms/Chip",
  component: Chip,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "radio",
      options: ["filled", "outlined"],
    },
    color: {
      control: "select",
      options: [
        "default",
        "primary",
        "secondary",
        "success",
        "error",
        "info",
        "warning",
      ],
    },
    size: {
      control: "select",
      options: ["small", "medium"],
    },
    label: { control: "text" },
    disabled: { control: "boolean" },
  },
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Admin",
    color: "warning",
    variant: "outlined",
    size: "small",
    sx: { fontWeight: 700 },
  },
};

export const RoleBadges: Story = {
  render: () => (
    <Box
      sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, alignItems: "center" }}
    >
      <Chip
        label="Admin"
        color="warning"
        variant="outlined"
        size="small"
        icon={<AdminPanelSettingsIcon />}
        sx={{ fontWeight: 700 }}
      />
      <Chip
        label="Instructor"
        color="info"
        variant="outlined"
        size="small"
        icon={<SchoolIcon />}
        sx={{ fontWeight: 700 }}
      />
      <Chip
        label="Student"
        color="success"
        variant="outlined"
        size="small"
        icon={<PersonIcon />}
        sx={{ fontWeight: 700 }}
      />
    </Box>
  ),
};

export const ColorVariants: Story = {
  render: () => (
    <Box
      sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, alignItems: "center" }}
    >
      <Chip label="Primary" color="primary" />
      <Chip label="Secondary" color="secondary" />
      <Chip label="Success" color="success" />
      <Chip label="Warning" color="warning" />
      <Chip label="Error" color="error" />
      <Chip label="Info" color="info" />
      <Chip label="Outlined" variant="outlined" color="primary" />
    </Box>
  ),
};
