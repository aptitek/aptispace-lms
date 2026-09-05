import type { ReactNode } from "react";
import type { SxProps, Theme } from "@mui/material/styles";

export interface InstitutionLogoProps {
  /** Logo image URL */
  logoUrl?: string | null;
  /** Name of the institution (used for alt text and fallback display) */
  name: string;
  /** Height of the logo in pixels or CSS units (default: 40) */
  height?: number | string;
  /** Maximum width of the logo (default: 160) */
  maxWidth?: number | string;
  /** Whether to apply holographic styling on the logo/text */
  holo?: boolean;
  /** Custom fallback element to render if image fails or is absent */
  fallback?: ReactNode;
  /** Whether to show the text name alongside the image (default: false if logo succeeds) */
  showText?: boolean;
  /** Test identifier */
  testId?: string;
  /** MUI styling overrides */
  sx?: SxProps<Theme>;
}
