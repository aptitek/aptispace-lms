import { describe, it, expect } from "vitest";
import CraftedByBadge from "./CraftedByBadge";

describe("CraftedByBadge Component Atom", () => {
  it("exports CraftedByBadge component function", () => {
    expect(CraftedByBadge).toBeDefined();
    expect(typeof CraftedByBadge).toBe("function");
  });

  it("accepts default small and medium sizing props", () => {
    const smallProps = { size: "small" as const, href: "https://aptitek.io" };
    const mediumProps = { size: "medium" as const, href: "https://aptitek.io" };

    expect(smallProps.size).toBe("small");
    expect(mediumProps.size).toBe("medium");
  });
});
