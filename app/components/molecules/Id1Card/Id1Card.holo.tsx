import React from "react";
import type { Id1CardProps, Id1CardSide, Id1HoloLayer } from "./Id1Card.types";
import { HoloLayerContainer, HoloLayerImage } from "./Id1Card.styles";

export function getHoloVariant(
  variant: string | undefined,
): "default" | "rainbow" | "cosmic" | "gold" {
  if (variant === "solarized-gold" || variant === "gold") return "gold";
  if (
    variant === "cyber-cyan" ||
    variant === "cosmic-crimson" ||
    variant === "deep-space" ||
    variant === "cosmic"
  ) {
    return "cosmic";
  }
  return "rainbow";
}

function normalizeSingleLayerEntry(
  rawLayer: string | Id1HoloLayer,
  index: number,
): Id1HoloLayer {
  if (typeof rawLayer === "string") {
    return {
      id: `holo-layer-${index}`,
      src: rawLayer,
      maskUrl: rawLayer,
      opacity: 1,
      blendMode: "normal",
      objectFit: "contain",
      side: "both",
      holographic: true,
    };
  }

  return {
    ...rawLayer,
    id: rawLayer.id || `holo-layer-${index}`,
    maskUrl: rawLayer.maskUrl || rawLayer.src,
    opacity: rawLayer.opacity ?? 1,
    blendMode: rawLayer.blendMode ?? "normal",
    objectFit: rawLayer.objectFit ?? "contain",
    side: rawLayer.side || "both",
    holographic: rawLayer.holographic !== false,
  };
}

export type HoloPropsSubset = Pick<
  Id1CardProps,
  | "holoLayers"
  | "holoImage"
  | "holoImageMask"
  | "holoImageOpacity"
  | "holoImageBlendMode"
  | "holoImageObjectFit"
  | "holoImageSide"
>;

/**
 * Normalizes user-supplied holo layers and convenience image props into a uniform Id1HoloLayer array.
 */
export function normalizeHoloLayers(props: HoloPropsSubset): Id1HoloLayer[] {
  const result: Id1HoloLayer[] = [];

  if (props.holoImage) {
    result.push({
      id: "holo-layer-primary",
      src: props.holoImage,
      maskUrl: props.holoImageMask || props.holoImage,
      opacity: props.holoImageOpacity ?? 1,
      blendMode: props.holoImageBlendMode ?? "normal",
      objectFit: props.holoImageObjectFit ?? "contain",
      side: props.holoImageSide ?? "both",
      holographic: true,
    });
  }

  if (Array.isArray(props.holoLayers)) {
    props.holoLayers.forEach((layerEntry, idx) => {
      result.push(normalizeSingleLayerEntry(layerEntry, idx));
    });
  }

  return result;
}

export interface HoloLayersLayerProps {
  layers: Id1HoloLayer[];
  faceSide: Id1CardSide;
}

export function HoloLayersLayer({ layers, faceSide }: HoloLayersLayerProps) {
  const activeLayers = layers.filter(
    (layer) => layer.src && (layer.side === "both" || layer.side === faceSide),
  );
  if (activeLayers.length === 0) return null;

  return (
    <>
      {activeLayers.map((layer, idx) => (
        <HoloLayerContainer
          key={layer.id || `holo-layer-${idx}`}
          layerOpacity={layer.opacity}
          blendMode={layer.blendMode}
          layerZIndex={layer.zIndex ?? 1}
          className={layer.className}
          style={layer.style}
        >
          {layer.src && (
            <HoloLayerImage
              src={layer.src}
              alt={layer.alt || `Holographic Layer ${idx + 1}`}
              objectFitStyle={layer.objectFit}
            />
          )}
        </HoloLayerContainer>
      ))}
    </>
  );
}

export function toSvgDataUrl(svgString: string): string {
  const cleanSvg = svgString.trim();
  if (typeof btoa !== "undefined") {
    try {
      return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(cleanSvg)))}`;
    } catch {
      // fallback
    }
  }
  return `data:image/svg+xml;utf8,${encodeURIComponent(cleanSvg)}`;
}

function extractLayerMask(
  layer: Id1HoloLayer,
  faceSide: Id1CardSide,
): string | undefined {
  const isMatch = layer.side === "both" || layer.side === faceSide;
  const isHolo = layer.holographic !== false;
  if (!isMatch || !isHolo) return undefined;
  return layer.maskUrl || layer.src;
}

export interface ResolveHoloMasksOptions {
  customMaskUrl?: string;
  guillocheMaskUrl?: string;
  holoLayers: Id1HoloLayer[];
  faceSide: Id1CardSide;
}

function buildLayerImageElements(
  holoLayers: Id1HoloLayer[],
  faceSide: Id1CardSide,
): string[] {
  const elements: string[] = [];
  for (const layer of holoLayers) {
    const mask = extractLayerMask(layer, faceSide);
    if (!mask) continue;
    const href = mask.startsWith("<svg") ? toSvgDataUrl(mask) : mask;
    const fit =
      layer.objectFit === "cover"
        ? "xMidYMid slice"
        : layer.objectFit === "fill"
          ? "none"
          : "xMidYMid meet";
    elements.push(
      `<image href="${href}" x="0" y="0" width="100%" height="100%" preserveAspectRatio="${fit}"/>`,
    );
  }
  return elements;
}

function compositeMaskSvg(
  guillocheMaskUrl: string | undefined,
  layerElements: string[],
): string {
  const svgElements: string[] = [];
  if (guillocheMaskUrl) {
    svgElements.push(
      `<image href="${guillocheMaskUrl}" x="0" y="0" width="100%" height="100%" preserveAspectRatio="none"/>`,
    );
  }
  svgElements.push(...layerElements);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 856 540" width="100%" height="100%">${svgElements.join("")}</svg>`;
}

export function resolveHoloMasks({
  customMaskUrl,
  guillocheMaskUrl,
  holoLayers,
  faceSide,
}: ResolveHoloMasksOptions): string | undefined {
  if (customMaskUrl) return customMaskUrl;

  const activeLayerMasks = holoLayers
    .map((layer) => extractLayerMask(layer, faceSide))
    .filter((mask): mask is string => Boolean(mask));

  if (!guillocheMaskUrl && activeLayerMasks.length === 0) return undefined;
  if (guillocheMaskUrl && activeLayerMasks.length === 0)
    return guillocheMaskUrl;
  if (!guillocheMaskUrl && activeLayerMasks.length === 1) {
    const single = activeLayerMasks[0];
    return single.startsWith("<svg") ? toSvgDataUrl(single) : single;
  }

  const layerElements = buildLayerImageElements(holoLayers, faceSide);
  const combined = compositeMaskSvg(guillocheMaskUrl, layerElements);
  return toSvgDataUrl(combined);
}
