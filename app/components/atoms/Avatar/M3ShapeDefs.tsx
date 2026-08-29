import { memo } from "react";
import { styled } from "@mui/material/styles";
import { ALL_35_M3_SHAPES, M3_EXPRESSIVE_CATALOG } from "./m3Shapes";

const HiddenSvgDefs = styled("svg")({
  position: "absolute",
  width: 0,
  height: 0,
  overflow: "hidden",
  pointerEvents: "none",
});

export const M3ShapeDefs = memo(function M3ShapeDefs() {
  return (
    <HiddenSvgDefs aria-hidden="true">
      <defs>
        {ALL_35_M3_SHAPES.map((shapeKey) => {
          const shape = M3_EXPRESSIVE_CATALOG[shapeKey];
          if (!shape?.pathData) return null;
          return (
            <clipPath
              key={shapeKey}
              id={`m3-shape-${shapeKey}`}
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

export default M3ShapeDefs;
