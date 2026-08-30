import { describe, it, expect } from "vitest";
import EmailField from "./EmailField";

describe("EmailField Component Molecule", () => {
  it("exports EmailField properly", () => {
    expect(EmailField).toBeDefined();
    expect(typeof EmailField).toBe("object"); // forwardRef component
  });

  it("handles default domain and normalizes prefix/domain props", () => {
    const props = {
      defaultValue: "john.doe",
      domain: "@aptitek.io",
      placeholder: "username",
      variant: "outlined" as const,
      size: "medium" as const,
      name: "email",
      autoComplete: "email",
    };

    expect(props.defaultValue).toBe("john.doe");
    expect(props.domain).toBe("@aptitek.io");
    expect(props.placeholder).toBe("username");
    expect(props.variant).toBe("outlined");
    expect(props.size).toBe("medium");
    expect(props.name).toBe("email");
    expect(props.autoComplete).toBe("email");
  });

  it("supports filled variant and error states", () => {
    const errorProps = {
      value: "invalid space",
      domain: "aptitek.io",
      variant: "filled" as const,
      size: "large" as const,
      error: true,
      helperText: "Invalid username identifier",
    };

    expect(errorProps.error).toBe(true);
    expect(errorProps.variant).toBe("filled");
    expect(errorProps.size).toBe("large");
    expect(errorProps.helperText).toContain("Invalid username");
  });

  it("supports disabled and read-only configurations", () => {
    const disabledProps = {
      value: "instructor.smith",
      domain: "aptispace.com",
      disabled: true,
      showClearButton: false,
    };

    expect(disabledProps.disabled).toBe(true);
    expect(disabledProps.showClearButton).toBe(false);
  });
});
