import { describe, it, expect } from "vitest";
import LanguageToggle, { MeridianToggle } from "./LanguageToggle";

describe("LanguageToggle and MeridianToggle components", () => {
  it("exports MeridianToggle and LanguageToggle components", () => {
    expect(MeridianToggle).toBeDefined();
    expect(LanguageToggle).toBeDefined();
    expect(typeof MeridianToggle).toBe("object"); // forwardRef component
    expect(typeof LanguageToggle).toBe("function");
  });

  it("MeridianToggle has displayName set", () => {
    expect(MeridianToggle.displayName).toBe("MeridianToggle");
  });
});
