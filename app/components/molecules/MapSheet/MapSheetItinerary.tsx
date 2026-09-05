import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import { useTheme, alpha } from "@mui/material/styles";

// Icons
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import ApartmentRoundedIcon from "@mui/icons-material/ApartmentRounded";
import MeetingRoomRoundedIcon from "@mui/icons-material/MeetingRoomRounded";
import LayersRoundedIcon from "@mui/icons-material/LayersRounded";
import DialpadRoundedIcon from "@mui/icons-material/DialpadRounded";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import NavigationRoundedIcon from "@mui/icons-material/NavigationRounded";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

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
  DoorCodePill,
  BottomActionsBar,
  AddressTextWrapper,
  ChipsDeckRow,
  WayfindingChip,
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

import { ExtendedStepperItinerary } from "./MapSheetStepper";

interface ActionsSectionProps {
  address: string;
  isAddressCopied: boolean;
  showCopyAddressButton: boolean;
  showDirectionsButton: boolean;
  onCopyAddress: () => void;
  onDirections: () => void;
  labels: MapSheetLabels;
}

export function ActionsSection({
  address,
  isAddressCopied,
  showCopyAddressButton,
  showDirectionsButton,
  onCopyAddress,
  onDirections,
  labels,
}: ActionsSectionProps) {
  const theme = useTheme();

  return (
    <BottomActionsBar data-testid="map-bottom-actions">
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
      </AddressTextWrapper>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 0.75,
          flexShrink: 0,
        }}
      >
        {showCopyAddressButton ? (
          <Tooltip
            arrow
            title={isAddressCopied ? labels.copiedAddress : labels.copyAddress}
          >
            <IconButton
              size="small"
              onClick={onCopyAddress}
              aria-label={labels.copyAddress}
              data-testid="copy-address-button"
              sx={{
                color: isAddressCopied ? "success.main" : "text.secondary",
                p: 0.5,
              }}
            >
              {isAddressCopied ? (
                <CheckRoundedIcon fontSize="small" />
              ) : (
                <ContentCopyRoundedIcon fontSize="small" />
              )}
            </IconButton>
          </Tooltip>
        ) : null}

        {showDirectionsButton ? (
          <Tooltip arrow title={labels.directions}>
            <IconButton
              size="small"
              onClick={onDirections}
              aria-label={labels.directions}
              data-testid="get-directions-button"
              sx={{
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                borderRadius: "8px",
                p: 0.6,
                "&:hover": {
                  backgroundColor: theme.palette.primary.dark,
                  boxShadow: `0 3px 10px ${alpha(theme.palette.primary.main, 0.35)}`,
                },
              }}
            >
              <NavigationRoundedIcon sx={{ fontSize: "1.05rem" }} />
            </IconButton>
          </Tooltip>
        ) : null}
      </Box>
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
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleOpen = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Tooltip arrow title={label}>
        <WayfindingChip
          $variant="instruction"
          onClick={handleOpen}
          aria-haspopup="true"
          aria-expanded={Boolean(anchorEl)}
          data-testid="instructions-menu-trigger"
          sx={{ cursor: "pointer" }}
        >
          <InfoOutlinedIcon
            sx={{ fontSize: "0.85rem", color: "warning.main" }}
          />
          <span>{label}</span>
        </WayfindingChip>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        data-testid="instructions-menu"
        slotProps={{
          paper: {
            sx: {
              maxWidth: 360,
              p: 1.5,
              borderRadius: "12px",
              boxShadow: (theme) =>
                `0 8px 24px ${alpha(theme.palette.common.black, 0.16)}`,
            },
          },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1, p: 0.5 }}>
          <InfoOutlinedIcon
            sx={{
              fontSize: "1.1rem",
              color: "warning.main",
              mt: 0.25,
              flexShrink: 0,
            }}
          />
          <Box sx={{ minWidth: 0 }}>
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 800, mb: 0.5, color: "text.primary" }}
            >
              {label}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "text.secondary",
                lineHeight: 1.5,
                fontSize: "0.8125rem",
                wordBreak: "break-word",
              }}
            >
              {instructions}
            </Typography>
          </Box>
        </Box>
      </Menu>
    </>
  );
}

export interface CompactChipsItineraryProps {
  campus: string;
  building: string;
  roomInfo: ParsedRoomInfo;
  floorPrefix?: string;
  doorCode?: string;
  instructions?: string;
  isCodeCopied: boolean;
  onCopyDoorCode: () => void;
  labels: MapSheetLabels;
}

export function CompactChipsItinerary({
  campus,
  building,
  roomInfo,
  doorCode,
  instructions,
  isCodeCopied,
  onCopyDoorCode,
  labels,
}: CompactChipsItineraryProps) {
  const cleanCampus = cleanCampusName(campus);
  const cleanBuilding = cleanBuildingName(building);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1, minWidth: 0 }}>
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
              sx={{ fontSize: "0.85rem", color: "info.main" }}
            />
            <span>{cleanBuilding}</span>
          </WayfindingChip>
        </Tooltip>

        {/* Room & Floor Chip: (3 | 02) - Prominently sized at the end of the location hierarchy */}
        <Tooltip arrow title={roomInfo.tooltipText}>
          <RoomChipContainer
            tabIndex={0}
            role="note"
            aria-label={roomInfo.tooltipText}
            data-testid="room-floor-chip"
          >
            <Tooltip arrow title={roomInfo.floorLabel}>
              <FloorPill data-testid="floor-pill">
                <LayersRoundedIcon sx={{ fontSize: "0.95rem" }} />
                <span>{roomInfo.floor}</span>
              </FloorPill>
            </Tooltip>
            <ChipDivider aria-hidden="true">|</ChipDivider>
            <Tooltip arrow title={roomInfo.roomLabel}>
              <RoomPill data-testid="room-pill">
                <MeetingRoomRoundedIcon sx={{ fontSize: "0.95rem" }} />
                <span>{roomInfo.roomNumber}</span>
              </RoomPill>
            </Tooltip>
          </RoomChipContainer>
        </Tooltip>

        {/* Door Code Pill */}
        {doorCode ? (
          <DoorCodePill data-testid="door-code-pill">
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <DialpadRoundedIcon sx={{ fontSize: "0.85rem" }} />
              <span>{doorCode}</span>
            </Box>
            <Tooltip
              arrow
              title={isCodeCopied ? labels.copiedDoorCode : labels.copy}
            >
              <IconButton
                size="small"
                onClick={onCopyDoorCode}
                aria-label={labels.doorCode}
                data-testid="copy-door-code-button"
                sx={{
                  p: 0.25,
                  color: isCodeCopied ? "success.main" : "inherit",
                }}
              >
                {isCodeCopied ? (
                  <CheckRoundedIcon sx={{ fontSize: "0.85rem" }} />
                ) : (
                  <ContentCopyRoundedIcon sx={{ fontSize: "0.85rem" }} />
                )}
              </IconButton>
            </Tooltip>
          </DoorCodePill>
        ) : null}

        {/* Instructions Menu Trigger */}
        {instructions ? (
          <InstructionsMenuTrigger
            instructions={instructions}
            label={labels.instructions}
          />
        ) : null}
      </ChipsDeckRow>
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
          doorCode={doorCode}
          instructions={instructions}
          isCodeCopied={copiedField === "code"}
          onCopyDoorCode={onCopyDoorCode}
          labels={labels}
        />
      ) : (
        <ExtendedStepperItinerary
          campus={campus}
          building={building}
          roomInfo={roomInfo}
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
