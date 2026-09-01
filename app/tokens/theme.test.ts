import { describe, it, expect } from "vitest";
import {
  darkTheme,
  lightTheme,
  getThemeByMode,
  ROLE_COLORS,
  CELESTIAL_COLORS,
  FLAG_COLORS,
  EU_FLAG_COLORS,
  FRENCH_FLAG_COLORS,
  UK_FLAG_COLORS,
  NAMED_COLORS,
} from "./theme";

describe("Theme definitions & Named Color Tokens", () => {
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

  it("provides named role color tokens on theme and palette", () => {
    expect(ROLE_COLORS.student).toBe("#859900");
    expect(ROLE_COLORS.instructor).toBe("#268bd2");
    expect(ROLE_COLORS.admin).toBe("#d33682");
    expect(ROLE_COLORS.guest).toBe("#586e75");

    expect(darkTheme.palette.roles.student).toBe("#859900");
    expect(darkTheme.palette.roles.instructor).toBe("#268bd2");
    expect(darkTheme.palette.roles.admin).toBe("#d33682");
    expect(darkTheme.palette.roles.guest).toBe("#586e75");

    expect(lightTheme.palette.roles.student).toBe(ROLE_COLORS.student);
    expect(lightTheme.palette.roles.instructor).toBe(ROLE_COLORS.instructor);
    expect(lightTheme.palette.roles.admin).toBe(ROLE_COLORS.admin);
  });

  it("provides named celestial color tokens (Sun, Moon, Horizon)", () => {
    expect(CELESTIAL_COLORS.sun.main).toBe("#b58900");
    expect(CELESTIAL_COLORS.sun.glow).toBe("#d4a400");
    expect(CELESTIAL_COLORS.sun.light).toBe("#fdf6e3");

    expect(CELESTIAL_COLORS.moon.main).toBe("#268bd2");
    expect(CELESTIAL_COLORS.moon.glow).toBe("#6c71c4");
    expect(CELESTIAL_COLORS.moon.crater).toBe("#586e75");

    expect(CELESTIAL_COLORS.horizon.day).toBe("#fdf6e3");
    expect(CELESTIAL_COLORS.horizon.night).toBe("#002b36");

    expect(darkTheme.palette.celestial.sun.main).toBe(
      CELESTIAL_COLORS.sun.main,
    );
    expect(darkTheme.palette.celestial.moon.main).toBe(
      CELESTIAL_COLORS.moon.main,
    );
    expect(lightTheme.palette.celestial.sun.glow).toBe(
      CELESTIAL_COLORS.sun.glow,
    );
  });

  it("provides named national and identity flag color tokens (EU, France, UK)", () => {
    expect(EU_FLAG_COLORS.blue).toBe("#003399");
    expect(EU_FLAG_COLORS.gold).toBe("#ffcc00");

    expect(FRENCH_FLAG_COLORS.blue).toBe("#002654");
    expect(FRENCH_FLAG_COLORS.white).toBe("#ffffff");
    expect(FRENCH_FLAG_COLORS.red).toBe("#ed2939");

    expect(UK_FLAG_COLORS.blue).toBe("#012169");
    expect(UK_FLAG_COLORS.red).toBe("#c8102e");
    expect(UK_FLAG_COLORS.white).toBe("#ffffff");

    expect(FLAG_COLORS.eu).toEqual(EU_FLAG_COLORS);
    expect(FLAG_COLORS.fr).toEqual(FRENCH_FLAG_COLORS);
    expect(FLAG_COLORS.uk).toEqual(UK_FLAG_COLORS);

    expect(darkTheme.palette.flags.eu.blue).toBe("#003399");
    expect(darkTheme.palette.flags.fr.blue).toBe("#002654");
    expect(darkTheme.palette.flags.uk.blue).toBe("#012169");
    expect(lightTheme.palette.flags.eu.gold).toBe("#ffcc00");
  });

  it("provides aggregated named container on theme", () => {
    expect(darkTheme.named).toEqual(NAMED_COLORS);
    expect(lightTheme.named).toEqual(NAMED_COLORS);
  });
});
