import React, { forwardRef, type ReactNode, type ReactElement } from "react";
import type { ChipProps } from "./Chip.types";
import { StyledMuiChip, ChipImage, EndImageLabelWrapper } from "./Chip.styles";
import ShapeDefs from "../Avatar/ShapeDefs";

interface ChipVisuals {
  image?: string | ReactNode;
  imageAlt?: string;
  imagePosition?: "start" | "end";
  imageHeight?: number | string;
  imageWidth?: number | string;
  icon?: ReactNode;
  label?: ReactNode;
}

function resolveChipSlots(props: ChipVisuals) {
  const {
    image,
    imageAlt = "",
    imagePosition = "start",
    imageHeight,
    imageWidth,
    icon,
    label,
  } = props;

  if (!image) {
    return { icon, label };
  }

  const imageElement =
    typeof image === "string" ? (
      <ChipImage
        src={image}
        alt={imageAlt}
        $position={imagePosition}
        $customHeight={imageHeight}
        $customWidth={imageWidth}
        data-testid="chip-image"
      />
    ) : (
      image
    );

  if (imagePosition === "start" && !icon) {
    return { icon: imageElement, label };
  }

  if (imagePosition === "end") {
    return {
      icon,
      label: (
        <EndImageLabelWrapper>
          {label}
          {imageElement}
        </EndImageLabelWrapper>
      ),
    };
  }

  return { icon, label };
}

/**
 * Generic Chip Atom Component
 *
 * Extends MUI's Chip component with:
 * - Expressive M3 shapes & geometric radius presets
 * - Embedded image support (start / end positions)
 * - Monospace styling mode for technical tokens / handles
 * - Micro-animations, subtle depth, and full dark mode support
 */
export const Chip = forwardRef<HTMLDivElement, ChipProps>(function Chip(
  {
    shape,
    image,
    imageAlt = "",
    imagePosition = "start",
    imageHeight,
    imageWidth,
    mono = false,
    icon,
    label,
    testId,
    "data-testid": dataTestId,
    ...rest
  },
  ref,
) {
  const resolvedTestId = dataTestId || testId;
  const { icon: finalIcon, label: finalLabel } = resolveChipSlots({
    image,
    imageAlt,
    imagePosition,
    imageHeight,
    imageWidth,
    icon,
    label,
  });

  return (
    <>
      {shape && <ShapeDefs />}
      <StyledMuiChip
        ref={ref}
        $chipShape={shape}
        $mono={mono}
        icon={finalIcon as ReactElement | undefined}
        label={finalLabel}
        data-testid={resolvedTestId}
        data-shape={typeof shape === "string" ? shape : undefined}
        {...rest}
      />
    </>
  );
});

Chip.displayName = "Chip";
export default Chip;
