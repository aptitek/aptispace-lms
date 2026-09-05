import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import AccessCodeChip from "./MapSheetAccessChip";

// Icons
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import ApartmentRoundedIcon from "@mui/icons-material/ApartmentRounded";
import MeetingRoomRoundedIcon from "@mui/icons-material/MeetingRoomRounded";
import LayersRoundedIcon from "@mui/icons-material/LayersRounded";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import NavigationRoundedIcon from "@mui/icons-material/NavigationRounded";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";

import Tooltip from "../../atoms/Tooltip";
import { cleanCampusName, cleanBuildingName } from "./MapSheet.utils";
import type {
  MapSheetSize,
  MapSheetOrientation,
  MapSheetMode,
  ParsedRoomInfo,
  AccessType,
} from "./MapSheet.types";
import {
  ItineraryContainer,
  RoomChipContainer,
  FloorPill,
  ChipDivider,
  RoomPill,
  BottomActionsBar,
  AddressTextWrapper,
  ChipsDeckWrapper,
  ChipsDeckRow,
  WayfindingChip,
  NavigationM3Fab,
} from "./MapSheet.styles";

export interface MapSheetLabels {
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
}

export interface MapSheetItineraryProps {
  mode: MapSheetMode;
  size: MapSheetSize;
  orientation: MapSheetOrientation;
  campus: string;
  building: string;
  roomInfo: ParsedRoomInfo;
  doorCode?: string;
  instructions?: string;
  accessType?: AccessType;
  copiedField?: "code" | "address" | null;
  onCopyDoorCode: () => void;
  labels: MapSheetLabels;
}

import {
  ExtendedStepperItinerary,
  HorizontalTransitTrackLine,
} from "./MapSheetStepper";

interface ActionsSectionProps {
  address: string;
  isAddressCopied: boolean;
  showCopyAddressButton: boolean;
  showDirectionsButton: boolean;
  onCopyAddress: () => void;
  onDirections: () => void;
  labels: MapSheetLabels;
  size?: MapSheetSize;
}

const PAD_MAP: Record<MapSheetSize, string> = {
  small: "52px",
  medium: "58px",
  large: "64px",
};

const FAB_ICON_SIZE_MAP: Record<MapSheetSize, string> = {
  small: "1.15rem",
  medium: "1.3rem",
  large: "1.45rem",
};

function getRightPad(
  showDirectionsButton: boolean,
  size: MapSheetSize,
): string {
  if (!showDirectionsButton) return "14px";
  return PAD_MAP[size] ?? "58px";
}

interface CopyAddressButtonProps {
  isAddressCopied: boolean;
  onCopyAddress: () => void;
  labels: MapSheetLabels;
}

function CopyAddressButton({
  isAddressCopied,
  onCopyAddress,
  labels,
}: CopyAddressButtonProps) {
  const title = isAddressCopied ? labels.copiedAddress : labels.copyAddress;
  return (
    <Tooltip arrow title={title}>
      <IconButton
        size="small"
        onClick={onCopyAddress}
        aria-label={labels.copyAddress}
        data-testid="copy-address-button"
        sx={{
          color: isAddressCopied ? "success.main" : "text.secondary",
          p: 0.5,
          flexShrink: 0,
        }}
      >
        {isAddressCopied ? (
          <CheckRoundedIcon fontSize="small" />
        ) : (
          <ContentCopyRoundedIcon fontSize="small" />
        )}
      </IconButton>
    </Tooltip>
  );
}

export function ActionsSection({
  address,
  isAddressCopied,
  showCopyAddressButton,
  showDirectionsButton,
  onCopyAddress,
  onDirections,
  labels,
  size = "medium",
}: ActionsSectionProps) {
  const rightPad = getRightPad(showDirectionsButton, size);
  const iconSize = FAB_ICON_SIZE_MAP[size] ?? "1.3rem";

  return (
    <BottomActionsBar data-testid="map-bottom-actions" sx={{ pr: rightPad }}>
      <AddressTextWrapper>
        <LocationOnRoundedIcon
          fontSize="small"
          sx={{ color: "primary.main", flexShrink: 0 }}
        />
        <Tooltip arrow title={address}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 600,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              color: "text.primary",
              fontSize: "0.8rem",
            }}
          >
            {address}
          </Typography>
        </Tooltip>

        {showCopyAddressButton ? (
          <CopyAddressButton
            isAddressCopied={isAddressCopied}
            onCopyAddress={onCopyAddress}
            labels={labels}
          />
        ) : null}
      </AddressTextWrapper>

      {showDirectionsButton ? (
        <Tooltip arrow title={labels.directions}>
          <NavigationM3Fab
            $fabSize={size}
            onClick={onDirections}
            aria-label={labels.directions}
            data-testid="get-directions-button"
          >
            <NavigationRoundedIcon sx={{ fontSize: iconSize }} />
          </NavigationM3Fab>
        </Tooltip>
      ) : null}
    </BottomActionsBar>
  );
}

interface InstructionsMenuTriggerProps {
  instructions: string;
  label: string;
}

export function InstructionsMenuTrigger({
  instructions,
  label,
}: InstructionsMenuTriggerProps) {
  return (
    <AccessCodeChip
      instructions={instructions}
      labels={{
        campus: "",
        building: "",
        room: "",
        floor: "",
        instructions: label,
        doorCode: "",
        copiedDoorCode: "",
        copyAddress: "",
        copiedAddress: "",
        directions: "",
        copy: "",
      }}
    />
  );
}

export interface CompactChipsItineraryProps {
  campus: string;
  building: string;
  roomInfo: ParsedRoomInfo;
  size?: MapSheetSize;
  orientation?: MapSheetOrientation;
  floorPrefix?: string;
  doorCode?: string;
  instructions?: string;
  accessType?: AccessType;
  isCodeCopied: boolean;
  onCopyDoorCode: () => void;
  labels: MapSheetLabels;
}

export function CompactChipsItinerary({
  campus,
  building,
  roomInfo,
  size = "medium",
  orientation = "horizontal",
  doorCode,
  instructions,
  accessType,
  isCodeCopied,
  onCopyDoorCode,
  labels,
}: CompactChipsItineraryProps) {
  const cleanCampus = cleanCampusName(campus);
  const cleanBuilding = cleanBuildingName(building);
  const isVertical = orientation === "vertical";

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 1,
        minWidth: 0,
        width: "100%",
      }}
    >
      <ChipsDeckWrapper>
        {isVertical ? <HorizontalTransitTrackLine /> : null}
        <ChipsDeckRow data-testid="chips-deck-row">
          {/* Campus Chip */}
          <Tooltip arrow title={`${labels.campus}: ${campus}`}>
            <WayfindingChip
              $variant="campus"
              aria-label={`${labels.campus}: ${campus}`}
              data-testid="chip-campus"
            >
              <SchoolRoundedIcon
                sx={{ fontSize: "0.85rem", color: "success.main" }}
              />
              <span>{cleanCampus}</span>
            </WayfindingChip>
          </Tooltip>

          {/* Building Chip */}
          <Tooltip arrow title={`${labels.building}: ${building}`}>
            <WayfindingChip
              $variant="building"
              aria-label={`${labels.building}: ${building}`}
              data-testid="chip-building"
            >
              <ApartmentRoundedIcon
                sx={{ fontSize: "0.85rem", color: "primary.main" }}
              />
              <span>{cleanBuilding}</span>
            </WayfindingChip>
          </Tooltip>

          {/* Optional Room Name Chip */}
          {roomInfo.roomName ? (
            <Tooltip arrow title={roomInfo.roomName}>
              <WayfindingChip
                $variant="room"
                aria-label={roomInfo.roomName}
                data-testid="chip-room-name"
                sx={{ fontWeight: 800 }}
              >
                <MeetingRoomRoundedIcon sx={{ fontSize: "0.85rem" }} />
                <span>{roomInfo.roomName}</span>
              </WayfindingChip>
            </Tooltip>
          ) : null}

          {/* Room & Floor Chip: (3 | 02) - Prominently sized! */}
          <RoomChipContainer
            $size={size}
            tabIndex={0}
            role="note"
            aria-label={roomInfo.tooltipText}
            data-testid="room-floor-chip"
          >
            <Tooltip arrow title={roomInfo.floorLabel}>
              <FloorPill data-testid="floor-pill">
                <LayersRoundedIcon />
                <span>{roomInfo.floor}</span>
              </FloorPill>
            </Tooltip>
            <ChipDivider aria-hidden="true">|</ChipDivider>
            <Tooltip arrow title={roomInfo.roomLabel}>
              <RoomPill data-testid="room-pill">
                <MeetingRoomRoundedIcon />
                <span>{roomInfo.roomNumber}</span>
              </RoomPill>
            </Tooltip>
          </RoomChipContainer>

          {/* Access Code & Instructions in the same chip */}
          <AccessCodeChip
            doorCode={doorCode}
            instructions={instructions}
            accessType={accessType}
            isCodeCopied={isCodeCopied}
            onCopyDoorCode={onCopyDoorCode}
            labels={labels}
          />
        </ChipsDeckRow>
      </ChipsDeckWrapper>
    </Box>
  );
}

export function MapSheetItinerary({
  mode,
  size,
  orientation,
  campus,
  building,
  roomInfo,
  doorCode,
  instructions,
  accessType,
  copiedField,
  onCopyDoorCode,
  labels,
}: MapSheetItineraryProps) {
  const isCompact = mode === "compact";

  return (
    <ItineraryContainer $size={size} $orientation={orientation} $mode={mode}>
      {isCompact ? (
        <CompactChipsItinerary
          campus={campus}
          building={building}
          roomInfo={roomInfo}
          size={size}
          orientation={orientation}
          doorCode={doorCode}
          instructions={instructions}
          accessType={accessType}
          isCodeCopied={copiedField === "code"}
          onCopyDoorCode={onCopyDoorCode}
          labels={labels}
        />
      ) : (
        <ExtendedStepperItinerary
          campus={campus}
          building={building}
          roomInfo={roomInfo}
          orientation={orientation}
          doorCode={doorCode}
          instructions={instructions}
          accessType={accessType}
          isCodeCopied={copiedField === "code"}
          onCopyDoorCode={onCopyDoorCode}
          labels={labels}
        />
      )}
    </ItineraryContainer>
  );
}

export default MapSheetItinerary;
