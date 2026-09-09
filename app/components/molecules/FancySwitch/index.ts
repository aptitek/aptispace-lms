export { default, FancySwitch } from "./FancySwitch";

export {
  ZenithSwitch,
  ThemeSwitch,
  MeridianSwitch,
  LanguageSwitch,
  ClockFormatSwitch,
  AttendanceSwitch,
  BadgeAccessSwitch,
} from "./FancySwitch.variants";

export { default as DebugThemeSwitch } from "./DebugThemeSwitch";
export type { DebugThemeSwitchProps } from "./DebugThemeSwitch";

export type {
  FancySwitchProps,
  FancySwitchRenderState,
  ThemeSwitchProps,
  ZenithSwitchProps,
  LanguageSwitchProps,
  MeridianSwitchProps,
  ClockFormatSwitchProps,
  AttendanceSwitchProps,
  BadgeAccessSwitchProps,
  SupportedLanguage,
  ClockFormat,
  AttendanceMode,
  AccessStatus,
  SwitchSize,
  SwitchSizeConfig,
} from "./FancySwitch.types";

export {
  SWITCH_SIZE_CONFIGS,
  DEFAULT_THUMB_SPRING,
  DEFAULT_PEEK_SPRING,
  FancyTrack,
  FancyThumb,
  PeekingAnchor,
  DisabledTooltipWrapper,
  ToggleWrapper,
  filterDollarProp,
} from "./FancySwitch.styles";

export * from "./FancySwitch.glyphs";
