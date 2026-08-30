import { describe, it, expect } from "vitest";
import Tooltip from "./Tooltip";

describe("Tooltip Component Atom", () => {
  it("exports Tooltip component", () => {
    expect(Tooltip).toBeDefined();
    expect(Tooltip.displayName).toBe("Tooltip");
  });

  it("provides valid default props structure", () => {
    const props = {
      title: "Test Tooltip Title",
      arrow: true,
      enterDelay: 200,
      leaveDelay: 100,
    };

    expect(props.title).toBe("Test Tooltip Title");
    expect(props.arrow).toBe(true);
    expect(props.enterDelay).toBe(200);
    expect(props.leaveDelay).toBe(100);
  });
});
