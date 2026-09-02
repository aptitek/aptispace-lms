import { describe, it, expect } from "vitest";
import Chip from "./Chip";
import { getResolvedChipShape } from "./Chip.styles";
import type { ChipShape } from "./Chip.types";

describe("Generic Chip Atom Component", () => {
  it("exports Chip component properly", () => {
    expect(Chip).toBeDefined();
    expect(typeof Chip).toBe("object"); // forwardRef component
    expect(Chip.displayName).toBe("Chip");
  });

  it("resolves geometric shapes and M3 expressive shapes properly", () => {
    const cookie = getResolvedChipShape("9-sided-cookie");
    expect(cookie?.clipPath).toBe("url(#avatar-shape-9-sided-cookie)");

    const rounded = getResolvedChipShape("rounded");
    expect(rounded?.borderRadius).toBe("12px");

    const customRadius = getResolvedChipShape("16px");
    expect(customRadius?.borderRadius).toBe("16px");
  });

  it("returns null when chip shape is undefined or null", () => {
    expect(getResolvedChipShape(undefined)).toBeNull();
    expect(getResolvedChipShape(null as unknown as ChipShape)).toBeNull();
  });
});
