import type { Meta, StoryObj } from "@storybook/react-vite";
import Box from "@mui/material/Box";
import RoleChip from "~/components/molecules/RoleChip/RoleChip";

const meta = {
  title: "Molecules/RoleChip",
  component: RoleChip,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    userRole: {
      control: "select",
      options: ["student", "instructor", "admin", "all"],
      description: "Semantic user role",
    },
    showIcon: { control: "boolean" },
    size: {
      control: "radio",
      options: ["small", "medium"],
    },
    variant: {
      control: "radio",
      options: ["filled", "outlined"],
    },
  },
} satisfies Meta<typeof RoleChip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const StudentRole: Story = {
  args: {
    userRole: "student",
    size: "small",
  },
};

export const InstructorRole: Story = {
  args: {
    userRole: "instructor",
    size: "small",
  },
};

export const AdminRole: Story = {
  args: {
    userRole: "admin",
    size: "small",
  },
};

export const AllRolesOption: Story = {
  args: {
    userRole: "all",
    size: "small",
  },
};

export const AllRolesGrid: Story = {
  render: () => (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        alignItems: "center",
        flexWrap: "wrap",
        p: 2,
      }}
    >
      <RoleChip userRole="student" size="small" />
      <RoleChip userRole="instructor" size="small" />
      <RoleChip userRole="admin" size="small" />
      <RoleChip userRole="all" size="small" />
    </Box>
  ),
};

export const MediumSizeGrid: Story = {
  render: () => (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        alignItems: "center",
        flexWrap: "wrap",
        p: 2,
      }}
    >
      <RoleChip userRole="student" size="medium" />
      <RoleChip userRole="instructor" size="medium" />
      <RoleChip userRole="admin" size="medium" />
      <RoleChip userRole="all" size="medium" />
    </Box>
  ),
};

export const WithoutIcon: Story = {
  render: () => (
    <Box sx={{ display: "flex", gap: 2, alignItems: "center", p: 2 }}>
      <RoleChip userRole="student" showIcon={false} size="small" />
      <RoleChip userRole="instructor" showIcon={false} size="small" />
      <RoleChip userRole="admin" showIcon={false} size="small" />
    </Box>
  ),
};
