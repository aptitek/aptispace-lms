import { describe, it, expect, vi, afterEach } from "vitest";
import React from "react";
import { render, cleanup } from "@testing-library/react";
import { ThemeProvider } from "@mui/material/styles";
import { appTheme } from "~/tokens/theme";
import Galaxy from "./Galaxy";
import {
  parseHex,
  parseColorToRgb,
  resolveBackgroundHex,
  getStellarColors,
  resolveThemeColors,
} from "./galaxyColors";
import { vertexShader, fragmentShader } from "./galaxyShaders";

vi.mock("ogl", () => {
  class MockRenderer {
    gl = {
      canvas: document.createElement("canvas"),
      getExtension: vi.fn(),
      clearColor: vi.fn(),
      clear: vi.fn(),
    };
    setSize = vi.fn();
    render = vi.fn();
  }
  class MockProgram {
    uniforms = {
      uTime: { value: 0 },
      uResolution: { value: [100, 100] },
      uFocal: { value: [0.5, 0.5] },
      uRotation: { value: [0, 0] },
      uStarSpeed: { value: 1 },
      uDensity: { value: 1 },
      uHueShift: { value: 0 },
      uSpeed: { value: 1 },
      uGlowIntensity: { value: 1 },
      uSaturation: { value: 1 },
      uTwinkleIntensity: { value: 1 },
      uRotationSpeed: { value: 1 },
      uRepulsionStrength: { value: 1 },
      uAutoCenterRepulsion: { value: 0 },
      uMousePos: { value: [0, 0] },
      uMouseActive: { value: 0 },
      uColorRed: { value: [1, 0, 0] },
      uColorOrange: { value: [1, 0.5, 0] },
      uColorYellow: { value: [1, 1, 0] },
      uColorWhite: { value: [1, 1, 1] },
      uColorBlue: { value: [0, 0, 1] },
      uColorBackground: { value: [0, 0, 0] },
      uTransparent: { value: 0 },
    };
  }
  class MockMesh {
    program = new MockProgram();
  }
  class MockColor {
    r: number;
    g: number;
    b: number;
    constructor(r = 0, g = 0, b = 0) {
      this.r = r;
      this.g = g;
      this.b = b;
    }
    set = vi.fn();
  }
  class MockTriangle {}

  return {
    Renderer: MockRenderer,
    Program: MockProgram,
    Mesh: MockMesh,
    Color: MockColor,
    Triangle: MockTriangle,
  };
});

afterEach(cleanup);

describe("Galaxy Component & Utilities", () => {
  describe("galaxyColors utilities", () => {
    it("parseHex parses 3-char and 6-char hex correctly", () => {
      const whiteShort = parseHex("#fff");
      expect(whiteShort).toEqual([1, 1, 1]);

      const blackLong = parseHex("#000000");
      expect(blackLong).toEqual([0, 0, 0]);

      const red = parseHex("#ff0000");
      expect(red[0]).toBe(1);
      expect(red[1]).toBe(0);
      expect(red[2]).toBe(0);
    });

    it("parseColorToRgb handles hex, rgb/rgba strings, and fallback", () => {
      expect(parseColorToRgb("#ffffff")).toEqual([1, 1, 1]);
      expect(parseColorToRgb("rgb(255, 0, 0)")).toEqual([1, 0, 0]);
      expect(parseColorToRgb("rgba(0, 255, 0, 0.5)")).toEqual([0, 1, 0]);
      expect(parseColorToRgb("")).toEqual([1, 1, 1]);
      expect(parseColorToRgb("invalid-color")).toEqual([1, 1, 1]);
    });

    it("resolveBackgroundHex returns customBg or theme background", () => {
      expect(resolveBackgroundHex(appTheme, "#123456")).toBe("#123456");
      expect(resolveBackgroundHex(appTheme)).toBe(
        appTheme.palette.background.default,
      );
    });

    it("getStellarColors and resolveThemeColors generate valid color vectors", () => {
      const stellar = getStellarColors(appTheme.palette);
      expect(stellar.red).toBeDefined();
      expect(stellar.orange).toBeDefined();
      expect(stellar.yellow).toBeDefined();
      expect(stellar.white).toBeDefined();
      expect(stellar.blue).toBeDefined();
      expect(stellar.background).toBeDefined();

      const resolved = resolveThemeColors(
        appTheme,
        { red: "#ff0000", blue: "#0000ff" },
        "#000000",
      );
      expect(resolved.red).toEqual([1, 0, 0]);
      expect(resolved.blue).toEqual([0, 0, 1]);
      expect(resolved.background).toEqual([0, 0, 0]);
    });
  });

  describe("galaxyShaders", () => {
    it("exports vertex and fragment shaders as valid GLSL strings", () => {
      expect(vertexShader).toContain("void main()");
      expect(fragmentShader).toContain("void main()");
      expect(fragmentShader).toContain("gl_FragColor");
    });
  });

  describe("Galaxy React Component", () => {
    it("renders Galaxy canvas container without errors", () => {
      const { container } = render(
        <ThemeProvider theme={appTheme}>
          <Galaxy
            data-testid="galaxy-view"
            starSpeed={0.5}
            density={1.2}
            mouseInteraction={true}
          />
        </ThemeProvider>,
      );

      const root = container.querySelector(".galaxy-container");
      expect(root).toBeDefined();
    });

    it("handles disableAnimation and custom starColors props", () => {
      const { unmount } = render(
        <ThemeProvider theme={appTheme}>
          <Galaxy
            disableAnimation={true}
            starColors={{ red: "#ff0000", blue: "#0000ff" }}
            backgroundColor="#050510"
          />
        </ThemeProvider>,
      );

      expect(unmount).not.toThrow();
    });
  });
});
