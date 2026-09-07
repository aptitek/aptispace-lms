import { memo } from "react";
import { styled } from "@mui/material/styles";
import {
  ALL_EXPRESSIVE_SHAPES,
  EXPRESSIVE_SHAPE_CATALOG,
} from "~/tokens/shapes";

const HiddenSvgDefs = styled("svg")({
  position: "absolute",
  width: 0,
  height: 0,
  overflow: "hidden",
  pointerEvents: "none",
});

export const ShapeDefs = memo(function ShapeDefs() {
  return (
    <HiddenSvgDefs aria-hidden="true">
      <defs>
        {ALL_EXPRESSIVE_SHAPES.map((shapeKey: string) => {
          const shape = EXPRESSIVE_SHAPE_CATALOG[shapeKey];
          if (!shape?.pathData) return null;
          return (
            <clipPath
              key={shapeKey}
              id={`avatar-shape-${shapeKey}`}
              clipPathUnits="objectBoundingBox"
            >
              <path d={shape.pathData} />
            </clipPath>
          );
        })}
      </defs>
    </HiddenSvgDefs>
  );
});

export default ShapeDefs;
