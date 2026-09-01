import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import Button from "@mui/material/Button";
import ProfileCardModal from "../app/components/organisms/ProfileCardModal/ProfileCardModal";
import type { AuthUser } from "../app/utils/auth";

const mockUser: AuthUser = {
  id: "user-story-1",
  name: "Arthur DENT",
  email: "arthur.dent@aptitek.io",
  role: "student",
  avatarUrl: "",
};

const meta: Meta<typeof ProfileCardModal> = {
  title: "Organisms/ProfileCardModal",
  component: ProfileCardModal,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Full-screen modal displaying the interactive ID-1 card of the user with in-place editable fields and auto-save on field blur or modal exit.",
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ProfileCardModal>;

function ProfileCardModalStory() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<AuthUser>(mockUser);

  return (
    <>
      <Button variant="contained" onClick={() => setIsOpen(true)}>
        Open Profile ID-1 Card Modal
      </Button>
      <ProfileCardModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        user={user}
        onUserUpdated={(updated) => setUser(updated)}
      />
    </>
  );
}

export const Default: Story = {
  render: () => <ProfileCardModalStory />,
};
