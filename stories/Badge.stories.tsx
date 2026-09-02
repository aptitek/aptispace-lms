import type { Meta, StoryObj } from "@storybook/react-vite";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AdminPanelSettingsRoundedIcon from "@mui/icons-material/AdminPanelSettingsRounded";
import SupervisorAccountRoundedIcon from "@mui/icons-material/SupervisorAccountRounded";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import Badge from "../app/components/atoms/Badge/Badge";

const meta = {
  title: "Atoms/Badge",
  component: Badge,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Generic, shape-aware Badge atom extending MUI Badge. Supports standalone icon/status mode, expressive M3 shapes, custom icons in badge slots, glowing ambient highlights, and wrapped child badges.",
      },
    },
  },
  argTypes: {
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
      options: ["small", "medium", "large"],
      description: "Badge sizing preset",
    },
    shape: {
      control: "text",
      description:
        "M3 expressive shape name ('pill', '9-sided-cookie', 'ghost-ish', 'diamond', etc.) or custom radius",
    },
    standalone: {
      control: "boolean",
      description: "Render badge as an atomic standalone indicator node",
    },
    glow: {
      control: "boolean",
      description: "Enable glowing ambient light drop-shadow",
    },
    mono: {
      control: "boolean",
      description: "Monospace typography for counts",
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    badgeContent: 4,
    color: "primary",
    children: (
      <IconButton aria-label="notifications">
        <NotificationsIcon />
      </IconButton>
    ),
  },
};

export const StandaloneRoleBadges: Story = {
  render: () => (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Box>
        <Typography variant="subtitle2" sx={{ mb: 1, color: "text.secondary" }}>
          Standalone Role Badges (Replacing legacy RoleBadge icon-only)
        </Typography>
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <Badge
            shape="pill"
            color="success"
            icon={<SchoolRoundedIcon />}
            size="medium"
            standalone
          />
          <Badge
            shape="ghost-ish"
            color="info"
            icon={<SupervisorAccountRoundedIcon />}
            size="medium"
            standalone
          />
          <Badge
            shape="9-sided-cookie"
            color="secondary"
            icon={<AdminPanelSettingsRoundedIcon />}
            size="medium"
            standalone
          />
        </Box>
      </Box>

      <Box>
        <Typography variant="subtitle2" sx={{ mb: 1, color: "text.secondary" }}>
          Size Variations (Admin)
        </Typography>
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <Badge
            shape="9-sided-cookie"
            color="secondary"
            icon={<AdminPanelSettingsRoundedIcon />}
            size="small"
            standalone
          />
          <Badge
            shape="9-sided-cookie"
            color="secondary"
            icon={<AdminPanelSettingsRoundedIcon />}
            size="medium"
            standalone
          />
          <Badge
            shape="9-sided-cookie"
            color="secondary"
            icon={<AdminPanelSettingsRoundedIcon />}
            size="large"
            standalone
          />
        </Box>
      </Box>
    </Box>
  ),
};

export const ShapesOnAvatars: Story = {
  render: () => (
    <Box sx={{ display: "flex", gap: 4, alignItems: "center" }}>
      <Badge
        shape="9-sided-cookie"
        color="secondary"
        size="medium"
        icon={<AdminPanelSettingsRoundedIcon />}
        overlap="circular"
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Avatar
          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120"
          sx={{ width: 56, height: 56 }}
        />
      </Badge>

      <Badge
        shape="ghost-ish"
        color="info"
        size="medium"
        icon={<SupervisorAccountRoundedIcon />}
        overlap="circular"
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Avatar
          src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120"
          sx={{ width: 56, height: 56 }}
        />
      </Badge>

      <Badge
        shape="pill"
        color="success"
        size="medium"
        icon={<CheckRoundedIcon />}
        overlap="circular"
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Avatar
          src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120"
          sx={{ width: 56, height: 56 }}
        />
      </Badge>
    </Box>
  ),
};

export const GlowingStatusIndicators: Story = {
  render: () => (
    <Box sx={{ display: "flex", gap: 2.5, alignItems: "center" }}>
      <Badge
        shape="pill"
        color="success"
        icon={<CheckRoundedIcon />}
        size="medium"
        glow
        standalone
      />
      <Badge
        shape="9-sided-cookie"
        color="secondary"
        icon={<AdminPanelSettingsRoundedIcon />}
        size="medium"
        glow
        standalone
      />
      <Badge
        shape="ghost-ish"
        color="info"
        icon={<SupervisorAccountRoundedIcon />}
        size="medium"
        glow
        standalone
      />
      <Badge shape="diamond" color="warning" size="medium" glow standalone />
    </Box>
  ),
};
