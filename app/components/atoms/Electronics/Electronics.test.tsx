import { describe, it, expect, afterEach } from "vitest";
import React from "react";
import { render, cleanup } from "@testing-library/react";
import { ThemeProvider } from "@mui/material/styles";
import { appTheme } from "~/tokens/theme";
import Electronics, { generateSpiralPath } from "./Electronics";
import { ISO_ELECTRONICS_CONSTANTS } from "./Electronics.types";

function renderElectronics(
  props: React.ComponentProps<typeof Electronics> = {},
) {
  return render(
    <ThemeProvider theme={appTheme}>
      <Electronics data-testid="electronics-svg" {...props} />
    </ThemeProvider>,
  );
}

describe("Electronics Component (ISO/IEC 7816 & 14443)", () => {
  afterEach(() => {
    cleanup();
  });

  it("maintains precise ISO/IEC 7816 contact pad position constants", () => {
    expect(ISO_ELECTRONICS_CONSTANTS.viewWidth).toBe(856);
    expect(ISO_ELECTRONICS_CONSTANTS.viewHeight).toBe(540);
    expect(ISO_ELECTRONICS_CONSTANTS.chipCenterX).toBe(162.5);
    expect(ISO_ELECTRONICS_CONSTANTS.chipCenterY).toBe(244.9);
    expect(ISO_ELECTRONICS_CONSTANTS.outerCoilX).toBe(24);
    expect(ISO_ELECTRONICS_CONSTANTS.outerCoilY).toBe(24);
    expect(ISO_ELECTRONICS_CONSTANTS.outerCoilW).toBe(808);
    expect(ISO_ELECTRONICS_CONSTANTS.outerCoilH).toBe(492);
  });

  it("generates valid SVG spiral path string", () => {
    const spiral = generateSpiralPath({
      turns: 4,
      baseX: 24,
      baseY: 24,
      baseW: 808,
      baseH: 492,
      spacing: 7,
      baseRadius: 26,
    });
    expect(spiral).toBeDefined();
    expect(spiral.startsWith("M 50.00 24.00")).toBe(true);
    expect(spiral).toContain("H 806.00");
    expect(spiral).toContain("A 26 26");
  });

  it("renders SVG layer in DOM with ISO dimensions", () => {
    const { container } = renderElectronics({ side: "front" });
    const svg = container.querySelector("svg");
    expect(svg).not.toBeNull();
    expect(svg?.getAttribute("viewBox")).toBe("0 0 856 540");
  });

  it("renders front side contact pads and coils", () => {
    const { container } = renderElectronics({
      side: "front",
      showNfcAntenna: true,
      chipView: "front",
    });
    const paths = container.querySelectorAll("path");
    expect(paths.length).toBeGreaterThan(0);

    const contactPadsGroup = container.querySelector("#iso7816-chip-front");
    expect(contactPadsGroup).not.toBeNull();
  });

  it("renders back side with silicone die and bonding wires", () => {
    const { container } = renderElectronics({
      side: "back",
      chipView: "back",
    });
    const dieGroup = container.querySelector("#iso7816-chip-backview");
    expect(dieGroup).not.toBeNull();
  });

  it("renders with mirrored coordinates when chipPosition is right", () => {
    const { container } = renderElectronics({
      side: "front",
      chipPosition: "right",
    });
    const g = container.querySelector("g[transform]");
    expect(g).not.toBeNull();
    // When mirrored on front with right position, transform includes scale(-1, 1)
    expect(g?.getAttribute("transform")).toContain("scale(-1, 1)");
  });
});
