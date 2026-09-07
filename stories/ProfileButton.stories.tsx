import type { Meta, StoryObj } from "@storybook/react-vite";
import Box from "@mui/material/Box";
import ProfileButton from "~/components/molecules/ProfileButton/ProfileButton";

const meta: Meta<typeof ProfileButton> = {
  title: "Molecules/ProfileButton",
  component: ProfileButton,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Official MD3 Expressive user profile button that morphs shape to circle on hover and slides out a pill with the round logoff or return-to-admin button, or renders as a logout-only variant for onboarding.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: { type: "number", min: 32, max: 80, step: 4 },
      description: "Size of the avatar in pixels",
    },
    variant: {
      control: "radio",
      options: ["default", "logoutOnly"],
      description: "Profile button variant",
    },
    extended: {
      control: "boolean",
      description: "Whether logoutOnly variant is extended horizontally",
    },
  },
};

export default meta;
type Story = StoryObj<typeof ProfileButton>;

export const WithInitials: Story = {
  args: {
    user: {
      id: "student-1",
      name: "Arthur Dent",
      email: "arthur@galaxy.org",
      role: "student",
    },
    size: 40,
    onLogout: () => {
      console.warn("Logged out clicked");
    },
  },
};

export const WithAvatarImage: Story = {
  args: {
    user: {
      id: "admin-1",
      name: "Dr. Eleanor Vance",
      email: "eleanor@aptispace.io",
      role: "admin",
      avatarUrl:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80",
    },
    size: 48,
    onLogout: () => {
      console.warn("Logged out clicked");
    },
  },
};

export const FallbackIcon: Story = {
  args: {
    user: {
      id: "anonymous-1",
      name: "",
      email: "anon@aptispace.io",
      role: "instructor",
    },
    size: 40,
    onLogout: () => {
      console.warn("Logged out clicked");
    },
  },
};

export const ImpersonatingMode: Story = {
  args: {
    user: {
      id: "student-2",
      name: "Arthur Dent",
      email: "arthur@galaxy.org",
      role: "student",
      impersonating: true,
    },
    size: 44,
    onReturnToAdmin: () => {
      console.warn("Return to admin clicked");
    },
  },
};

export const LogoutOnlyCompact: Story = {
  args: {
    user: {
      id: "student-1",
      name: "Arthur Dent",
      email: "arthur@galaxy.org",
      role: "student",
    },
    variant: "logoutOnly",
    size: 40,
    extended: false,
    onLogout: () => {
      console.warn("Logged out clicked");
    },
  },
};

export const LogoutOnlyExtended: Story = {
  render: () => (
    <Box sx={{ width: 220, p: 2 }}>
      <ProfileButton
        user={{
          id: "student-1",
          name: "Arthur Dent",
          email: "arthur@galaxy.org",
          role: "student",
        }}
        variant="logoutOnly"
        extended={true}
        size={40}
        onLogout={() => console.warn("Logout clicked")}
      />
    </Box>
  ),
};
