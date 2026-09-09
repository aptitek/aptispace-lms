import type { ReactNode } from "react";
import type { HTMLMotionProps, Transition } from "framer-motion";
import type { SwitchSize, SwitchSizeConfig } from "~/components/atoms/Switch";
import type { ThemeMode } from "~/tokens/theme";

export type { SwitchSize, SwitchSizeConfig };

export type SupportedLanguage = "en" | "fr";
export type ClockFormat = "12h" | "24h";
export type AttendanceMode = "in-person" | "remote";
export type AccessStatus = "locked" | "unlocked";

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
  customThumbShadow?: (state: FancySwitchRenderState) => string | undefined;
  customTrackBackground?: (state: FancySwitchRenderState) => string | undefined;
  customTrackBorder?: (state: FancySwitchRenderState) => string | undefined;
  customTrackShadow?: (state: FancySwitchRenderState) => string | undefined;
}

export interface ZenithSwitchProps extends Omit<
  HTMLMotionProps<"button">,
  "size" | "onChange" | "onToggle" | "children"
> {
  checked?: boolean; // true = dark mode, false = light mode
  mode?: ThemeMode;
  size?: SwitchSize;
  onChange?: (checked: boolean) => void;
  onToggle?: (checked: boolean) => void;
  onChangeMode?: (mode: ThemeMode) => void;
  disabled?: boolean;
  className?: string;
  "data-testid"?: string;
}

export interface ThemeSwitchProps {
  className?: string;
  size?: SwitchSize;
  disabled?: boolean;
  "data-testid"?: string;
}

export interface MeridianSwitchProps extends Omit<
  HTMLMotionProps<"button">,
  "size" | "onChange" | "onToggle" | "children"
> {
  language?: SupportedLanguage;
  onLanguageChange?: (lang: SupportedLanguage) => void;
  size?: SwitchSize;
  disabled?: boolean;
  className?: string;
  "data-testid"?: string;
}

export interface LanguageSwitchProps {
  className?: string;
  size?: SwitchSize;
  disabled?: boolean;
  "data-testid"?: string;
}

export interface ClockFormatSwitchProps extends Omit<
  HTMLMotionProps<"button">,
  "size" | "onChange" | "onToggle" | "children"
> {
  format?: ClockFormat;
  onChangeFormat?: (format: ClockFormat) => void;
  onChange?: (is24h: boolean) => void;
  onToggle?: (is24h: boolean) => void;
  size?: SwitchSize;
  disabled?: boolean;
  className?: string;
  "data-testid"?: string;
}

export interface AttendanceSwitchProps extends Omit<
  HTMLMotionProps<"button">,
  "size" | "onChange" | "onToggle" | "children"
> {
  mode?: AttendanceMode;
  checked?: boolean; // true = in-person, false = remote
  onChangeMode?: (mode: AttendanceMode) => void;
  onChange?: (checked: boolean) => void;
  onToggle?: (checked: boolean) => void;
  size?: SwitchSize;
  disabled?: boolean;
  className?: string;
  "data-testid"?: string;
}

export interface BadgeAccessSwitchProps extends Omit<
  HTMLMotionProps<"button">,
  "size" | "onChange" | "onToggle" | "children"
> {
  status?: AccessStatus;
  checked?: boolean; // true = unlocked/granted, false = locked
  onChangeStatus?: (status: AccessStatus) => void;
  onChange?: (checked: boolean) => void;
  onToggle?: (checked: boolean) => void;
  size?: SwitchSize;
  disabled?: boolean;
  className?: string;
  "data-testid"?: string;
}
