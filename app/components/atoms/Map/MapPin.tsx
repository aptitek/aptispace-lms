import React from "react";
import { styled, keyframes } from "@mui/material/styles";
import { M3_SHAPE_CORNERS } from "~/tokens/shapes";

export interface MapPinProps {
  label?: string;
  color?: string;
  ariaLabel?: string;
  className?: string;
  style?: React.CSSProperties;
  "data-testid"?: string;
}

const pulseRing = keyframes`
  0% {
    transform: scale(0.6);
    opacity: 0.85;
  }
  70% {
    transform: scale(2.4);
    opacity: 0;
  }
  100% {
    transform: scale(2.6);
    opacity: 0;
  }
`;

const pinBounce = keyframes`
  0% {
    transform: translateY(-8px) scale(0.9);
    opacity: 0;
  }
  60% {
    transform: translateY(2px) scale(1.05);
    opacity: 1;
  }
  100% {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
`;

const PinContainer = styled("div")({
  position: "relative",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "flex-end",
  cursor: "pointer",
  userSelect: "none",
  transform: "translate(-50%, -100%)",
  pointerEvents: "auto",
  animation: `${pinBounce} 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards`,
});

const RadarRing = styled("div")<{ $color?: string }>(({ theme, $color }) => ({
  position: "absolute",
  bottom: -4,
  left: "50%",
  marginLeft: -10,
  width: 20,
  height: 20,
  borderRadius: M3_SHAPE_CORNERS.full,
  backgroundColor: $color || theme.palette.primary.main,
  animation: `${pulseRing} 2s cubic-bezier(0.25, 1, 0.5, 1) infinite`,
  pointerEvents: "none",
  zIndex: 1,
}));

const GroundShadow = styled("div")({
  position: "absolute",
  bottom: -2,
  left: "50%",
  marginLeft: -8,
  width: 16,
  height: 6,
  borderRadius: M3_SHAPE_CORNERS.full,
  backgroundColor: "rgba(0, 0, 0, 0.35)",
  filter: "blur(2px)",
  zIndex: 1,
});

const PinSvg = styled("svg")({
  position: "relative",
  zIndex: 2,
  filter: "drop-shadow(0 3px 6px rgba(0, 0, 0, 0.35))",
  transition: "transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)",
  "&:hover": {
    transform: "scale(1.15) translateY(-2px)",
  },
});

const PinBadge = styled("span")<{ $bg?: string }>(({ theme, $bg }) => ({
  position: "absolute",
  top: -22,
  zIndex: 3,
  padding: "2px 8px",
  borderRadius: M3_SHAPE_CORNERS.full,
  backgroundColor: $bg || theme.palette.primary.main,
  color: theme.palette.common.white,
  fontSize: "0.68rem",
  fontWeight: 700,
  letterSpacing: "0.02em",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
  whiteSpace: "nowrap",
  border: "1px solid rgba(255, 255, 255, 0.35)",
  pointerEvents: "none",
  maxWidth: 160,
  overflow: "hidden",
  textOverflow: "ellipsis",
}));

export const MapPin: React.FC<MapPinProps> = ({
  label,
  color = "var(--color-solarized-green, #859900)",
  ariaLabel = "Emplacement sélectionné",
  className,
  style,
  "data-testid": dataTestId = "map-pin-container",
}) => {
  return (
    <PinContainer
      data-testid={dataTestId}
      role="img"
      aria-label={ariaLabel}
      className={className}
      style={style}
    >
      {label && (
        <PinBadge $bg={color} data-testid="map-pin-label">
          {label}
        </PinBadge>
      )}

      <GroundShadow />
      <RadarRing $color={color} />

      <PinSvg
        width="28"
        height="36"
        viewBox="0 0 28 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        data-testid="map-pin-svg"
      >
        <path
          d="M14 0C6.268 0 0 6.268 0 14C0 24.5 14 36 14 36C14 36 28 24.5 28 14C28 6.268 21.732 0 14 0Z"
          fill={color}
        />
        {/* Subtle highlight sheen on top dome */}
        <path
          d="M14 2C7.373 2 2 7.373 2 14C2 17.5 4 21.5 7 26C5 21 4 17 4 14C4 8.477 8.477 4 14 4C17.5 4 20.5 5.8 22.3 8.5C20.3 4.5 16.5 2 14 2Z"
          fill="white"
          fillOpacity={0.25}
        />
        {/* Center white dot */}
        <circle cx="14" cy="13" r="5" fill="white" />
        {/* Inner core matching pin color */}
        <circle cx="14" cy="13" r="2.5" fill={color} />
      </PinSvg>
    </PinContainer>
  );
};

export default MapPin;
