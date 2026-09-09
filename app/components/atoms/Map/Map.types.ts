import type { ReactNode, CSSProperties } from "react";
import type {
  StyleSpecification,
  AttributionControlOptions,
} from "maplibre-gl";
import type { MapRef, ErrorEvent, MapEvent } from "react-map-gl/maplibre";
import type { MapPinProps } from "./MapPin";
import type { GetSolarizedMapStyleOptions } from "./Map.mapStyle";

export type {
  MapRef,
  MapPinProps,
  GetSolarizedMapStyleOptions,
  AttributionControlOptions,
  ErrorEvent,
  MapEvent,
};

export interface MapCoordinates {
  lat: number;
  lon: number;
}

export interface MapProps {
  /**
   * Geographic coordinates object containing lat and lon.
   * If provided, takes precedence over separate latitude/longitude props.
   */
  coordinates?: MapCoordinates;

  /**
   * Latitude in decimal degrees (default: 48.7118 - Paris-Saclay).
   */
  latitude?: number;

  /**
   * Longitude in decimal degrees (default: 2.1698 - Paris-Saclay).
   */
  longitude?: number;

  /**
   * Initial or viewport zoom level (default: 14.5).
   */
  zoom?: number;

  /**
   * Camera pitch angle in degrees (0 = nadir/top-down, up to 85) for 3D oblique tilt (default: 55).
   */
  pitch?: number;

  /**
   * Camera bearing (rotation) in degrees clockwise from true north for 3D perspective angle (default: -25).
   */
  bearing?: number;

  /**
   * Maximum pitch allowed for camera tilt (default: 85).
   */
  maxPitch?: number;

  /**
   * Initial camera pitch in degrees when map mounts (defaults to pitch).
   */
  initialPitch?: number;

  /**
   * Initial camera bearing in degrees when map mounts (defaults to bearing).
   */
  initialBearing?: number;

  /**
   * Whether to render 3D building extrusions in the vector tile style (default: true).
   */
  enable3dBuildings?: boolean;

  /**
   * Custom style specification object or remote JSON URL (e.g. MapTiler, Stadia, Protomaps, OpenFreeMap).
   * If omitted, defaults to the built-in Solarized vector style (auto-switching light/dark).
   */
  mapStyle?: string | StyleSpecification | object;

  /**
   * Custom MapTiler or tile provider API key.
   */
  tileProviderKey?: string;

  /**
   * Custom vector tile TileJSON endpoint URL (e.g. Protomaps or self-hosted tile server).
   */
  providerUrl?: string;

  /**
   * Theme mode override ("light" | "dark").
   * Defaults to the application theme resolved by `useThemeMode()`.
   */
  themeMode?: "light" | "dark";

  /**
   * Whether to render the location marker pin at the center coordinates (default: true).
   */
  showPin?: boolean;

  /**
   * Text label badge displayed above the marker pin (e.g. campus name or room).
   */
  pinLabel?: string;

  /**
   * Hex or CSS color for the pin and radar pulse (default: Solarized green `var(--color-solarized-green, #859900)`).
   */
  pinColor?: string;

  /**
   * Accessibility label for the marker pin.
   */
  pinAriaLabel?: string;

  /**
   * Whether the user can pan, zoom, or interact with the map (default: true).
   */
  interactive?: boolean;

  /**
   * Whether to display MapLibre default attribution controls (default: false).
   */
  attributionControl?: boolean | AttributionControlOptions;

  /**
   * Container width (e.g. "100%", 320, "380px"). Default: "100%".
   */
  width?: string | number;

  /**
   * Container height (e.g. "100%", 220, "240px"). Default: "100%".
   */
  height?: string | number;

  /**
   * Container border radius (e.g. "16px", 12). Default: "12px".
   */
  borderRadius?: string | number;

  /**
   * Container border (e.g. "1px solid rgba(0, 43, 54, 0.12)").
   */
  border?: string;

  /**
   * Container box shadow (e.g. "0 8px 24px rgba(0, 43, 54, 0.12)").
   */
  boxShadow?: string;

  /**
   * Container aspect ratio (e.g. "16 / 9", "4 / 3").
   */
  aspectRatio?: string | number;

  /**
   * Custom web worker script URL. Defaults to "/maplibre-gl-worker.mjs".
   */
  workerUrl?: string;

  /**
   * Additional React children rendered inside the Map (e.g. custom Markers, Popups, Controls).
   */
  children?: ReactNode;

  /**
   * Callback fired when map completes initial load.
   */
  onLoad?: (event: MapEvent<unknown>) => void;

  /**
   * Callback fired when map encounters an error (network, WebGL, tile error).
   */
  onError?: (event: ErrorEvent) => void;

  /**
   * Click handler for the map viewport.
   */
  onClick?: (event: unknown) => void;

  /**
   * Optional CSS class name for the wrapper element.
   */
  className?: string;

  /**
   * Inline CSS properties for the wrapper element.
   */
  style?: CSSProperties;

  /**
   * Whether to preserve WebGL drawing buffer for canvas screenshots (default: true).
   */
  preserveDrawingBuffer?: boolean;

  /**
   * Whether the map is currently in a loading state. When true, renders MapSkeleton.
   */
  isLoading?: boolean;

  /**
   * Custom fallback React node rendered if WebGL is unavailable or fails.
   * If omitted, renders the built-in MapFallback component.
   */
  fallback?: ReactNode;

  /**
   * Forces the map into 2D fallback mode, skipping WebGL initialization.
   */
  disableWebGL?: boolean;

  /**
   * Test identifier for unit and e2e testing.
   */
  "data-testid"?: string;
}
