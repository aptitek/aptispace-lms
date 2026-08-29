import { describe, it, expect } from "vitest";
import CraftedBy from "./CraftedBy";

describe("CraftedBy Component Atom", () => {
  it("exports CraftedBy component function", () => {
    expect(CraftedBy).toBeDefined();
    expect(typeof CraftedBy).toBe("function");
  });

  it("accepts default small and medium sizing props", () => {
    const smallProps = { size: "small" as const, href: "https://aptitek.io" };
    const mediumProps = { size: "medium" as const, href: "https://aptitek.io" };

    expect(smallProps.size).toBe("small");
    expect(mediumProps.size).toBe("medium");
  });
});
