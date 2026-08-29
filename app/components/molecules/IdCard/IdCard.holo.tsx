import type React from "react";
import type { IdCardProps, IdCardSide, IdHoloLayer } from "./IdCard.types";
import { HoloLayerContainer, HoloLayerImage } from "./IdCard.styles";

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
  rawLayer: string | IdHoloLayer,
  index: number,
): IdHoloLayer {
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
  IdCardProps,
  | "holoLayers"
  | "holoImage"
  | "holoImageMask"
  | "holoImageOpacity"
  | "holoImageBlendMode"
  | "holoImageObjectFit"
  | "holoImageSide"
>;

/**
 * Normalizes user-supplied holo layers and convenience image props into a uniform IdHoloLayer array.
 */
export function normalizeHoloLayers(props: HoloPropsSubset): IdHoloLayer[] {
  const result: IdHoloLayer[] = [];

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
  layers: IdHoloLayer[];
  faceSide: IdCardSide;
}

function resolveLayerBoundsStyle(
  layer: IdHoloLayer,
): React.CSSProperties | undefined {
  const left = layer.left ?? layer.x;
  const top = layer.top ?? layer.y;
  if (
    left === undefined &&
    top === undefined &&
    layer.width === undefined &&
    layer.height === undefined
  ) {
    return undefined;
  }
  return {
    left,
    top,
    right: layer.right ?? "auto",
    bottom: layer.bottom ?? "auto",
    width: layer.width,
    height: layer.height,
  };
}

export function HoloLayersLayer({ layers, faceSide }: HoloLayersLayerProps) {
  const activeLayers = layers.filter(
    (layer) => layer.src && (layer.side === "both" || layer.side === faceSide),
  );
  if (activeLayers.length === 0) return null;

  return (
    <>
      {activeLayers.map((layer, idx) => {
        const boundsStyle = resolveLayerBoundsStyle(layer);
        const containerStyle: React.CSSProperties = {
          ...layer.style,
          ...boundsStyle,
        };

        return (
          <HoloLayerContainer
            key={layer.id || `holo-layer-${idx}`}
            layerOpacity={layer.opacity}
            blendMode={layer.blendMode}
            layerZIndex={layer.zIndex ?? 1}
            className={layer.className}
            style={containerStyle}
          >
            {layer.src && (
              <HoloLayerImage
                src={
                  isRawSvgString(layer.src)
                    ? toSvgDataUrl(layer.src)
                    : layer.src
                }
                alt={layer.alt || `Holographic Layer ${idx + 1}`}
                objectFitStyle={layer.objectFit}
              />
            )}
          </HoloLayerContainer>
        );
      })}
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
  layer: IdHoloLayer,
  faceSide: IdCardSide,
): string | undefined {
  const isMatch = layer.side === "both" || layer.side === faceSide;
  const isHolo = layer.holographic !== false;
  if (!isMatch || !isHolo) return undefined;
  return layer.maskUrl || layer.src;
}

export interface ResolveHoloMasksOptions {
  customMaskUrl?: string;
  guillocheMaskUrl?: string;
  holoLayers: IdHoloLayer[];
  faceSide: IdCardSide;
}

export function isRawSvgString(str: string): boolean {
  const trimmed = str.trim();
  return trimmed.startsWith("<svg") || trimmed.startsWith("<?xml");
}

function resolveLayerAspectRatio(layer: IdHoloLayer): string {
  if (layer.preserveAspectRatio) return layer.preserveAspectRatio;
  if (layer.objectFit === "cover") return "xMidYMid slice";
  if (layer.objectFit === "fill") return "none";
  return "xMidYMid meet";
}

function buildLayerImageTag(layer: IdHoloLayer, mask: string): string {
  const href = isRawSvgString(mask) ? toSvgDataUrl(mask) : mask;
  const fit = resolveLayerAspectRatio(layer);
  const x = layer.x ?? layer.left ?? "0";
  const y = layer.y ?? layer.top ?? "0";
  const width = layer.width ?? "100%";
  const height = layer.height ?? "100%";
  return `<image href="${href}" x="${x}" y="${y}" width="${width}" height="${height}" preserveAspectRatio="${fit}"/>`;
}

function buildLayerImageElements(
  holoLayers: IdHoloLayer[],
  faceSide: IdCardSide,
): string[] {
  const elements: string[] = [];
  for (const layer of holoLayers) {
    const mask = extractLayerMask(layer, faceSide);
    if (mask) {
      elements.push(buildLayerImageTag(layer, mask));
    }
  }
  return elements;
}

function compositeMaskSvg(
  guillocheMaskUrl: string | undefined,
  layerElements: string[],
): string {
  const svgElements: string[] = [];

  svgElements.push(`
    <defs>
      <filter id="white-mask" color-interpolation-filters="sRGB">
        <feColorMatrix type="matrix" values="
          0 0 0 0 1
          0 0 0 0 1
          0 0 0 0 1
          0 0 0 1 0" />
      </filter>
    </defs>
  `);

  if (guillocheMaskUrl) {
    svgElements.push(
      `<image href="${guillocheMaskUrl}" x="0" y="0" width="100%" height="100%" preserveAspectRatio="none"/>`,
    );
  }

  if (layerElements.length > 0) {
    svgElements.push(
      `<g filter="url(#white-mask)">${layerElements.join("")}</g>`,
    );
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 856 540" width="100%" height="100%">${svgElements.join("")}</svg>`;
}

async function urlToBase64(url: string): Promise<string> {
  if (url.startsWith("data:") || isRawSvgString(url)) return url;
  try {
    const res = await fetch(url);
    const blob = await res.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (err) {
    console.warn("Failed to fetch image to base64 for holo mask", err);
    return url; // fallback to original (might fail in SVG mask)
  }
}

export async function resolveHoloMasksAsync({
  customMaskUrl,
  guillocheMaskUrl,
  holoLayers,
  faceSide,
}: ResolveHoloMasksOptions): Promise<string | undefined> {
  if (customMaskUrl) return customMaskUrl;

  const activeLayerMasks = holoLayers
    .map((layer) => extractLayerMask(layer, faceSide))
    .filter((mask): mask is string => Boolean(mask));

  if (!guillocheMaskUrl && activeLayerMasks.length === 0) return undefined;
  if (guillocheMaskUrl && activeLayerMasks.length === 0)
    return guillocheMaskUrl;

  const resolvedLayers = await Promise.all(
    holoLayers.map(async (layer) => {
      const mask = extractLayerMask(layer, faceSide);
      if (mask) {
        const b64 = await urlToBase64(mask);
        return { ...layer, maskUrl: b64, src: layer.maskUrl ? layer.src : b64 };
      }
      return layer;
    }),
  );

  const layerElements = buildLayerImageElements(resolvedLayers, faceSide);
  const combined = compositeMaskSvg(guillocheMaskUrl, layerElements);
  return toSvgDataUrl(combined);
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

  const layerElements = buildLayerImageElements(holoLayers, faceSide);
  const combined = compositeMaskSvg(guillocheMaskUrl, layerElements);
  return toSvgDataUrl(combined);
}
