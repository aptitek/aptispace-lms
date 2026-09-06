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
  MapCardProps,
  MapCardMode,
  ExtendedMapView,
} from "./MapCard.types";
import {
  DEFAULT_CAMPUS_COORDINATES,
  parseRoomCode,
  buildOsmEmbedUrl,
  buildDirectionsUrl,
  formatCoordinatesDMS,
} from "./MapCard.utils";
import { SheetCard, CardBodyWrapper } from "./MapCard.styles";
import { MapCardViewport } from "./MapCardViewport";
import {
  MapCardItinerary,
  CompactChipsItinerary,
  ActionsSection,
} from "./MapCardItinerary";

const DEFAULTS = {
  mode: "compact" as MapCardMode,
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
  const campus = campusName || t("mapCard.defaultCampus", "AptiSpace Campus");
  const building =
    buildingName || t("mapCard.defaultBuilding", "Main Academic Hall");
  const accessInstructions =
    instructions ||
    t(
      "mapCard.defaultInstructions",
      "Scan student badge or enter keycode at the main glass entrance door.",
    );
  return { campus, building, instructions: accessInstructions };
}

interface FloatingOverlayDeckProps {
  campus: string;
  building: string;
  roomInfo: ReturnType<typeof parseRoomCode>;
  size?: MapCardProps["size"];
  orientation?: MapCardProps["orientation"];
  doorCode?: string;
  instructions?: string;
  accessType?: MapCardProps["accessType"];
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
        size={props.size}
        orientation={props.orientation}
        doorCode={props.doorCode}
        instructions={props.instructions}
        accessType={props.accessType}
        isCodeCopied={props.isCodeCopied}
        onCopyDoorCode={props.onCopyDoorCode}
        labels={props.labels}
      />
    </Box>
  );
}

/**
 * MapCard Molecule Component
 *
 * Displays an OpenStreetMap (OSM) address card with a 3D accordion paper map
 * unfolding animation on load, alongside step-by-step classroom wayfinding
 * (Campus, Building, Floor & Room Chip e.g. 302 = (3 | 02), and door access code).
 */
export const MapCard = forwardRef<HTMLElement, MapCardProps>(
  function MapCard(props, ref) {
    const config = useMemo(() => ({ ...DEFAULTS, ...props }), [props]);
    const { t, i18n } = useTranslation("common");

    const activeLocale = resolveLocale(
      props.locale,
      i18n.resolvedLanguage,
      i18n.language,
    );

    const [internalMode, setInternalMode] = useState<MapCardMode>(
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
        parseRoomCode(config.room, config.floor, config.roomNumber, {
          locale: activeLocale,
          roomName: config.roomName,
        }),
      [
        config.room,
        config.floor,
        config.roomNumber,
        activeLocale,
        config.roomName,
      ],
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
        campus: t("mapCard.campus", "Campus"),
        building: t("mapCard.building", "Building"),
        room: t("mapCard.room", "Room"),
        floor: t("mapCard.floor", "Floor"),
        instructions: t("mapCard.instructions", "Instructions"),
        doorCode: t("mapCard.doorCode", "Door Code"),
        copiedDoorCode: t("mapCard.copiedDoorCode", "Door code copied!"),
        copyAddress: t("mapCard.copyAddress", "Copy Address"),
        copiedAddress: t(
          "mapCard.copiedAddress",
          "Address copied to clipboard!",
        ),
        directions: t("mapCard.getDirections", "Directions"),
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
        size={config.size}
        orientation={config.orientation}
        doorCode={config.doorCode}
        instructions={sheetTexts.instructions}
        accessType={config.accessType}
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
        aria-label={t("mapCard.title", "Location & Access")}
        data-testid="map-sheet"
      >
        <CardBodyWrapper $orientation={config.orientation} $size={config.size}>
          <MapCardViewport
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
            titleOsm={t("mapCard.openOsm", "OpenStreetMap")}
            labelFolded={t("mapCard.foldStatusFolded", "Folded")}
            labelUnfolded={t("mapCard.foldStatusUnfolded", "Unfolded")}
            labelZoomIn={t("mapCard.zoomIn", "Zoom In")}
            labelZoomOut={t("mapCard.zoomOut", "Zoom Out")}
            labelResetView={t("mapCard.resetView", "Reset View")}
            labelUnfoldMap={t("mapCard.unfoldMap", "Unfold Map")}
            labelFoldMap={t("mapCard.foldMap", "Fold Map")}
            labelExpandMap={t("mapCard.expandMap", "Extended Full Map")}
            labelCollapseMap={t("mapCard.collapseMap", "Compact Map View")}
            labelFullMapView={t("mapCard.fullMapView", "Full Map View")}
            labelSplitView={t("mapCard.splitView", "Side-by-Side Steps")}
          >
            {floatingOverlayContent}
          </MapCardViewport>

          {showSideItinerary ? (
            <MapCardItinerary
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
          size={config.size}
        />
      </SheetCard>
    );
  },
);

MapCard.displayName = "MapCard";
export const MapSheet = MapCard;
export default MapCard;
