import type { ReactElement } from "react";
import type { SxProps, Theme } from "@mui/material/styles";

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
  /** Optional mask size for image mode. Default is 'contain' */
  maskSize?: "contain" | "cover" | string;
  /** Optional custom styles */
  sx?: SxProps<Theme>;
}
