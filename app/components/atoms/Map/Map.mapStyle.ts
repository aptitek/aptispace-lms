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

  if (!options?.apiKey && !options?.providerUrl) {
    return base;
  }

  // Clone to avoid mutating static imports
  const customStyle: StyleSpecification = JSON.parse(JSON.stringify(base));

  if (options.providerUrl) {
    customStyle.sources = {
      ...customStyle.sources,
      openmaptiles: {
        type: "vector",
        url: options.providerUrl,
      },
    };
  } else if (options.apiKey) {
    // MapTiler standard vector tile TileJSON endpoint
    customStyle.sources = {
      ...customStyle.sources,
      openmaptiles: {
        type: "vector",
        url: `https://api.maptiler.com/tiles/v3/tiles.json?key=${options.apiKey}`,
      },
    };
  }

  return customStyle;
}
