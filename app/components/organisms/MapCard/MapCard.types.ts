import type { CSSProperties, ReactNode } from "react";

export interface MapCoordinates {
  lat: number;
  lon: number;
}

export type AccessType = "code" | "badge" | "intercom" | "key" | "open";
export type MapCardSize = "small" | "medium" | "large";
export type MapCardOrientation = "horizontal" | "vertical";

export interface ParsedRoomInfo {
  floor: string;
  roomNumber: string;
  rawRoom: string;
  chipText: string;
  floorLabel: string;
  roomLabel: string;
  fullRoomLabel: string;
  tooltipText: string;
  roomName?: string;
}

export interface ParseRoomCodeOptions {
  locale?: string;
  roomName?: string;
}

export interface MapCardProps {
  /**
   * Optional card section title (e.g. "Location & Access"). If omitted, no title banner is displayed.
   */
  title?: string;

  /**
   * Full postal or physical address displayed in the card footer.
   */
  address: string;

  /**
   * Exact geographic coordinates (latitude and longitude) for OSM map centering and GPS routing.
   */
  coordinates?: MapCoordinates;

  /**
   * Campus name (e.g. "Campus Paris-Saclay", "Sorbonne Innovation Campus").
   */
  campusName?: string;

  /**
   * Building name or pavilion (e.g. "Bâtiment Alan Turing", "Pavillon Poincaré").
   */
  buildingName?: string;

  /**
   * Room code or identifier (e.g. "302", "B-204", "004"). Automatically parsed into floor and room number.
   */
  room?: string;

  /**
   * Optional custom room title or lecture hall name (e.g. "Amphithéâtre Alan Turing").
   */
  roomName?: string;

  /**
   * Explicit floor override (if not parsed from room).
   */
  floor?: string | number;

  /**
   * Explicit room number override (if not parsed from room).
   */
  roomNumber?: string | number;

  /**
   * Initial OpenStreetMap zoom level (10-19, default: 14.5).
   */
  zoom?: number;

  /**
   * Camera pitch angle in degrees (0 = nadir/top-down, up to 85) for 3D tilt (default: 55).
   */
  pitch?: number;

  /**
   * Camera bearing angle in degrees for 3D ortho perspective angle (default: -25).
   */
  bearing?: number;

  /**
   * Security door code, digicode, or entrance PIN (e.g. "*4829#", "3920A").
   */
  doorCode?: string;

  /**
   * Entrance security barrier type ("code" | "badge" | "intercom" | "key" | "open").
   */
  accessType?: AccessType;

  /**
   * Supplementary access instructions or wayfinding notes.
   */
  instructions?: string;

  /**
   * Sizing scale of the card ("small" | "medium" | "large", default: "medium").
   */
  size?: MapCardSize;

  /**
   * Layout orientation ("horizontal" side-by-side or "vertical" stacked, default: "horizontal").
   */
  orientation?: MapCardOrientation;

  /**
   * Layout orientation of the wayfinding segmented chip ("horizontal" | "vertical" | "responsive", default: "responsive").
   */
  chipOrientation?: "horizontal" | "vertical" | "responsive";

  /**
   * Whether the map begins in folded origami accordion state.
   */
  initialFolded?: boolean;

  /**
   * Whether to display interactive fold/unfold toggle and zoom controls on the map.
   * @default false
   */
  showControls?: boolean;

  /**
   * Whether to display a dedicated instruction banner below the chips.
   * @default false
   */
  showInstructionBanner?: boolean;

  /**
   * Language locale override ("en" | "fr").
   */
  locale?: string;

  /**
   * Optional custom leading or trailing elements inside wayfinding panel.
   */
  children?: ReactNode;

  /**
   * Additional CSS class name.
   */
  className?: string;

  /**
   * Custom inline styles.
   */
  style?: CSSProperties;

  /**
   * Custom test identifier.
   */
  testId?: string;

  /**
   * Callback fired when the full address is copied.
   */
  onCopyAddress?: (address: string) => void;

  /**
   * Callback fired when the door code is copied.
   */
  onCopyDoorCode?: (doorCode: string) => void;

  /**
   * Callback fired when navigation/directions action is clicked.
   */
  onDirectionsClick?: (coordinates?: MapCoordinates, address?: string) => void;

  /**
   * Optional custom MapLibre style specification object or remote style URL (e.g. MapTiler, Stadia, Protomaps).
   * Defaults to the built-in Solarized vector tile style matching current theme mode.
   */
  mapStyle?: string | object;

  /**
   * Viewport width ratio for the map in horizontal orientation ("narrow" compact preview or "standard").
   * @default "narrow"
   */
  mapWidth?: "narrow" | "standard";

  /**
   * Optional API key for external tile providers such as MapTiler or Protomaps.
   */
  tileProviderKey?: string;

  /**
   * Optional custom label displayed on the pin badge (defaults to campus name).
   */
  pinLabel?: string;

  /**
   * Optional custom color for the pin marker (defaults to Solarized green).
   */
  pinColor?: string;

  /**
   * Callback fired when the paper map fold state toggles.
   */
  onFoldChange?: (isFolded: boolean) => void;
}
