import { describe, it, expect } from "vitest";
import Header from "./Header";

describe("Header Component", () => {
  it("exports Header component", () => {
    expect(Header).toBeDefined();
    expect(typeof Header).toBe("function");
  });
});
