import type * as ReactType from "react";
import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  beforeAll,
  afterEach,
} from "vitest";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  cleanup,
} from "@testing-library/react";
import { ThemeProvider, createTheme } from "@mui/material/styles";

import MapCard, {
  parseRoomCode,
  buildOsmEmbedUrl,
  buildOsmViewUrl,
  buildDirectionsUrl,
  formatCoordinatesDMS,
  cleanCampusName,
  cleanBuildingName,
  getSolarizedMapStyle,
  SOLARIZED_DARK_MAP_STYLE,
  SOLARIZED_LIGHT_MAP_STYLE,
} from "./index";
import "~/i18n";

const theme = createTheme();

interface MockMapProps {
  children?: ReactType.ReactNode;
  initialViewState?: { latitude?: number; longitude?: number; zoom?: number };
}

interface MockMarkerProps {
  children?: ReactType.ReactNode;
  longitude?: number;
  latitude?: number;
}

vi.mock("react-map-gl/maplibre", async () => {
  const actualReact = await vi.importActual<typeof ReactType>("react");
  const MockMap = actualReact.forwardRef<
    { zoomIn: () => void; zoomOut: () => void; flyTo: () => void },
    MockMapProps
  >(({ children, initialViewState }, ref) => {
    actualReact.useImperativeHandle(ref, () => ({
      zoomIn: vi.fn(),
      zoomOut: vi.fn(),
      flyTo: vi.fn(),
      resize: vi.fn(),
      getMap: () => ({
        dragPan: { enable: vi.fn(), disable: vi.fn() },
        scrollZoom: { enable: vi.fn(), disable: vi.fn() },
        doubleClickZoom: { enable: vi.fn(), disable: vi.fn() },
        boxZoom: { enable: vi.fn(), disable: vi.fn() },
      }),
    }));
    return (
      <div
        data-testid="maplibre-gl-map"
        data-lat={initialViewState?.latitude}
        data-lon={initialViewState?.longitude}
        data-zoom={initialViewState?.zoom}
      >
        {children}
      </div>
    );
  });
  MockMap.displayName = "MockMap";

  const MockMarker = ({ children, longitude, latitude }: MockMarkerProps) => (
    <div data-testid="maplibre-marker" data-lat={latitude} data-lon={longitude}>
      {children}
    </div>
  );

  return {
    default: MockMap,
    Marker: MockMarker,
    NavigationControl: () => <div data-testid="maplibre-nav-control" />,
  };
});

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);
}

describe("MapCard Organism", () => {
  const defaultAddress = "Rue Noetzlin, 91190 Gif-sur-Yvette, France";
  const defaultCoords = { lat: 48.7118, lon: 2.1698 };

  beforeAll(() => {
    Object.defineProperty(HTMLIFrameElement.prototype, "src", {
      get() {
        return this.getAttribute("data-src") || "";
      },
      set(val) {
        this.setAttribute("data-src", val);
      },
      configurable: true,
    });
  });

  afterEach(() => {
    cleanup();
  });

  beforeEach(() => {
    vi.clearAllMocks();
    Object.defineProperty(navigator, "clipboard", {
      value: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
      configurable: true,
      writable: true,
    });
  });

  describe("parseRoomCode utility", () => {
    it("parses 3-digit room code '302' into floor 3 and room 02 with chip (3 | 02)", () => {
      const parsed = parseRoomCode("302", undefined, undefined, "en");
      expect(parsed.floor).toBe("3");
      expect(parsed.roomNumber).toBe("02");
      expect(parsed.chipText).toBe("(3 | 02)");
      expect(parsed.floorLabel).toBe("Floor 3");
      expect(parsed.roomLabel).toBe("Room 02");
      expect(parsed.tooltipText).toBe("Floor 3 • Room 02");
    });

    it("parses 4-digit room code '1408' into floor 14 and room 08", () => {
      const parsed = parseRoomCode("1408", undefined, undefined, "en");
      expect(parsed.floor).toBe("14");
      expect(parsed.roomNumber).toBe("08");
      expect(parsed.chipText).toBe("(14 | 08)");
    });

    it("parses ground floor room code '004' into floor 0 and room 04", () => {
      const parsed = parseRoomCode("004", undefined, undefined, "en");
      expect(parsed.floor).toBe("0");
      expect(parsed.roomNumber).toBe("04");
      expect(parsed.chipText).toBe("(0 | 04)");
    });

    it("parses alphanumeric code 'B-204' into floor 2 and room 04", () => {
      const parsed = parseRoomCode("B-204", undefined, undefined, "en");
      expect(parsed.floor).toBe("2");
      expect(parsed.roomNumber).toBe("04");
      expect(parsed.chipText).toBe("(2 | 04)");
    });

    it("parses punctuated room '3.12' into floor 3 and room 12", () => {
      const parsed = parseRoomCode("3.12", undefined, undefined, "en");
      expect(parsed.floor).toBe("3");
      expect(parsed.roomNumber).toBe("12");
      expect(parsed.chipText).toBe("(3 | 12)");
    });

    it("parses word-prefixed room 'Lab 105' into floor 1 and room 05", () => {
      const parsed = parseRoomCode("Lab 105", undefined, undefined, "en");
      expect(parsed.floor).toBe("1");
      expect(parsed.roomNumber).toBe("05");
      expect(parsed.chipText).toBe("(1 | 05)");
    });

    it("handles explicit floor and roomNumber overrides", () => {
      const parsed = parseRoomCode("IgnoredRaw", 4, "15", "en");
      expect(parsed.floor).toBe("4");
      expect(parsed.roomNumber).toBe("15");
      expect(parsed.chipText).toBe("(4 | 15)");
    });

    it("produces localized French labels when locale='fr'", () => {
      const parsed = parseRoomCode("302", undefined, undefined, "fr");
      expect(parsed.floorLabel).toBe("Étage 3");
      expect(parsed.roomLabel).toBe("Salle 02");
      expect(parsed.tooltipText).toBe("Étage 3 • Salle 02");
    });

    it("handles empty or null room input gracefully", () => {
      const parsed = parseRoomCode(null);
      expect(parsed.floor).toBe("—");
      expect(parsed.roomNumber).toBe("—");
      expect(parsed.chipText).toBe("(— | —)");
    });

    it("supports explicit roomName parameter and computes fullRoomLabel", () => {
      const parsed = parseRoomCode("302", undefined, undefined, {
        locale: "en",
        roomName: "Amphithéâtre Alan Turing",
      });
      expect(parsed.roomName).toBe("Amphithéâtre Alan Turing");
      expect(parsed.fullRoomLabel).toBe("Room 302");
      expect(parsed.floorLabel).toBe("Floor 3");
    });
  });

  describe("URL & Coordinate helpers", () => {
    it("builds a valid OpenStreetMap embed URL with bounding box and marker", () => {
      const url = buildOsmEmbedUrl({ lat: 48.8566, lon: 2.3522 }, 16);
      expect(url).toContain("https://www.openstreetmap.org/export/embed.html");
      expect(url).toContain("bbox=");
      expect(url).toContain("layer=mapnik");
      expect(url).toContain("marker=48.85660%2C2.35220");
    });

    it("builds a valid OpenStreetMap view URL", () => {
      const url = buildOsmViewUrl({ lat: 48.8566, lon: 2.3522 }, 16);
      expect(url).toContain(
        "https://www.openstreetmap.org/?mlat=48.85660&mlon=2.35220#map=16",
      );
    });

    it("builds directions URL with coordinates and address", () => {
      const urlCoords = buildDirectionsUrl({ lat: 48.8566, lon: 2.3522 });
      expect(urlCoords).toContain("google.com/maps/dir");
      expect(urlCoords).toContain("48.85660,2.35220");

      const urlAddr = buildDirectionsUrl(undefined, "Paris, France");
      expect(urlAddr).toContain("google.com/maps/search");
      expect(urlAddr).toContain("Paris%2C%20France");
    });

    it("formats coordinates into standard DMS notation", () => {
      const dms = formatCoordinatesDMS({ lat: 48.8566, lon: 2.3522 });
      expect(dms).toContain("48°51'");
      expect(dms).toContain("N");
      expect(dms).toContain("2°21'");
      expect(dms).toContain("E");
    });

    it("strips redundant campus and building prefixes", () => {
      expect(cleanCampusName("Campus Paris-Saclay")).toBe("Paris-Saclay");
      expect(cleanCampusName("Campus de Jussieu")).toBe("Jussieu");
      expect(cleanBuildingName("Bâtiment Alan Turing")).toBe("Alan Turing");
      expect(cleanBuildingName("Building Alan Turing")).toBe("Alan Turing");
    });
  });

  describe("Component Rendering", () => {
    it("renders prominent segmented chip with campus, building, floor, and room", () => {
      renderWithTheme(
        <MapCard
          address={defaultAddress}
          campusName="Campus Paris-Saclay"
          buildingName="Bâtiment Alan Turing"
          room="302"
          coordinates={defaultCoords}
        />,
      );

      // Location context chip and prominent hero room chip
      expect(screen.getByTestId("location-chip")).toBeDefined();
      expect(screen.getByTestId("prominent-wayfinding-chip")).toBeDefined();
      // Segments
      expect(screen.getByTestId("seg-campus").textContent).toContain(
        "Paris-Saclay",
      );
      expect(screen.getByTestId("seg-building").textContent).toContain(
        "Alan Turing",
      );
      expect(screen.getByTestId("seg-floor").textContent).toContain("3");
      expect(screen.getByTestId("seg-room").textContent).toContain("02");
    });

    it("renders custom amphitheater roomName when provided", () => {
      renderWithTheme(
        <MapCard
          address={defaultAddress}
          campusName="Campus Paris-Saclay"
          buildingName="Bâtiment Alan Turing"
          room="302"
          roomName="Amphithéâtre Alan Turing"
        />,
      );

      expect(screen.getByTestId("seg-room").textContent).toContain(
        "Amphithéâtre Alan Turing",
      );
    });

    it("renders optional access segmented chip when doorCode or accessType are provided", () => {
      renderWithTheme(
        <MapCard
          address={defaultAddress}
          campusName="Campus Paris-Saclay"
          buildingName="Bâtiment Alan Turing"
          room="302"
          doorCode="*4829#"
          accessType="code"
          instructions="Badge RFID requis après 18h."
          showInstructionBanner={true}
        />,
      );

      // Access chip container
      expect(screen.getByTestId("optional-access-chip")).toBeDefined();
      expect(screen.getByTestId("seg-doorcode").textContent).toContain(
        "*4829#",
      );
      expect(screen.getByTestId("seg-access-badge")).toBeDefined();
      expect(screen.queryByTestId("seg-instructions")).toBeNull();
      expect(screen.getByTestId("instruction-note").textContent).toContain(
        "Badge RFID requis après 18h.",
      );
    });

    it("does not render instruction note banner by default without showInstructionBanner", () => {
      renderWithTheme(
        <MapCard
          address={defaultAddress}
          campusName="Campus Paris-Saclay"
          buildingName="Bâtiment Alan Turing"
          room="302"
          doorCode="*4829#"
          instructions="Badge RFID requis après 18h."
        />,
      );

      expect(screen.queryByTestId("instruction-note")).toBeNull();
    });

    it("does not render optional access chip when no access info is provided", () => {
      renderWithTheme(
        <MapCard
          address={defaultAddress}
          campusName="Campus Paris-Saclay"
          buildingName="Bâtiment Alan Turing"
          room="302"
        />,
      );

      expect(screen.queryByTestId("optional-access-chip")).toBeNull();
      expect(screen.queryByTestId("instruction-note")).toBeNull();
    });

    it("allows copying door code by clicking the doorcode segment", async () => {
      const onCopyDoorCode = vi.fn();
      renderWithTheme(
        <MapCard
          address={defaultAddress}
          room="302"
          doorCode="*4829#"
          onCopyDoorCode={onCopyDoorCode}
        />,
      );

      const doorCodeSegment = screen.getByTestId("seg-doorcode");
      fireEvent.click(doorCodeSegment);

      expect(onCopyDoorCode).toHaveBeenCalledWith("*4829#");
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith("*4829#");
      await waitFor(() => {
        expect(doorCodeSegment.textContent).toContain("Copié !");
      });
    });

    it("renders MapLibre vector map container within 3D folding paper canvas", () => {
      renderWithTheme(
        <MapCard
          address={defaultAddress}
          coordinates={defaultCoords}
          zoom={16}
        />,
      );

      expect(screen.getByTestId("map-perspective-wrapper")).toBeDefined();
      expect(screen.getByTestId("folding-paper-canvas")).toBeDefined();
      expect(screen.getByTestId("maplibre-container")).toBeDefined();
    });

    it("renders with custom mapStyle and narrow width layout", () => {
      const customStyle =
        "https://api.maptiler.com/maps/basic/style.json?key=test-key";
      renderWithTheme(
        <MapCard
          address={defaultAddress}
          coordinates={defaultCoords}
          mapStyle={customStyle}
          mapWidth="narrow"
        />,
      );

      const wrapper = screen.getByTestId("map-perspective-wrapper");
      expect(wrapper).toBeDefined();
      expect(screen.getByTestId("maplibre-container")).toBeDefined();
    });

    it("renders campus name on map pin badge by default and supports custom pinLabel", () => {
      renderWithTheme(
        <MapCard
          campusName="Campus Condorcet"
          address={defaultAddress}
          coordinates={defaultCoords}
        />,
      );

      // In wayfinding chip, cleanCampusName produces "Condorcet"
      expect(screen.getByText("Condorcet")).toBeDefined();
      // On the pin badge, the full campus name is displayed
      expect(screen.getByTestId("map-pin-label").textContent).toBe(
        "Campus Condorcet",
      );
    });

    it("renders footer with address, copy button, and navigation FloatingActionButton", async () => {
      const onCopyAddress = vi.fn();
      const onDirectionsClick = vi.fn();

      renderWithTheme(
        <MapCard
          address={defaultAddress}
          coordinates={defaultCoords}
          onCopyAddress={onCopyAddress}
          onDirectionsClick={onDirectionsClick}
        />,
      );

      // Address display
      expect(screen.getByTestId("address-text").textContent).toContain(
        defaultAddress,
      );

      // Copy Address Button
      const copyBtn = screen.getByTestId("btn-copy-address");
      expect(copyBtn).toBeDefined();
      fireEvent.click(copyBtn);
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
        defaultAddress,
      );
      expect(onCopyAddress).toHaveBeenCalledWith(defaultAddress);

      // Navigation FAB
      const navFab = screen.getByTestId("fab-navigate-gps");
      expect(navFab).toBeDefined();
      fireEvent.click(navFab);
      expect(onDirectionsClick).toHaveBeenCalledWith(
        defaultCoords,
        defaultAddress,
      );
    });

    it("does not render viewport controls overlay by default", () => {
      renderWithTheme(
        <MapCard address={defaultAddress} coordinates={defaultCoords} />,
      );

      expect(screen.queryByTestId("map-overlay-controls")).toBeNull();
      expect(screen.queryByTestId("btn-toggle-fold")).toBeNull();
    });

    it("toggles fold state using viewport controls when showControls is true", () => {
      const onFoldChange = vi.fn();
      renderWithTheme(
        <MapCard
          address={defaultAddress}
          coordinates={defaultCoords}
          initialFolded={true}
          showControls={true}
          onFoldChange={onFoldChange}
        />,
      );

      const toggleFoldBtn = screen.getByTestId("btn-toggle-fold");
      expect(toggleFoldBtn).toBeDefined();
      fireEvent.click(toggleFoldBtn);
      expect(onFoldChange).toHaveBeenCalledWith(false);
    });

    it("renders wayfinding segmented chip in vertical orientation when requested", () => {
      renderWithTheme(
        <MapCard
          address={defaultAddress}
          campusName="Campus Paris-Saclay"
          buildingName="Bâtiment Alan Turing"
          room="302"
          chipOrientation="vertical"
        />,
      );

      const chip = screen.getByTestId("prominent-wayfinding-chip");
      expect(chip.getAttribute("data-orientation")).toBe("vertical");
    });
  });

  describe("Solarized Map Style specifications", () => {
    it("provides valid Solarized Dark style specification with OpenMapTiles source", () => {
      expect(SOLARIZED_DARK_MAP_STYLE).toBeDefined();
      const darkStyle = getSolarizedMapStyle("dark");
      expect(darkStyle.version).toBe(8);
      expect(darkStyle.name).toBe("Solarized Dark");
      expect(darkStyle.sources.openmaptiles).toBeDefined();
      const backgroundLayer = darkStyle.layers.find(
        (l) => l.id === "background",
      );
      expect(backgroundLayer).toBeDefined();
      const paint = backgroundLayer?.paint as
        Record<string, unknown> | undefined;
      expect(paint?.["background-color"]).toBe("#002b36");
    });

    it("provides valid Solarized Light style specification", () => {
      expect(SOLARIZED_LIGHT_MAP_STYLE).toBeDefined();
      const lightStyle = getSolarizedMapStyle("light");
      expect(lightStyle.version).toBe(8);
      expect(lightStyle.name).toBe("Solarized Light");
      const backgroundLayer = lightStyle.layers.find(
        (l) => l.id === "background",
      );
      expect(backgroundLayer).toBeDefined();
      const paint = backgroundLayer?.paint as
        Record<string, unknown> | undefined;
      expect(paint?.["background-color"]).toBe("#fdf6e3");
    });

    it("injects custom MapTiler API key into vector source URL", () => {
      const customKeyStyle = getSolarizedMapStyle("dark", {
        apiKey: "maptiler-secret-key-123",
      });
      const source = customKeyStyle.sources.openmaptiles as
        { url?: string } | undefined;
      expect(source?.url).toContain("key=maptiler-secret-key-123");
    });

    it("injects custom vector tile provider URL", () => {
      const customUrlStyle = getSolarizedMapStyle("light", {
        providerUrl: "https://api.protomaps.com/tiles/v3.json",
      });
      const source = customUrlStyle.sources.openmaptiles as
        { url?: string } | undefined;
      expect(source?.url).toBe("https://api.protomaps.com/tiles/v3.json");
    });
  });
});
