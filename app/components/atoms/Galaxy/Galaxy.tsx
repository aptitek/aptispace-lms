import { Renderer, Program, Mesh, Color, Triangle } from "ogl";
import { useEffect, useRef, type HTMLAttributes } from "react";
import { useTheme, type Theme } from "@mui/material/styles";
import "./Galaxy.css";

import { vertexShader, fragmentShader } from "./galaxyShaders";

export interface GalaxyStarColors {
  red?: string;
  orange?: string;
  yellow?: string;
  white?: string;
  blue?: string;
}

export interface GalaxyProps extends HTMLAttributes<HTMLDivElement> {
  focal?: [number, number];
  rotation?: [number, number];
  starSpeed?: number;
  density?: number;
  hueShift?: number;
  disableAnimation?: boolean;
  speed?: number;
  mouseInteraction?: boolean;
  glowIntensity?: number;
  saturation?: number;
  mouseRepulsion?: boolean;
  twinkleIntensity?: number;
  rotationSpeed?: number;
  repulsionStrength?: number;
  autoCenterRepulsion?: number;
  transparent?: boolean;
  backgroundColor?: string;
  starColors?: GalaxyStarColors;
}

interface GalaxySettings {
  focal: [number, number];
  rotation: [number, number];
  starSpeed: number;
  density: number;
  hueShift: number;
  disableAnimation: boolean;
  speed: number;
  mouseInteraction: boolean;
  glowIntensity: number;
  saturation: number;
  mouseRepulsion: boolean;
  twinkleIntensity: number;
  rotationSpeed: number;
  repulsionStrength: number;
  autoCenterRepulsion: number;
  transparent: boolean;
  isDark: boolean;
  backgroundColor?: string;
  starColors?: GalaxyStarColors;
}

interface ResolvedGalaxyColors {
  red: [number, number, number];
  orange: [number, number, number];
  yellow: [number, number, number];
  white: [number, number, number];
  blue: [number, number, number];
  background: [number, number, number];
}

const DEFAULT_SETTINGS: GalaxySettings = {
  focal: [0.5, 0.5],
  rotation: [1.0, 0.0],
  starSpeed: 0.5,
  density: 1,
  hueShift: 140,
  disableAnimation: false,
  speed: 1.0,
  mouseInteraction: true,
  glowIntensity: 0.3,
  saturation: 0.0,
  mouseRepulsion: true,
  repulsionStrength: 2,
  twinkleIntensity: 0.3,
  rotationSpeed: 0.1,
  autoCenterRepulsion: 0,
  transparent: false,
  isDark: true,
};

const GALAXY_PROP_KEYS = new Set<string>([
  "focal",
  "rotation",
  "starSpeed",
  "density",
  "hueShift",
  "disableAnimation",
  "speed",
  "mouseInteraction",
  "glowIntensity",
  "saturation",
  "mouseRepulsion",
  "twinkleIntensity",
  "rotationSpeed",
  "repulsionStrength",
  "autoCenterRepulsion",
  "transparent",
  "backgroundColor",
  "starColors",
]);

function parseHex(hexStr: string): [number, number, number] {
  const cleanHex = hexStr.replace(/^#/, "");
  if (cleanHex.length === 3 || cleanHex.length === 4) {
    return [
      parseInt(cleanHex[0] + cleanHex[0], 16) / 255,
      parseInt(cleanHex[1] + cleanHex[1], 16) / 255,
      parseInt(cleanHex[2] + cleanHex[2], 16) / 255,
    ];
  }
  return [
    parseInt(cleanHex.slice(0, 2), 16) / 255,
    parseInt(cleanHex.slice(2, 4), 16) / 255,
    parseInt(cleanHex.slice(4, 6), 16) / 255,
  ];
}

function parseColorToRgb(color: string): [number, number, number] {
  if (!color) return [1, 1, 1];
  const trimmed = color.trim().toLowerCase();
  if (trimmed.startsWith("#")) {
    return parseHex(trimmed);
  }
  if (trimmed.startsWith("rgb")) {
    const match = trimmed.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (match) {
      return [
        parseInt(match[1], 10) / 255,
        parseInt(match[2], 10) / 255,
        parseInt(match[3], 10) / 255,
      ];
    }
  }
  return [1, 1, 1];
}

function resolveBackgroundHex(theme: Theme, customBg?: string): string {
  if (customBg) {
    return customBg;
  }
  if (theme.palette.mode === "dark") {
    return theme.palette.background.default || theme.palette.common.black;
  }
  return theme.palette.background.default || theme.palette.common.white;
}

function getDarkStarPalette(
  palette: Theme["palette"],
  custom: GalaxyStarColors,
) {
  return {
    red: parseColorToRgb(custom.red ?? palette.error.light),
    orange: parseColorToRgb(custom.orange ?? palette.warning.main),
    yellow: parseColorToRgb(custom.yellow ?? palette.warning.light),
    white: parseColorToRgb(custom.white ?? palette.common.white),
    blue: parseColorToRgb(custom.blue ?? palette.info.light),
  };
}

function getLightStarPalette(
  palette: Theme["palette"],
  custom: GalaxyStarColors,
) {
  return {
    red: parseColorToRgb(custom.red ?? palette.error.main),
    orange: parseColorToRgb(custom.orange ?? palette.warning.dark),
    yellow: parseColorToRgb(custom.yellow ?? palette.warning.main),
    white: parseColorToRgb(custom.white ?? palette.text.primary),
    blue: parseColorToRgb(custom.blue ?? palette.info.main),
  };
}

function resolveThemeColors(
  theme: Theme,
  starColors?: GalaxyStarColors,
  customBg?: string,
): ResolvedGalaxyColors {
  const custom = starColors ?? {};
  const bgHex = resolveBackgroundHex(theme, customBg);
  const stars =
    theme.palette.mode === "dark"
      ? getDarkStarPalette(theme.palette, custom)
      : getLightStarPalette(theme.palette, custom);

  return {
    ...stars,
    background: parseColorToRgb(bgHex),
  };
}

function extractProps(
  props: GalaxyProps,
  isDark: boolean,
): {
  settings: GalaxySettings;
  domProps: HTMLAttributes<HTMLDivElement>;
} {
  const settings: GalaxySettings = { ...DEFAULT_SETTINGS, isDark };
  const domProps: Record<string, unknown> = {};

  Object.entries(props).forEach(([key, propValue]) => {
    if (GALAXY_PROP_KEYS.has(key)) {
      if (propValue !== undefined && key in settings) {
        (settings as unknown as Record<string, unknown>)[key] = propValue;
      }
    } else {
      domProps[key] = propValue;
    }
  });

  return {
    settings,
    domProps: domProps as HTMLAttributes<HTMLDivElement>,
  };
}

function createGalaxyProgram(
  gl: Renderer["gl"],
  settings: GalaxySettings,
  colors: ResolvedGalaxyColors,
  initialMouse: { x: number; y: number },
): Program {
  return new Program(gl, {
    vertex: vertexShader,
    fragment: fragmentShader,
    uniforms: {
      uTime: { value: 0 },
      uResolution: {
        value: new Color(
          gl.canvas.width,
          gl.canvas.height,
          gl.canvas.width / gl.canvas.height,
        ),
      },
      uFocal: { value: new Float32Array(settings.focal) },
      uRotation: { value: new Float32Array(settings.rotation) },
      uStarSpeed: { value: settings.starSpeed },
      uDensity: { value: settings.density },
      uHueShift: { value: settings.hueShift },
      uSpeed: { value: settings.speed },
      uMouse: {
        value: new Float32Array([initialMouse.x, initialMouse.y]),
      },
      uGlowIntensity: { value: settings.glowIntensity },
      uSaturation: { value: settings.saturation },
      uMouseRepulsion: { value: settings.mouseRepulsion },
      uTwinkleIntensity: { value: settings.twinkleIntensity },
      uRotationSpeed: { value: settings.rotationSpeed },
      uRepulsionStrength: { value: settings.repulsionStrength },
      uMouseActiveFactor: { value: 0.0 },
      uAutoCenterRepulsion: { value: settings.autoCenterRepulsion },
      uTransparent: { value: settings.transparent },
      uIsDark: { value: settings.isDark },
      uColorRed: { value: new Float32Array(colors.red) },
      uColorOrange: { value: new Float32Array(colors.orange) },
      uColorYellow: { value: new Float32Array(colors.yellow) },
      uColorWhite: { value: new Float32Array(colors.white) },
      uColorBlue: { value: new Float32Array(colors.blue) },
      uBackgroundColor: { value: new Float32Array(colors.background) },
    },
  });
}

function setupGlBlending(
  gl: Renderer["gl"],
  transparent: boolean,
  bg: [number, number, number],
) {
  if (transparent) {
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(0, 0, 0, 0);
  } else {
    gl.clearColor(bg[0], bg[1], bg[2], 1);
  }
}

export default function Galaxy(props: GalaxyProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { settings, domProps } = extractProps(props, isDark);
  const { className, ...cleanDomProps } = domProps;

  const colors = resolveThemeColors(
    theme,
    settings.starColors,
    settings.backgroundColor,
  );

  const ctnDom = useRef<HTMLDivElement>(null);
  const targetMousePos = useRef({ x: 0.5, y: 0.5 });
  const smoothMousePos = useRef({ x: 0.5, y: 0.5 });
  const targetMouseActive = useRef(0.0);
  const smoothMouseActive = useRef(0.0);

  useEffect(() => {
    const ctn = ctnDom.current;
    if (!ctn) return;

    const renderer = new Renderer({
      alpha: settings.transparent,
      premultipliedAlpha: true,
    });
    const gl = renderer.gl;
    setupGlBlending(gl, settings.transparent, colors.background);

    const program = createGalaxyProgram(
      gl,
      settings,
      colors,
      smoothMousePos.current,
    );

    const resize = () => {
      renderer.setSize(ctn.offsetWidth, ctn.offsetHeight);
      program.uniforms.uResolution.value = new Color(
        gl.canvas.width,
        gl.canvas.height,
        gl.canvas.width / gl.canvas.height,
      );
    };
    window.addEventListener("resize", resize, false);
    resize();

    const geometry = new Triangle(gl);
    const mesh = new Mesh(gl, { geometry, program });
    let animateId: number;

    const update = (timestampMs: number) => {
      animateId = requestAnimationFrame(update);
      if (!settings.disableAnimation) {
        program.uniforms.uTime.value = timestampMs * 0.001;
        program.uniforms.uStarSpeed.value =
          (timestampMs * 0.001 * settings.starSpeed) / 10.0;
      }

      const lerpFactor = 0.05;
      smoothMousePos.current.x +=
        (targetMousePos.current.x - smoothMousePos.current.x) * lerpFactor;
      smoothMousePos.current.y +=
        (targetMousePos.current.y - smoothMousePos.current.y) * lerpFactor;

      smoothMouseActive.current +=
        (targetMouseActive.current - smoothMouseActive.current) * lerpFactor;
      if (
        targetMouseActive.current === 0.0 &&
        smoothMouseActive.current < 0.001
      ) {
        smoothMouseActive.current = 0.0;
      }

      program.uniforms.uMouse.value[0] = smoothMousePos.current.x;
      program.uniforms.uMouse.value[1] = smoothMousePos.current.y;
      program.uniforms.uMouseActiveFactor.value = smoothMouseActive.current;

      renderer.render({ scene: mesh });
    };

    animateId = requestAnimationFrame(update);
    ctn.appendChild(gl.canvas);

    const handleMouseMove = (event: MouseEvent) => {
      const rect = ctn.getBoundingClientRect();
      const mouseX = (event.clientX - rect.left) / rect.width;
      const mouseY = 1.0 - (event.clientY - rect.top) / rect.height;
      if (
        event.clientX >= 0 &&
        event.clientX <= window.innerWidth &&
        event.clientY >= 0 &&
        event.clientY <= window.innerHeight &&
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom
      ) {
        targetMousePos.current = { x: mouseX, y: mouseY };
        targetMouseActive.current = 1.0;
      } else {
        targetMouseActive.current = 0.0;
      }
    };

    const handleMouseLeave = () => {
      targetMouseActive.current = 0.0;
    };

    const handleMouseOut = (event: MouseEvent) => {
      if (
        !event.relatedTarget ||
        event.clientX <= 0 ||
        event.clientY <= 0 ||
        event.clientX >= window.innerWidth ||
        event.clientY >= window.innerHeight
      ) {
        targetMouseActive.current = 0.0;
      }
    };

    const handleBlur = () => {
      targetMouseActive.current = 0.0;
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        targetMouseActive.current = 0.0;
      }
    };

    if (settings.mouseInteraction) {
      window.addEventListener("mousemove", handleMouseMove, { passive: true });
      window.addEventListener("mouseout", handleMouseOut, { passive: true });
      window.addEventListener("blur", handleBlur);
      document.addEventListener("mouseleave", handleMouseLeave);
      document.addEventListener("visibilitychange", handleVisibilityChange);
    }

    return () => {
      cancelAnimationFrame(animateId);
      window.removeEventListener("resize", resize);
      if (settings.mouseInteraction) {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseout", handleMouseOut);
        window.removeEventListener("blur", handleBlur);
        document.removeEventListener("mouseleave", handleMouseLeave);
        document.removeEventListener(
          "visibilitychange",
          handleVisibilityChange,
        );
      }
      if (gl.canvas.parentNode === ctn) {
        ctn.removeChild(gl.canvas);
      }
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [settings, colors]);

  const containerClass = [
    "galaxy-container",
    settings.transparent ? "galaxy-transparent" : "",
    !isDark ? "galaxy-light" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return <div ref={ctnDom} className={containerClass} {...cleanDomProps} />;
}
