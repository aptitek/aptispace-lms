import {
  MaterialShapes,
  roundedPolygonToPath,
  type RoundedPolygon,
} from "material-shapes-ts";

export type ExpressiveShapeName =
  | "circle"
  | "square"
  | "slanted"
  | "arch"
  | "semicircle"
  | "oval"
  | "pill"
  | "triangle"
  | "arrow"
  | "fan"
  | "diamond"
  | "clamshell"
  | "pentagon"
  | "gem"
  | "very-sunny"
  | "verySunny"
  | "sunny"
  | "4-sided-cookie"
  | "four-sided-cookie"
  | "fourSidedCookie"
  | "6-sided-cookie"
  | "six-sided-cookie"
  | "sixSidedCookie"
  | "7-sided-cookie"
  | "seven-sided-cookie"
  | "sevenSidedCookie"
  | "9-sided-cookie"
  | "nine-sided-cookie"
  | "nineSidedCookie"
  | "12-sided-cookie"
  | "twelve-sided-cookie"
  | "twelveSidedCookie"
  | "4-leaf-clover"
  | "four-leaf-clover"
  | "fourLeafClover"
  | "8-leaf-clover"
  | "eight-leaf-clover"
  | "eightLeafClover"
  | "8-cookie"
  | "eight-cookie"
  | "8-sided-cookie"
  | "eight-sided-cookie"
  | "eightSidedCookie"
  | "burst"
  | "soft-burst"
  | "softBurst"
  | "boom"
  | "soft-boom"
  | "softBoom"
  | "flower"
  | "puffy"
  | "puffy-diamond"
  | "puffyDiamond"
  | "ghost-ish"
  | "ghostIsh"
  | "pixel-circle"
  | "pixelCircle"
  | "pixel-triangle"
  | "pixelTriangle"
  | "bun"
  | "heart";

export type M3ExpressiveShapeName = ExpressiveShapeName;

export interface ShapeDefinition {
  name: string;
  label: string;
  pathData: string;
  clipPath: string;
  borderRadius?: string;
}

export type M3ShapeDefinition = ShapeDefinition;

const RAW_SHAPE_ENTRIES: Array<[string, string, RoundedPolygon]> = [
  ["circle", "Circle", MaterialShapes.Circle],
  ["square", "Square", MaterialShapes.Square],
  ["slanted", "Slanted", MaterialShapes.Slanted],
  ["arch", "Arch", MaterialShapes.Arch],
  ["semicircle", "Semicircle", MaterialShapes.SemiCircle],
  ["oval", "Oval", MaterialShapes.Oval],
  ["pill", "Pill", MaterialShapes.Pill],
  ["triangle", "Triangle", MaterialShapes.Triangle],
  ["arrow", "Arrow", MaterialShapes.Arrow],
  ["fan", "Fan", MaterialShapes.Fan],
  ["diamond", "Diamond", MaterialShapes.Diamond],
  ["clamshell", "Clamshell", MaterialShapes.ClamShell],
  ["pentagon", "Pentagon", MaterialShapes.Pentagon],
  ["gem", "Gem", MaterialShapes.Gem],
  ["very-sunny", "Very sunny", MaterialShapes.VerySunny],
  ["sunny", "Sunny", MaterialShapes.Sunny],
  ["4-sided-cookie", "4-sided cookie", MaterialShapes.Cookie4Sided],
  ["6-sided-cookie", "6-sided cookie", MaterialShapes.Cookie6Sided],
  ["7-sided-cookie", "7-sided cookie", MaterialShapes.Cookie7Sided],
  ["9-sided-cookie", "9-sided cookie", MaterialShapes.Cookie9Sided],
  ["12-sided-cookie", "12-sided cookie", MaterialShapes.Cookie12Sided],
  ["4-leaf-clover", "4-leaf clover", MaterialShapes.Clover4Leaf],
  ["8-leaf-clover", "8-leaf clover", MaterialShapes.Clover8Leaf],
  ["burst", "Burst", MaterialShapes.Burst],
  ["soft-burst", "Soft burst", MaterialShapes.SoftBurst],
  ["boom", "Boom", MaterialShapes.Boom],
  ["soft-boom", "Soft boom", MaterialShapes.SoftBoom],
  ["flower", "Flower", MaterialShapes.Flower],
  ["puffy", "Puffy", MaterialShapes.Puffy],
  ["puffy-diamond", "Puffy diamond", MaterialShapes.PuffyDiamond],
  ["ghost-ish", "Ghost-ish", MaterialShapes.Ghostish],
  ["pixel-circle", "Pixel circle", MaterialShapes.PixelCircle],
  ["pixel-triangle", "Pixel triangle", MaterialShapes.PixelTriangle],
  ["bun", "Bun", MaterialShapes.Bun],
  ["heart", "Heart", MaterialShapes.Heart],
];

export const EXPRESSIVE_SHAPE_CATALOG: Record<string, ShapeDefinition> = {};
export const M3_EXPRESSIVE_CATALOG = EXPRESSIVE_SHAPE_CATALOG;

for (const [key, label, shapePolygon] of RAW_SHAPE_ENTRIES) {
  const path = roundedPolygonToPath(shapePolygon);
  EXPRESSIVE_SHAPE_CATALOG[key] = {
    name: key,
    label,
    pathData: path.toSvgPathData(),
    clipPath: `url(#avatar-shape-${key})`,
  };
}

// Aliases mapping
const ALIASES: Record<string, string> = {
  verySunny: "very-sunny",
  "four-sided-cookie": "4-sided-cookie",
  fourSidedCookie: "4-sided-cookie",
  "six-sided-cookie": "6-sided-cookie",
  sixSidedCookie: "6-sided-cookie",
  "seven-sided-cookie": "7-sided-cookie",
  sevenSidedCookie: "7-sided-cookie",
  "nine-sided-cookie": "9-sided-cookie",
  nineSidedCookie: "9-sided-cookie",
  "twelve-sided-cookie": "12-sided-cookie",
  twelveSidedCookie: "12-sided-cookie",
  "four-leaf-clover": "4-leaf-clover",
  fourLeafClover: "4-leaf-clover",
  "eight-leaf-clover": "8-leaf-clover",
  eightLeafClover: "8-leaf-clover",
  "8-cookie": "8-leaf-clover",
  "eight-cookie": "8-leaf-clover",
  "8-sided-cookie": "8-leaf-clover",
  "eight-sided-cookie": "8-leaf-clover",
  eightSidedCookie: "8-leaf-clover",
  softBurst: "soft-burst",
  softBoom: "soft-boom",
  puffyDiamond: "puffy-diamond",
  ghostIsh: "ghost-ish",
  pixelCircle: "pixel-circle",
  pixelTriangle: "pixel-triangle",
};

for (const [alias, canonicalKey] of Object.entries(ALIASES)) {
  if (EXPRESSIVE_SHAPE_CATALOG[canonicalKey]) {
    EXPRESSIVE_SHAPE_CATALOG[alias] = EXPRESSIVE_SHAPE_CATALOG[canonicalKey];
  }
}

export const ALL_EXPRESSIVE_SHAPES: string[] = [
  "circle",
  "square",
  "slanted",
  "arch",
  "semicircle",
  "oval",
  "pill",
  "triangle",
  "arrow",
  "fan",
  "diamond",
  "clamshell",
  "pentagon",
  "gem",
  "very-sunny",
  "sunny",
  "4-sided-cookie",
  "6-sided-cookie",
  "7-sided-cookie",
  "9-sided-cookie",
  "12-sided-cookie",
  "4-leaf-clover",
  "8-leaf-clover",
  "burst",
  "soft-burst",
  "boom",
  "soft-boom",
  "flower",
  "puffy",
  "puffy-diamond",
  "ghost-ish",
  "pixel-circle",
  "pixel-triangle",
  "bun",
  "heart",
];

export const ALL_35_M3_SHAPES = ALL_EXPRESSIVE_SHAPES;

export const SHAPE_SCALE_RADIUS_MAP: Record<string, string> = {
  none: "0px",
  "extra-small": "4px",
  "extra-small-top": "4px 4px 0 0",
  small: "8px",
  medium: "12px",
  rounded: "12px",
  landscape: "8px",
  large: "16px",
  "large-end": "0 16px 16px 0",
  "large-top": "16px 16px 0 0",
  "large-start": "16px 0 0 16px",
  "extra-large": "28px",
  "extra-large-top": "28px 28px 0 0",
  full: "9999px",
  circular: "50%",
  cut: "14px 2px 14px 2px",
  asymmetric: "24px 6px 24px 6px",
  biometric: "10px",
};

export const M3_SCALE_RADIUS_MAP = SHAPE_SCALE_RADIUS_MAP;

export interface ResolvedShapeStyle {
  borderRadius: string;
  clipPath?: string;
  pathData?: string;
}

export function resolveShapeStyle(
  shape?: string | number,
  customRadius?: number | string,
): ResolvedShapeStyle {
  if (customRadius !== undefined) {
    const rad =
      typeof customRadius === "number" ? `${customRadius}px` : customRadius;
    return { borderRadius: rad };
  }
  if (!shape) {
    return { borderRadius: "10px" };
  }
  if (typeof shape === "number") {
    return { borderRadius: `${shape}px` };
  }

  const expressiveDef = EXPRESSIVE_SHAPE_CATALOG[shape];
  if (expressiveDef) {
    return {
      borderRadius: expressiveDef.borderRadius ?? "0px",
      clipPath: expressiveDef.clipPath,
      pathData: expressiveDef.pathData,
    };
  }

  const scaleRad = SHAPE_SCALE_RADIUS_MAP[shape];
  if (scaleRad) {
    return { borderRadius: scaleRad };
  }

  return { borderRadius: shape };
}

export const resolveM3ShapeStyle = resolveShapeStyle;

/**
 * Shape-based avatar system resolver:
 * - student: MD3 pill ("pill")
 * - instructor: Ghost-ish ("ghost-ish")
 * - admin: 9-sided cookie ("9-sided-cookie")
 */
export function getRoleAvatarShape(role?: string | null): ExpressiveShapeName {
  switch (role) {
    case "admin":
      return "9-sided-cookie";
    case "instructor":
      return "ghost-ish";
    case "student":
    default:
      return "pill";
  }
}
