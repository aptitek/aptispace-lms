import { describe, it, expect } from "vitest";
import {
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

describe("MapCard Helpers & Specifications", () => {
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

  describe("Solarized Map Style specifications", () => {
    it("provides valid Solarized Dark style specification with OpenMapTiles source", () => {
      expect(SOLARIZED_DARK_MAP_STYLE).toBeDefined();
      const darkStyle = getSolarizedMapStyle("dark");
      expect(darkStyle.version).toBe(8);
      expect(darkStyle.name).toBe("Solarized Dark");
      expect(darkStyle.sources.openmaptiles).toBeDefined();
      const backgroundLayer = darkStyle.layers.find(
        (layerConfig) => layerConfig.id === "background",
      );
      expect(backgroundLayer).toBeDefined();
      const paint = backgroundLayer?.paint as
        | Record<string, unknown>
        | undefined;
      expect(paint?.["background-color"]).toBe("#002b36");
    });

    it("provides valid Solarized Light style specification", () => {
      expect(SOLARIZED_LIGHT_MAP_STYLE).toBeDefined();
      const lightStyle = getSolarizedMapStyle("light");
      expect(lightStyle.version).toBe(8);
      expect(lightStyle.name).toBe("Solarized Light");
      const backgroundLayer = lightStyle.layers.find(
        (layerConfig) => layerConfig.id === "background",
      );
      expect(backgroundLayer).toBeDefined();
      const paint = backgroundLayer?.paint as
        | Record<string, unknown>
        | undefined;
      expect(paint?.["background-color"]).toBe("#fdf6e3");
    });

    it("injects custom MapTiler API key into vector source URL", () => {
      const customKeyStyle = getSolarizedMapStyle("dark", {
        apiKey: "maptiler-secret-key-123",
      });
      const source = customKeyStyle.sources.openmaptiles as
        | { url?: string }
        | undefined;
      expect(source?.url).toContain("key=maptiler-secret-key-123");
    });

    it("injects custom vector tile provider URL", () => {
      const customUrlStyle = getSolarizedMapStyle("light", {
        providerUrl: "https://api.protomaps.com/tiles/v3.json",
      });
      const source = customUrlStyle.sources.openmaptiles as
        | { url?: string }
        | undefined;
      expect(source?.url).toBe("https://api.protomaps.com/tiles/v3.json");
    });
  });
});
