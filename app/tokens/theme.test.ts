import { describe, it, expect } from "vitest";
import { darkTheme, lightTheme, getThemeByMode } from "./theme";

describe("Theme definitions", () => {
  it("defines distinct dark and light themes", () => {
    expect(darkTheme.palette.mode).toBe("dark");
    expect(lightTheme.palette.mode).toBe("light");
    expect(darkTheme.palette.background.default).not.toBe(
      lightTheme.palette.background.default,
    );
  });

  it("retrieves proper theme using getThemeByMode", () => {
    expect(getThemeByMode("dark").palette.mode).toBe("dark");
    expect(getThemeByMode("light").palette.mode).toBe("light");
  });
});
