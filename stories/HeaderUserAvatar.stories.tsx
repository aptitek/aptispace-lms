import type { Meta, StoryObj } from "@storybook/react-vite";
import HeaderUserAvatar from "../app/components/molecules/HeaderUserAvatar/HeaderUserAvatar";

const meta: Meta<typeof HeaderUserAvatar> = {
  title: "Molecules/HeaderUserAvatar",
  component: HeaderUserAvatar,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Official 45-degree pill MD3 Expressive user avatar that morphs shape to circle on hover and slides out a pill with the round logoff button to the right.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: { type: "number", min: 32, max: 80, step: 4 },
      description: "Size of the avatar in pixels",
    },
  },
};

export default meta;
type Story = StoryObj<typeof HeaderUserAvatar>;

export const WithInitials: Story = {
  args: {
    user: {
      id: "student-1",
      name: "Arthur Dent",
      email: "arthur@galaxy.org",
      role: "student",
    },
    size: 44,
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
