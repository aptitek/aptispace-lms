import type { StyleSpecification } from "maplibre-gl";
import solarizedDarkJson from "./styles/solarized-dark.style.json";
import solarizedLightJson from "./styles/solarized-light.style.json";

export const SOLARIZED_DARK_MAP_STYLE =
  solarizedDarkJson as unknown as StyleSpecification;
export const SOLARIZED_LIGHT_MAP_STYLE =
  solarizedLightJson as unknown as StyleSpecification;

export interface GetSolarizedMapStyleOptions {
  apiKey?: string;
  providerUrl?: string;
  enable3dBuildings?: boolean;
}

function shouldReturnBaseStyle(options?: GetSolarizedMapStyleOptions): boolean {
  if (!options) {
    return true;
  }
  return (
    !options.apiKey &&
    !options.providerUrl &&
    options.enable3dBuildings !== false
  );
}

function applyCustomSource(
  style: StyleSpecification,
  options: GetSolarizedMapStyleOptions,
) {
  if (options.providerUrl) {
    style.sources = {
      ...style.sources,
      openmaptiles: {
        type: "vector",
        url: options.providerUrl,
      },
    };
  } else if (options.apiKey) {
    style.sources = {
      ...style.sources,
      openmaptiles: {
        type: "vector",
        url: `https://api.maptiler.com/tiles/v3/tiles.json?key=${options.apiKey}`,
      },
    };
  }
}

function applyLayerFilters(
  style: StyleSpecification,
  options: GetSolarizedMapStyleOptions,
) {
  if (options.enable3dBuildings === false) {
    style.layers = style.layers.filter((layer) => layer.id !== "building-3d");
  }
}

/**
 * Returns a Solarized MapLibre GL style object based on current theme mode ("dark" | "light")
 * and optional custom vector tile provider or MapTiler API key.
 */
export function getSolarizedMapStyle(
  mode: "light" | "dark" = "dark",
  options?: GetSolarizedMapStyleOptions,
): StyleSpecification {
  const base =
    mode === "dark" ? SOLARIZED_DARK_MAP_STYLE : SOLARIZED_LIGHT_MAP_STYLE;

  if (shouldReturnBaseStyle(options)) {
    return base;
  }

  const customStyle: StyleSpecification = JSON.parse(JSON.stringify(base));
  if (options) {
    applyLayerFilters(customStyle, options);
    applyCustomSource(customStyle, options);
  }

  return customStyle;
}
