import React, { useEffect, useRef, useState, useCallback } from "react";
import { Renderer, Program, Mesh, Plane, Texture } from "ogl";
import { styled, useTheme, getLuminance } from "@mui/material/styles";
import {
  accordionVertexShader,
  accordionFragmentShader,
} from "./accordionPaperShaders";
import { TrifoldBrochurePaper } from "./TrifoldBrochurePaper";
import { createCampusMapCanvas } from "./campusMapTexture";
import { isWebGLSupported } from "~/components/atoms/Map";

export interface AccordionPaperGLProps {
  isFolded: boolean;
  snapshotUrl: string | null;
  isDark?: boolean;
  onUnfoldDone: () => void;
  onClick?: () => void;
  disableWebGL?: boolean;
}

const GLCanvasContainer = styled("div")(({ theme }) => ({
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  zIndex: 4,
  overflow: "hidden",
  backgroundColor: theme.palette.background.default,
}));

const StyledCanvas = styled("canvas")<{ $pointerEvents: "auto" | "none" }>(
  ({ $pointerEvents }) => ({
    width: "100%",
    height: "100%",
    display: "block",
    pointerEvents: $pointerEvents,
  }),
);

const SOLARIZED_LIGHT_RGB = [0.992, 0.965, 0.89] as const;
const SOLARIZED_DARK_RGB = [0.0, 0.168, 0.211] as const;

function easeInOutCubic(x: number): number {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

export const ACCORDION_ANIMATION_DURATION = 1750;

function initGLRenderer(canvas: HTMLCanvasElement): Renderer | null {
  const glCheck = canvas.getContext("webgl2") || canvas.getContext("webgl");
  if (!glCheck) return null;

  try {
    const renderer = new Renderer({
      canvas,
      alpha: true,
      antialias: true,
      dpr: Math.min(window.devicePixelRatio || 1, 2),
    });
    if (!renderer.gl) return null;
    return renderer;
  } catch {
    return null;
  }
}

function createAccordionMesh(
  gl: Renderer["gl"],
  isDark: boolean,
  initialProgress: number,
): { mesh: Mesh; program: Program; texture: Texture } {
  const geometry = new Plane(gl, {
    width: 1,
    height: 1,
    widthSegments: 96,
    heightSegments: 1,
  });

  const initialMapCanvas = createCampusMapCanvas({
    width: 1024,
    height: 640,
    isDark,
  });
  const initialTexture = new Texture(gl, {
    image: initialMapCanvas,
    generateMipmaps: false,
  });

  const baseRgb = isDark ? SOLARIZED_DARK_RGB : SOLARIZED_LIGHT_RGB;

  const program = new Program(gl, {
    vertex: accordionVertexShader,
    fragment: accordionFragmentShader,
    uniforms: {
      uTexture: { value: initialTexture },
      uHasTexture: { value: 1.0 },
      uProgress: { value: initialProgress },
      uFoldAngle: { value: 0.92 },
      uAmplitude: { value: 2.6 },
      uBaseColor: { value: baseRgb },
    },
    transparent: true,
    cullFace: null,
  });

  const mesh = new Mesh(gl, { geometry, program });
  return { mesh, program, texture: initialTexture };
}

export const AccordionPaperGL: React.FC<AccordionPaperGLProps> = ({
  isFolded,
  snapshotUrl,
  isDark: propIsDark,
  onUnfoldDone,
  onClick,
  disableWebGL = false,
}) => {
  const theme = useTheme();
  const isDark =
    propIsDark ?? getLuminance(theme.palette.background.default) < 0.5;

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rendererRef = useRef<Renderer | null>(null);
  const meshRef = useRef<Mesh | null>(null);
  const programRef = useRef<Program | null>(null);
  const textureRef = useRef<Texture | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const progressRef = useRef<number>(isFolded ? 0.0 : 1.0);

  const [hasGlFailed, setHasGlFailed] = useState<boolean>(() => {
    if (disableWebGL) return true;
    return !isWebGLSupported();
  });

  useEffect(() => {
    if (disableWebGL || !isWebGLSupported()) {
      setHasGlFailed(true);
    }
  }, [disableWebGL]);

  useEffect(() => {
    if (hasGlFailed && !isFolded) {
      onUnfoldDone();
    }
  }, [hasGlFailed, isFolded, onUnfoldDone]);

  // Initialize WebGL Scene
  useEffect(() => {
    if (disableWebGL || !isWebGLSupported()) {
      setHasGlFailed(true);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = initGLRenderer(canvas);
    if (!renderer) {
      setHasGlFailed(true);
      return;
    }
    rendererRef.current = renderer;

    const { mesh, program, texture } = createAccordionMesh(
      renderer.gl,
      isDark,
      progressRef.current,
    );
    meshRef.current = mesh;
    programRef.current = program;
    textureRef.current = texture;

    const resize = () => {
      if (!canvas.parentElement) return;
      const width = canvas.parentElement.clientWidth || 300;
      const height = canvas.parentElement.clientHeight || 150;
      renderer.setSize(width, height);
      renderer.render({ scene: mesh });
    };

    resize();
    renderer.render({ scene: mesh });

    const ro = new ResizeObserver(resize);
    if (canvas.parentElement) {
      ro.observe(canvas.parentElement);
    }

    return () => {
      ro.disconnect();
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [isDark, disableWebGL]);

  // Update texture when snapshotUrl arrives
  useEffect(() => {
    if (!snapshotUrl || !rendererRef.current || !programRef.current) return;
    const { gl } = rendererRef.current;
    if (!gl) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      if (!rendererRef.current || !programRef.current) return;
      const nextTexture = new Texture(gl, {
        image: img,
        generateMipmaps: false,
      });
      textureRef.current = nextTexture;
      programRef.current.uniforms.uTexture.value = nextTexture;
      programRef.current.uniforms.uHasTexture.value = 1.0;
      if (meshRef.current) {
        rendererRef.current.render({ scene: meshRef.current });
      }
    };
    img.src = snapshotUrl;
  }, [snapshotUrl]);

  // Animate accordion progress smoothly
  const animateProgress = useCallback(
    (target: number, duration = ACCORDION_ANIMATION_DURATION) => {
      const start = progressRef.current;
      const startTime = performance.now();

      const tick = (now: number) => {
        const elapsed = now - startTime;
        const rawFrac = Math.min(elapsed / duration, 1.0);
        const frac = easeInOutCubic(rawFrac);
        const current = start + (target - start) * frac;
        progressRef.current = current;

        if (programRef.current && rendererRef.current && meshRef.current) {
          programRef.current.uniforms.uProgress.value = current;
          rendererRef.current.render({ scene: meshRef.current });
        }

        if (rawFrac < 1.0) {
          animFrameRef.current = requestAnimationFrame(tick);
        } else {
          progressRef.current = target;
          if (programRef.current && rendererRef.current && meshRef.current) {
            programRef.current.uniforms.uProgress.value = target;
            rendererRef.current.render({ scene: meshRef.current });
          }
          if (target === 1.0) {
            onUnfoldDone();
          }
        }
      };

      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
      animFrameRef.current = requestAnimationFrame(tick);
    },
    [onUnfoldDone],
  );

  // Trigger animation when isFolded prop changes
  useEffect(() => {
    const targetProgress = isFolded ? 0.0 : 1.0;
    if (Math.abs(progressRef.current - targetProgress) > 0.001) {
      animateProgress(targetProgress, ACCORDION_ANIMATION_DURATION);
    }
  }, [isFolded, animateProgress]);

  if (hasGlFailed) {
    return (
      <GLCanvasContainer
        data-testid="accordion-paper-gl-container"
        onClick={isFolded ? onClick : undefined}
      >
        <TrifoldBrochurePaper snapshotUrl={snapshotUrl} />
      </GLCanvasContainer>
    );
  }

  const pointerEvents = isFolded ? "auto" : "none";

  return (
    <GLCanvasContainer
      data-testid="accordion-paper-gl-container"
      onClick={isFolded ? onClick : undefined}
    >
      <StyledCanvas
        ref={canvasRef}
        $pointerEvents={pointerEvents}
        data-testid="accordion-paper-gl"
      />
    </GLCanvasContainer>
  );
};

export default AccordionPaperGL;
