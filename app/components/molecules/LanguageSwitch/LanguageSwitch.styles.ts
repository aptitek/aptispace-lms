import { styled, alpha } from "@mui/material/styles";
import { motion, type Transition } from "framer-motion";
import { M3_SPRINGS } from "~/tokens/motion";
import {
  Switch,
  type SwitchSize,
  type SwitchSizeConfig,
  SWITCH_SIZE_CONFIGS,
  filterDollarProp,
} from "~/components/atoms/Switch";

export type { SwitchSize };
export { SWITCH_SIZE_CONFIGS as MERIDIAN_SIZE_CONFIGS };

export const FLIGHT_SPRING: Transition = M3_SPRINGS.flightPuck;

export const MeridianBaseSwitch = styled(Switch, {
  shouldForwardProp: filterDollarProp,
})<{
  $isFrench: boolean;
}>(({ theme }) => {
  const primaryMain = theme.palette.primary.main;
  const primaryLight = theme.palette.primary.light;
  const bgPaper = theme.palette.background.paper;
  const bgDefault = theme.palette.background.default;

  return {
    "&.md3-switch-track": {
      border: `2px solid ${theme.palette.divider}`,
      backgroundColor: bgDefault,
      backgroundImage: `linear-gradient(180deg, ${bgPaper} 0%, ${bgDefault} 100%)`,
      boxShadow: `inset 0 1px 3px rgba(0, 0, 0, 0.15), 0 0 8px ${theme.palette.action.hover}`,

      "&:hover": {
        borderColor: primaryMain,
        boxShadow: `inset 0 1px 3px rgba(0, 0, 0, 0.15), 0 0 12px ${primaryMain}`,
      },

      ...theme.applyStyles("dark", {
        boxShadow: `0 0 0 1px ${theme.palette.divider}`,
        "&:hover": {
          borderColor: primaryMain,
          boxShadow: `0 0 0 1px ${primaryMain}, 0 0 12px ${primaryMain}`,
        },
      }),

      "&:focus-visible": {
        outline: "none",
        borderColor: primaryMain,
        boxShadow: `0 0 0 2px ${bgDefault}, 0 0 0 4px ${primaryMain}, 0 0 16px ${primaryLight}`,
      },

      "& .md3-switch-thumb": {
        background: `linear-gradient(135deg, ${primaryMain} 0%, ${theme.palette.primary.dark} 100%)`,
        boxShadow: `0 0 10px ${primaryMain}, 0 2px 6px rgba(0, 0, 0, 0.2)`,
        ...theme.applyStyles("dark", {
          boxShadow: `0 0 10px ${primaryMain}, 0 2px 6px rgba(0, 0, 0, 0.4)`,
        }),
      },

      "& .md3-switch-ripple": {
        backgroundColor: alpha(primaryMain, 0.15),
      },
    },
  };
});

export const FlightArcSvg = styled("svg")({
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  pointerEvents: "none",
  zIndex: 1,
});

export const CountryMapZone = styled("div", {
  shouldForwardProp: filterDollarProp,
})<{
  $position: "left" | "right";
  $cfg: SwitchSizeConfig;
}>(({ $position, $cfg }) => ({
  position: "absolute",
  top: "50%",
  [$position === "left" ? "left" : "right"]: 1,
  transform: "translateY(-50%)",
  width: $cfg.mapWidth,
  height: $cfg.mapHeight,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1,
  pointerEvents: "none",
}));

export const PeekingAirplane = styled(motion.div, {
  shouldForwardProp: (prop) => prop !== "$planeSize",
})<{
  $planeSize: number;
}>(({ theme, $planeSize }) => ({
  position: "absolute",
  top: "50%",
  left: 0,
  width: $planeSize,
  height: $planeSize,
  marginTop: -$planeSize / 2,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 3,
  pointerEvents: "none",
  color: theme.palette.primary.main,
  filter: `drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2)) drop-shadow(0 0 4px ${theme.palette.primary.main})`,
  ...theme.applyStyles("dark", {
    color: theme.palette.common.white,
    filter: `drop-shadow(0 1px 2px rgba(0, 0, 0, 0.4)) drop-shadow(0 0 4px ${theme.palette.primary.main})`,
  }),
}));

export const ToggleWrapper = styled("div")(({ theme }) => ({
  display: "inline-flex",
  alignItems: "center",
  gap: theme.spacing(0.75),
}));

export const DisabledTooltipWrapper = styled("span")({
  display: "inline-flex",
});
