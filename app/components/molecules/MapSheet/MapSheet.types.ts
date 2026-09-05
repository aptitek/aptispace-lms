import type { CSSProperties } from "react";

export interface MapCoordinates {
  lat: number;
  lon: number;
}

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

export type MapSheetSize = "small" | "medium" | "large";
export type MapSheetOrientation = "horizontal" | "vertical";
export type AccessType = "code" | "badge" | "intercom" | "key" | "open";
export type MapSheetMode = "compact" | "extended";
export type ExtendedMapView = "full" | "split";

export interface MapSheetProps {
  /**
   * Display mode: "compact" for schedule card triad views with chips or "extended" for full interactive map view.
   */
  mode?: MapSheetMode;

  /**
   * View layout when in extended mode: "full" for full-bleed map or "split" for side-by-side stepper. Default: "full".
   */
  extendedView?: ExtendedMapView;

  /**
   * Whether to display the expand / collapse toggle button between compact and extended mode.
   */
  allowModeToggle?: boolean;

  /**
   * Callback fired when switching between compact and extended mode.
   */
  onModeChange?: (mode: MapSheetMode) => void;

  /**
   * Callback fired when switching extended view between full and split layout.
   */
  onExtendedViewChange?: (view: ExtendedMapView) => void;
  /**
   * Human-readable address to display (e.g. "12 Rue de l'Université, 75007 Paris")
   */
  address: string;

  /**
   * Optional exact geographic coordinates for OpenStreetMap marker centering.
   * If omitted, default coordinates or campus coordinates are used.
   */
  coordinates?: MapCoordinates;

  /**
   * Map initial zoom level (OpenStreetMap zoom scale 1-19, default 16).
   */
  zoom?: number;

  /**
   * Campus name (e.g. "Campus Paris-Saclay", "North Campus")
   */
  campusName?: string;

  /**
   * Building name or identifier (e.g. "Bâtiment Alan Turing", "Building Ada Lovelace")
   */
  buildingName?: string;

  /**
   * Room number or identifier to be parsed (e.g. "302", "B-204", "Lab 105").
   * Automatically parsed to display floor and room in a chip like (3 | 02).
   */
  room?: string;

  /**
   * Optional room name or lecture hall title (e.g. "Amphithéâtre Alan Turing", "Lab Poincaré").
   */
  roomName?: string;

  /**
   * Explicit floor override if not parsing from room string.
   */
  floor?: string | number;

  /**
   * Explicit room number override if not parsing from room string.
   */
  roomNumber?: string | number;

  /**
   * Security door code, keypad code, or pin for classroom access (e.g. "*4829#", "3902A").
   */
  doorCode?: string;

  /**
   * Supplementary access instructions or wayfinding guidance
   * (e.g. "Scan student badge at glass double doors; take elevator B to 3rd floor").
   */
  instructions?: string;

  /**
   * Type of entrance access barrier (code, badge, intercom, key, open).
   */
  accessType?: AccessType;

  /**
   * Component sizing scale ("small" | "medium" | "large"). Default: "medium".
   */
  size?: MapSheetSize;

  /**
   * Layout direction ("horizontal" side-by-side or "vertical" stacked). Default: "horizontal".
   */
  orientation?: MapSheetOrientation;

  /**
   * Whether the map begins in a folded paper brochure state.
   * Defaults to false, but animates the 3D unfolding sequence on load.
   */
  initialFolded?: boolean;

  /**
   * Whether to display the interactive fold/unfold toggle button.
   */
  allowFoldToggle?: boolean;

  /**
   * Whether to render interactive map viewport controls (zoom in/out, reset, open OSM).
   */
  showControls?: boolean;

  /**
   * Whether to show the "Get Directions" action button.
   */
  showDirectionsButton?: boolean;

  /**
   * Whether to show the "Copy Address" action button.
   */
  showCopyAddressButton?: boolean;

  /**
   * Specific language locale override ("en" | "fr").
   */
  locale?: string;

  /**
   * Additional CSS class name.
   */
  className?: string;

  /**
   * Inline styles applied to the outer container.
   */
  style?: CSSProperties;

  /**
   * Callback fired when the door code is copied to clipboard.
   */
  onCopyDoorCode?: (code: string) => void;

  /**
   * Callback fired when the address is copied to clipboard.
   */
  onCopyAddress?: (address: string) => void;

  /**
   * Callback fired when "Get Directions" is clicked.
   */
  onDirectionsClick?: (coords?: MapCoordinates, address?: string) => void;

  /**
   * Callback fired when the paper map fold state changes.
   */
  onFoldChange?: (isFolded: boolean) => void;
}
