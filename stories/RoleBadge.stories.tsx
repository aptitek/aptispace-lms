import type { Meta, StoryObj } from "@storybook/react-vite";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import RoleBadge from "../app/components/atoms/RoleBadge/RoleBadge";

const meta: Meta<typeof RoleBadge> = {
  title: "Atoms/RoleBadge",
  component: RoleBadge,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Theme-driven atomic Role Badge. Displays Student in Green (theme.palette.success), Instructor in Blue (theme.palette.primary), and Admin in Magenta (theme.palette.secondary) with dedicated icons and glassmorphism.",
      },
    },
  },
  argTypes: {
    userRole: {
      control: "select",
      options: ["student", "instructor", "admin"],
      description: "User security & platform role",
    },
    variant: {
      control: "radio",
      options: ["icon-only", "chip", "badge"],
      description: "Visual presentation format",
    },
    size: {
      control: "select",
      options: ["small", "medium", "large"],
      description: "Size preset",
    },
    showTooltip: {
      control: "boolean",
    },
  },
  args: {
    userRole: "student",
    variant: "icon-only",
    size: "medium",
    showTooltip: true,
  },
};

export default meta;
type Story = StoryObj<typeof RoleBadge>;

export const Student: Story = {
  args: {
    userRole: "student",
    variant: "icon-only",
    size: "medium",
  },
};

export const Instructor: Story = {
  args: {
    userRole: "instructor",
    variant: "icon-only",
    size: "medium",
  },
};

export const Admin: Story = {
  args: {
    userRole: "admin",
    variant: "icon-only",
    size: "medium",
  },
};

export const AllRolesComparison: Story = {
  render: () => (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Box>
        <Typography variant="subtitle2" sx={{ mb: 1, color: "text.secondary" }}>
          Icon Only (Avatar Corner Overlays)
        </Typography>
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <RoleBadge userRole="student" variant="icon-only" size="medium" />
          <RoleBadge userRole="instructor" variant="icon-only" size="medium" />
          <RoleBadge userRole="admin" variant="icon-only" size="medium" />
        </Box>
      </Box>

      <Box>
        <Typography variant="subtitle2" sx={{ mb: 1, color: "text.secondary" }}>
          Chip Variant (With Text Labels)
        </Typography>
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <RoleBadge userRole="student" variant="chip" size="small" />
          <RoleBadge userRole="instructor" variant="chip" size="small" />
          <RoleBadge userRole="admin" variant="chip" size="small" />
        </Box>
      </Box>

      <Box>
        <Typography variant="subtitle2" sx={{ mb: 1, color: "text.secondary" }}>
          Size Variations (Admin)
        </Typography>
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <RoleBadge userRole="admin" variant="chip" size="small" />
          <RoleBadge userRole="admin" variant="chip" size="medium" />
          <RoleBadge userRole="admin" variant="chip" size="large" />
        </Box>
      </Box>
    </Box>
  ),
};
