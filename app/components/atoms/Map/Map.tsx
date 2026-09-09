import React, {
  forwardRef,
  useRef,
  useImperativeHandle,
  useMemo,
  useEffect,
  type CSSProperties,
  type RefObject,
} from "react";
import * as maplibregl from "maplibre-gl";
import ReactMapGLMap, {
  Marker,
  type MapRef,
  type MapEvent,
} from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { useTheme } from "@mui/material/styles";

import { useThemeMode } from "~/utils/themeContext";
import type { MapProps, MapCoordinates } from "./Map.types";
import { StyledMapRoot } from "./Map.styles";
import { getSolarizedMapStyle } from "./Map.mapStyle";
import { MapPin } from "./MapPin";

// Configure default workerUrl for MapLibre in Vite and production builds
if (typeof window !== "undefined") {
  maplibregl.setWorkerUrl("/maplibre-gl-worker.mjs");
}

export const DEFAULT_MAP_COORDINATES: MapCoordinates = {
  lat: 48.7118,
  lon: 2.1698,
};

export const DEFAULT_MAP_ZOOM = 14.5;
export const DEFAULT_MAP_PITCH = 55;
export const DEFAULT_MAP_BEARING = -25;
export const DEFAULT_MAP_MAX_PITCH = 85;

const MAP_CANVAS_STYLE: CSSProperties = {
  width: "100%",
  height: "100%",
};

function resolveCoordinates(
  coordinates?: MapCoordinates,
  latitude?: number,
  longitude?: number,
): { lon: number; lat: number } {
  return {
    lon: coordinates?.lon ?? longitude ?? DEFAULT_MAP_COORDINATES.lon,
    lat: coordinates?.lat ?? latitude ?? DEFAULT_MAP_COORDINATES.lat,
  };
}

function useWorkerUrl(workerUrl?: string) {
  useEffect(() => {
    if (typeof window !== "undefined" && workerUrl) {
      maplibregl.setWorkerUrl(workerUrl);
    }
  }, [workerUrl]);
}

interface MapViewState {
  lon: number;
  lat: number;
  zoom: number;
  pitch: number;
  bearing: number;
}

function hasCoordsChanged(prev: MapViewState, next: MapViewState) {
  return (
    prev.lon !== next.lon || prev.lat !== next.lat || prev.zoom !== next.zoom
  );
}

function syncMapCamera(
  mapRef: RefObject<MapRef | null>,
  target: MapViewState,
  coordsChanged: boolean,
) {
  try {
    if (!coordsChanged) {
      mapRef.current?.easeTo({
        pitch: target.pitch,
        bearing: target.bearing,
        duration: 1600,
      });
    } else {
      mapRef.current?.flyTo({
        center: [target.lon, target.lat],
        zoom: target.zoom,
        pitch: target.pitch,
        bearing: target.bearing,
      });
    }
  } catch {
    // Map might not be fully initialized yet
  }
}

function useMapCenterSync(
  mapRef: RefObject<MapRef | null>,
  target: MapViewState,
) {
  const prevCenterRef = useRef<MapViewState>(target);

  useEffect(() => {
    const prev = prevCenterRef.current;
    const coordsChanged = hasCoordsChanged(prev, target);
    const anglesChanged =
      prev.pitch !== target.pitch || prev.bearing !== target.bearing;

    if (coordsChanged || anglesChanged) {
      prevCenterRef.current = target;
      syncMapCamera(mapRef, target, coordsChanged);
    }
  }, [target, mapRef]);
}

function toggleInteractivity(map: maplibregl.Map, enable: boolean) {
  const method = enable ? "enable" : "disable";
  const handlers = [
    map.dragPan,
    map.scrollZoom,
    map.doubleClickZoom,
    map.boxZoom,
  ];
  for (const handler of handlers) {
    if (handler && typeof handler[method] === "function") {
      handler[method]();
    }
  }
}

function useMapInteractivity(
  mapRef: RefObject<MapRef | null>,
  interactive: boolean,
) {
  useEffect(() => {
    if (typeof mapRef.current?.getMap === "function") {
      const map = mapRef.current.getMap();
      if (map) {
        toggleInteractivity(map, interactive);
      }
    }
  }, [interactive, mapRef]);
}

function resolveAttribution(
  attributionControl: MapProps["attributionControl"],
) {
  if (typeof attributionControl === "boolean") {
    return attributionControl ? undefined : false;
  }
  return attributionControl;
}

interface ResolvedStyleOpts {
  tileProviderKey?: string;
  providerUrl?: string;
  enable3dBuildings?: boolean;
}

function useResolvedMapStyle(
  mapStyle: MapProps["mapStyle"],
  resolvedMode: "dark" | "light",
  options?: ResolvedStyleOpts,
) {
  return useMemo(() => {
    if (mapStyle) {
      return mapStyle;
    }
    return getSolarizedMapStyle(resolvedMode, {
      apiKey: options?.tileProviderKey,
      providerUrl: options?.providerUrl,
      enable3dBuildings: options?.enable3dBuildings,
    });
  }, [
    mapStyle,
    resolvedMode,
    options?.tileProviderKey,
    options?.providerUrl,
    options?.enable3dBuildings,
  ]);
}

function tryResizeMap(target?: { resize?: () => void }) {
  try {
    target?.resize?.();
  } catch {
    // ignore
  }
}

function normalizeCameraProps(props: MapProps) {
  return {
    zoom: props.zoom ?? DEFAULT_MAP_ZOOM,
    pitch: props.pitch ?? DEFAULT_MAP_PITCH,
    bearing: props.bearing ?? DEFAULT_MAP_BEARING,
    maxPitch: props.maxPitch ?? DEFAULT_MAP_MAX_PITCH,
  };
}

function normalizeLayoutProps(props: MapProps) {
  return {
    showPin: props.showPin ?? true,
    interactive: props.interactive ?? true,
    attributionControl: props.attributionControl ?? false,
    width: props.width ?? "100%",
    height: props.height ?? "100%",
    dataTestId: props["data-testid"] ?? "atomic-map-root",
  };
}

function resolveThemeMode(
  themeMode?: "dark" | "light",
  theme?: unknown,
  baseMode?: "dark" | "light",
): "dark" | "light" {
  if (themeMode) {
    return themeMode;
  }
  const palette = theme
    ? (theme as { palette?: { mode?: string } }).palette
    : undefined;
  const paletteMode = palette?.mode;
  if (paletteMode === "light" || paletteMode === "dark") {
    return paletteMode;
  }
  return baseMode ?? "light";
}

export const AtomicMap = forwardRef<MapRef, MapProps>((props, ref) => {
  const {
    coordinates,
    latitude,
    longitude,
    mapStyle,
    tileProviderKey,
    providerUrl,
    themeMode,
    pinLabel,
    pinColor,
    pinAriaLabel,
    borderRadius,
    border,
    boxShadow,
    aspectRatio,
    workerUrl,
    children,
    onLoad,
    onError,
    onClick,
    className,
    style,
    initialPitch,
    initialBearing,
    enable3dBuildings,
    preserveDrawingBuffer = true,
  } = props;

  const { zoom, pitch, bearing, maxPitch } = normalizeCameraProps(props);
  const {
    showPin,
    interactive,
    attributionControl,
    width,
    height,
    dataTestId,
  } = normalizeLayoutProps(props);

  const mapRef = useRef<MapRef | null>(null);
  useImperativeHandle(
    ref,
    () =>
      new Proxy({} as MapRef, {
        get: (_target, prop) => {
          if (!mapRef.current) return undefined;
          const propertyValue = (
            mapRef.current as unknown as Record<string, unknown>
          )[prop as string];
          if (typeof propertyValue === "function") {
            return (propertyValue as (...args: unknown[]) => unknown).bind(
              mapRef.current,
            );
          }
          return propertyValue;
        },
      }),
    [],
  );
  useWorkerUrl(workerUrl);

  const theme = useTheme();
  const { baseMode } = useThemeMode();
  const resolvedMode = resolveThemeMode(themeMode, theme, baseMode);

  const { lon: resolvedLon, lat: resolvedLat } = resolveCoordinates(
    coordinates,
    latitude,
    longitude,
  );

  useMapCenterSync(mapRef, {
    lon: resolvedLon,
    lat: resolvedLat,
    zoom,
    pitch,
    bearing,
  });
  useMapInteractivity(mapRef, interactive);

  const resolvedMapStyle = useResolvedMapStyle(mapStyle, resolvedMode, {
    tileProviderKey,
    providerUrl,
    enable3dBuildings,
  });

  const handleMapLoad = (e: MapEvent<unknown>) => {
    tryResizeMap(e.target as { resize?: () => void });
    onLoad?.(e);
  };

  const containerStyle = useMemo<CSSProperties>(
    () => ({
      width,
      height,
      borderRadius,
      border,
      boxShadow,
      aspectRatio,
      ...style,
    }),
    [width, height, borderRadius, border, boxShadow, aspectRatio, style],
  );

  return (
    <StyledMapRoot
      $width={width}
      $height={height}
      $borderRadius={borderRadius}
      $border={border}
      $boxShadow={boxShadow}
      $aspectRatio={aspectRatio}
      className={className}
      style={containerStyle}
      data-testid={dataTestId}
      onClick={onClick}
    >
      <ReactMapGLMap
        ref={mapRef}
        mapLib={maplibregl}
        initialViewState={{
          longitude: resolvedLon,
          latitude: resolvedLat,
          zoom,
          pitch: initialPitch ?? pitch,
          bearing: initialBearing ?? bearing,
        }}
        maxPitch={maxPitch}
        mapStyle={resolvedMapStyle as unknown as maplibregl.StyleSpecification}
        interactive={interactive}
        dragPan={interactive}
        scrollZoom={interactive}
        doubleClickZoom={interactive}
        dragRotate={interactive}
        pitchWithRotate={interactive}
        attributionControl={resolveAttribution(attributionControl)}
        canvasContextAttributes={
          preserveDrawingBuffer
            ? { preserveDrawingBuffer: true, antialias: true }
            : undefined
        }
        styleDiffing={false}
        style={MAP_CANVAS_STYLE}
        onLoad={handleMapLoad}
        onError={onError}
        data-testid="maplibre-gl-map"
      >
        {showPin && (
          <Marker
            longitude={resolvedLon}
            latitude={resolvedLat}
            anchor="bottom"
            data-testid="maplibre-marker"
          >
            <MapPin
              label={pinLabel}
              color={pinColor ?? "var(--color-solarized-green, #859900)"}
              ariaLabel={pinAriaLabel}
            />
          </Marker>
        )}
        {children}
      </ReactMapGLMap>
    </StyledMapRoot>
  );
});

AtomicMap.displayName = "Map";

export { AtomicMap as Map, AtomicMap as default };
