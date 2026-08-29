import { Renderer, Program, Mesh, Color, Triangle } from "ogl";
import { useEffect, useRef, type HTMLAttributes } from "react";
import { useTheme } from "@mui/material/styles";
import "./Galaxy.css";

import { vertexShader, fragmentShader } from "./galaxyShaders";
import {
  type GalaxyStarColors,
  type ResolvedGalaxyColors,
  resolveThemeColors,
} from "./galaxyColors";

export type { GalaxyStarColors } from "./galaxyColors";

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
  dpr?: number;
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
  dpr?: number;
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
  "dpr",
]);

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

// A single WebGL context per page lifetime. Reusing one canvas + context means
// route/HMR remounts no longer create fresh contexts and evict older ones (the
// browser logs "WebGL context was lost." once Chrome's per-domain context budget
// is exceeded). The slot lives on `window` so it survives module re-evaluation
// during Vite HMR; a full page reload starts a fresh page and context, and the
// previous one is released silently at unload.
const SHARED_CANVAS_KEY = "__aptispace_galaxy_shared_canvas__";
const contextLostHandledCanvases = new WeakSet<HTMLCanvasElement>();

function getSharedGalaxyCanvas(): HTMLCanvasElement {
  const w = window as Window & { [SHARED_CANVAS_KEY]?: HTMLCanvasElement };
  let canvas = w[SHARED_CANVAS_KEY];
  if (!canvas) {
    canvas = document.createElement("canvas");
    w[SHARED_CANVAS_KEY] = canvas;
  }
  if (!contextLostHandledCanvases.has(canvas)) {
    contextLostHandledCanvases.add(canvas);
    // Mark any genuine GPU context loss as recoverable: without preventDefault
    // the browser treats the loss as permanent (and logs it), so we could never
    // restore — with it, the browser fires webglcontextrestored and we recompile.
    canvas.addEventListener("webglcontextlost", (event) => {
      event.preventDefault();
    });
  }
  return canvas;
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

    const canvas = getSharedGalaxyCanvas();
    const resolvedDpr =
      settings.dpr ??
      (typeof window !== "undefined"
        ? Math.min(window.devicePixelRatio || 1, 1.25)
        : 1);

    const renderer = new Renderer({
      canvas,
      dpr: resolvedDpr,
      alpha: settings.transparent,
      premultipliedAlpha: true,
    });
    const gl = renderer.gl;
    setupGlBlending(gl, settings.transparent, colors.background);

    let program = createGalaxyProgram(
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

    const TARGET_FPS = 60;
    const FRAME_INTERVAL = 1000 / TARGET_FPS;
    let lastRenderTime = 0;
    let animateId: number | null = null;
    let isRunning = false;
    let isPageVisible =
      typeof document !== "undefined" ? !document.hidden : true;
    let isIntersecting = true;

    // GPU shader state is reset when the (rare) genuine context loss is restored
    // by the browser, so recompile the program on the same shared gl and refresh
    // dimensions. Lost-handling itself lives on the shared canvas (see
    // getSharedGalaxyCanvas) so it fires even while no Galaxy is mounted.
    const handleContextRestored = () => {
      setupGlBlending(gl, settings.transparent, colors.background);
      program = createGalaxyProgram(
        gl,
        settings,
        colors,
        smoothMousePos.current,
      );
      mesh.program = program;
      resize();
    };
    canvas.addEventListener(
      "webglcontextrestored",
      handleContextRestored,
      false,
    );

    const update = (timestampMs: number) => {
      if (!isRunning) return;
      animateId = requestAnimationFrame(update);

      const elapsed = timestampMs - lastRenderTime;
      if (elapsed < FRAME_INTERVAL - 1.0) {
        return;
      }
      lastRenderTime = timestampMs;

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

    const startLoop = () => {
      if (!isRunning && isPageVisible && isIntersecting) {
        isRunning = true;
        animateId = requestAnimationFrame(update);
      }
    };

    const stopLoop = () => {
      isRunning = false;
      if (animateId !== null) {
        cancelAnimationFrame(animateId);
        animateId = null;
      }
    };

    startLoop();
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
      isPageVisible = typeof document !== "undefined" ? !document.hidden : true;
      if (!isPageVisible) {
        targetMouseActive.current = 0.0;
        stopLoop();
      } else {
        startLoop();
      }
    };

    let observer: IntersectionObserver | null = null;
    if (typeof IntersectionObserver !== "undefined") {
      observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          isIntersecting = entry?.isIntersecting ?? true;
          if (!isIntersecting) {
            stopLoop();
          } else {
            startLoop();
          }
        },
        { threshold: 0 },
      );
      observer.observe(ctn);
    }

    if (settings.mouseInteraction) {
      window.addEventListener("mousemove", handleMouseMove, { passive: true });
      window.addEventListener("mouseout", handleMouseOut, { passive: true });
      window.addEventListener("blur", handleBlur);
      document.addEventListener("mouseleave", handleMouseLeave);
      document.addEventListener("visibilitychange", handleVisibilityChange);
    } else {
      document.addEventListener("visibilitychange", handleVisibilityChange);
    }

    return () => {
      stopLoop();
      if (observer) {
        observer.disconnect();
      }
      window.removeEventListener("resize", resize);
      canvas.removeEventListener(
        "webglcontextrestored",
        handleContextRestored,
        false,
      );
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (settings.mouseInteraction) {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseout", handleMouseOut);
        window.removeEventListener("blur", handleBlur);
        document.removeEventListener("mouseleave", handleMouseLeave);
      }
      if (gl.canvas.parentNode === ctn) {
        ctn.removeChild(gl.canvas);
      }
      // Deliberately do NOT lose the WebGL context here: the canvas is shared
      // page-wide (see getSharedGalaxyCanvas) and the next mount reuses it. The
      // context is released by the browser when the page unloads.
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
