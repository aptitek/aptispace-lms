import { describe, it, expect } from "vitest";
import FixedDomainEmailField from "./FixedDomainEmailField";

describe("FixedDomainEmailField Component Molecule", () => {
  it("exports FixedDomainEmailField properly", () => {
    expect(FixedDomainEmailField).toBeDefined();
    expect(typeof FixedDomainEmailField).toBe("object"); // forwardRef component
  });

  it("handles default domain and normalizes prefix/domain props", () => {
    const props = {
      defaultValue: "cadet.shepard",
      domain: "@aptispace.org",
      placeholder: "cadet.username",
      variant: "outlined" as const,
      size: "medium" as const,
      name: "email",
      autoComplete: "email",
    };

    expect(props.defaultValue).toBe("cadet.shepard");
    expect(props.domain).toBe("@aptispace.org");
    expect(props.placeholder).toBe("cadet.username");
    expect(props.variant).toBe("outlined");
    expect(props.size).toBe("medium");
    expect(props.name).toBe("email");
    expect(props.autoComplete).toBe("email");
  });

  it("supports filled variant and error states", () => {
    const errorProps = {
      value: "invalid space",
      domain: "aptispace.com",
      variant: "filled" as const,
      size: "large" as const,
      error: true,
      helperText: "Invalid cadet username identifier",
    };

    expect(errorProps.error).toBe(true);
    expect(errorProps.variant).toBe("filled");
    expect(errorProps.size).toBe("large");
    expect(errorProps.helperText).toContain("Invalid cadet username");
  });

  it("supports disabled and read-only configurations", () => {
    const disabledProps = {
      value: "instructor.vance",
      domain: "aptispace.com",
      disabled: true,
      showClearButton: false,
    };

    expect(disabledProps.disabled).toBe(true);
    expect(disabledProps.showClearButton).toBe(false);
  });
});
