import type { Meta, StoryObj } from "@storybook/react-vite";
import Box from "@mui/material/Box";
import HeaderTabs from "~/components/molecules/HeaderTabs/HeaderTabs";
import type { AuthUser } from "~/utils/auth";

const mockStudent: AuthUser = {
  id: "std-1",
  role: "student",
  name: "Alex Mercer",
  email: "alex@aptitek.io",
  isProfileComplete: true,
};

const mockAdmin: AuthUser = {
  id: "adm-1",
  role: "admin",
  name: "Admin Eleanor",
  email: "admin@aptitek.io",
  isProfileComplete: true,
};

const mockInstructor: AuthUser = {
  id: "inst-1",
  role: "instructor",
  name: "Prof. Sarah Connor",
  email: "sarah@aptitek.io",
  isProfileComplete: true,
};

const meta = {
  title: "Molecules/HeaderTabs",
  component: HeaderTabs,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <Box sx={{ width: "100%", maxWidth: 640, p: 2 }}>
        <Story />
      </Box>
    ),
  ],
} satisfies Meta<typeof HeaderTabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const StudentNavigation: Story = {
  args: {
    user: mockStudent,
  },
};

export const AdminNavigation: Story = {
  args: {
    user: mockAdmin,
  },
};

export const InstructorNavigation: Story = {
  args: {
    user: mockInstructor,
  },
};

export const GuestOrLoggedOut: Story = {
  args: {
    user: null,
  },
};
