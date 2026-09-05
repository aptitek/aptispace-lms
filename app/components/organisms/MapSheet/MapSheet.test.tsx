import { describe, it, expect } from "vitest";
import React from "react";
import ReactDOMServer from "react-dom/server";
import { ThemeProvider, createTheme } from "@mui/material/styles";

import MapSheet, {
  parseRoomCode,
  buildOsmEmbedUrl,
  buildOsmViewUrl,
  buildDirectionsUrl,
  formatCoordinatesDMS,
  cleanCampusName,
  cleanBuildingName,
} from "./index";
import "~/i18n";

const theme = createTheme();

function renderWithTheme(element: React.ReactElement): string {
  return ReactDOMServer.renderToString(
    React.createElement(ThemeProvider, { theme }, element),
  );
}

describe("MapSheet Molecule", () => {
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

    it("builds directions URL with coordinates", () => {
      const url = buildDirectionsUrl({ lat: 48.8566, lon: 2.3522 });
      expect(url).toContain("directions?engine=fossgis_osrm_car");
      expect(url).toContain("48.85660%2C2.35220");
    });

    it("formats coordinates into DMS string", () => {
      const dms = formatCoordinatesDMS({ lat: 48.8566, lon: 2.3522 });
      expect(dms).toContain("48°");
      expect(dms).toContain("N");
      expect(dms).toContain("2°");
      expect(dms).toContain("E");
    });
  });

  describe("MapSheet Component SSR Rendering", () => {
    const defaultAddress = "12 Rue de Paris, 75007 Paris";

    it("renders campus name, building name, address, and room chip", () => {
      const html = renderWithTheme(
        React.createElement(MapSheet, {
          address: defaultAddress,
          campusName: "Campus Paris-Saclay",
          buildingName: "Bâtiment Alan Turing",
          room: "302",
        }),
      );

      expect(html).toContain("Campus Paris-Saclay");
      expect(html).toContain("Bâtiment Alan Turing");
      expect(html).toContain(defaultAddress);
      // Room chip parts
      expect(html).toContain("3");
      expect(html).toContain("02");
      expect(html).toContain('data-testid="room-floor-chip"');
    });

    it("renders door access code and instructions menu trigger when provided", () => {
      const html = renderWithTheme(
        React.createElement(MapSheet, {
          address: defaultAddress,
          room: "302",
          doorCode: "*4829#",
          instructions: "Scan student badge at the double door entrance.",
        }),
      );

      expect(html).toContain("*4829#");
      expect(html).toContain('data-testid="door-code-pill"');
      expect(html).toContain('data-testid="instructions-menu-trigger"');
    });

    it("renders with different sizing scales ('small', 'medium', 'large')", () => {
      for (const size of ["small", "medium", "large"] as const) {
        const html = renderWithTheme(
          React.createElement(MapSheet, {
            address: defaultAddress,
            size,
          }),
        );
        expect(html).toContain(defaultAddress);
      }
    });

    it("renders vertical and horizontal orientations", () => {
      for (const orientation of ["horizontal", "vertical"] as const) {
        const html = renderWithTheme(
          React.createElement(MapSheet, {
            address: defaultAddress,
            orientation,
          }),
        );
        expect(html).toContain(defaultAddress);
      }
    });

    it("renders different access types ('code', 'badge', 'intercom', 'key')", () => {
      for (const accessType of ["code", "badge", "intercom", "key"] as const) {
        const html = renderWithTheme(
          React.createElement(MapSheet, {
            address: defaultAddress,
            accessType,
            doorCode: "1234",
          }),
        );
        expect(html).toContain("1234");
      }
    });

    it("renders clean map in compact mode without tape/clutter and full tape/controls in extended mode", () => {
      const compactHtml = renderWithTheme(
        React.createElement(MapSheet, {
          address: defaultAddress,
          coordinates: { lat: 48.8566, lon: 2.3522 },
          mode: "compact",
        }),
      );

      expect(compactHtml).toContain('role="region"');
      expect(compactHtml).not.toContain('data-testid="map-top-tape"');
      expect(compactHtml).not.toContain('data-testid="map-compass-badge"');
      expect(compactHtml).not.toContain('data-testid="zoom-in-button"');
      expect(compactHtml).not.toContain('data-testid="fold-toggle-button"');
      expect(compactHtml).toContain('data-testid="mode-toggle-button"');

      const extendedHtml = renderWithTheme(
        React.createElement(MapSheet, {
          address: defaultAddress,
          coordinates: { lat: 48.8566, lon: 2.3522 },
          mode: "extended",
        }),
      );

      expect(extendedHtml).toContain('data-testid="map-top-tape"');
      expect(extendedHtml).toContain("OSM •");
      expect(extendedHtml).toContain('data-testid="map-compass-badge"');
      expect(extendedHtml).toContain('data-testid="zoom-in-button"');
      expect(extendedHtml).toContain('data-testid="fold-toggle-button"');
    });

    it("renders campus and building as chips in compact mode", () => {
      const html = renderWithTheme(
        React.createElement(MapSheet, {
          address: defaultAddress,
          campusName: "Campus Paris-Saclay",
          buildingName: "Bâtiment Alan Turing",
          room: "302",
          mode: "compact",
        }),
      );

      expect(html).toContain('data-testid="chips-deck-row"');
      expect(html).toContain('data-testid="chip-campus"');
      expect(html).toContain("Paris-Saclay");
      expect(html).toContain('data-testid="chip-building"');
      expect(html).toContain("Alan Turing");
      expect(html).toContain('data-testid="room-floor-chip"');
      expect(html).toContain('data-testid="floor-pill"');
      expect(html).toContain('data-testid="room-pill"');
      expect(html).toContain('data-testid="mode-toggle-button"');
    });

    it("renders extended full map mode with floating wayfinding overlay and view controls", () => {
      const html = renderWithTheme(
        React.createElement(MapSheet, {
          address: defaultAddress,
          campusName: "Campus Paris-Saclay",
          buildingName: "Bâtiment Alan Turing",
          room: "302",
          doorCode: "*4829#",
          mode: "extended",
          extendedView: "full",
        }),
      );

      expect(html).toContain('data-testid="floating-wayfinding-overlay"');
      expect(html).toContain('data-testid="chip-campus"');
      expect(html).toContain('data-testid="chip-building"');
      expect(html).toContain('data-testid="room-floor-chip"');
      expect(html).toContain('data-testid="door-code-pill"');
      expect(html).toContain('data-testid="mode-toggle-button"');
      expect(html).toContain('data-testid="extended-view-toggle-button"');
    });

    it("renders extended split view mode with transit steps", () => {
      const html = renderWithTheme(
        React.createElement(MapSheet, {
          address: defaultAddress,
          campusName: "Campus Paris-Saclay",
          buildingName: "Bâtiment Alan Turing",
          room: "302",
          doorCode: "*4829#",
          mode: "extended",
          extendedView: "split",
        }),
      );

      expect(html).toContain('data-testid="step-campus"');
      expect(html).toContain('data-testid="step-building"');
      expect(html).toContain('data-testid="step-floor"');
      expect(html).toContain('data-testid="step-room"');
      expect(html).toContain('data-testid="room-floor-chip"');
      expect(html).toContain('data-testid="step-instructions"');
      expect(html).toContain('data-testid="mode-toggle-button"');
      expect(html).toContain('data-testid="extended-view-toggle-button"');
    });

    it("renders floor and room chip prominently in compact mode", () => {
      const html = renderWithTheme(
        React.createElement(MapSheet, {
          address: defaultAddress,
          campusName: "Campus Paris-Saclay",
          buildingName: "Bâtiment Alan Turing",
          room: "302",
          mode: "compact",
        }),
      );

      expect(html).toContain('data-testid="room-floor-chip"');
      expect(html).toContain('data-testid="floor-pill"');
      expect(html).toContain('data-testid="room-pill"');
      expect(html).toContain("3");
      expect(html).toContain("02");
    });

    it("renders custom room name chip when roomName is provided", () => {
      const html = renderWithTheme(
        React.createElement(MapSheet, {
          address: defaultAddress,
          campusName: "Campus Paris-Saclay",
          buildingName: "Bâtiment Alan Turing",
          room: "302",
          roomName: "Amphithéâtre Alan Turing",
          mode: "compact",
        }),
      );

      expect(html).toContain('data-testid="chip-room-name"');
      expect(html).toContain("Amphithéâtre Alan Turing");
      expect(html).toContain('data-testid="room-floor-chip"');
      expect(html).toContain("3");
      expect(html).toContain("02");
    });

    it("combines door code and instructions in the same chip and provides hover card", () => {
      const html = renderWithTheme(
        React.createElement(MapSheet, {
          address: defaultAddress,
          room: "302",
          doorCode: "4920#",
          instructions: "Entrée côté nord, sonner à l'accueil",
          mode: "compact",
        }),
      );

      // In the same chip
      expect(html).toContain('data-testid="door-code-pill"');
      expect(html).toContain("4920#");
      expect(html).toContain('data-testid="instructions-menu-trigger"');
      expect(html).toContain('data-testid="copy-door-code-button"');
    });

    it("renders instructions in extended stepper mode with instruction card trigger without repeating icons or text", () => {
      const testInstructions = "Sonner au digicode puis monter au 3eme";
      const html = renderWithTheme(
        React.createElement(MapSheet, {
          address: defaultAddress,
          room: "302",
          doorCode: "4920#",
          instructions: testInstructions,
          mode: "extended",
          extendedView: "split",
        }),
      );

      expect(html).toContain('data-testid="step-instructions"');
      expect(html).toContain('data-testid="door-code-pill"');
      expect(html).toContain("4920#");
      expect(html).toContain('data-testid="instructions-menu-trigger"');
      expect(html).not.toContain('data-testid="step-instruction-text"');
    });

    it("renders horizontal wavy transit line behind chips in vertical view and omits it in horizontal view", () => {
      const verticalHtml = renderWithTheme(
        React.createElement(MapSheet, {
          address: defaultAddress,
          room: "302",
          orientation: "vertical",
          mode: "compact",
        }),
      );
      expect(verticalHtml).toContain(
        'data-testid="horizontal-transit-track-line"',
      );

      const horizontalHtml = renderWithTheme(
        React.createElement(MapSheet, {
          address: defaultAddress,
          room: "302",
          orientation: "horizontal",
          mode: "compact",
        }),
      );
      expect(horizontalHtml).not.toContain(
        'data-testid="horizontal-transit-track-line"',
      );
    });

    it("renders vertical wavy transit line in extended stepper itinerary view", () => {
      const html = renderWithTheme(
        React.createElement(MapSheet, {
          address: defaultAddress,
          room: "302",
          mode: "extended",
          extendedView: "split",
        }),
      );

      expect(html).toContain('data-testid="transit-track-line"');
    });

    it("renders wayfinding instructions across all views", () => {
      const customInstructions = "Prendre ascenseur B jusqu au 3eme etage.";

      // 1. Compact Horizontal View
      const compactH = renderWithTheme(
        React.createElement(MapSheet, {
          address: defaultAddress,
          room: "302",
          instructions: customInstructions,
          orientation: "horizontal",
          mode: "compact",
        }),
      );
      expect(compactH).toContain('data-testid="instructions-menu-trigger"');

      // 2. Compact Vertical View
      const compactV = renderWithTheme(
        React.createElement(MapSheet, {
          address: defaultAddress,
          room: "302",
          instructions: customInstructions,
          orientation: "vertical",
          mode: "compact",
        }),
      );
      expect(compactV).toContain('data-testid="instructions-menu-trigger"');
      expect(compactV).toContain('data-testid="horizontal-transit-track-line"');

      // 3. Extended Split Itinerary View
      const extendedSplit = renderWithTheme(
        React.createElement(MapSheet, {
          address: defaultAddress,
          room: "302",
          instructions: customInstructions,
          mode: "extended",
          extendedView: "split",
        }),
      );
      expect(extendedSplit).toContain('data-testid="step-instructions"');
      expect(extendedSplit).toContain(
        'data-testid="instructions-menu-trigger"',
      );

      // 4. Extended Full Map View
      const extendedFull = renderWithTheme(
        React.createElement(MapSheet, {
          address: defaultAddress,
          room: "302",
          instructions: customInstructions,
          mode: "extended",
          extendedView: "full",
        }),
      );
      expect(extendedFull).toContain(
        'data-testid="floating-wayfinding-overlay"',
      );
      expect(extendedFull).toContain('data-testid="instructions-menu-trigger"');
    });

    it("does not repeat access icon or instructions in extended stepper mode", () => {
      const html = renderWithTheme(
        React.createElement(MapSheet, {
          address: defaultAddress,
          room: "302",
          doorCode: "4920#",
          accessType: "code",
          instructions: "Sonner à l'accueil",
          mode: "extended",
          extendedView: "split",
        }),
      );

      expect(html).toContain('data-testid="step-instructions"');
      expect(html).toContain('data-testid="door-code-pill"');
      expect(html).toContain('data-testid="instructions-menu-trigger"');
      // Verify instructions text is not repeated in static layout
      expect(html).not.toContain('data-testid="step-instruction-text"');
    });
  });

  describe("cleanCampusName & cleanBuildingName utilities", () => {
    it("strips redundant campus labels while preserving name", () => {
      expect(cleanCampusName("Campus Paris-Saclay")).toBe("Paris-Saclay");
      expect(cleanCampusName("Campus de Jussieu")).toBe("Jussieu");
      expect(cleanCampusName("Sorbonne Innovation Campus")).toBe(
        "Sorbonne Innovation",
      );
      expect(cleanCampusName("Central Campus")).toBe("Central");
    });

    it("strips redundant building and bâtiment labels while preserving name", () => {
      expect(cleanBuildingName("Bâtiment Alan Turing")).toBe("Alan Turing");
      expect(cleanBuildingName("Building Alan Turing")).toBe("Alan Turing");
      expect(cleanBuildingName("Bâtiment 333 (Informatique)")).toBe(
        "333 (Informatique)",
      );
      expect(cleanBuildingName("Building B")).toBe("B");
    });
  });
});
