import type { MapCoordinates, ParsedRoomInfo } from "./MapSheet.types";

export const DEFAULT_CAMPUS_COORDINATES: MapCoordinates = {
  lat: 48.856614,
  lon: 2.352222,
};

function buildRoomInfo(
  floor: string,
  roomNumber: string,
  rawRoom: string,
  isFr: boolean,
): ParsedRoomInfo {
  const floorLabel = isFr ? `Étage ${floor}` : `Floor ${floor}`;
  const roomLabel = isFr ? `Salle ${roomNumber}` : `Room ${roomNumber}`;

  return {
    floor,
    roomNumber,
    rawRoom,
    chipText: `(${floor} | ${roomNumber})`,
    floorLabel,
    roomLabel,
    tooltipText: `${floorLabel} • ${roomLabel}`,
  };
}

function tryExplicit(
  rawRoom: string,
  explicitFloor?: string | number,
  explicitRoom?: string | number,
  isFr = false,
): ParsedRoomInfo | null {
  if (explicitFloor === undefined && explicitRoom === undefined) {
    return null;
  }
  const floor =
    explicitFloor !== undefined ? String(explicitFloor).trim() : "0";
  const roomNumber =
    explicitRoom !== undefined
      ? String(explicitRoom).trim().padStart(2, "0")
      : rawRoom;

  return buildRoomInfo(
    floor,
    roomNumber,
    rawRoom || `${floor}${roomNumber}`,
    isFr,
  );
}

function tryPunctuation(rawRoom: string, isFr: boolean): ParsedRoomInfo | null {
  const match = rawRoom.match(/([A-Za-z]+[-_/\s]*)?(\d+)[._\-\s/]+(\d+)/);
  if (!match) return null;

  const floor = match[2];
  const roomNumber = match[3].padStart(2, "0");
  return buildRoomInfo(floor, roomNumber, rawRoom, isFr);
}

function tryAlphaNumeric(
  rawRoom: string,
  isFr: boolean,
): ParsedRoomInfo | null {
  const match = rawRoom.match(/([A-Za-z\s]+)?(\d{3,4})$/);
  if (!match) return null;

  const digits = match[2];
  const isFourDigits = digits.length === 4;
  const floor = isFourDigits ? digits.slice(0, 2) : digits.slice(0, 1);
  const roomNumber = isFourDigits ? digits.slice(2) : digits.slice(1);

  return buildRoomInfo(floor, roomNumber, rawRoom, isFr);
}

function tryGroundFloor(rawRoom: string, isFr: boolean): ParsedRoomInfo | null {
  if (!/^(RDC|RC|GF|GROUND)/i.test(rawRoom)) return null;

  const roomDigits = rawRoom.replace(/^\D+/g, "") || "01";
  const roomNumber = roomDigits.padStart(2, "0");
  const floor = "0";
  const floorLabel = isFr ? "Rez-de-chaussée" : "Ground Floor";
  const roomLabel = isFr ? `Salle ${roomNumber}` : `Room ${roomNumber}`;

  return {
    floor,
    roomNumber,
    rawRoom,
    chipText: `(0 | ${roomNumber})`,
    floorLabel,
    roomLabel,
    tooltipText: `${floorLabel} • ${roomLabel}`,
  };
}

function tryDigits(rawRoom: string, isFr: boolean): ParsedRoomInfo | null {
  const match = rawRoom.match(/\d+/);
  if (!match) return null;

  const digits = match[0];
  const floor = digits.length > 2 ? digits.slice(0, -2) : "0";
  const roomNumber =
    digits.length > 2 ? digits.slice(-2) : digits.padStart(2, "0");

  return buildRoomInfo(floor, roomNumber, rawRoom, isFr);
}

/**
 * Parses classroom / room strings into floor and room identifiers.
 *
 * Examples:
 * - "302" -> floor: "3", room: "02", chip: "(3 | 02)"
 * - "1408" -> floor: "14", room: "08", chip: "(14 | 08)"
 * - "004" -> floor: "0", room: "04", chip: "(0 | 04)"
 * - "B-204" -> floor: "2", room: "04", chip: "(2 | 04)"
 * - "Lab 105" -> floor: "1", room: "05", chip: "(1 | 05)"
 * - "3.12" -> floor: "3", room: "12", chip: "(3 | 12)"
 */
export function parseRoomCode(
  roomInput?: string | null,
  explicitFloor?: string | number,
  explicitRoom?: string | number,
  locale = "en",
): ParsedRoomInfo {
  const isFr = locale.startsWith("fr");
  const rawRoom = (roomInput || "").trim();

  const explicitResult = tryExplicit(
    rawRoom,
    explicitFloor,
    explicitRoom,
    isFr,
  );
  if (explicitResult) return explicitResult;

  if (!rawRoom) {
    return buildRoomInfo("—", "—", "", isFr);
  }

  const punctResult = tryPunctuation(rawRoom, isFr);
  if (punctResult) return punctResult;

  const alphaResult = tryAlphaNumeric(rawRoom, isFr);
  if (alphaResult) return alphaResult;

  const groundResult = tryGroundFloor(rawRoom, isFr);
  if (groundResult) return groundResult;

  const digitResult = tryDigits(rawRoom, isFr);
  if (digitResult) return digitResult;

  return buildRoomInfo("0", rawRoom, rawRoom, isFr);
}

/**
 * Builds standard OpenStreetMap embed iframe URL with a pinpoint marker and bounding box.
 */
export function buildOsmEmbedUrl(
  coords: MapCoordinates = DEFAULT_CAMPUS_COORDINATES,
  zoom = 16,
): string {
  const safeZoom = Math.min(Math.max(zoom, 10), 19);
  const factor = Math.pow(2, 16 - safeZoom);
  const deltaLon = 0.0045 * factor;
  const deltaLat = 0.0028 * factor;

  const minLon = (coords.lon - deltaLon).toFixed(5);
  const minLat = (coords.lat - deltaLat).toFixed(5);
  const maxLon = (coords.lon + deltaLon).toFixed(5);
  const maxLat = (coords.lat + deltaLat).toFixed(5);

  return `https://www.openstreetmap.org/export/embed.html?bbox=${minLon}%2C${minLat}%2C${maxLon}%2C${maxLat}&layer=mapnik&marker=${coords.lat.toFixed(5)}%2C${coords.lon.toFixed(5)}`;
}

/**
 * Builds an external navigation link to OpenStreetMap.
 */
export function buildOsmViewUrl(
  coords: MapCoordinates = DEFAULT_CAMPUS_COORDINATES,
  zoom = 16,
): string {
  return `https://www.openstreetmap.org/?mlat=${coords.lat.toFixed(5)}&mlon=${coords.lon.toFixed(5)}#map=${zoom}/${coords.lat.toFixed(5)}/${coords.lon.toFixed(5)}`;
}

/**
 * Builds external routing / directions URL.
 */
export function buildDirectionsUrl(
  coords?: MapCoordinates,
  address?: string,
): string {
  if (coords) {
    return `https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=%3B${coords.lat.toFixed(5)}%2C${coords.lon.toFixed(5)}`;
  }
  if (address) {
    return `https://www.openstreetmap.org/search?query=${encodeURIComponent(address)}`;
  }
  return "https://www.openstreetmap.org";
}

/**
 * Formats coordinates into standard Degrees, Minutes, Seconds (DMS) notation.
 */
export function formatCoordinatesDMS(coords: MapCoordinates): string {
  function toDms(coordinateNum: number, isLat: boolean): string {
    const direction = isLat
      ? coordinateNum >= 0
        ? "N"
        : "S"
      : coordinateNum >= 0
        ? "E"
        : "W";
    const absValue = Math.abs(coordinateNum);
    const deg = Math.floor(absValue);
    const minFloat = (absValue - deg) * 60;
    const min = Math.floor(minFloat);
    const sec = Math.round((minFloat - min) * 60);
    return `${deg}°${min}'${sec}"${direction}`;
  }

  return `${toDms(coords.lat, true)} ${toDms(coords.lon, false)}`;
}

/**
 * Strips redundant 'Campus' labels and prefixes to allow clean chip presentation.
 */
export function cleanCampusName(name?: string): string {
  if (!name) return "";
  const cleaned = name
    .replace(/\bcampus\b(\s+de\s+|\s+d['’]\s*|\s*[-–—:]\s*|\s+)?/gi, "")
    .replace(/\s+/g, " ")
    .trim();
  return cleaned || name;
}

/**
 * Strips redundant 'Building' and 'Bâtiment' labels and prefixes to allow clean chip presentation.
 */
export function cleanBuildingName(name?: string): string {
  if (!name) return "";
  const cleaned = name
    .replace(
      /\b(b[âa]timent|building|b[âa]t\.?|bldg\.?)\b\s*([-–—:]\s*|\s+)?/gi,
      "",
    )
    .replace(/\s+/g, " ")
    .trim();
  return cleaned || name;
}
