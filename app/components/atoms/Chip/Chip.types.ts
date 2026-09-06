import type { ElementType, ReactNode } from "react";
import type { ChipProps as MuiChipProps } from "@mui/material/Chip";
import type { ChipShape } from "~/tokens/shapes";
import type { InstitutionType } from "~/tokens/institutions";
import type { RoleType } from "~/tokens/roles";

export type { ChipShape, InstitutionType, RoleType };

export interface BaseChipProps {
  /**
   * Expressive or geometric shape for the chip.
   * Supports all 35 M3 expressive shapes (e.g. 'pill', 'circle', 'square', '9-sided-cookie',
   * 'ghost-ish', 'diamond', 'arch', 'slanted', etc.) or custom radius string/number.
   */
  shape?: ChipShape;

  /**
   * Institution category type preset ("school" | "company" | "all" | string).
   * Automatically resolves institution icon, M3 shape (clamshell, semicircle),
   * theme color (cyan/yellow), and internationalized label.
   */
  institutionType?: InstitutionType | string | null;

  /**
   * Alias for institutionType.
   */
  institution?: InstitutionType | string | null;

  /**
   * User role preset ("student" | "instructor" | "admin" | "all" | string).
   * Automatically resolves role icon, M3 shape (pill, ghost-ish, 9-sided-cookie),
   * theme color (success/info/secondary), and internationalized label.
   */
  userRole?: RoleType | "all" | string | null;

  /**
   * Whether to display the preset's associated icon (defaults to true).
   */
  showIcon?: boolean;

  /**
   * Optional image source URL or custom image ReactNode.
   */
  image?: string | ReactNode;

  /**
   * Accessible alt text for image when `image` is a URL string.
   */
  imageAlt?: string;

  /**
   * Position of the image relative to label ("start" | "end"). Default is "start".
   */
  imagePosition?: "start" | "end";

  /**
   * Custom height for image (default size-matched).
   */
  imageHeight?: number | string;

  /**
   * Custom width for image.
   */
  imageWidth?: number | string;

  /**
   * Monospace typography toggle (ideal for technical tags, usernames, hashes, IDs).
   */
  mono?: boolean;

  /**
   * Custom test ID for data-testid
   */
  testId?: string;

  /**
   * Direct data-testid support
   */
  "data-testid"?: string;

  /**
   * Optional anchor attributes when rendered as a link
   */
  href?: string;
  target?: string;
  rel?: string;
}

export type ChipProps<
  RootComponent extends ElementType = "div",
  AdditionalProps = object,
> = MuiChipProps<RootComponent, AdditionalProps & BaseChipProps>;
