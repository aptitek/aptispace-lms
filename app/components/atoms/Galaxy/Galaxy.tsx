import { Renderer, Program, Mesh, Color, Triangle } from "ogl";
import { useEffect, useRef, type HTMLAttributes } from "react";
import { useTheme, type Theme } from "@mui/material/styles";
import "./Galaxy.css";

const vertexShader = `
attribute vec2 uv;
attribute vec2 position;

varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position, 0, 1);
}
`;

const fragmentShader = `
precision highp float;

uniform float uTime;
uniform vec3 uResolution;
uniform vec2 uFocal;
uniform vec2 uRotation;
uniform float uStarSpeed;
uniform float uDensity;
uniform float uHueShift;
uniform float uSpeed;
uniform vec2 uMouse;
uniform float uGlowIntensity;
uniform float uSaturation;
uniform bool uMouseRepulsion;
uniform float uTwinkleIntensity;
uniform float uRotationSpeed;
uniform float uRepulsionStrength;
uniform float uMouseActiveFactor;
uniform float uAutoCenterRepulsion;
uniform bool uTransparent;

uniform vec3 uColorRed;
uniform vec3 uColorOrange;
uniform vec3 uColorYellow;
uniform vec3 uColorWhite;
uniform vec3 uColorBlue;
uniform vec3 uBackgroundColor;

varying vec2 vUv;

#define NUM_LAYER 4.0
#define MAT45 mat2(0.7071, -0.7071, 0.7071, 0.7071)
#define PERIOD 3.0

float Hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float tri(float x) {
  return abs(fract(x) * 2.0 - 1.0);
}

float tris(float x) {
  float t = fract(x);
  return 1.0 - smoothstep(0.0, 1.0, abs(2.0 * t - 1.0));
}

float trisn(float x) {
  float t = fract(x);
  return 2.0 * (1.0 - smoothstep(0.0, 1.0, abs(2.0 * t - 1.0))) - 1.0;
}

vec3 getRealisticStarColor(float tempRand) {
  // Realistic stellar blackbody spectrum:
  // Red (0.00-0.25) -> Orange (0.25-0.50) -> Yellow (0.50-0.75) -> White (0.75-0.90) -> Light Blue (0.90-1.00)
  // Strictly excludes green, cyan, purple, pink, and dark blue.
  if (tempRand < 0.25) {
    return mix(uColorRed, uColorOrange, tempRand * 4.0);
  } else if (tempRand < 0.50) {
    return mix(uColorOrange, uColorYellow, (tempRand - 0.25) * 4.0);
  } else if (tempRand < 0.75) {
    return mix(uColorYellow, uColorWhite, (tempRand - 0.50) * 4.0);
  } else {
    return mix(uColorWhite, uColorBlue, (tempRand - 0.75) * 4.0);
  }
}

float Star(vec2 uv, float flare) {
  float d = length(uv);
  float m = (0.05 * uGlowIntensity) / d;
  float rays = smoothstep(0.0, 1.0, 1.0 - abs(uv.x * uv.y * 1000.0));
  m += rays * flare * uGlowIntensity;
  uv *= MAT45;
  rays = smoothstep(0.0, 1.0, 1.0 - abs(uv.x * uv.y * 1000.0));
  m += rays * 0.3 * flare * uGlowIntensity;
  m *= smoothstep(1.0, 0.2, d);
  return m;
}

vec3 StarLayer(vec2 uv) {
  vec3 col = vec3(0.0);

  vec2 gv = fract(uv) - 0.5; 
  vec2 id = floor(uv);

  for (int y = -1; y <= 1; y++) {
    for (int x = -1; x <= 1; x++) {
      vec2 offset = vec2(float(x), float(y));
      vec2 si = id + vec2(float(x), float(y));
      float seed = Hash21(si);
      float size = fract(seed * 345.32);
      float glossLocal = tri(uStarSpeed / (PERIOD * seed + 1.0));
      float flareSize = smoothstep(0.9, 1.0, size) * glossLocal;

      float tempRand = fract(seed * 789.123);
      vec3 starBaseColor = getRealisticStarColor(tempRand);

      vec2 pad = vec2(tris(seed * 34.0 + uTime * uSpeed / 10.0), tris(seed * 38.0 + uTime * uSpeed / 30.0)) - 0.5;

      float star = Star(gv - offset - pad, flareSize);

      float twinkle = trisn(uTime * uSpeed + seed * 6.2831) * 0.5 + 1.0;
      twinkle = mix(1.0, twinkle, uTwinkleIntensity);
      star *= twinkle;
      
      col += star * size * starBaseColor;
    }
  }

  return col;
}

void main() {
  vec2 focalPx = uFocal * uResolution.xy;
  vec2 uv = (vUv * uResolution.xy - focalPx) / uResolution.y;

  vec2 mouseNorm = uMouse - vec2(0.5);
  
  if (uAutoCenterRepulsion > 0.0) {
    vec2 centerUV = vec2(0.0, 0.0);
    float centerDist = length(uv - centerUV);
    vec2 repulsion = normalize(uv - centerUV) * (uAutoCenterRepulsion / (centerDist + 0.1));
    uv += repulsion * 0.05;
  } else if (uMouseRepulsion) {
    vec2 mousePosUV = (uMouse * uResolution.xy - focalPx) / uResolution.y;
    float mouseDist = length(uv - mousePosUV);
    vec2 repulsion = normalize(uv - mousePosUV) * (uRepulsionStrength / (mouseDist + 0.1));
    uv += repulsion * 0.05 * uMouseActiveFactor;
  } else {
    vec2 mouseOffset = mouseNorm * 0.1 * uMouseActiveFactor;
    uv += mouseOffset;
  }

  float autoRotAngle = uTime * uRotationSpeed;
  mat2 autoRot = mat2(cos(autoRotAngle), -sin(autoRotAngle), sin(autoRotAngle), cos(autoRotAngle));
  uv = autoRot * uv;

  uv = mat2(uRotation.x, -uRotation.y, uRotation.y, uRotation.x) * uv;

  vec3 col = vec3(0.0);

  for (float i = 0.0; i < 1.0; i += 1.0 / NUM_LAYER) {
    float depth = fract(i + uStarSpeed * uSpeed);
    float scale = mix(20.0 * uDensity, 0.5 * uDensity, depth);
    float fade = depth * smoothstep(1.0, 0.9, depth);
    col += StarLayer(uv * scale + i * 453.32) * fade;
  }

  if (uTransparent) {
    // Premultiplied alpha additive output: leaves DOM backdrop 100% intact and adds star light
    gl_FragColor = vec4(col, 0.0);
  } else {
    // Pure additive light onto background color: stars only add illumination and never darken background
    vec3 finalColor = min(uBackgroundColor + col, vec3(1.0));
    gl_FragColor = vec4(finalColor, 1.0);
  }
}
`;

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

function resolveThemeColors(
  theme: Theme,
  starColors?: GalaxyStarColors,
  customBg?: string,
): ResolvedGalaxyColors {
  const palette = theme.palette;
  const custom = starColors ?? {};
  const bgHex = resolveBackgroundHex(theme, customBg);

  return {
    red: parseColorToRgb(custom.red ?? palette.error.light),
    orange: parseColorToRgb(custom.orange ?? palette.warning.main),
    yellow: parseColorToRgb(custom.yellow ?? palette.warning.light),
    white: parseColorToRgb(custom.white ?? palette.common.white),
    blue: parseColorToRgb(custom.blue ?? palette.info.light),
    background: parseColorToRgb(bgHex),
  };
}

function extractProps(props: GalaxyProps): {
  settings: GalaxySettings;
  domProps: HTMLAttributes<HTMLDivElement>;
} {
  const settings: GalaxySettings = { ...DEFAULT_SETTINGS };
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
  const { settings, domProps } = extractProps(props);
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

    if (settings.mouseInteraction) {
      window.addEventListener("mousemove", handleMouseMove, { passive: true });
      document.addEventListener("mouseleave", handleMouseLeave);
    }

    return () => {
      cancelAnimationFrame(animateId);
      window.removeEventListener("resize", resize);
      if (settings.mouseInteraction) {
        window.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseleave", handleMouseLeave);
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
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return <div ref={ctnDom} className={containerClass} {...cleanDomProps} />;
}
