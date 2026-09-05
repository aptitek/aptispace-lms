import type { Meta, StoryObj } from "@storybook/react-vite";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import GitHubIcon from "@mui/icons-material/GitHub";
import AdminPanelSettingsRoundedIcon from "@mui/icons-material/AdminPanelSettingsRounded";
import SupervisorAccountRoundedIcon from "@mui/icons-material/SupervisorAccountRounded";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import CodeRoundedIcon from "@mui/icons-material/CodeRounded";
import VerifiedRoundedIcon from "@mui/icons-material/VerifiedRounded";
import Chip from "../app/components/atoms/Chip/Chip";
import RoleChip from "../app/components/molecules/RoleChip/RoleChip";

const meta = {
  title: "Atoms/Chip",
  component: Chip,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Generic, shape-aware Chip atom extending MUI Chip with support for all 35 M3 expressive shapes, custom icons, embedded images/logos, monospace typography, and interactive link/click states.",
      },
    },
  },
  argTypes: {
    variant: {
      control: "radio",
      options: ["filled", "outlined"],
      description: "Visual surface treatment",
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
      description: "Palette color from design tokens",
    },
    size: {
      control: "select",
      options: ["small", "medium"],
      description: "Size preset",
    },
    shape: {
      control: "text",
      description:
        "M3 expressive shape name ('pill', '9-sided-cookie', 'ghost-ish', 'diamond', etc.) or custom radius",
    },
    mono: {
      control: "boolean",
      description: "Enable monospace typography for handles, hashes, or code",
    },
    label: { control: "text" },
    disabled: { control: "boolean" },
    clickable: { control: "boolean" },
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

export const ExpressiveShapes: Story = {
  render: () => (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Typography variant="subtitle2" sx={{ color: "text.secondary" }}>
        M3 Expressive & Geometric Shapes
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 1.5,
          alignItems: "center",
        }}
      >
        <Chip
          label="Pill (Default)"
          shape="pill"
          color="primary"
          variant="filled"
        />
        <Chip
          label="9-Sided Cookie"
          shape="9-sided-cookie"
          color="secondary"
          variant="filled"
        />
        <Chip
          label="Ghost-ish"
          shape="ghost-ish"
          color="info"
          variant="filled"
        />
        <Chip
          label="Diamond"
          shape="diamond"
          color="success"
          variant="filled"
        />
        <Chip
          label="Cut Corners"
          shape="cut"
          color="warning"
          variant="filled"
        />
        <Chip
          label="Asymmetric"
          shape="asymmetric"
          color="error"
          variant="filled"
        />
        <Chip label="Arch" shape="arch" color="primary" variant="outlined" />
      </Box>
    </Box>
  ),
};

export const HandlesAndIcons: Story = {
  render: () => (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Typography variant="subtitle2" sx={{ color: "text.secondary" }}>
        GitHub Handles, Technical Tokens & Role Chips
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 1.5,
          alignItems: "center",
        }}
      >
        <Chip
          icon={<GitHubIcon sx={{ fontSize: 16 }} />}
          label="@aptitek"
          mono
          size="small"
          variant="outlined"
          clickable
        />
        <Chip
          icon={<AdminPanelSettingsRoundedIcon />}
          label="Administrator"
          shape="9-sided-cookie"
          color="secondary"
          size="small"
        />
        <Chip
          icon={<SupervisorAccountRoundedIcon />}
          label="Instructor"
          shape="ghost-ish"
          color="info"
          size="small"
        />
        <Chip
          icon={<SchoolRoundedIcon />}
          label="Student"
          shape="pill"
          color="success"
          size="small"
        />
        <Chip
          icon={<CodeRoundedIcon />}
          label="v2.4.0-rc1"
          mono
          color="default"
          size="small"
          variant="outlined"
        />
      </Box>
    </Box>
  ),
};

export const CraftedByAndImages: Story = {
  render: () => (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Typography variant="subtitle2" sx={{ color: "text.secondary" }}>
        Logo & Image Embeds (Start / End Position)
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 1.5,
          alignItems: "center",
        }}
      >
        <Chip
          label="Crafted by"
          image="/aptitek-logo.svg"
          imageAlt="Aptitek"
          imagePosition="end"
          imageHeight={14}
          component="a"
          href="https://aptitek.io"
          target="_blank"
          rel="noopener noreferrer"
          size="small"
          variant="outlined"
          clickable
          sx={{
            fontWeight: 600,
            textDecoration: "none",
          }}
        />
        <Chip
          label="Verified Partner"
          icon={<VerifiedRoundedIcon sx={{ fontSize: 16 }} />}
          image="/aptitek-logo.svg"
          imagePosition="end"
          imageHeight={12}
          color="primary"
          variant="outlined"
          size="small"
        />
      </Box>
    </Box>
  ),
};

export const InteractiveStates: Story = {
  render: () => (
    <Box
      sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, alignItems: "center" }}
    >
      <Chip
        label="Clickable"
        clickable
        color="primary"
        onClick={() => alert("Clicked!")}
      />
      <Chip
        label="Link Chip"
        component="a"
        href="https://aptitek.io"
        target="_blank"
        clickable
        color="secondary"
      />
      <Chip
        label="Deletable"
        onDelete={() => alert("Deleted!")}
        color="error"
        variant="outlined"
      />
      <Chip label="Disabled" disabled color="primary" />
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

export const RoleChips: Story = {
  render: () => (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Typography variant="subtitle2" sx={{ color: "text.secondary" }}>
        RoleChip Molecule (Shaped + Colored + Icon)
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 1.5,
          alignItems: "center",
        }}
      >
        <RoleChip userRole="student" size="small" />
        <RoleChip userRole="instructor" size="small" />
        <RoleChip userRole="admin" size="small" />
        <RoleChip userRole="all" size="small" />
        <RoleChip userRole="admin" variant="outlined" size="small" />
      </Box>
    </Box>
  ),
};
