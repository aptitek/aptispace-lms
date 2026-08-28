import { useState, useRef } from "react";
import { alpha } from "@mui/material/styles";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Chip from "@mui/material/Chip";
import Tooltip from "@mui/material/Tooltip";
import LinearProgress from "@mui/material/LinearProgress";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import SyncAltIcon from "@mui/icons-material/SyncAlt";
import SpeedIcon from "@mui/icons-material/Speed";
import ExploreIcon from "@mui/icons-material/Explore";
import FlightLandIcon from "@mui/icons-material/FlightLand";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import TerminalIcon from "@mui/icons-material/Terminal";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

import {
  MD3DeckCard,
  MD3CardHeader,
  MD3CardHeadline,
  MD3CardSubhead,
  MD3CardTitleGroup,
  MD3CardMedia,
  MD3CardContent,
  MD3CardActions,
  type MD3CardVariant,
  type MD3Elevation,
  type MD3DeckCardRef,
} from "../MD3DeckCard/MD3DeckCard";

import {
  CardWrapper,
  HeaderBadgeRow,
  SimulationViewport,
  TelemetryHudGrid,
  TelemetryMetric,
  MetricLabel,
  MetricValue,
  ProgressContainer,
  ProgressLabelRow,
  ChecklistGroup,
  ChecklistRow,
  TerminalLogView,
  SimulationViewportContent,
  HudActiveTag,
  ViewportTitle,
  ViewportSubtext,
  RocketIconBox,
  FullWidthBox,
  MissionDescription,
} from "./OrbitalMissionCard.styles";

export interface OrbitalMissionCardProps {
  variant?: MD3CardVariant;
  elevation?: MD3Elevation;
  height?: number | string;
  holographic?: boolean;
  holoVariant?: "default" | "rainbow" | "cosmic" | "gold";
  holoStrength?: number;
  missionCode?: string;
  title?: string;
  description?: string;
  progress?: number;
  onLaunchSimulation?: () => void;
  onInspectTelemetry?: () => void;
  className?: string;
  "data-testid"?: string;
}

interface ChecklistEntry {
  id: string;
  label: string;
  done: boolean;
}

const DEFAULT_CHECKLIST: ChecklistEntry[] = [
  { id: "1", label: "Calibrate Inertial Guidance Ring", done: true },
  { id: "2", label: "Calculate Retrograde Delta-V Vector", done: true },
  { id: "3", label: "Validate Heat Shield Ablative Reserves", done: true },
  { id: "4", label: "Synchronize Command Relay Lock", done: false },
];

const DEFAULT_MISSION_CONFIG = {
  variant: "elevated" as MD3CardVariant,
  elevation: 2 as MD3Elevation,
  height: 610,
  holographic: true,
  holoVariant: "cosmic" as const,
  holoStrength: 0.85,
  missionCode: "ASTRO-402",
  title: "Atmospheric Re-entry Vectors & Orbital Sync",
  description:
    "Execute multi-burn deceleration burns and calculate retrograde descent trajectories through the upper thermosphere. Synchronize orbital telemetry with ground telemetry array.",
  progress: 76,
  testId: "orbital-mission-card",
};

function resolveMissionProps(props: OrbitalMissionCardProps) {
  return {
    ...DEFAULT_MISSION_CONFIG,
    ...props,
    testId: props["data-testid"] ?? DEFAULT_MISSION_CONFIG.testId,
  };
}

export default function OrbitalMissionCard(rawProps: OrbitalMissionCardProps) {
  const config = resolveMissionProps(rawProps);
  const cardRef = useRef<MD3DeckCardRef>(null);

  const [checklist, setChecklist] =
    useState<ChecklistEntry[]>(DEFAULT_CHECKLIST);

  const handleToggleChecklist = (targetId: string) => {
    setChecklist((prevList) =>
      prevList.map((entry) =>
        entry.id === targetId ? { ...entry, done: !entry.done } : entry,
      ),
    );
  };

  const handleFlipToggle = () => {
    cardRef.current?.toggleFlip();
  };

  const layers = [
    {
      id: "holo-space-bg",
      parallax: -8,
      holographic: config.holographic
        ? {
            variant: config.holoVariant,
            intensity: config.holoStrength,
            patternOpacity: 0.2,
          }
        : false,
    },
  ];

  return (
    <CardWrapper className={config.className} data-testid={config.testId}>
      <MD3DeckCard
        ref={cardRef}
        variant={config.variant}
        elevation={config.elevation}
        holographic={config.holographic}
        holoStrength={config.holoStrength}
        layers={layers}
        width="100%"
        height={config.height}
        maxTilt={10}
        scaleOnHover={1.015}
        showGlare
        backContent={
          <FullWidthBox>
            <MD3CardHeader>
              <MD3CardTitleGroup>
                <HeaderBadgeRow>
                  <Chip
                    label="PROTOCOL LOG"
                    size="small"
                    color="secondary"
                    sx={{ fontWeight: 700, fontFamily: "monospace" }}
                  />
                  <Chip
                    label="CADET VERIFICATION"
                    size="small"
                    variant="outlined"
                    sx={{ fontWeight: 600 }}
                  />
                </HeaderBadgeRow>
                <MD3CardHeadline sx={{ mt: 1 }}>
                  Pre-Entry Sequence Checklist
                </MD3CardHeadline>
                <MD3CardSubhead>
                  Verify all critical flight telemetry items prior to simulation
                  ignition
                </MD3CardSubhead>
              </MD3CardTitleGroup>

              <Tooltip title="Return to Mission Briefing">
                <IconButton
                  onClick={handleFlipToggle}
                  color="primary"
                  aria-label="Return to front"
                  data-testid="flip-to-front-btn"
                  sx={{
                    bgcolor: (t) => alpha(t.palette.primary.main, 0.1),
                    "&:hover": {
                      bgcolor: (t) => alpha(t.palette.primary.main, 0.2),
                    },
                  }}
                >
                  <SyncAltIcon />
                </IconButton>
              </Tooltip>
            </MD3CardHeader>

            <MD3CardContent>
              <ChecklistGroup>
                {checklist.map((checkEntry) => (
                  <ChecklistRow key={checkEntry.id} isDone={checkEntry.done}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={checkEntry.done}
                          onChange={() => handleToggleChecklist(checkEntry.id)}
                          icon={<RadioButtonUncheckedIcon fontSize="small" />}
                          checkedIcon={<CheckCircleIcon fontSize="small" />}
                          color="success"
                        />
                      }
                      label={checkEntry.label}
                      sx={{
                        margin: 0,
                        textDecoration: checkEntry.done
                          ? "line-through"
                          : "none",
                        opacity: checkEntry.done ? 0.75 : 1,
                      }}
                    />
                    <Chip
                      label={checkEntry.done ? "CONFIRMED" : "PENDING"}
                      size="small"
                      color={checkEntry.done ? "success" : "warning"}
                      variant="outlined"
                      sx={{ fontFamily: "monospace", fontSize: "0.7rem" }}
                    />
                  </ChecklistRow>
                ))}
              </ChecklistGroup>

              <TerminalLogView>
                <HeaderBadgeRow>
                  <TerminalIcon fontSize="inherit" />
                  <strong>TELEMETRY BUS // COM-LINK ACTIVE</strong>
                </HeaderBadgeRow>
                <div>[04:08:12] GPS SatLock acquired (12 constellations)</div>
                <div>[04:08:14] Thruster ISP nominal at 310s</div>
                <div>[04:08:19] Atmospheric density gradient locked</div>
              </TerminalLogView>
            </MD3CardContent>

            <MD3CardActions>
              <Button
                variant="outlined"
                startIcon={<InfoOutlinedIcon />}
                onClick={handleFlipToggle}
              >
                Return to Briefing
              </Button>
              <Button
                variant="contained"
                color="success"
                startIcon={<CheckCircleIcon />}
                onClick={handleFlipToggle}
              >
                Confirm Flight Readiness
              </Button>
            </MD3CardActions>
          </FullWidthBox>
        }
      >
        <FullWidthBox>
          <MD3CardHeader>
            <MD3CardTitleGroup>
              <HeaderBadgeRow>
                <Chip
                  label={config.missionCode}
                  size="small"
                  color="primary"
                  variant="filled"
                  sx={{ fontWeight: 700, fontFamily: "monospace" }}
                />
                <Chip
                  label="SIMULATION ACTIVE"
                  size="small"
                  color="success"
                  variant="outlined"
                  sx={{ fontWeight: 600, fontSize: "0.7rem" }}
                />
              </HeaderBadgeRow>
              <MD3CardHeadline sx={{ mt: 1 }}>{config.title}</MD3CardHeadline>
              <MD3CardSubhead>
                Orbital Mechanics • Flight Division Tier IV
              </MD3CardSubhead>
            </MD3CardTitleGroup>

            <Tooltip title="Flip to Flight Log & Protocol Checklist">
              <IconButton
                onClick={handleFlipToggle}
                color="primary"
                aria-label="Flip card to checklist"
                data-testid="flip-to-back-btn"
                sx={{
                  bgcolor: (t) => alpha(t.palette.primary.main, 0.1),
                  "&:hover": {
                    bgcolor: (t) => alpha(t.palette.primary.main, 0.2),
                  },
                }}
              >
                <SyncAltIcon />
              </IconButton>
            </Tooltip>
          </MD3CardHeader>

          <MD3CardMedia sx={{ px: 3 }}>
            <SimulationViewport>
              <SimulationViewportContent>
                <HudActiveTag>
                  <AutoAwesomeIcon fontSize="inherit" />
                  <span>Holographic HUD Active</span>
                </HudActiveTag>
                <ViewportTitle>Orbital Insertion Corridor</ViewportTitle>
                <ViewportSubtext>
                  Real-time Deck-FX dynamic foil & physics tilt active.
                </ViewportSubtext>
              </SimulationViewportContent>

              <RocketIconBox>
                <RocketLaunchIcon />
              </RocketIconBox>
            </SimulationViewport>
          </MD3CardMedia>

          <MD3CardContent>
            <MissionDescription>{config.description}</MissionDescription>

            <TelemetryHudGrid>
              <TelemetryMetric>
                <MetricLabel>
                  <SpeedIcon fontSize="inherit" /> Orbital Velocity
                </MetricLabel>
                <MetricValue>28,140 km/h</MetricValue>
              </TelemetryMetric>

              <TelemetryMetric>
                <MetricLabel>
                  <ExploreIcon fontSize="inherit" /> Apogee Altitude
                </MetricLabel>
                <MetricValue>418.2 km</MetricValue>
              </TelemetryMetric>

              <TelemetryMetric>
                <MetricLabel>
                  <FlightLandIcon fontSize="inherit" /> Descent Vector
                </MetricLabel>
                <MetricValue>-1.42° FPA</MetricValue>
              </TelemetryMetric>
            </TelemetryHudGrid>

            <ProgressContainer>
              <ProgressLabelRow>
                <span>Simulation Readiness</span>
                <span>{config.progress}%</span>
              </ProgressLabelRow>
              <LinearProgress
                variant="determinate"
                value={config.progress}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  bgcolor: (t) => alpha(t.palette.primary.main, 0.15),
                }}
              />
            </ProgressContainer>
          </MD3CardContent>

          <MD3CardActions>
            <Button
              variant="text"
              startIcon={<SyncAltIcon />}
              onClick={handleFlipToggle}
              data-testid="actions-flip-btn"
            >
              Checklist
            </Button>
            <Button
              variant="outlined"
              startIcon={<ShieldOutlinedIcon />}
              onClick={config.onInspectTelemetry}
              data-testid="actions-telemetry-btn"
            >
              Telemetry
            </Button>
            <Button
              variant="contained"
              startIcon={<RocketLaunchIcon />}
              onClick={config.onLaunchSimulation}
              data-testid="actions-launch-btn"
            >
              Engage Simulator
            </Button>
          </MD3CardActions>
        </FullWidthBox>
      </MD3DeckCard>
    </CardWrapper>
  );
}
