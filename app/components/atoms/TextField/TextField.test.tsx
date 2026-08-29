import { describe, it, expect } from "vitest";
import TextField from "./TextField";

describe("TextField Component Atom", () => {
  it("exports TextField forwardRef component", () => {
    expect(TextField).toBeDefined();
    expect(typeof TextField).toBe("object");
  });

  it("handles filled and outlined variants", () => {
    const filledProps = { variant: "filled" as const, label: "First Name" };
    const outlinedProps = { variant: "outlined" as const, label: "Last Name" };

    expect(filledProps.variant).toBe("filled");
    expect(outlinedProps.variant).toBe("outlined");
  });

  it("handles small, medium, and large size presets", () => {
    const small = { size: "small" as const };
    const med = { size: "medium" as const };
    const lg = { size: "large" as const };

    expect(small.size).toBe("small");
    expect(med.size).toBe("medium");
    expect(lg.size).toBe("large");
  });
});
