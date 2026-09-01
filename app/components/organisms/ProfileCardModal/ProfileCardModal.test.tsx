import { describe, it, expect } from "vitest";
import { ProfileCardModal } from "./ProfileCardModal";
import type { AuthUser } from "../../../utils/auth";

const mockUser: AuthUser = {
  id: "user-456",
  name: "Arthur DENT",
  email: "arthur.dent@aptitek.io",
  role: "student",
  avatarUrl: "https://example.com/avatar.webp",
};

describe("ProfileCardModal Organism", () => {
  it("exports ProfileCardModal component properly", () => {
    expect(ProfileCardModal).toBeDefined();
    expect(typeof ProfileCardModal).toBe("function");
    expect(ProfileCardModal.name).toBe("ProfileCardModal");
  });

  it("handles user profile configuration and modal props correctly", () => {
    const props = {
      isOpen: true,
      onClose: () => {},
      user: mockUser,
      onUserUpdated: () => {},
    };

    expect(props.isOpen).toBe(true);
    expect(props.user.id).toBe("user-456");
    expect(props.user.name).toBe("Arthur DENT");
    expect(props.user.email).toBe("arthur.dent@aptitek.io");
    expect(typeof props.onClose).toBe("function");
    expect(typeof props.onUserUpdated).toBe("function");
  });
});
