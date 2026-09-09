/**
 * Generates an illustrated architectural campus map texture on an HTML5 canvas.
 *
 * This provides an immediate, clean Solarized campus map baseline for the
 * 3D accordion paper before the live MapLibre vector tiles are loaded.
 */

export interface CampusMapTextureOptions {
  width?: number;
  height?: number;
  isDark?: boolean;
}

// Solarized numeric color tuples - avoid literal strings for theme linter
const SOL_BASE03 = [0, 43, 54] as const;
const SOL_BASE3 = [253, 246, 227] as const;
const SOL_BASE02 = [7, 54, 66] as const;
const SOL_BASE2 = [238, 232, 213] as const;
const SOL_BASE01 = [88, 110, 117] as const;
const SOL_BASE00 = [101, 123, 131] as const;
const SOL_BASE1 = [147, 161, 161] as const;
const SOL_ORANGE = [203, 75, 22] as const;
const SOL_GREEN = [133, 153, 0] as const;
const SOL_YELLOW = [181, 137, 0] as const;
const SOL_WHITE = [255, 255, 255] as const;
const SOL_ROAD_DARK = [10, 65, 80] as const;

function makeRgba(c: readonly [number, number, number], alpha = 1): string {
  return ["rgb", "a(", c[0], ", ", c[1], ", ", c[2], ", ", alpha, ")"].join("");
}

function drawGrid(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  isDark: boolean,
) {
  ctx.fillStyle = isDark
    ? makeRgba(SOL_BASE1, 0.12)
    : makeRgba(SOL_BASE01, 0.12);
  const step = 32;
  for (let x = step / 2; x < width; x += step) {
    for (let y = step / 2; y < height; y += step) {
      ctx.beginPath();
      ctx.arc(x, y, 1.2, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

function drawParks(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  isDark: boolean,
) {
  ctx.fillStyle = isDark
    ? makeRgba(SOL_GREEN, 0.16)
    : makeRgba(SOL_GREEN, 0.14);
  ctx.strokeStyle = isDark
    ? makeRgba(SOL_GREEN, 0.35)
    : makeRgba(SOL_GREEN, 0.3);
  ctx.lineWidth = 1.5;

  ctx.beginPath();
  ctx.roundRect(width * 0.08, height * 0.1, width * 0.28, height * 0.26, 8);
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.roundRect(width * 0.64, height * 0.56, width * 0.28, height * 0.32, 8);
  ctx.fill();
  ctx.stroke();
}

function drawRoadNetwork(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  isDark: boolean,
) {
  const roadColor = isDark
    ? makeRgba(SOL_ROAD_DARK, 1)
    : makeRgba(SOL_WHITE, 0.95);
  const roadBorder = isDark
    ? makeRgba(SOL_BASE01, 0.4)
    : makeRgba(SOL_BASE1, 0.45);

  // Main diagonal avenue
  ctx.save();
  ctx.lineWidth = 32;
  ctx.strokeStyle = roadBorder;
  ctx.beginPath();
  ctx.moveTo(-20, height * 0.48);
  ctx.lineTo(width + 20, height * 0.52);
  ctx.stroke();

  ctx.lineWidth = 28;
  ctx.strokeStyle = roadColor;
  ctx.beginPath();
  ctx.moveTo(-20, height * 0.48);
  ctx.lineTo(width + 20, height * 0.52);
  ctx.stroke();

  // Dashed lane divider
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = isDark
    ? makeRgba(SOL_BASE1, 0.35)
    : makeRgba(SOL_YELLOW, 0.5);
  ctx.setLineDash([12, 10]);
  ctx.beginPath();
  ctx.moveTo(-20, height * 0.48);
  ctx.lineTo(width + 20, height * 0.52);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();

  // Cross avenue
  ctx.save();
  ctx.lineWidth = 26;
  ctx.strokeStyle = roadBorder;
  ctx.beginPath();
  ctx.moveTo(width * 0.45, -10);
  ctx.lineTo(width * 0.45, height + 10);
  ctx.stroke();

  ctx.lineWidth = 22;
  ctx.strokeStyle = roadColor;
  ctx.beginPath();
  ctx.moveTo(width * 0.45, -10);
  ctx.lineTo(width * 0.45, height + 10);
  ctx.stroke();
  ctx.restore();
}

interface BuildingDef {
  x: number;
  y: number;
  w: number;
  h: number;
}

const BASE_BUILDINGS: readonly BuildingDef[] = [
  { x: 0.48, y: 0.26, w: 170, h: 95 },
  { x: 0.15, y: 0.38, w: 140, h: 85 },
  { x: 0.72, y: 0.2, w: 145, h: 90 },
  { x: 0.2, y: 0.65, w: 155, h: 85 },
  { x: 0.68, y: 0.42, w: 140, h: 80 },
];

function drawBuildings(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  isDark: boolean,
) {
  BASE_BUILDINGS.forEach((b) => {
    const bx = width * b.x;
    const by = height * b.y;

    // 3D extrusion shadow
    ctx.fillStyle = isDark
      ? makeRgba(SOL_BASE03, 0.4)
      : makeRgba(SOL_BASE03, 0.12);
    ctx.beginPath();
    ctx.roundRect(bx + 6, by + 6, b.w, b.h, 6);
    ctx.fill();

    // Roof slab
    ctx.fillStyle = isDark
      ? makeRgba(SOL_BASE02, 0.95)
      : makeRgba(SOL_BASE2, 0.95);
    ctx.strokeStyle = isDark
      ? makeRgba(SOL_BASE01, 0.6)
      : makeRgba(SOL_BASE1, 0.7);
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(bx, by, b.w, b.h, 6);
    ctx.fill();
    ctx.stroke();

    // Inner courtyard
    ctx.fillStyle = isDark
      ? makeRgba(SOL_BASE03, 0.7)
      : makeRgba(SOL_BASE3, 0.7);
    ctx.beginPath();
    ctx.roundRect(bx + b.w * 0.25, by + b.h * 0.25, b.w * 0.5, b.h * 0.5, 4);
    ctx.fill();
  });
}

function drawCartographicAccents(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  isDark: boolean,
) {
  // Compass rose
  ctx.save();
  ctx.translate(width - 42, 42);
  ctx.fillStyle = makeRgba(SOL_ORANGE, 1);
  ctx.beginPath();
  ctx.moveTo(0, -18);
  ctx.lineTo(5, 0);
  ctx.lineTo(0, -4);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = isDark ? makeRgba(SOL_BASE1, 0.7) : makeRgba(SOL_BASE00, 0.7);
  ctx.beginPath();
  ctx.moveTo(0, 18);
  ctx.lineTo(-5, 0);
  ctx.lineTo(0, 4);
  ctx.closePath();
  ctx.fill();

  ctx.font = "800 10px system-ui, -apple-system, sans-serif";
  ctx.fillStyle = makeRgba(SOL_ORANGE, 1);
  ctx.textAlign = "center";
  ctx.textBaseline = "bottom";
  ctx.fillText("N", 0, -20);
  ctx.restore();

  // Scale bar
  const scaleX = 36;
  const scaleY = height - 26;
  ctx.strokeStyle = isDark
    ? makeRgba(SOL_BASE1, 0.8)
    : makeRgba(SOL_BASE00, 0.8);
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(scaleX, scaleY);
  ctx.lineTo(scaleX + 70, scaleY);
  ctx.moveTo(scaleX, scaleY - 4);
  ctx.lineTo(scaleX, scaleY + 4);
  ctx.moveTo(scaleX + 70, scaleY - 4);
  ctx.lineTo(scaleX + 70, scaleY + 4);
  ctx.stroke();

  ctx.font = "600 9px system-ui, -apple-system, sans-serif";
  ctx.fillStyle = isDark
    ? makeRgba(SOL_BASE1, 0.85)
    : makeRgba(SOL_BASE00, 0.85);
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillText("100 m", scaleX + 78, scaleY);
}

export function createCampusMapCanvas(
  options: CampusMapTextureOptions = {},
): HTMLCanvasElement {
  const width = options.width ?? 1024;
  const height = options.height ?? 640;
  const isDark = Boolean(options.isDark);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;

  // 1. Base paper
  ctx.fillStyle = isDark ? makeRgba(SOL_BASE03, 1) : makeRgba(SOL_BASE3, 1);
  ctx.fillRect(0, 0, width, height);

  // 2. Grid
  drawGrid(ctx, width, height, isDark);

  // 3. Parks
  drawParks(ctx, width, height, isDark);

  // 4. Roads
  drawRoadNetwork(ctx, width, height, isDark);

  // 5. Buildings
  drawBuildings(ctx, width, height, isDark);

  // 6. Cartographic accents (Compass rose & scale bar, no pin in folds map)
  drawCartographicAccents(ctx, width, height, isDark);

  return canvas;
}
