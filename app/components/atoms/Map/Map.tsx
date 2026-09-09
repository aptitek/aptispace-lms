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

function useMapCenterSync(
  mapRef: RefObject<MapRef | null>,
  target: MapViewState,
) {
  const prevCenterRef = useRef<MapViewState>(target);

  useEffect(() => {
    const prev = prevCenterRef.current;
    if (
      prev.lon !== target.lon ||
      prev.lat !== target.lat ||
      prev.zoom !== target.zoom ||
      prev.pitch !== target.pitch ||
      prev.bearing !== target.bearing
    ) {
      prevCenterRef.current = target;
      try {
        mapRef.current?.flyTo({
          center: [target.lon, target.lat],
          zoom: target.zoom,
          pitch: target.pitch,
          bearing: target.bearing,
        });
      } catch {
        // Map might not be fully initialized yet
      }
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

function useResolvedMapStyle(
  mapStyle: MapProps["mapStyle"],
  resolvedMode: "dark" | "light",
  tileProviderKey?: string,
  providerUrl?: string,
) {
  return useMemo(() => {
    if (mapStyle) {
      return mapStyle;
    }
    return getSolarizedMapStyle(resolvedMode, {
      apiKey: tileProviderKey,
      providerUrl,
    });
  }, [mapStyle, resolvedMode, tileProviderKey, providerUrl]);
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
  useImperativeHandle(ref, () => mapRef.current as MapRef, []);
  useWorkerUrl(workerUrl);

  const theme = useTheme();
  const palette = theme
    ? (theme as unknown as { palette?: { mode?: string } }).palette
    : undefined;
  const paletteMode = palette?.mode;

  const { baseMode } = useThemeMode();
  const resolvedMode: "dark" | "light" =
    themeMode ??
    (paletteMode === "light" || paletteMode === "dark"
      ? paletteMode
      : (baseMode ?? "light"));

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

  const resolvedMapStyle = useResolvedMapStyle(
    mapStyle,
    resolvedMode,
    tileProviderKey,
    providerUrl,
  );

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
          pitch,
          bearing,
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
