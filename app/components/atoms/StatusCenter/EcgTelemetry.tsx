import React, { useEffect, useRef } from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import { SOLARIZED_BASE } from "~/tokens/theme";
import type { SystemHealthStatus } from "~/utils/statusCenterContext";

export interface EcgTelemetryProps {
  status?: SystemHealthStatus;
  bpm?: number;
  height?: number;
  className?: string;
  showMetrics?: boolean;
}

const TelemetryContainer = styled("div", {
  shouldForwardProp: (prop) => prop !== "height",
})<{ height: number }>(({ theme, height }) => ({
  position: "relative",
  width: "100%",
  height,
  overflow: "hidden",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: theme.shadows[2],
}));

const CanvasOverlay = styled("canvas")({
  display: "block",
  width: "100%",
  height: "100%",
});

const TelemetryMetrics = styled("div")(({ theme }) => ({
  position: "absolute",
  top: 6,
  left: 10,
  right: 10,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  pointerEvents: "none",
  fontFamily: "Recursive, 'JetBrains Mono', 'Courier New', monospace",
  fontSize: "0.6875rem",
  fontWeight: 600,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: theme.palette.text.secondary,
  zIndex: 2,
}));

const MetricTag = styled("span", {
  shouldForwardProp: (prop) => prop !== "color",
})<{ color?: string }>(({ color }) => ({
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  color: color || "inherit",
}));

const StatusDot = styled("span", {
  shouldForwardProp: (prop) => prop !== "color",
})<{ color: string }>(({ color }) => ({
  width: 6,
  height: 6,
  borderRadius: "50%",
  backgroundColor: color,
  boxShadow: `0 0 8px ${color}`,
  display: "inline-block",
}));

function getPWave(p: number): number {
  if (p >= 0.12 && p <= 0.22) {
    const localP = (p - 0.17) / 0.05;
    return 0.18 * Math.exp(-0.5 * localP * localP * 12);
  }
  return 0;
}

function getQrsComplex(p: number): number {
  if (p >= 0.26 && p <= 0.3) {
    const localP = (p - 0.28) / 0.02;
    return -0.15 * Math.exp(-0.5 * localP * localP * 30);
  }
  if (p >= 0.3 && p <= 0.35) {
    const localP = (p - 0.32) / 0.015;
    return 1.0 * Math.exp(-0.5 * localP * localP * 25);
  }
  if (p >= 0.34 && p <= 0.39) {
    const localP = (p - 0.365) / 0.02;
    return -0.35 * Math.exp(-0.5 * localP * localP * 25);
  }
  return 0;
}

function getTWave(p: number): number {
  if (p >= 0.48 && p <= 0.62) {
    const localP = (p - 0.55) / 0.07;
    return 0.28 * Math.exp(-0.5 * localP * localP * 10);
  }
  return 0;
}

function getEcgY(phase: number): number {
  const normalizedPhase =
    ((phase % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
  const progressRatio = normalizedPhase / (2 * Math.PI);

  return (
    getPWave(progressRatio) +
    getQrsComplex(progressRatio) +
    getTWave(progressRatio)
  );
}

function drawOscilloscopeGrid(
  ctx: CanvasRenderingContext2D,
  width: number,
  h: number,
  midY: number,
) {
  ctx.save();
  ctx.strokeStyle = `${SOLARIZED_BASE.cyan}14`;
  ctx.lineWidth = 1;
  const gridSize = 16;
  for (let x = 0; x < width; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
  }
  for (let y = 0; y < h; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  ctx.strokeStyle = `${SOLARIZED_BASE.base01}26`;
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.moveTo(0, midY);
  ctx.lineTo(width, midY);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();
}

function drawWaveformFromBuffer(
  ctx: CanvasRenderingContext2D,
  buffer: Float32Array,
  width: number,
) {
  ctx.beginPath();
  let isDrawing = false;

  for (let x = 0; x < width; x++) {
    const y = buffer[x];
    if (Number.isNaN(y)) {
      if (isDrawing) {
        ctx.stroke();
        ctx.beginPath();
        isDrawing = false;
      }
      continue;
    }

    if (!isDrawing) {
      ctx.moveTo(x, y);
      isDrawing = true;
    } else {
      ctx.lineTo(x, y);
    }
  }

  if (isDrawing) {
    ctx.stroke();
  }
}

interface SweepUpdateConfig {
  width: number;
  startX: number;
  endX: number;
  prevY: number;
  currentY: number;
  clearGap: number;
}

function updateSampleBuffer(buffer: Float32Array, config: SweepUpdateConfig) {
  const { width, startX, endX, prevY, currentY, clearGap } = config;
  const span = Math.max(1, endX - startX);
  const minX = Math.max(0, Math.floor(startX));
  const maxX = Math.min(width - 1, Math.floor(endX));

  for (let x = minX; x <= maxX; x++) {
    const progress = (x - startX) / span;
    buffer[x] = prevY + (currentY - prevY) * progress;
  }

  for (let offset = 1; offset <= clearGap; offset++) {
    const clearIdx = (Math.floor(endX) + offset) % width;
    buffer[clearIdx] = Number.NaN;
  }
}

function resolveStatusTelemetry(status: SystemHealthStatus, bpmProp: number) {
  switch (status) {
    case "offline":
      return {
        color: SOLARIZED_BASE.base01,
        label: "OFFLINE",
        targetBpm: 0,
      };
    case "critical":
      return {
        color: SOLARIZED_BASE.red,
        label: "CRITICAL ERROR",
        targetBpm: bpmProp || 156,
      };
    case "security_breach":
      return {
        color: SOLARIZED_BASE.magenta,
        label: "SECURITY ALERT (403)",
        targetBpm: bpmProp || 132,
      };
    case "degraded":
      return {
        color: SOLARIZED_BASE.yellow,
        label: "DEGRADED (WARNINGS)",
        targetBpm: bpmProp || 98,
      };
    case "nominal":
    default:
      return {
        color: SOLARIZED_BASE.green,
        label: "OPERATIONAL",
        targetBpm: bpmProp || 68,
      };
  }
}

export function EcgTelemetry({
  status = "nominal",
  bpm = 68,
  height = 96,
  className,
  showMetrics = true,
}: EcgTelemetryProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const statusConfig = resolveStatusTelemetry(status, bpm);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let sweepX = 0;
    let lastPointY = 0;
    let ecgPhase = 0;
    let lastTime = performance.now();

    let sampleBuffer = new Float32Array(0);

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);

      const targetWidth = Math.max(1, Math.ceil(rect.width));
      const midY = rect.height * 0.52;
      const newBuffer = new Float32Array(targetWidth);
      newBuffer.fill(midY);
      sampleBuffer = newBuffer;
      lastPointY = midY;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const SWEEP_SPEED_PX_PER_SEC = 140;
    const CLEAR_GAP = 32;

    const render = (currentTime: number) => {
      const dt = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;

      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const h = rect.height;
      const midY = h * 0.52;
      const amplitude = h * 0.38;

      if (width <= 0 || h <= 0 || sampleBuffer.length === 0) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      const prevSweepX = sweepX;
      sweepX += SWEEP_SPEED_PX_PER_SEC * dt;

      const freqHz = (status === "offline" ? 0 : statusConfig.targetBpm) / 60;
      ecgPhase += 2 * Math.PI * freqHz * dt;

      const currentSample =
        status === "offline"
          ? Math.sin(currentTime * 0.02) * 0.015 + (Math.random() - 0.5) * 0.01
          : getEcgY(ecgPhase);

      const currentPointY = midY - currentSample * amplitude;

      if (sweepX >= width) {
        // Complete the sweep to the right edge
        updateSampleBuffer(sampleBuffer, {
          width: Math.floor(width),
          startX: prevSweepX,
          endX: width,
          prevY: lastPointY,
          currentY: currentPointY,
          clearGap: CLEAR_GAP,
        });
        sweepX = 0;
        lastPointY = currentPointY;
      } else {
        updateSampleBuffer(sampleBuffer, {
          width: Math.floor(width),
          startX: prevSweepX,
          endX: sweepX,
          prevY: lastPointY,
          currentY: currentPointY,
          clearGap: CLEAR_GAP,
        });
        lastPointY = currentPointY;
      }

      ctx.clearRect(0, 0, width, h);
      drawOscilloscopeGrid(ctx, width, h, midY);

      const traceColor = statusConfig.color;
      ctx.save();
      ctx.lineWidth = 2.2;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.strokeStyle = traceColor;
      ctx.shadowColor = traceColor;
      ctx.shadowBlur = status === "offline" ? 4 : 8;

      drawWaveformFromBuffer(ctx, sampleBuffer, Math.floor(width));

      // Draw Sweep Head Beacon
      ctx.fillStyle = traceColor;
      ctx.shadowColor = traceColor;
      ctx.shadowBlur = 14;
      ctx.beginPath();
      ctx.arc(sweepX, currentPointY, 3, 0, Math.PI * 2);
      ctx.fill();

      // Draw Vertical Radar Lead Line
      const radarGrad = ctx.createLinearGradient(0, 0, 0, h);
      radarGrad.addColorStop(0, `${traceColor}00`);
      radarGrad.addColorStop(0.5, `${traceColor}88`);
      radarGrad.addColorStop(1, `${traceColor}00`);
      ctx.strokeStyle = radarGrad;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(sweepX, 0);
      ctx.lineTo(sweepX, h);
      ctx.stroke();
      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [status, statusConfig]);

  return (
    <TelemetryContainer height={height} className={className}>
      {showMetrics && (
        <TelemetryMetrics>
          <MetricTag color={statusConfig.color}>
            <StatusDot color={statusConfig.color} />
            <span>{statusConfig.label}</span>
          </MetricTag>
          <MetricTag>
            <span>
              {status === "offline"
                ? "--- BPM"
                : `${statusConfig.targetBpm} BPM`}
            </span>
            <Box component="span" sx={{ opacity: 0.6 }}>
              • REAL-TIME
            </Box>
          </MetricTag>
        </TelemetryMetrics>
      )}
      <CanvasOverlay ref={canvasRef} />
    </TelemetryContainer>
  );
}

export default EcgTelemetry;
