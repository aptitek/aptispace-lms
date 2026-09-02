import type { ReactElement } from "react";

export interface HoloDecoratorProps {
  /** The arbitrary component to apply the holographic effect to */
  children: ReactElement;
  /** Whether the effect should be applied (useful for conditional application) */
  active?: boolean;
  /**
   * The type of rendering approach:
   * - 'text' applies background-clip and uses currentColor
   * - 'image' uses a mask-image overlay and requires maskUrl
   */
  type?: "text" | "image";
  /** Required if type === 'image'. The URL of the image to mask against */
  maskUrl?: string;
}
