import { describe, it, expect } from "vitest";
import HeaderBar from "./HeaderBar";

describe("HeaderBar Component", () => {
  it("exports HeaderBar component", () => {
    expect(HeaderBar).toBeDefined();
    expect(typeof HeaderBar).toBe("function");
  });
});
