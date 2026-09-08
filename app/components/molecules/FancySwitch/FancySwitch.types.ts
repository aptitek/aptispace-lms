import type { ReactNode } from "react";
import type { HTMLMotionProps, Transition } from "framer-motion";
import type { SwitchSize, SwitchSizeConfig } from "~/components/atoms/Switch";

export type { SwitchSize, SwitchSizeConfig };

export interface FancySwitchRenderState {
  checked: boolean;
  isHovered: boolean;
  isPressed: boolean;
  isToggling: boolean;
  toggleDirection: "forward" | "backward";
  cfg: SwitchSizeConfig;
  disabled: boolean;
}

export interface FancySwitchProps extends Omit<
  HTMLMotionProps<"button">,
  "size" | "onChange" | "onToggle" | "children" | "ref"
> {
  checked: boolean;
  onChange?: (checked: boolean) => void;
  onToggle?: (checked: boolean) => void;
  size?: SwitchSize;
  disabled?: boolean;
  ariaLabel: string;
  tooltipTitle?: string;
  className?: string;
  "data-testid"?: string;

  /**
   * When true, the switch operates as a bimodal selector (e.g. 12h/24h, EN/FR, In-Person/Remote)
   * rather than an on/off toggle, maintaining consistent neutral track styling in both positions.
   */
  bimodal?: boolean;

  // Custom visual slots
  thumbContent: (state: FancySwitchRenderState) => ReactNode;
  peekingElement?: (state: FancySwitchRenderState) => ReactNode;
  backgroundDecorations?: (state: FancySwitchRenderState) => ReactNode;
  overlayDecorations?: (state: FancySwitchRenderState) => ReactNode;

  // Dynamic travel & styling
  thumbReverseTravel?: boolean;
  thumbSpring?: Transition;
  toggleDurationMs?: number;

  // Visual customization hooks
  customThumbColor?: (state: FancySwitchRenderState) => string | undefined;
  customTrackBackground?: (state: FancySwitchRenderState) => string | undefined;
  customTrackBorder?: (state: FancySwitchRenderState) => string | undefined;
}
