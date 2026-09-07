import React, { forwardRef, useState, useMemo, useCallback } from "react";
import { useTranslation } from "react-i18next";

import type { MapCardProps } from "./MapCard.types";
import { parseRoomCode } from "./MapCard.utils";
import { SheetCard, CardBodyWrapper } from "./MapCard.styles";
import MapCardWayfinding from "./MapCardWayfinding";
import MapCardViewport from "./MapCardViewport";
import MapCardFooter from "./MapCardFooter";

function normalizeCardSettings(props: MapCardProps) {
  return {
    size: props.size ?? "medium",
    orientation: props.orientation ?? "horizontal",
    zoom: props.zoom ?? 16,
    initialFolded: Boolean(props.initialFolded),
    showControls: Boolean(props.showControls),
    showInstructionBanner: Boolean(props.showInstructionBanner),
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
    } = props;

    const {
      size,
      orientation,
      zoom,
      initialFolded,
      showControls,
      showInstructionBanner,
      testId,
    } = normalizeCardSettings(props);

    const { t, i18n } = useTranslation("common");
    const activeLocale = locale || i18n?.language || "en";

    const [isCodeCopied, setIsCodeCopied] = useState<boolean>(false);

    // Parse room string into structured components (floor, roomNumber, labels)
    const roomInfo = useMemo(
      () =>
        parseRoomCode(room, floor, roomNumber, {
          locale: activeLocale,
          roomName,
        }),
      [room, floor, roomNumber, activeLocale, roomName],
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
            campusName={campusName}
            buildingName={buildingName}
            roomInfo={roomInfo}
            doorCode={doorCode}
            accessType={accessType}
            instructions={instructions}
            showInstructionBanner={showInstructionBanner}
            size={size}
            orientation={orientation}
            chipOrientation={chipOrientation}
            isCodeCopied={isCodeCopied}
            onCopyDoorCode={handleCopyDoorCode}
            title={title}
          >
            {children}
          </MapCardWayfinding>

          {/* Right / Top side: OSM map with 3D origami paper unfolding animation */}
          <MapCardViewport
            coordinates={coordinates}
            zoom={zoom}
            size={size}
            orientation={orientation}
            initialFolded={initialFolded}
            showControls={showControls}
            titleOsm={labels.titleOsm}
            onFoldChange={onFoldChange}
          />
        </CardBodyWrapper>

        {/* Bottom Footer: Full address, copy button, and navigation FloatingActionButton */}
        <MapCardFooter
          address={address}
          coordinates={coordinates}
          onCopyAddress={onCopyAddress}
          onDirectionsClick={onDirectionsClick}
          copyLabel={labels.copyAddressLabel}
          copiedLabel={labels.copiedAddressLabel}
          navigateLabel={labels.getDirectionsLabel}
        />
      </SheetCard>
    );
  },
);

MapCard.displayName = "MapCard";
export const MapSheet = MapCard;
export default MapCard;
