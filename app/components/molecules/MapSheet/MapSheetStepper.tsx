import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import ApartmentRoundedIcon from "@mui/icons-material/ApartmentRounded";
import MeetingRoomRoundedIcon from "@mui/icons-material/MeetingRoomRounded";
import LayersRoundedIcon from "@mui/icons-material/LayersRounded";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

import Tooltip from "../../atoms/Tooltip";
import type {
  ParsedRoomInfo,
  AccessType,
  MapSheetOrientation,
} from "./MapSheet.types";
import AccessCodeChip, { resolveAccessIcon } from "./MapSheetAccessChip";
import {
  TransitLineWrapper,
  TransitTrackWrapper,
  TransitTrackProgress,
  HorizontalTransitTrackWrapper,
  HorizontalTransitTrackProgress,
  ItineraryStep,
  StepIconBadge,
  StepContent,
} from "./MapSheet.styles";

export interface TransitTrackLineProps {
  className?: string;
}

/**
 * Animated vertical wavy connector line using MD3 wavy progress bar from dependencies
 */
export function TransitTrackLine({ className }: TransitTrackLineProps) {
  return (
    <TransitTrackWrapper className={className} data-testid="transit-track-line">
      <TransitTrackProgress wavy value={100} thickness={4} />
    </TransitTrackWrapper>
  );
}

export interface HorizontalTransitTrackLineProps {
  className?: string;
}

/**
 * Animated horizontal wavy connector line running from left to right behind chips in vertical view
 */
export function HorizontalTransitTrackLine({
  className,
}: HorizontalTransitTrackLineProps) {
  return (
    <HorizontalTransitTrackWrapper
      className={className}
      data-testid="horizontal-transit-track-line"
    >
      <HorizontalTransitTrackProgress wavy value={100} thickness={4} />
    </HorizontalTransitTrackWrapper>
  );
}

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

  const badgeIcon = doorCode ? (
    resolveAccessIcon(accessType, "1.15rem")
  ) : (
    <InfoOutlinedIcon sx={{ fontSize: "1.15rem" }} />
  );

  return (
    <ItineraryStep data-testid="step-instructions">
      <Tooltip arrow title={labels.instructions}>
        <StepIconBadge $variant="instruction" aria-label={labels.instructions}>
          {badgeIcon}
        </StepIconBadge>
      </Tooltip>
      <StepContent>
        <Box sx={{ display: "flex", alignItems: "center", minWidth: 0 }}>
          <AccessCodeChip
            doorCode={doorCode}
            instructions={instructions}
            accessType={accessType}
            showIcon={false}
            isCodeCopied={isCopied}
            onCopyDoorCode={onCopyDoorCode}
            labels={labels}
          />
        </Box>
      </StepContent>
    </ItineraryStep>
  );
}

export interface ExtendedStepperItineraryProps {
  campus: string;
  building: string;
  roomInfo: ParsedRoomInfo;
  orientation?: MapSheetOrientation;
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
            sx={{ fontWeight: 800, color: "primary.main" }}
            aria-label={`${labels.building}: ${building}`}
          >
            {cleanBuilding}
          </Typography>
        </StepContent>
      </ItineraryStep>

      {/* Step 3: Floor */}
      <ItineraryStep data-testid="step-floor">
        <Tooltip arrow title={roomInfo.floorLabel}>
          <StepIconBadge $variant="room" aria-label={roomInfo.floorLabel}>
            <LayersRoundedIcon sx={{ fontSize: "1.15rem" }} />
          </StepIconBadge>
        </Tooltip>
        <StepContent>
          <Typography
            variant="subtitle2"
            sx={{ fontWeight: 800, color: "text.primary" }}
            data-testid="floor-pill"
          >
            {roomInfo.floorLabel}
          </Typography>
        </StepContent>
      </ItineraryStep>

      {/* Step 4: Room */}
      <ItineraryStep data-testid="step-room">
        <Tooltip arrow title={roomInfo.roomLabel}>
          <StepIconBadge $variant="room" aria-label={roomInfo.roomLabel}>
            <MeetingRoomRoundedIcon sx={{ fontSize: "1.15rem" }} />
          </StepIconBadge>
        </Tooltip>
        <StepContent>
          <Box
            sx={{ display: "flex", flexDirection: "column", gap: 0.25 }}
            data-testid="room-floor-chip"
          >
            {roomInfo.roomName ? (
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 800, color: "text.primary" }}
                data-testid="chip-room-name"
              >
                {roomInfo.roomName}
              </Typography>
            ) : null}
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 800, color: "text.primary" }}
              data-testid="room-pill"
            >
              {roomInfo.roomLabel}
            </Typography>
          </Box>
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
