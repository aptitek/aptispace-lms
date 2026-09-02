import { styled, alpha } from "@mui/material/styles";
import MuiChip from "@mui/material/Chip";
import { resolveShapeStyle, type ResolvedShapeStyle } from "../Avatar/shapes";
import type { ChipShape } from "./Chip.types";

interface StyledChipProps {
  $chipShape?: ChipShape;
  $mono?: boolean;
}

export function getResolvedChipShape(
  shape?: ChipShape,
): ResolvedShapeStyle | null {
  if (shape === undefined || shape === null) return null;
  return resolveShapeStyle(shape);
}

export const StyledMuiChip = styled(MuiChip, {
  shouldForwardProp: (prop) => prop !== "$chipShape" && prop !== "$mono",
})<StyledChipProps>(({ theme, $chipShape, $mono }) => {
  const shapeStyle = getResolvedChipShape($chipShape);
  const hasClipPath = Boolean(shapeStyle?.clipPath);

  return {
    transition: theme.transitions.create([
      "background-color",
      "border-color",
      "box-shadow",
      "transform",
      "filter",
    ]),
    boxSizing: "border-box",

    ...(shapeStyle && {
      borderRadius: shapeStyle.borderRadius,
      ...(hasClipPath && {
        clipPath: shapeStyle.clipPath,
        WebkitClipPath: shapeStyle.clipPath,
        border: "none",
        filter: `drop-shadow(0 1px 3px ${alpha(theme.palette.common.black, 0.15)})`,
      }),
    }),

    ...($mono && {
      fontFamily: '"Roboto Mono", "Fira Code", monospace',
      letterSpacing: "0.02em",
      fontWeight: 600,
      "& .MuiChip-label": {
        fontFamily: "inherit",
        letterSpacing: "inherit",
        fontWeight: "inherit",
      },
    }),

    "& .MuiChip-icon": {
      fontSize: "inherit",
      marginLeft: "6px",
      marginRight: "-2px",
    },

    "&.MuiChip-clickable:hover": {
      transform: "translateY(-1px)",
      boxShadow: hasClipPath
        ? undefined
        : `0 2px 8px ${alpha(theme.palette.primary.main, 0.2)}`,
      filter: hasClipPath
        ? `drop-shadow(0 2px 6px ${alpha(theme.palette.primary.main, 0.35)})`
        : undefined,
    },

    "&.MuiChip-clickable:active": {
      transform: "translateY(0)",
    },

    ...theme.applyStyles("dark", {
      ...(hasClipPath && {
        filter: `drop-shadow(0 1px 4px ${alpha(theme.palette.common.black, 0.45)})`,
      }),
      "&.MuiChip-clickable:hover": {
        boxShadow: hasClipPath
          ? undefined
          : `0 2px 10px ${alpha(theme.palette.primary.main, 0.3)}`,
        filter: hasClipPath
          ? `drop-shadow(0 2px 8px ${alpha(theme.palette.primary.main, 0.45)})`
          : undefined,
      },
    }),
  };
});

export const ChipImage = styled("img", {
  shouldForwardProp: (prop) =>
    prop !== "$position" && prop !== "$customHeight" && prop !== "$customWidth",
})<{
  $position: "start" | "end";
  $customHeight?: number | string;
  $customWidth?: number | string;
}>(({ $position, $customHeight, $customWidth }) => ({
  height: $customHeight ?? "16px",
  width: $customWidth ?? "auto",
  objectFit: "contain",
  display: "inline-block",
  verticalAlign: "middle",
  flexShrink: 0,
  marginLeft: $position === "end" ? "6px" : "-2px",
  marginRight: $position === "start" ? "6px" : "-2px",
}));

export const EndImageLabelWrapper = styled("span")({
  display: "inline-flex",
  alignItems: "center",
  verticalAlign: "middle",
});
