import React from "react";
import { styled, alpha } from "@mui/material/styles";
import NavigationRoundedIcon from "@mui/icons-material/NavigationRounded";

export interface TrifoldBrochurePaperProps {
  snapshotUrl: string | null;
  campusLabel?: string;
}

const PaperRoot = styled("div")(({ theme }) => ({
  position: "relative",
  width: "100%",
  height: "100%",
  backgroundColor: theme.palette.background.default,
  backgroundImage: `radial-gradient(${alpha(theme.palette.text.secondary, 0.15)} 1px, transparent 1px)`,
  backgroundSize: "24px 24px",
  overflow: "hidden",
  boxSizing: "border-box",
}));

const SnapshotImage = styled("img")({
  width: "100%",
  height: "100%",
  objectFit: "cover",
  display: "block",
  pointerEvents: "none",
});

const RoadBandHorizontal = styled("div")(({ theme }) => ({
  position: "absolute",
  top: "50%",
  left: "-10%",
  width: "120%",
  height: 28,
  transform: "translateY(-50%) rotate(-4deg)",
  backgroundColor: alpha(theme.palette.background.paper, 0.85),
  borderTop: `1px solid ${alpha(theme.palette.divider, 0.3)}`,
  borderBottom: `1px solid ${alpha(theme.palette.divider, 0.3)}`,
}));

const RoadBandVertical = styled("div")(({ theme }) => ({
  position: "absolute",
  left: "38%",
  top: "-10%",
  height: "120%",
  width: 22,
  backgroundColor: alpha(theme.palette.background.paper, 0.85),
  borderLeft: `1px solid ${alpha(theme.palette.divider, 0.3)}`,
  borderRight: `1px solid ${alpha(theme.palette.divider, 0.3)}`,
}));

const CampusBlockA = styled("div")(({ theme }) => ({
  position: "absolute",
  top: "18%",
  left: "14%",
  width: 75,
  height: 48,
  borderRadius: 4,
  backgroundColor: alpha(theme.palette.text.primary, 0.08),
  border: `1px solid ${alpha(theme.palette.divider, 0.4)}`,
}));

const CampusBlockB = styled("div")(({ theme }) => ({
  position: "absolute",
  bottom: "16%",
  left: "55%",
  width: 85,
  height: 42,
  borderRadius: 4,
  backgroundColor: alpha(theme.palette.text.primary, 0.08),
  border: `1px solid ${alpha(theme.palette.divider, 0.4)}`,
}));

const CampusBlockC = styled("div")(({ theme }) => ({
  position: "absolute",
  top: "15%",
  right: "12%",
  width: 70,
  height: 52,
  borderRadius: 4,
  backgroundColor: alpha(theme.palette.text.primary, 0.08),
  border: `1px solid ${alpha(theme.palette.divider, 0.4)}`,
}));

const CompassBadge = styled("div")(({ theme }) => ({
  position: "absolute",
  top: 8,
  right: 12,
  display: "flex",
  alignItems: "center",
  gap: 2,
  color: theme.palette.text.secondary,
  fontSize: "0.68rem",
  fontWeight: 700,
  letterSpacing: "0.08em",
  opacity: 0.8,
  userSelect: "none",
}));

export const TrifoldBrochurePaper: React.FC<TrifoldBrochurePaperProps> = ({
  snapshotUrl,
}) => {
  if (snapshotUrl) {
    return <SnapshotImage src={snapshotUrl} alt="Brochure map preview" />;
  }

  return (
    <PaperRoot>
      <RoadBandHorizontal />
      <RoadBandVertical />
      <CampusBlockA />
      <CampusBlockB />
      <CampusBlockC />
      <CompassBadge>
        <NavigationRoundedIcon
          sx={{ fontSize: 13, transform: "rotate(-25deg)" }}
        />
        N
      </CompassBadge>
    </PaperRoot>
  );
};
