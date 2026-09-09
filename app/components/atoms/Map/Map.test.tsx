import type * as ReactType from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Button from "@mui/material/Button";

import {
  Map,
  MapPin,
  DEFAULT_MAP_COORDINATES,
  DEFAULT_MAP_ZOOM,
  DEFAULT_MAP_PITCH,
  DEFAULT_MAP_BEARING,
  getSolarizedMapStyle,
  SOLARIZED_DARK_MAP_STYLE,
  SOLARIZED_LIGHT_MAP_STYLE,
  type MapRef,
} from "./index";

interface MockMapProps {
  children?: ReactType.ReactNode;
  initialViewState?: {
    latitude?: number;
    longitude?: number;
    zoom?: number;
    pitch?: number;
    bearing?: number;
  };
  mapStyle?: unknown;
  interactive?: boolean;
  onLoad?: (e: { target: { resize: () => void } }) => void;
  onError?: (e: { error: Error }) => void;
}

interface MockMarkerProps {
  children?: ReactType.ReactNode;
  longitude?: number;
  latitude?: number;
}

const mockZoomIn = vi.fn();
const mockZoomOut = vi.fn();
const mockFlyTo = vi.fn();
const mockResize = vi.fn();

vi.mock("react-map-gl/maplibre", async () => {
  const actualReact = await vi.importActual<typeof ReactType>("react");
  const MockMap = actualReact.forwardRef<
    {
      zoomIn: () => void;
      zoomOut: () => void;
      flyTo: () => void;
      resize: () => void;
      getMap: () => unknown;
    },
    MockMapProps
  >(
    (
      { children, initialViewState, mapStyle, interactive, onLoad, onError },
      ref,
    ) => {
      actualReact.useImperativeHandle(ref, () => ({
        zoomIn: mockZoomIn,
        zoomOut: mockZoomOut,
        flyTo: mockFlyTo,
        resize: mockResize,
        getMap: () => ({
          dragPan: { enable: vi.fn(), disable: vi.fn() },
          scrollZoom: { enable: vi.fn(), disable: vi.fn() },
          doubleClickZoom: { enable: vi.fn(), disable: vi.fn() },
          boxZoom: { enable: vi.fn(), disable: vi.fn() },
        }),
      }));

      actualReact.useEffect(() => {
        onLoad?.({ target: { resize: mockResize } });
      }, [onLoad]);

      return (
        <div
          data-testid="maplibre-gl-map"
          data-lat={initialViewState?.latitude}
          data-lon={initialViewState?.longitude}
          data-zoom={initialViewState?.zoom}
          data-pitch={initialViewState?.pitch}
          data-bearing={initialViewState?.bearing}
          data-interactive={String(interactive)}
          data-style={
            typeof mapStyle === "string"
              ? mapStyle
              : (mapStyle as { name?: string })?.name
          }
        >
          {children}
          <Button
            data-testid="trigger-error"
            onClick={() =>
              onError?.({ error: new Error("Simulated tile error") })
            }
          >
            Trigger Error
          </Button>
        </div>
      );
    },
  );
  MockMap.displayName = "MockMap";

  const MockMarker = ({ children, longitude, latitude }: MockMarkerProps) => (
    <div data-testid="maplibre-marker" data-lat={latitude} data-lon={longitude}>
      {children}
    </div>
  );

  return {
    default: MockMap,
    Marker: MockMarker,
  };
});

const lightTheme = createTheme({ palette: { mode: "light" } });
const darkTheme = createTheme({ palette: { mode: "dark" } });

describe("Atomic Map Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  describe("Rendering & Defaults", () => {
    it("renders with default Paris-Saclay coordinates, lower zoom 14.5, and 3D ortho angle", () => {
      render(
        <ThemeProvider theme={lightTheme}>
          <Map />
        </ThemeProvider>,
      );

      const root = screen.getByTestId("atomic-map-root");
      expect(root).toBeDefined();

      const map = screen.getByTestId("maplibre-gl-map");
      expect(map.getAttribute("data-lat")).toBe(
        String(DEFAULT_MAP_COORDINATES.lat),
      );
      expect(map.getAttribute("data-lon")).toBe(
        String(DEFAULT_MAP_COORDINATES.lon),
      );
      expect(map.getAttribute("data-zoom")).toBe(String(DEFAULT_MAP_ZOOM));
      expect(map.getAttribute("data-pitch")).toBe(String(DEFAULT_MAP_PITCH));
      expect(map.getAttribute("data-bearing")).toBe(
        String(DEFAULT_MAP_BEARING),
      );
    });

    it("renders with custom coordinates via coordinates prop", () => {
      render(
        <ThemeProvider theme={lightTheme}>
          <Map coordinates={{ lat: 48.8566, lon: 2.3522 }} zoom={14} />
        </ThemeProvider>,
      );

      const map = screen.getByTestId("maplibre-gl-map");
      expect(map.getAttribute("data-lat")).toBe("48.8566");
      expect(map.getAttribute("data-lon")).toBe("2.3522");
      expect(map.getAttribute("data-zoom")).toBe("14");
    });

    it("renders with separate latitude and longitude props", () => {
      render(
        <ThemeProvider theme={lightTheme}>
          <Map latitude={48.8472} longitude={2.3563} zoom={15} />
        </ThemeProvider>,
      );

      const map = screen.getByTestId("maplibre-gl-map");
      expect(map.getAttribute("data-lat")).toBe("48.8472");
      expect(map.getAttribute("data-lon")).toBe("2.3563");
      expect(map.getAttribute("data-zoom")).toBe("15");
    });

    it("applies custom dimensions, borders, and shadows to container", () => {
      render(
        <ThemeProvider theme={lightTheme}>
          <Map
            width={400}
            height={250}
            borderRadius="16px"
            border="1px solid #ccc"
            boxShadow="0 4px 12px rgba(0,0,0,0.1)"
          />
        </ThemeProvider>,
      );

      const root = screen.getByTestId("atomic-map-root");
      expect(root.style.width).toBe("400px");
      expect(root.style.height).toBe("250px");
      expect(root.style.borderRadius).toBe("16px");
    });
  });

  describe("Theme Mode & Styles", () => {
    it("automatically uses Solarized Light style when theme is light", () => {
      render(
        <ThemeProvider theme={lightTheme}>
          <Map />
        </ThemeProvider>,
      );

      const map = screen.getByTestId("maplibre-gl-map");
      expect(map.getAttribute("data-style")).toBe("Solarized Light");
    });

    it("automatically uses Solarized Dark style when theme is dark", () => {
      render(
        <ThemeProvider theme={darkTheme}>
          <Map />
        </ThemeProvider>,
      );

      const map = screen.getByTestId("maplibre-gl-map");
      expect(map.getAttribute("data-style")).toBe("Solarized Dark");
    });

    it("respects explicit themeMode prop override", () => {
      render(
        <ThemeProvider theme={lightTheme}>
          <Map themeMode="dark" />
        </ThemeProvider>,
      );

      const map = screen.getByTestId("maplibre-gl-map");
      expect(map.getAttribute("data-style")).toBe("Solarized Dark");
    });

    it("supports custom remote style URL string", () => {
      const customUrl = "https://tiles.openfreemap.org/styles/positron";
      render(
        <ThemeProvider theme={lightTheme}>
          <Map mapStyle={customUrl} />
        </ThemeProvider>,
      );

      const map = screen.getByTestId("maplibre-gl-map");
      expect(map.getAttribute("data-style")).toBe(customUrl);
    });
  });

  describe("Marker Pin", () => {
    it("renders default marker pin with campus label", () => {
      render(
        <ThemeProvider theme={lightTheme}>
          <Map pinLabel="Campus Condorcet" />
        </ThemeProvider>,
      );

      const marker = screen.getByTestId("maplibre-marker");
      expect(marker).toBeDefined();
      expect(screen.getByTestId("map-pin-container")).toBeDefined();
      expect(screen.getByTestId("map-pin-label").textContent).toBe(
        "Campus Condorcet",
      );
    });

    it("hides marker pin when showPin is false", () => {
      render(
        <ThemeProvider theme={lightTheme}>
          <Map showPin={false} />
        </ThemeProvider>,
      );

      expect(screen.queryByTestId("maplibre-marker")).toBeNull();
      expect(screen.queryByTestId("map-pin-container")).toBeNull();
    });

    it("renders custom children (e.g. supplementary marker or overlay)", () => {
      render(
        <ThemeProvider theme={lightTheme}>
          <Map>
            <div data-testid="custom-marker-child">Custom Point</div>
          </Map>
        </ThemeProvider>,
      );

      expect(screen.getByTestId("custom-marker-child").textContent).toBe(
        "Custom Point",
      );
    });
  });

  describe("Interactivity & Ref", () => {
    it("forwards ref and exposes imperative map controls", () => {
      const ref = { current: null as unknown as MapRef };
      render(
        <ThemeProvider theme={lightTheme}>
          <Map ref={ref as unknown as React.RefObject<MapRef>} />
        </ThemeProvider>,
      );

      expect(ref.current).toBeDefined();
      ref.current.zoomIn();
      expect(mockZoomIn).toHaveBeenCalled();
      ref.current.zoomOut();
      expect(mockZoomOut).toHaveBeenCalled();
      ref.current.flyTo({ center: [2.1698, 48.7118], zoom: 17 });
      expect(mockFlyTo).toHaveBeenCalledWith({
        center: [2.1698, 48.7118],
        zoom: 17,
      });
    });

    it("supports non-interactive mode", () => {
      render(
        <ThemeProvider theme={lightTheme}>
          <Map interactive={false} />
        </ThemeProvider>,
      );

      const map = screen.getByTestId("maplibre-gl-map");
      expect(map.getAttribute("data-interactive")).toBe("false");
    });

    it("calls onLoad and onError callbacks", () => {
      const onLoad = vi.fn();
      const onError = vi.fn();

      render(
        <ThemeProvider theme={lightTheme}>
          <Map onLoad={onLoad} onError={onError} />
        </ThemeProvider>,
      );

      expect(onLoad).toHaveBeenCalled();

      fireEvent.click(screen.getByTestId("trigger-error"));
      expect(onError).toHaveBeenCalled();
    });
  });

  describe("Standalone MapPin atom", () => {
    it("renders MapPin with custom label and color", () => {
      render(
        <ThemeProvider theme={lightTheme}>
          <MapPin
            label="Amphithéâtre Turing"
            color="#2aa198"
            ariaLabel="Point A"
          />
        </ThemeProvider>,
      );

      const pin = screen.getByTestId("map-pin-container");
      expect(pin.getAttribute("aria-label")).toBe("Point A");
      expect(screen.getByTestId("map-pin-label").textContent).toBe(
        "Amphithéâtre Turing",
      );
      expect(screen.getByTestId("map-pin-svg")).toBeDefined();
    });
  });

  describe("Solarized Map Style Utilities", () => {
    it("returns solarized dark and light style specifications", () => {
      expect(SOLARIZED_DARK_MAP_STYLE.version).toBe(8);
      expect(SOLARIZED_LIGHT_MAP_STYLE.version).toBe(8);

      const dark = getSolarizedMapStyle("dark");
      expect(dark.name).toBe("Solarized Dark");

      const light = getSolarizedMapStyle("light");
      expect(light.name).toBe("Solarized Light");
    });

    it("supports tileProviderKey and providerUrl overrides", () => {
      const customKeyStyle = getSolarizedMapStyle("dark", {
        apiKey: "key-xyz",
      });
      const sourceKey = customKeyStyle.sources.openmaptiles as { url?: string };
      expect(sourceKey.url).toContain("key=key-xyz");

      const customUrlStyle = getSolarizedMapStyle("light", {
        providerUrl: "https://custom-tiles.org/tiles.json",
      });
      const sourceUrl = customUrlStyle.sources.openmaptiles as { url?: string };
      expect(sourceUrl.url).toBe("https://custom-tiles.org/tiles.json");
    });
  });
});
