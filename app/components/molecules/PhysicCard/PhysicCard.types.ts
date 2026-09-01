import type { CardProps } from "@mui/material/Card";
import type { ReactNode } from "react";

export interface PhysicCardProps extends Omit<CardProps, "children"> {
  /**
   * The content to display on the front of the card.
   */
  frontContent: ReactNode;

  /**
   * The content to display on the back of the card.
   */
  backContent?: ReactNode;

  /**
   * Whether the card is currently flipped (controlled state).
   */
  isFlipped?: boolean;

  /**
   * The initial flip state if uncontrolled.
   */
  defaultFlipped?: boolean;

  /**
   * Callback fired when the card flips (e.g. via click).
   */
  onFlip?: (isFlipped: boolean) => void;

  /**
   * CSS aspect-ratio string or number (e.g. '85.6/53.98' for ID card, or 1.58).
   * If not provided, the card will size based on its content or container.
   */
  ratio?: string | number;

  /**
   * Multiplier for the 3D tilt effect on hover. Defaults to 1.
   * Set to 0 to disable tilt.
   */
  tiltStrength?: number;

  /**
   * If true, clicking the card flips it, and hovering tilts it.
   * @default true
   */
  interactive?: boolean;
  /**
   * Whether to show the holographic foil effect on the card.
   * @default false
   */
  showHolo?: boolean;
  /**
   * Optional image URL to use as a CSS mask for the holo foil effect.
   * Allows specific parts of the card (like an illustration) to have foil
   * while the rest remains unaffected.
   */
  holoMaskImage?: string;
  /**
   * Whether to show the physical lighting sheen effect when tilting.
   * @default true
   */
  showSheen?: boolean;
  /**
   * If true, enables transparent glass mode where the opposite face
   * is faintly visible as a mirrored ghost.
   * @default false
   */
  isTransparent?: boolean;
}
