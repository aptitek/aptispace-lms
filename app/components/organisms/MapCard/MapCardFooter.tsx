import React, { useState, useCallback } from "react";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import NavigationRoundedIcon from "@mui/icons-material/NavigationRounded";
import Tooltip from "@mui/material/Tooltip";

import FloatingActionButton from "~/components/atoms/FloatingActionButton";
import type { MapCoordinates } from "./MapCard.types";
import { buildDirectionsUrl } from "./MapCard.utils";
import {
  FooterActionsBar,
  AddressContainer,
  AddressLabelText,
  FooterButtonsGroup,
  CopyActionButton,
} from "./MapCard.styles";

export interface MapCardFooterProps {
  address: string;
  coordinates?: MapCoordinates;
  onCopyAddress?: (address: string) => void;
  onDirectionsClick?: (coordinates?: MapCoordinates, address?: string) => void;
  copyLabel?: string;
  copiedLabel?: string;
  navigateLabel?: string;
}

export function MapCardFooter({
  address,
  coordinates,
  onCopyAddress,
  onDirectionsClick,
  copyLabel = "Copier l'adresse",
  copiedLabel = "Adresse copiée !",
  navigateLabel = "Naviguer avec le GPS",
}: MapCardFooterProps) {
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const handleCopy = useCallback(async () => {
    if (!address) return;
    setIsCopied(true);
    onCopyAddress?.(address);
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(address);
      }
    } catch {
      // fallback
    }

    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  }, [address, onCopyAddress]);

  const handleNavigate = useCallback(() => {
    if (onDirectionsClick) {
      onDirectionsClick(coordinates, address);
      return;
    }

    const directionsUrl = buildDirectionsUrl(coordinates, address);
    window.open(directionsUrl, "_blank", "noopener,noreferrer");
  }, [coordinates, address, onDirectionsClick]);

  return (
    <FooterActionsBar data-testid="map-card-footer">
      <AddressContainer>
        <PlaceRoundedIcon
          sx={{ fontSize: 20, color: "primary.main", flexShrink: 0 }}
          data-testid="address-icon"
        />
        <Tooltip title={address} arrow placement="top-start">
          <AddressLabelText data-testid="address-text">
            {address}
          </AddressLabelText>
        </Tooltip>
      </AddressContainer>

      <FooterButtonsGroup>
        <Tooltip
          title={isCopied ? copiedLabel : copyLabel}
          arrow
          placement="top"
        >
          <CopyActionButton
            onClick={handleCopy}
            aria-label={isCopied ? copiedLabel : copyLabel}
            data-testid="btn-copy-address"
            size="small"
          >
            {isCopied ? (
              <CheckRoundedIcon sx={{ fontSize: 18, color: "success.main" }} />
            ) : (
              <ContentCopyRoundedIcon sx={{ fontSize: 18 }} />
            )}
          </CopyActionButton>
        </Tooltip>

        <FloatingActionButton
          tooltip={navigateLabel}
          onClick={handleNavigate}
          testId="fab-navigate-gps"
          icon={<NavigationRoundedIcon sx={{ fontSize: 24 }} />}
        />
      </FooterButtonsGroup>
    </FooterActionsBar>
  );
}

export default MapCardFooter;
