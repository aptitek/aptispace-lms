import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import ApartmentRoundedIcon from "@mui/icons-material/ApartmentRounded";
import MeetingRoomRoundedIcon from "@mui/icons-material/MeetingRoomRounded";
import LayersRoundedIcon from "@mui/icons-material/LayersRounded";
import VpnKeyRoundedIcon from "@mui/icons-material/VpnKeyRounded";
import BadgeRoundedIcon from "@mui/icons-material/BadgeRounded";
import DialpadRoundedIcon from "@mui/icons-material/DialpadRounded";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

import Tooltip from "../../atoms/Tooltip";
import type { ParsedRoomInfo, AccessType } from "./MapSheet.types";
import {
  TransitLineWrapper,
  TransitTrackLine,
  ItineraryStep,
  StepIconBadge,
  StepContent,
  RoomChipContainer,
  FloorPill,
  ChipDivider,
  RoomPill,
  InstructionBox,
  DoorCodePill,
} from "./MapSheet.styles";

import { cleanCampusName, cleanBuildingName } from "./MapSheet.utils";

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

function resolveAccessIcon(accessType?: AccessType) {
  if (accessType === "badge") {
    return <BadgeRoundedIcon sx={{ fontSize: "1.1rem" }} />;
  }
  if (accessType === "key") {
    return <VpnKeyRoundedIcon sx={{ fontSize: "1.1rem" }} />;
  }
  return <DialpadRoundedIcon sx={{ fontSize: "1.1rem" }} />;
}

interface InstructionSectionProps {
  accessType?: AccessType;
  doorCode?: string;
  instructions?: string;
  isCopied: boolean;
  onCopyDoorCode: () => void;
  labels: MapSheetLabels;
}

export function InstructionSection({
  accessType,
  doorCode,
  instructions,
  isCopied,
  onCopyDoorCode,
  labels,
}: InstructionSectionProps) {
  if (!doorCode && !instructions) return null;

  return (
    <ItineraryStep data-testid="step-instructions">
      <Tooltip arrow title={labels.instructions}>
        <StepIconBadge
          $variant="instruction"
          aria-label={labels.instructions}
        >
          {resolveAccessIcon(accessType)}
        </StepIconBadge>
      </Tooltip>
      <StepContent>
        <InstructionBox>
          {doorCode ? (
            <DoorCodePill data-testid="door-code-pill">
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <DialpadRoundedIcon sx={{ fontSize: "0.95rem" }} />
                <span>{doorCode}</span>
              </Box>

              <Tooltip
                arrow
                title={isCopied ? labels.copiedDoorCode : labels.copy}
              >
                <IconButton
                  size="small"
                  onClick={onCopyDoorCode}
                  aria-label={labels.doorCode}
                  data-testid="copy-door-code-button"
                  sx={{
                    p: 0.5,
                    color: isCopied ? "success.main" : "inherit",
                  }}
                >
                  {isCopied ? (
                    <CheckRoundedIcon fontSize="small" />
                  ) : (
                    <ContentCopyRoundedIcon fontSize="small" />
                  )}
                </IconButton>
              </Tooltip>
            </DoorCodePill>
          ) : null}

          {instructions ? (
            <Box sx={{ display: "flex", alignItems: "flex-start", gap: 0.75 }}>
              <InfoOutlinedIcon
                sx={{
                  fontSize: "0.9rem",
                  color: "warning.main",
                  mt: 0.2,
                  flexShrink: 0,
                }}
              />
              <Typography
                variant="caption"
                sx={{
                  lineHeight: 1.35,
                  color: "text.secondary",
                  fontWeight: 500,
                }}
              >
                {instructions}
              </Typography>
            </Box>
          ) : null}
        </InstructionBox>
      </StepContent>
    </ItineraryStep>
  );
}

export interface ExtendedStepperItineraryProps {
  campus: string;
  building: string;
  roomInfo: ParsedRoomInfo;
  floorPrefix?: string;
  doorCode?: string;
  instructions?: string;
  accessType?: AccessType;
  isCodeCopied: boolean;
  onCopyDoorCode: () => void;
  labels: MapSheetLabels;
}

export function ExtendedStepperItinerary({
  campus,
  building,
  roomInfo,
  doorCode,
  instructions,
  accessType,
  isCodeCopied,
  onCopyDoorCode,
  labels,
}: ExtendedStepperItineraryProps) {
  const cleanCampus = cleanCampusName(campus);
  const cleanBuilding = cleanBuildingName(building);

  return (
    <TransitLineWrapper>
      <TransitTrackLine />

      {/* Step 1: Campus */}
      <ItineraryStep data-testid="step-campus">
        <Tooltip arrow title={`${labels.campus}: ${campus}`}>
          <StepIconBadge
            $variant="campus"
            aria-label={`${labels.campus}: ${campus}`}
          >
            <SchoolRoundedIcon sx={{ fontSize: "1.15rem" }} />
          </StepIconBadge>
        </Tooltip>
        <StepContent>
          <Typography
            variant="subtitle2"
            sx={{ fontWeight: 800, color: "text.primary" }}
            aria-label={`${labels.campus}: ${campus}`}
          >
            {cleanCampus}
          </Typography>
        </StepContent>
      </ItineraryStep>

      {/* Step 2: Building */}
      <ItineraryStep data-testid="step-building">
        <Tooltip arrow title={`${labels.building}: ${building}`}>
          <StepIconBadge
            $variant="building"
            aria-label={`${labels.building}: ${building}`}
          >
            <ApartmentRoundedIcon sx={{ fontSize: "1.15rem" }} />
          </StepIconBadge>
        </Tooltip>
        <StepContent>
          <Typography
            variant="subtitle2"
            sx={{ fontWeight: 800, color: "text.primary" }}
            aria-label={`${labels.building}: ${building}`}
          >
            {cleanBuilding}
          </Typography>
        </StepContent>
      </ItineraryStep>

      {/* Step 3: Room & Floor Chip: 302 = (3 | 02) */}
      <ItineraryStep data-testid="step-room">
        <Tooltip arrow title={roomInfo.tooltipText}>
          <StepIconBadge
            $variant="room"
            aria-label={roomInfo.tooltipText}
          >
            <MeetingRoomRoundedIcon sx={{ fontSize: "1.15rem" }} />
          </StepIconBadge>
        </Tooltip>
        <StepContent>
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
        </StepContent>
      </ItineraryStep>

      {/* Step 4: Access Instructions */}
      <InstructionSection
        accessType={accessType}
        doorCode={doorCode}
        instructions={instructions}
        isCopied={isCodeCopied}
        onCopyDoorCode={onCopyDoorCode}
        labels={labels}
      />
    </TransitLineWrapper>
  );
}
