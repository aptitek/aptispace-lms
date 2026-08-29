/**
 * Material Design 3 Expressive Shapes Catalog
 * Source of Truth: AndroidX Compose Material3 `androidx.compose.material3.MaterialShapes`
 * Reference: https://developer.android.com/reference/kotlin/androidx/compose/material3/MaterialShapes
 */

export type M3ExpressiveShapeName =
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

export interface M3ShapeDefinition {
  name: string;
  label: string;
  borderRadius?: string;
  clipPath?: string;
}

export const M3_EXPRESSIVE_CATALOG: Record<string, M3ShapeDefinition> = {
  circle: {
    name: "circle",
    label: "Circle",
    borderRadius: "50%",
  },
  square: {
    name: "square",
    label: "Square",
    borderRadius: "30%",
  },
  slanted: {
    name: "slanted",
    label: "Slanted",
    clipPath: "polygon(90.9% 95.1%, 0% 94.8%, 9.1% 4.9%, 100% 5.2%)",
    borderRadius: "8px",
  },
  arch: {
    name: "arch",
    label: "Arch",
    borderRadius: "50% 50% 6% 6% / 60% 60% 6% 6%",
  },
  semicircle: {
    name: "semicircle",
    label: "Semicircle",
    borderRadius: "50% 50% 0 0 / 100% 100% 0 0",
  },
  oval: {
    name: "oval",
    label: "Oval",
    borderRadius: "38% 62% 62% 38% / 48% 52% 48% 52%",
  },
  pill: {
    name: "pill",
    label: "Pill",
    borderRadius: "9999px",
  },
  triangle: {
    name: "triangle",
    label: "Triangle",
    clipPath: "polygon(50% 0%, 100% 100%, 0% 100%)",
    borderRadius: "12px",
  },
  arrow: {
    name: "arrow",
    label: "Arrow",
    clipPath: "polygon(49.7% 80.7%, 0% 91.6%, 49.6% 7.7%, 100% 92.3%)",
  },
  fan: {
    name: "fan",
    label: "Fan",
    clipPath: "polygon(100% 100%, 0% 100%, 0% 0%, 97.4% 2.3%)",
    borderRadius: "80% 0 0 0",
  },
  diamond: {
    name: "diamond",
    label: "Diamond",
    clipPath: "polygon(50% 100%, 11.4% 50%, 50% 0%, 88.6% 50%)",
  },
  clamshell: {
    name: "clamshell",
    label: "Clamshell",
    clipPath:
      "polygon(18.4% 82.8%, 0% 50%, 18.3% 17.2%, 81.6% 17.2%, 100% 50%, 81.7% 82.8%)",
  },
  pentagon: {
    name: "pentagon",
    label: "Pentagon",
    clipPath:
      "polygon(50% 3.8%, 100% 39.1%, 80.9% 96.2%, 19.1% 96.2%, 0% 39.1%)",
  },
  gem: {
    name: "gem",
    label: "Gem",
    clipPath:
      "polygon(50% 100%, 0.7% 77.4%, 8.3% 25.2%, 43.5% 0%, 56.8% 0%, 91.9% 25.4%, 99.3% 77.6%)",
  },
  "very-sunny": {
    name: "very-sunny",
    label: "Very sunny",
    clipPath:
      "polygon(50% 100%, 37.8% 79.6%, 14.6% 85.4%, 20.4% 62.3%, 0% 50%, 20.4% 37.8%, 14.6% 14.6%, 37.7% 20.4%, 50% 0%, 62.2% 20.4%, 85.4% 14.6%, 79.6% 37.7%, 100% 50%, 79.6% 62.2%, 85.4% 85.4%, 62.3% 79.6%)",
  },
  sunny: {
    name: "sunny",
    label: "Sunny",
    clipPath:
      "polygon(50% 0%, 65.3% 13%, 85.4% 14.6%, 87% 34.7%, 100% 50%, 87% 65.3%, 85.4% 85.4%, 65.3% 87%, 50% 100%, 34.7% 87%, 14.6% 85.4%, 13% 65.3%, 0% 50%, 13% 34.7%, 14.6% 14.6%, 34.7% 13%)",
  },
  "4-sided-cookie": {
    name: "4-sided-cookie",
    label: "4-sided cookie",
    clipPath:
      "polygon(100% 99.9%, 50% 78.4%, 0.1% 100%, 21.6% 50%, 0% 0.1%, 50% 21.6%, 99.9% 0%, 78.4% 50%)",
  },
  "6-sided-cookie": {
    name: "6-sided-cookie",
    label: "6-sided cookie",
    clipPath:
      "polygon(68.6% 82.1%, 50% 100%, 31.5% 82.1%, 6.7% 75%, 12.9% 50.1%, 6.7% 25%, 31.4% 17.9%, 50% 0%, 68.5% 17.9%, 93.3% 25%, 87.1% 49.9%, 93.3% 75%)",
  },
  "7-sided-cookie": {
    name: "7-sided-cookie",
    label: "7-sided cookie",
    clipPath:
      "polygon(1.3% 50%, 17.9% 33.3%, 20.6% 9.9%, 44% 12.5%, 64% 0%, 76.5% 19.9%, 98.7% 27.7%, 91% 50%, 98.7% 72.3%, 76.5% 80.1%, 64% 100%, 44% 87.5%, 20.6% 90.1%, 17.9% 66.7%)",
  },
  "9-sided-cookie": {
    name: "9-sided-cookie",
    label: "9-sided cookie",
    clipPath:
      "polygon(0.8% 50%, 13.4% 36.1%, 12.6% 17.4%, 31.2% 14.8%, 42.7% 0%, 58.6% 10%, 76.9% 6%, 82.6% 23.9%, 99.2% 32.6%, 92.1% 50%, 99.2% 67.4%, 82.6% 76.1%, 76.9% 94%, 58.6% 90%, 42.7% 100%, 31.2% 85.2%, 12.6% 82.6%, 13.4% 63.9%)",
  },
  "12-sided-cookie": {
    name: "12-sided-cookie",
    label: "12-sided cookie",
    clipPath:
      "polygon(0% 50%, 11.4% 39.6%, 6.7% 25%, 21.7% 21.7%, 25% 6.7%, 39.6% 11.4%, 50% 0%, 60.4% 11.4%, 75% 6.7%, 78.3% 21.7%, 93.3% 25%, 88.6% 39.6%, 100% 50%, 88.6% 60.4%, 93.3% 75%, 78.3% 78.3%, 75% 93.3%, 60.4% 88.6%, 50% 100%, 39.6% 88.6%, 25% 93.3%, 21.7% 78.3%, 6.7% 75%, 11.4% 60.4%)",
  },
  "4-leaf-clover": {
    name: "4-leaf-clover",
    label: "4-leaf clover",
    clipPath:
      "polygon(50% 14.4%, 68.8% 0%, 100% 31.2%, 85.6% 50%, 100% 68.8%, 68.8% 100%, 50% 85.6%, 31.2% 100%, 0% 68.8%, 14.4% 50%, 0% 31.2%, 31.2% 0%)",
  },
  "8-leaf-clover": {
    name: "8-leaf-clover",
    label: "8-leaf clover",
    clipPath:
      "polygon(50% 11.8%, 71.2% 0.5%, 77% 23%, 100% 30%, 88.2% 50%, 99.5% 71.2%, 77% 77%, 70% 100%, 50% 88.2%, 28.8% 99.5%, 23% 77%, 0% 70%, 11.8% 50%, 0.5% 28.8%, 23% 23%, 30% 0%)",
  },
  burst: {
    name: "burst",
    label: "Burst",
    clipPath:
      "polygon(50% 0%, 59.1% 16.2%, 75% 6.7%, 74.8% 25.3%, 93.3% 25%, 83.8% 41%, 100% 50%, 83.8% 59.1%, 93.3% 75%, 74.7% 74.8%, 75% 93.3%, 59% 83.8%, 50% 100%, 40.9% 83.8%, 25% 93.3%, 25.2% 74.7%, 6.7% 75%, 16.2% 59%, 0% 50%, 16.2% 40.9%, 6.7% 25%, 25.3% 25.2%, 25% 6.7%, 41% 16.2%)",
  },
  "soft-burst": {
    name: "soft-burst",
    label: "Soft burst",
    clipPath:
      "polygon(22.1% 29.7%, 20.6% 9.6%, 39.3% 17.2%, 49.9% 0%, 60.6% 17.2%, 79.3% 9.5%, 77.9% 29.7%, 97.5% 34.5%, 84.5% 50%, 97.6% 65.4%, 77.9% 70.3%, 79.4% 90.4%, 60.7% 82.8%, 50.1% 100%, 39.4% 82.8%, 20.7% 90.5%, 22.1% 70.3%, 2.5% 65.5%, 15.5% 50%, 2.4% 34.6%)",
  },
  boom: {
    name: "boom",
    label: "Boom",
    clipPath:
      "polygon(46.1% 31.9%, 50% 0.3%, 54% 31.9%, 70.4% 4.6%, 61.2% 35.2%, 87.4% 16.9%, 66.5% 41.1%, 97.8% 35%, 68.9% 48.6%, 100% 55.8%, 68.1% 56.5%, 93.5% 75.7%, 64.1% 63.3%, 79.6% 91.2%, 57.7% 67.9%, 60.5% 99.7%, 50% 69.6%, 39.5% 99.7%, 42.2% 67.9%, 20.4% 91.2%, 35.8% 63.3%, 6.5% 75.7%, 31.9% 56.4%, 0% 55.8%, 31.1% 48.5%, 2.2% 35%, 33.5% 41%, 12.6% 16.9%, 38.8% 35.1%, 29.6% 4.6%)",
  },
  "soft-boom": {
    name: "soft-boom",
    label: "Soft boom",
    clipPath:
      "polygon(73.4% 45.4%, 84% 43.7%, 95.1% 44.9%, 100% 47.8%, 100% 52.4%, 95.1% 55.2%, 84% 56.4%, 73.4% 54.7%, 83.9% 57.2%, 93.6% 62.5%, 97% 67.1%, 95.3% 71.3%, 89.6% 72.1%, 79% 69%, 69.8% 63.3%, 78.5% 69.6%, 85.5% 78.3%, 86.9% 83.8%, 83.7% 87%, 78.2% 85.6%, 69.5% 78.6%, 63.2% 69.8%, 68.9% 79%, 72% 89.7%, 71.2% 95.3%, 67% 97.1%, 62.4% 93.6%, 57.1% 83.9%, 54.6% 73.4%, 56.3% 84%, 55.1% 95.1%, 52.2% 100%, 47.6% 100%, 44.8% 95.1%, 43.6% 84%, 45.3% 73.4%, 42.8% 83.9%, 37.5% 93.6%, 32.9% 97%, 28.7% 95.3%, 27.9% 89.6%, 31% 79%, 36.7% 69.8%, 30.4% 78.5%, 21.7% 85.5%, 16.2% 86.9%, 13% 83.7%, 14.4% 78.2%, 21.4% 69.5%, 30.2% 63.2%, 21% 68.9%, 10.3% 72%, 4.7% 71.2%, 2.9% 67%, 6.4% 62.4%, 16.1% 57.1%, 26.6% 54.6%, 16% 56.3%, 4.9% 55.1%, 0% 52.2%, 0% 47.6%, 4.9% 44.8%, 16% 43.6%, 26.6% 45.3%, 16.1% 42.8%, 6.4% 37.5%, 3% 32.9%, 4.7% 28.7%, 10.4% 27.9%, 21% 31%, 30.2% 36.7%, 21.5% 30.4%, 14.5% 21.7%, 13.1% 16.2%, 16.3% 13%, 21.8% 14.4%, 30.5% 21.4%, 36.8% 30.2%, 31.1% 21%, 28% 10.3%, 28.8% 4.7%, 33% 2.9%, 37.6% 6.4%, 42.9% 16.1%, 45.4% 26.6%, 43.7% 16%, 44.9% 4.9%, 47.8% 0%, 52.4% 0%, 55.2% 4.9%, 56.4% 16%, 54.7% 26.6%, 57.2% 16.1%, 62.5% 6.4%, 67.1% 3%, 71.3% 4.7%, 72.1% 10.4%, 69% 21%, 63.3% 30.2%, 69.6% 21.5%, 78.3% 14.5%, 83.8% 13.1%, 87% 16.3%, 85.6% 21.8%, 78.6% 30.5%, 69.8% 36.8%, 79% 31.1%, 89.7% 28%, 95.3% 28.8%, 97.1% 33%, 93.6% 37.6%, 83.9% 42.9%)",
  },
  flower: {
    name: "flower",
    label: "Flower",
    clipPath:
      "polygon(37% 18.6%, 41.6% 4.8%, 47.9% 0%, 52% 0%, 58.3% 4.8%, 63% 18.6%, 76% 12.1%, 83.9% 13.2%, 86.8% 16.1%, 87.9% 23.9%, 81.4% 37%, 95.2% 41.6%, 100% 47.9%, 100% 52%, 95.2% 58.3%, 81.4% 63%, 87.9% 76%, 86.8% 83.9%, 83.9% 86.8%, 76.1% 87.9%, 63% 81.4%, 58.4% 95.2%, 52.1% 100%, 48% 100%, 41.7% 95.2%, 37% 81.4%, 24% 87.9%, 16.1% 86.8%, 13.2% 83.9%, 12.1% 76.1%, 18.6% 63%, 4.8% 58.4%, 0% 52.1%, 0% 48%, 4.8% 41.7%, 18.6% 37%, 12.1% 24%, 13.2% 16.1%, 16.1% 13.2%, 23.9% 12.1%)",
  },
  puffy: {
    name: "puffy",
    label: "Puffy",
    clipPath:
      "polygon(50% 17%, 54.5% 10.2%, 66.9% 10.5%, 71.6% 18%, 72.1% 22.6%, 77.5% 13.3%, 91.2% 24.1%, 92.3% 34.4%, 87.9% 38.6%, 93.7% 38.5%, 100% 45.4%, 100% 54.6%, 93.7% 61.5%, 87.9% 61.4%, 92.3% 65.6%, 91.2% 75.9%, 77.5% 86.7%, 72.1% 77.4%, 71.6% 82%, 66.9% 89.5%, 54.5% 89.8%, 50% 83%, 45.5% 89.8%, 33.1% 89.5%, 28.4% 82%, 27.9% 77.4%, 22.5% 86.7%, 8.8% 75.9%, 7.7% 65.6%, 12.1% 61.4%, 6.3% 61.5%, 0% 54.6%, 0% 45.4%, 6.3% 38.5%, 12.1% 38.6%, 7.7% 34.4%, 8.8% 24.1%, 22.5% 13.3%, 27.9% 22.6%, 28.4% 18%, 33.1% 10.5%, 45.5% 10.2%)",
  },
  "puffy-diamond": {
    name: "puffy-diamond",
    label: "Puffy diamond",
    clipPath:
      "polygon(87% 13%, 81.8% 35.7%, 100% 33.2%, 100% 66.8%, 81.8% 64.3%, 87% 87%, 64.3% 81.8%, 66.8% 100%, 33.2% 100%, 35.7% 81.8%, 13% 87%, 18.2% 64.3%, 0% 66.8%, 0% 33.2%, 18.2% 35.7%, 13% 13%, 35.7% 18.2%, 33.2% 0%, 66.8% 0%, 64.3% 18.2%)",
  },
  "ghost-ish": {
    name: "ghost-ish",
    label: "Ghost-ish",
    clipPath:
      "polygon(50% 0%, 93.9% 0%, 93.9% 100%, 56.6% 79.5%, 43.4% 79.5%, 6.1% 100%, 6.1% 0%)",
  },
  "pixel-circle": {
    name: "pixel-circle",
    label: "Pixel circle",
    clipPath:
      "polygon(50% 0%, 70.4% 0%, 70.4% 6.5%, 84.3% 6.5%, 84.3% 14.8%, 92.6% 14.8%, 92.6% 29.6%, 100% 29.6%, 100% 70.4%, 92.6% 70.4%, 92.6% 85.2%, 84.3% 85.2%, 84.3% 93.5%, 70.4% 93.5%, 70.4% 100%, 50% 100%, 29.6% 100%, 29.6% 93.5%, 15.7% 93.5%, 15.7% 85.2%, 7.4% 85.2%, 7.4% 70.4%, 0% 70.4%, 0% 29.6%, 7.4% 29.6%, 7.4% 14.8%, 15.7% 14.8%, 15.7% 6.5%, 29.6% 6.5%, 29.6% 0%)",
  },
  "pixel-triangle": {
    name: "pixel-triangle",
    label: "Pixel triangle",
    clipPath:
      "polygon(11.1% 50%, 11.4% 0%, 28.8% 0%, 28.8% 8.7%, 42.2% 8.7%, 42.2% 17%, 56.1% 17%, 56.1% 26.5%, 67.5% 26.5%, 67.6% 34.4%, 79% 34.4%, 79% 43.9%, 88.9% 43.9%, 88.9% 56.1%, 79% 56.1%, 79% 65.6%, 67.6% 65.6%, 67.5% 73.5%, 56.1% 73.5%, 56.1% 83%, 42.2% 83%, 42.2% 91.3%, 28.8% 91.3%, 28.8% 100%, 11.4% 100%)",
  },
  bun: {
    name: "bun",
    label: "Bun",
    clipPath:
      "polygon(79.6% 50%, 85.3% 51.8%, 99.2% 63.1%, 96.8% 100%, 3.2% 100%, 0.8% 63.1%, 14.7% 51.8%, 20.4% 50%, 14.7% 48.2%, 0.8% 36.9%, 3.2% 0%, 96.8% 0%, 99.2% 36.9%, 85.3% 48.2%)",
  },
  heart: {
    name: "heart",
    label: "Heart",
    clipPath:
      "polygon(50% 34.8%, 75.9% 5.1%, 100% 35.5%, 50.1% 94.9%, 49.9% 94.9%, 0% 35.5%, 24.1% 5.1%)",
  },
};

// CamelCase and hyphenated aliases mapping
M3_EXPRESSIVE_CATALOG["verySunny"] = M3_EXPRESSIVE_CATALOG["very-sunny"];
M3_EXPRESSIVE_CATALOG["four-sided-cookie"] =
  M3_EXPRESSIVE_CATALOG["4-sided-cookie"];
M3_EXPRESSIVE_CATALOG["fourSidedCookie"] =
  M3_EXPRESSIVE_CATALOG["4-sided-cookie"];
M3_EXPRESSIVE_CATALOG["six-sided-cookie"] =
  M3_EXPRESSIVE_CATALOG["6-sided-cookie"];
M3_EXPRESSIVE_CATALOG["sixSidedCookie"] =
  M3_EXPRESSIVE_CATALOG["6-sided-cookie"];
M3_EXPRESSIVE_CATALOG["seven-sided-cookie"] =
  M3_EXPRESSIVE_CATALOG["7-sided-cookie"];
M3_EXPRESSIVE_CATALOG["sevenSidedCookie"] =
  M3_EXPRESSIVE_CATALOG["7-sided-cookie"];
M3_EXPRESSIVE_CATALOG["nine-sided-cookie"] =
  M3_EXPRESSIVE_CATALOG["9-sided-cookie"];
M3_EXPRESSIVE_CATALOG["nineSidedCookie"] =
  M3_EXPRESSIVE_CATALOG["9-sided-cookie"];
M3_EXPRESSIVE_CATALOG["twelve-sided-cookie"] =
  M3_EXPRESSIVE_CATALOG["12-sided-cookie"];
M3_EXPRESSIVE_CATALOG["twelveSidedCookie"] =
  M3_EXPRESSIVE_CATALOG["12-sided-cookie"];
M3_EXPRESSIVE_CATALOG["four-leaf-clover"] =
  M3_EXPRESSIVE_CATALOG["4-leaf-clover"];
M3_EXPRESSIVE_CATALOG["fourLeafClover"] =
  M3_EXPRESSIVE_CATALOG["4-leaf-clover"];
M3_EXPRESSIVE_CATALOG["eight-leaf-clover"] =
  M3_EXPRESSIVE_CATALOG["8-leaf-clover"];
M3_EXPRESSIVE_CATALOG["eightLeafClover"] =
  M3_EXPRESSIVE_CATALOG["8-leaf-clover"];
M3_EXPRESSIVE_CATALOG["softBurst"] = M3_EXPRESSIVE_CATALOG["soft-burst"];
M3_EXPRESSIVE_CATALOG["softBoom"] = M3_EXPRESSIVE_CATALOG["soft-boom"];
M3_EXPRESSIVE_CATALOG["puffyDiamond"] = M3_EXPRESSIVE_CATALOG["puffy-diamond"];
M3_EXPRESSIVE_CATALOG["ghostIsh"] = M3_EXPRESSIVE_CATALOG["ghost-ish"];
M3_EXPRESSIVE_CATALOG["pixelCircle"] = M3_EXPRESSIVE_CATALOG["pixel-circle"];
M3_EXPRESSIVE_CATALOG["pixelTriangle"] =
  M3_EXPRESSIVE_CATALOG["pixel-triangle"];

// Canonical 35 Expressive Shapes ordered matching Google Material Design 3 spec
export const ALL_35_M3_SHAPES: M3ExpressiveShapeName[] = [
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

export const M3_SCALE_RADIUS_MAP: Record<string, string> = {
  none: "0px",
  "extra-small": "4px",
  "extra-small-top": "4px 4px 0 0",
  small: "8px",
  medium: "12px",
  rounded: "12px",
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

export interface ResolvedShapeStyle {
  borderRadius: string;
  clipPath?: string;
}

export function resolveM3ShapeStyle(
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

  const expressiveDef = M3_EXPRESSIVE_CATALOG[shape];
  if (expressiveDef) {
    return {
      borderRadius: expressiveDef.borderRadius ?? "0px",
      clipPath: expressiveDef.clipPath,
    };
  }

  const scaleRad = M3_SCALE_RADIUS_MAP[shape];
  if (scaleRad) {
    return { borderRadius: scaleRad };
  }

  return { borderRadius: shape };
}
