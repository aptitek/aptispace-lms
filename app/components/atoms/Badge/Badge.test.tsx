import { describe, it, expect } from "vitest";
import Badge from "./Badge";
import {
  getResolvedBadgeShape,
  resolveBadgePaletteColor,
} from "./Badge.styles";
import { darkTheme, lightTheme } from "../../../tokens/theme";
import type { BadgeShape } from "./Badge.types";

describe("Generic Badge Atom Component", () => {
  it("exports Badge component properly", () => {
    expect(Badge).toBeDefined();
    expect(typeof Badge).toBe("object"); // forwardRef component
    expect(Badge.displayName).toBe("Badge");
  });

  it("resolves geometric shapes and M3 expressive shapes properly", () => {
    const pill = getResolvedBadgeShape("pill");
    expect(pill?.clipPath).toBe("url(#avatar-shape-pill)");

    const cookie = getResolvedBadgeShape("9-sided-cookie");
    expect(cookie?.clipPath).toBe("url(#avatar-shape-9-sided-cookie)");

    const ghost = getResolvedBadgeShape("ghost-ish");
    expect(ghost?.clipPath).toBe("url(#avatar-shape-ghost-ish)");

    const customRadius = getResolvedBadgeShape("8px 3px 8px 3px");
    expect(customRadius?.borderRadius).toBe("8px 3px 8px 3px");
  });

  it("resolves palette colors properly without raw hardcoded values", () => {
    const secondaryDark = resolveBadgePaletteColor(darkTheme, "secondary");
    expect(secondaryDark.main).toBe(darkTheme.palette.secondary.main);

    const infoLight = resolveBadgePaletteColor(lightTheme, "info");
    expect(infoLight.main).toBe(lightTheme.palette.info.main);

    const successDark = resolveBadgePaletteColor(darkTheme, "success");
    expect(successDark.main).toBe(darkTheme.palette.success.main);

    const defaultLight = resolveBadgePaletteColor(lightTheme, "default");
    expect(defaultLight.main).toBe(lightTheme.palette.text.primary);
  });

  it("returns null when badge shape is undefined or null", () => {
    expect(getResolvedBadgeShape(undefined)).toBeNull();
    expect(getResolvedBadgeShape(null as unknown as BadgeShape)).toBeNull();
  });
});
