import React, { forwardRef, useState, useMemo, useCallback } from "react";
import { useTranslation } from "react-i18next";

import type { MapCardProps } from "./MapCard.types";
import { parseRoomCode } from "./MapCard.utils";
import { SheetCard, CardBodyWrapper } from "./MapCard.styles";
import MapCardWayfinding from "./MapCardWayfinding";
import MapCardViewport from "./MapCardViewport";
import MapCardFooter from "./MapCardFooter";
import MapCardSkeleton from "./MapCardSkeleton";
import { useMapCardEditableState } from "./useMapCardEditableState";

function normalizeCardSettings(props: MapCardProps) {
  return {
    size: props.size ?? "medium",
    orientation: props.orientation ?? "horizontal",
    zoom: props.zoom,
    pitch: props.pitch,
    bearing: props.bearing,
    initialFolded: Boolean(props.initialFolded),
    showControls: Boolean(props.showControls),
    showInstructionBanner: Boolean(props.showInstructionBanner),
    editable: Boolean(props.editable),
    testId: props.testId ?? "map-card",
  };
}

function resolveCardLabels(
  t: (key: string, fallback: string) => string,
  customTitle?: string,
) {
  const fallbackTitle = t("mapCard.title", "Accès & Localisation");
  return {
    ariaLabel: customTitle || fallbackTitle,
    titleOsm: t("mapCard.openOsm", "OpenStreetMap"),
    copyAddressLabel: t("mapCard.copyAddress", "Copier l'adresse"),
    copiedAddressLabel: t(
      "mapCard.copiedAddress",
      "Adresse copiée dans le presse-papier !",
    ),
    getDirectionsLabel: t("mapCard.getDirections", "Naviguer avec le GPS"),
  };
}

export const MapCard = forwardRef<HTMLDivElement, MapCardProps>(
  function MapCard(props, ref) {
    const {
      address,
      coordinates,
      campusName,
      buildingName,
      room,
      roomName,
      floor,
      roomNumber,
      doorCode,
      accessType,
      hasBadge,
      instructions,
      title,
      chipOrientation,
      locale,
      children,
      className,
      style,
      onCopyAddress,
      onCopyDoorCode,
      onDirectionsClick,
      onFoldChange,
      onAddressChange,
      onCoordinatesChange,
      customGeocodeService,
      onBadgeChange,
      onInstructionsChange,
      onCampusChange,
      onBuildingChange,
      onFloorChange,
      onRoomChange,
      onDoorCodeChange,
    } = props;

    const {
      size,
      orientation,
      zoom,
      pitch,
      bearing,
      initialFolded,
      showControls,
      showInstructionBanner,
      editable,
      testId,
    } = normalizeCardSettings(props);

    const { t, i18n } = useTranslation("common");
    const activeLocale = locale || i18n?.language || "en";

    const [isCodeCopied, setIsCodeCopied] = useState<boolean>(false);

    const {
      localAddress,
      localCoordinates,
      localCampus,
      localBuilding,
      localFloor,
      localRoom,
      localDoorCode,
      localInstructions,
      localHasBadge,
      handleAddressChange,
      handleCoordinatesChange,
      handleCampusChange,
      handleBuildingChange,
      handleFloorChange,
      handleRoomChange,
      handleDoorCodeChange,
      handleBadgeChange,
      handleInstructionsChange,
    } = useMapCardEditableState({
      address,
      coordinates,
      campusName,
      buildingName,
      floor,
      room,
      doorCode,
      instructions,
      hasBadge,
      accessType,
      onAddressChange,
      onCoordinatesChange,
      onCampusChange,
      onBuildingChange,
      onFloorChange,
      onRoomChange,
      onDoorCodeChange,
      onBadgeChange,
      onInstructionsChange,
    });

    const resolvedCoordinates = localCoordinates ?? coordinates;

    // Parse room string into structured components (floor, roomNumber, labels)
    const roomInfo = useMemo(
      () =>
        parseRoomCode(localRoom, localFloor, roomNumber, {
          locale: activeLocale,
          roomName,
        }),
      [localRoom, localFloor, roomNumber, activeLocale, roomName],
    );

    const handleCopyDoorCode = useCallback(async () => {
      if (!doorCode) return;
      setIsCodeCopied(true);
      onCopyDoorCode?.(doorCode);
      try {
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(doorCode);
        }
      } catch {
        // fallback
      }

      setTimeout(() => {
        setIsCodeCopied(false);
      }, 2000);
    }, [doorCode, onCopyDoorCode]);

    const labels = resolveCardLabels(t, title);

    if (props.isLoading) {
      return (
        <MapCardSkeleton
          size={size}
          orientation={orientation}
          className={className}
          style={style}
          testId={
            props.testId ? `${props.testId}-skeleton` : "map-card-skeleton"
          }
        />
      );
    }

    return (
      <SheetCard
        ref={ref}
        $size={size}
        $orientation={orientation}
        className={className}
        style={style}
        role="region"
        aria-label={labels.ariaLabel}
        data-testid={testId}
      >
        <CardBodyWrapper $size={size} $orientation={orientation}>
          {/* Left / Top side: Wayfinding with prominent segmented chip and optional access chip */}
          <MapCardWayfinding
            campusName={localCampus}
            buildingName={localBuilding}
            roomInfo={roomInfo}
            doorCode={localDoorCode}
            accessType={accessType}
            instructions={localInstructions}
            showInstructionBanner={showInstructionBanner}
            size={size}
            orientation={orientation}
            chipOrientation={chipOrientation}
            isCodeCopied={isCodeCopied}
            onCopyDoorCode={handleCopyDoorCode}
            title={title}
            editable={editable}
            hasBadge={localHasBadge}
            onBadgeChange={handleBadgeChange}
            onInstructionsChange={handleInstructionsChange}
            onCampusChange={handleCampusChange}
            onBuildingChange={handleBuildingChange}
            onFloorChange={handleFloorChange}
            onRoomChange={handleRoomChange}
            onDoorCodeChange={handleDoorCodeChange}
          >
            {children}
          </MapCardWayfinding>

          {/* Right / Top side: MapLibre vector map with 3D origami paper unfolding animation */}
          <MapCardViewport
            coordinates={resolvedCoordinates}
            zoom={zoom}
            pitch={pitch}
            bearing={bearing}
            size={size}
            orientation={orientation}
            initialFolded={initialFolded}
            showControls={showControls}
            titleOsm={labels.titleOsm}
            mapStyle={props.mapStyle}
            mapWidth={props.mapWidth}
            tileProviderKey={props.tileProviderKey}
            pinLabel={
              props.pinLabel !== undefined ? props.pinLabel : campusName
            }
            pinColor={props.pinColor ?? "var(--color-solarized-green, #859900)"}
            disableWebGL={props.disableWebGL}
            fallback={props.fallback}
            onFoldChange={onFoldChange}
          />
        </CardBodyWrapper>

        {/* Bottom Footer: Full address, copy button, and navigation FloatingActionButton */}
        <MapCardFooter
          address={localAddress}
          coordinates={resolvedCoordinates}
          onCopyAddress={onCopyAddress}
          onDirectionsClick={onDirectionsClick}
          copyLabel={labels.copyAddressLabel}
          copiedLabel={labels.copiedAddressLabel}
          navigateLabel={labels.getDirectionsLabel}
          editable={editable}
          onAddressChange={handleAddressChange}
          onCoordinatesChange={handleCoordinatesChange}
          customGeocodeService={customGeocodeService}
        />
      </SheetCard>
    );
  },
);

MapCard.displayName = "MapCard";
export default MapCard;
