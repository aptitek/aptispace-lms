import { describe, it, expect } from "vitest";
import ThemeToggle, { ZenithSwitch } from "./ThemeToggle";

describe("ThemeToggle and ZenithSwitch components", () => {
  it("exports ZenithSwitch and ThemeToggle components", () => {
    expect(ZenithSwitch).toBeDefined();
    expect(ThemeToggle).toBeDefined();
    expect(typeof ZenithSwitch).toBe("object"); // forwardRef component
    expect(typeof ThemeToggle).toBe("function");
  });

  it("ZenithSwitch has displayName set", () => {
    expect(ZenithSwitch.displayName).toBe("ZenithSwitch");
  });
});
