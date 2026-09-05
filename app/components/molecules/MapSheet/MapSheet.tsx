import React, {
  forwardRef,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import Box from "@mui/material/Box";
import { useTranslation } from "react-i18next";

import type {
  MapSheetProps,
  MapSheetMode,
  ExtendedMapView,
} from "./MapSheet.types";
import {
  DEFAULT_CAMPUS_COORDINATES,
  parseRoomCode,
  buildOsmEmbedUrl,
  buildDirectionsUrl,
  formatCoordinatesDMS,
} from "./MapSheet.utils";
import { SheetCard, CardBodyWrapper } from "./MapSheet.styles";
import { MapSheetViewport } from "./MapSheetViewport";
import {
  MapSheetItinerary,
  CompactChipsItinerary,
  ActionsSection,
} from "./MapSheetItinerary";

const DEFAULTS = {
  mode: "compact" as MapSheetMode,
  extendedView: "full" as ExtendedMapView,
  zoom: 16,
  room: "302",
  size: "medium" as const,
  orientation: "horizontal" as const,
  initialFolded: false,
  allowFoldToggle: true,
  allowModeToggle: true,
  showControls: true,
  showDirectionsButton: true,
  showCopyAddressButton: true,
  accessType: "code" as const,
  coordinates: DEFAULT_CAMPUS_COORDINATES,
};

function resolveLocale(
  customLocale?: string,
  resolvedLang?: string,
  lang?: string,
): string {
  if (customLocale) return customLocale;
  if (resolvedLang) return resolvedLang;
  if (lang) return lang;
  return "en";
}

function resolveSheetTexts(
  t: (key: string, fallback: string) => string,
  campusName?: string,
  buildingName?: string,
  instructions?: string,
) {
  const campus = campusName || t("mapSheet.defaultCampus", "AptiSpace Campus");
  const building =
    buildingName || t("mapSheet.defaultBuilding", "Main Academic Hall");
  const accessInstructions =
    instructions ||
    t(
      "mapSheet.defaultInstructions",
      "Scan student badge or enter keycode at the main glass entrance door.",
    );
  return { campus, building, instructions: accessInstructions };
}

interface FloatingOverlayDeckProps {
  campus: string;
  building: string;
  roomInfo: ReturnType<typeof parseRoomCode>;
  doorCode?: string;
  instructions?: string;
  isCodeCopied: boolean;
  onCopyDoorCode: () => void;
  labels: {
    campus: string;
    building: string;
    room: string;
    floor: string;
    instructions: string;
    doorCode: string;
    copiedDoorCode: string;
    copyAddress: string;
    copiedAddress: string;
    directions: string;
    copy: string;
  };
}

function FloatingOverlayDeck(props: FloatingOverlayDeckProps) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 1,
        width: "100%",
      }}
    >
      <CompactChipsItinerary
        campus={props.campus}
        building={props.building}
        roomInfo={props.roomInfo}
        doorCode={props.doorCode}
        instructions={props.instructions}
        isCodeCopied={props.isCodeCopied}
        onCopyDoorCode={props.onCopyDoorCode}
        labels={props.labels}
      />
    </Box>
  );
}

/**
 * MapSheet Molecule Component
 *
 * Displays an OpenStreetMap (OSM) address card with a 3D accordion paper map
 * unfolding animation on load, alongside step-by-step classroom wayfinding
 * (Campus, Building, Floor & Room Chip e.g. 302 = (3 | 02), and door access code).
 */
export const MapSheet = forwardRef<HTMLElement, MapSheetProps>(
  function MapSheet(props, ref) {
    const config = useMemo(() => ({ ...DEFAULTS, ...props }), [props]);
    const { t, i18n } = useTranslation("common");

    const activeLocale = resolveLocale(
      props.locale,
      i18n.resolvedLanguage,
      i18n.language,
    );

    const [internalMode, setInternalMode] = useState<MapSheetMode>(
      props.mode ?? config.mode,
    );
    const currentMode = props.mode ?? internalMode;

    const [internalExtendedView, setInternalExtendedView] =
      useState<ExtendedMapView>(props.extendedView ?? config.extendedView);
    const currentExtendedView = props.extendedView ?? internalExtendedView;

    const [isFolded, setIsFolded] = useState<boolean>(config.initialFolded);
    const [currentZoom, setCurrentZoom] = useState<number>(config.zoom);
    const [copiedField, setCopiedField] = useState<"code" | "address" | null>(
      null,
    );

    useEffect(() => {
      if (!config.initialFolded) {
        setIsFolded(true);
        const timer = setTimeout(() => setIsFolded(false), 120);
        return () => clearTimeout(timer);
      }
    }, [config.initialFolded]);

    const roomInfo = useMemo(
      () =>
        parseRoomCode(
          config.room,
          config.floor,
          config.roomNumber,
          activeLocale,
        ),
      [config.room, config.floor, config.roomNumber, activeLocale],
    );

    const sheetTexts = resolveSheetTexts(
      t,
      config.campusName,
      config.buildingName,
      config.instructions,
    );

    const osmEmbedUrl = useMemo(
      () => buildOsmEmbedUrl(config.coordinates, currentZoom),
      [config.coordinates, currentZoom],
    );

    const dmsCoords = useMemo(
      () => formatCoordinatesDMS(config.coordinates),
      [config.coordinates],
    );

    const handleToggleFold = useCallback(() => {
      setIsFolded((prev) => {
        const next = !prev;
        config.onFoldChange?.(next);
        return next;
      });
    }, [config]);

    const handleToggleMode = useCallback(() => {
      const nextMode = currentMode === "compact" ? "extended" : "compact";
      setInternalMode(nextMode);
      config.onModeChange?.(nextMode);
    }, [currentMode, config]);

    const handleToggleExtendedView = useCallback(() => {
      const nextView = currentExtendedView === "full" ? "split" : "full";
      setInternalExtendedView(nextView);
      config.onExtendedViewChange?.(nextView);
    }, [currentExtendedView, config]);

    const clearCodeCopied = useCallback(() => {
      setCopiedField((prev) => (prev === "code" ? null : prev));
    }, []);

    const clearAddressCopied = useCallback(() => {
      setCopiedField((prev) => (prev === "address" ? null : prev));
    }, []);

    const handleCopyDoorCode = useCallback(async () => {
      if (!config.doorCode) return;
      try {
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(config.doorCode);
        }
      } catch {
        // clipboard fallback
      }
      setCopiedField("code");
      config.onCopyDoorCode?.(config.doorCode);
      setTimeout(clearCodeCopied, 2200);
    }, [config, clearCodeCopied]);

    const handleCopyAddress = useCallback(async () => {
      if (!config.address) return;
      try {
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(config.address);
        }
      } catch {
        // clipboard fallback
      }
      setCopiedField("address");
      config.onCopyAddress?.(config.address);
      setTimeout(clearAddressCopied, 2200);
    }, [config, clearAddressCopied]);

    const handleDirections = useCallback(() => {
      if (config.onDirectionsClick) {
        config.onDirectionsClick(config.coordinates, config.address);
        return;
      }
      const url = buildDirectionsUrl(config.coordinates, config.address);
      window.open(url, "_blank", "noopener,noreferrer");
    }, [config]);

    const labels = useMemo(
      () => ({
        campus: t("mapSheet.campus", "Campus"),
        building: t("mapSheet.building", "Building"),
        room: t("mapSheet.room", "Room"),
        floor: t("mapSheet.floor", "Floor"),
        instructions: t("mapSheet.instructions", "Instructions"),
        doorCode: t("mapSheet.doorCode", "Door Code"),
        copiedDoorCode: t("mapSheet.copiedDoorCode", "Door code copied!"),
        copyAddress: t("mapSheet.copyAddress", "Copy Address"),
        copiedAddress: t("mapSheet.copiedAddress", "Address copied to clipboard!"),
        directions: t("mapSheet.getDirections", "Directions"),
        copy: t("common.copy", "Copy"),
      }),
      [t],
    );

    const isFullMap =
      currentMode === "extended" && currentExtendedView === "full";
    const showSideItinerary = !isFullMap;

    const floatingOverlayContent = isFullMap ? (
      <FloatingOverlayDeck
        campus={sheetTexts.campus}
        building={sheetTexts.building}
        roomInfo={roomInfo}
        doorCode={config.doorCode}
        instructions={sheetTexts.instructions}
        isCodeCopied={copiedField === "code"}
        onCopyDoorCode={handleCopyDoorCode}
        labels={labels}
      />
    ) : null;

    return (
      <SheetCard
        ref={ref}
        $size={config.size}
        $orientation={config.orientation}
        $mode={currentMode}
        className={config.className}
        style={config.style}
        role="region"
        aria-label={t("mapSheet.title", "Location & Access")}
        data-testid="map-sheet"
      >
        <CardBodyWrapper
          $orientation={config.orientation}
          $size={config.size}
        >
          <MapSheetViewport
            mode={currentMode}
            extendedView={currentExtendedView}
            size={config.size}
            orientation={config.orientation}
            isFolded={isFolded}
            initialFolded={config.initialFolded}
            osmEmbedUrl={osmEmbedUrl}
            coordinates={config.coordinates}
            currentZoom={currentZoom}
            dmsCoords={dmsCoords}
            showControls={config.showControls}
            allowFoldToggle={config.allowFoldToggle}
            allowModeToggle={config.allowModeToggle}
            onToggleFold={handleToggleFold}
            onToggleMode={handleToggleMode}
            onToggleExtendedView={handleToggleExtendedView}
            onZoomIn={() => setCurrentZoom((z) => Math.min(z + 1, 19))}
            onZoomOut={() => setCurrentZoom((z) => Math.max(z - 1, 10))}
            onResetZoom={() => setCurrentZoom(config.zoom)}
            titleOsm={t("mapSheet.openOsm", "OpenStreetMap")}
            labelFolded={t("mapSheet.foldStatusFolded", "Folded")}
            labelUnfolded={t("mapSheet.foldStatusUnfolded", "Unfolded")}
            labelZoomIn={t("mapSheet.zoomIn", "Zoom In")}
            labelZoomOut={t("mapSheet.zoomOut", "Zoom Out")}
            labelResetView={t("mapSheet.resetView", "Reset View")}
            labelUnfoldMap={t("mapSheet.unfoldMap", "Unfold Map")}
            labelFoldMap={t("mapSheet.foldMap", "Fold Map")}
            labelExpandMap={t("mapSheet.expandMap", "Extended Full Map")}
            labelCollapseMap={t("mapSheet.collapseMap", "Compact Map View")}
            labelFullMapView={t("mapSheet.fullMapView", "Full Map View")}
            labelSplitView={t("mapSheet.splitView", "Side-by-Side Steps")}
          >
            {floatingOverlayContent}
          </MapSheetViewport>

          {showSideItinerary ? (
            <MapSheetItinerary
              mode={currentMode}
              size={config.size}
              orientation={config.orientation}
              campus={sheetTexts.campus}
              building={sheetTexts.building}
              roomInfo={roomInfo}
              doorCode={config.doorCode}
              instructions={sheetTexts.instructions}
              accessType={config.accessType}
              copiedField={copiedField}
              onCopyDoorCode={handleCopyDoorCode}
              labels={labels}
            />
          ) : null}
        </CardBodyWrapper>

        {/* Full-width address and actions bar spanning across the bottom of the card */}
        <ActionsSection
          address={config.address}
          isAddressCopied={copiedField === "address"}
          showCopyAddressButton={config.showCopyAddressButton}
          showDirectionsButton={config.showDirectionsButton}
          onCopyAddress={handleCopyAddress}
          onDirections={handleDirections}
          labels={labels}
        />
      </SheetCard>
    );
  },
);

MapSheet.displayName = "MapSheet";
export default MapSheet;
