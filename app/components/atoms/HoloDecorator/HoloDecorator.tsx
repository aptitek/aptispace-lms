import React from "react";
import { styled } from "@mui/material/styles";
import { holoGradient } from "../../../tokens/holo";
import type { HoloDecoratorProps } from "./HoloDecorator.types";

const textHoloStyles = {
  background: `${holoGradient}, linear-gradient(currentColor, currentColor)`,
  backgroundSize: "200% 200%, 100% 100%",
  backgroundPosition: "center, center",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundBlendMode: "screen",
};

const ImageHoloWrapper = styled("span", {
  shouldForwardProp: (prop) => prop !== "maskUrl",
})<{ maskUrl: string }>(({ maskUrl }) => ({
  position: "relative",
  display: "inline-flex",
  "&::after": {
    content: '""',
    position: "absolute",
    inset: 0,
    backgroundImage: holoGradient,
    backgroundSize: "200% 200%",
    backgroundPosition: "center",
    maskImage: `url("${maskUrl}")`,
    WebkitMaskImage: `url("${maskUrl}")`,
    maskSize: "contain",
    WebkitMaskSize: "contain",
    maskPosition: "center",
    WebkitMaskPosition: "center",
    maskRepeat: "no-repeat",
    WebkitMaskRepeat: "no-repeat",
    mixBlendMode: "screen",
    pointerEvents: "none",
  },
}));

export default function HoloDecorator({
  children,
  active = true,
  type = "text",
  maskUrl,
}: HoloDecoratorProps) {
  if (!active) {
    return children;
  }

  if (type === "image") {
    if (!maskUrl) {
      console.warn("HoloDecorator with type='image' requires a maskUrl prop.");
      return children;
    }
    return <ImageHoloWrapper maskUrl={maskUrl}>{children}</ImageHoloWrapper>;
  }

  // Text mode: clone element and merge sx
  const childElement = React.Children.only(children);
  const childProps = childElement.props as { sx?: object };
  const childSx = childProps.sx || {};

  return React.cloneElement(childElement, {
    sx: { ...childSx, ...textHoloStyles },
  } as Record<string, unknown>);
}
