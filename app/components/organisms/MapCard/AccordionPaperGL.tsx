import React, { useEffect, useRef, useState, useCallback } from "react";
import { Renderer, Program, Mesh, Plane, Texture } from "ogl";
import { styled, useTheme, getLuminance } from "@mui/material/styles";
import {
  accordionVertexShader,
  accordionFragmentShader,
} from "./accordionPaperShaders";
import { TrifoldBrochurePaper } from "./TrifoldBrochurePaper";
import { createCampusMapCanvas } from "./campusMapTexture";

export interface AccordionPaperGLProps {
  isFolded: boolean;
  snapshotUrl: string | null;
  isDark?: boolean;
  onUnfoldDone: () => void;
  onClick?: () => void;
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

function easeOutCubic(x: number): number {
  return 1 - Math.pow(1 - x, 3);
}

function easeInOutCubic(x: number): number {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

export const AccordionPaperGL: React.FC<AccordionPaperGLProps> = ({
  isFolded,
  snapshotUrl,
  isDark: propIsDark,
  onUnfoldDone,
  onClick,
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

  const [hasGlFailed, setHasGlFailed] = useState<boolean>(false);

  // Initialize WebGL Scene
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const glCheck = canvas.getContext("webgl2") || canvas.getContext("webgl");
    if (!glCheck) {
      setHasGlFailed(true);
      return;
    }

    let renderer: Renderer;
    try {
      renderer = new Renderer({
        canvas,
        alpha: true,
        antialias: true,
        dpr: Math.min(window.devicePixelRatio || 1, 2),
      });
      rendererRef.current = renderer;
    } catch {
      setHasGlFailed(true);
      return;
    }

    const { gl } = renderer;
    if (!gl) {
      setHasGlFailed(true);
      return;
    }

    // High-resolution continuous mesh with 96 horizontal segments
    const geometry = new Plane(gl, {
      width: 1,
      height: 1,
      widthSegments: 96,
      heightSegments: 1,
    });

    // Create illustrated campus map canvas texture immediately
    const initialMapCanvas = createCampusMapCanvas({
      width: 1024,
      height: 640,
      isDark,
    });
    const initialTexture = new Texture(gl, {
      image: initialMapCanvas,
      generateMipmaps: false,
    });
    textureRef.current = initialTexture;

    const baseRgb = isDark ? SOLARIZED_DARK_RGB : SOLARIZED_LIGHT_RGB;

    const program = new Program(gl, {
      vertex: accordionVertexShader,
      fragment: accordionFragmentShader,
      uniforms: {
        uTexture: { value: initialTexture },
        uHasTexture: { value: 1.0 },
        uProgress: { value: progressRef.current },
        uFoldAngle: { value: 0.38 },
        uBaseColor: { value: baseRgb },
      },
      transparent: true,
      cullFace: null,
    });
    programRef.current = program;

    const mesh = new Mesh(gl, { geometry, program });
    meshRef.current = mesh;

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
  }, [isDark]);

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
    (target: number, duration = 850) => {
      const start = progressRef.current;
      const startTime = performance.now();

      const tick = (now: number) => {
        const elapsed = now - startTime;
        const rawFrac = Math.min(elapsed / duration, 1.0);
        const frac =
          target === 1.0 ? easeOutCubic(rawFrac) : easeInOutCubic(rawFrac);
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
      animateProgress(targetProgress, 850);
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
