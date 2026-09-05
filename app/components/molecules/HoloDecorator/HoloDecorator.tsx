import React, { useRef, useLayoutEffect } from "react";
import { styled } from "@mui/material/styles";
import { holoGradient } from "~/tokens/holo";
import type { HoloDecoratorProps } from "./HoloDecorator.types";

const textHoloStyles = {
  background: `${holoGradient}, linear-gradient(currentColor, currentColor)`,
  backgroundSize:
    "calc(var(--holo-bg-size-x, 100%) * 2) calc(var(--holo-bg-size-y, 100%) * 2)",
  backgroundPosition:
    "calc(-0.5 * var(--holo-bg-size-x, 100%) - var(--holo-offset-x, 0px)) calc(-0.5 * var(--holo-bg-size-y, 100%) - var(--holo-offset-y, 0px))",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundBlendMode: "screen",
  transition: "background-image 0.4s ease-in-out",
  ".is-facing-away &": {
    backgroundImage: "linear-gradient(currentColor, currentColor)",
  },
};

const ImageHoloWrapper = styled("span", {
  shouldForwardProp: (prop) => prop !== "maskUrl" && prop !== "maskSize",
})<{ maskUrl: string; maskSize?: string }>(
  ({ maskUrl, maskSize = "contain" }) => ({
    position: "relative",
    display: "inline-flex",
    "&::after": {
      content: '""',
      position: "absolute",
      inset: 0,
      opacity: 0.7,
      backgroundImage: holoGradient,
      backgroundSize:
        "calc(var(--holo-bg-size-x, 100%) * 2) calc(var(--holo-bg-size-y, 100%) * 2)",
      backgroundPosition:
        "calc(-0.5 * var(--holo-bg-size-x, 100%) - var(--holo-offset-x, 0px)) calc(-0.5 * var(--holo-bg-size-y, 100%) - var(--holo-offset-y, 0px))",
      maskImage: `url("${maskUrl}")`,
      WebkitMaskImage: `url("${maskUrl}")`,
      maskSize,
      WebkitMaskSize: maskSize,
      maskPosition: "center",
      WebkitMaskPosition: "center",
      maskRepeat: "no-repeat",
      WebkitMaskRepeat: "no-repeat",
      mixBlendMode: "screen",
      pointerEvents: "none",
      transition: "opacity 0.4s ease-in-out",
      ".is-facing-away &": {
        opacity: 0,
      },
    },
  }),
);

export default function HoloDecorator({
  children,
  active = true,
  type = "text",
  maskUrl,
  maskSize,
  sx,
}: HoloDecoratorProps) {
  const wrapperRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    if (!active || !wrapperRef.current) return;
    const element = wrapperRef.current;

    // Find the closest card
    const card = element.closest(".physics-card, .physic-card");
    if (!card) return;

    const updateOffsets = () => {
      const elementRect = element.getBoundingClientRect();
      const cardRect = card.getBoundingClientRect();

      // Calculate offset so the background perfectly aligns with the card
      const offsetX = elementRect.left - cardRect.left;
      const offsetY = elementRect.top - cardRect.top;

      element.style.setProperty("--holo-bg-size-x", `${cardRect.width}px`);
      element.style.setProperty("--holo-bg-size-y", `${cardRect.height}px`);
      element.style.setProperty("--holo-offset-x", `${offsetX}px`);
      element.style.setProperty("--holo-offset-y", `${offsetY}px`);
    };

    updateOffsets();

    const observer = new ResizeObserver(() => updateOffsets());
    observer.observe(card);
    observer.observe(element);

    return () => observer.disconnect();
  }, [active]);

  if (!active) {
    return children;
  }

  if (type === "image") {
    if (!maskUrl) {
      console.warn("HoloDecorator with type='image' requires a maskUrl prop.");
      return children;
    }
    return (
      <ImageHoloWrapper
        maskUrl={maskUrl}
        maskSize={maskSize}
        ref={wrapperRef}
        sx={sx}
      >
        {children}
      </ImageHoloWrapper>
    );
  }

  // Text mode: we wrap in a span to attach the ref and apply styles
  const childElement = React.Children.only(children);
  const childProps = childElement.props as { sx?: object };
  const childSx = childProps.sx || {};

  return React.cloneElement(childElement, {
    ref: wrapperRef,
    sx: { ...childSx, ...textHoloStyles, ...sx },
  } as Record<string, unknown>);
}
