import React, { forwardRef } from "react";
import { AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { M3_SPRINGS } from "~/tokens/motion";
import { useThemeMode } from "~/utils/themeContext";
import type { ThemeMode } from "~/tokens/theme";
import FancySwitch from "../FancySwitch";
import { ToggleWrapper, StateRippleLayer } from "../FancySwitch.styles";
import type { ThemeSwitchProps, ZenithSwitchProps } from "../FancySwitch.types";
import {
  ActiveZenithGlyph,
  HorizonPeekPreview,
  CelestialArcLine,
} from "../FancySwitch.glyphs";

function resolveIsDark(
  propChecked?: boolean,
  propMode?: ThemeMode,
  contextMode?: ThemeMode,
): boolean {
  if (propChecked !== undefined) return propChecked;
  if (propMode !== undefined) return propMode === "dark";
  return contextMode === "dark";
}

function resolveDarkAria(
  isDark: boolean,
  t: (key: string, def: string) => string,
): string {
  return isDark
    ? t("theme.switchToLight", "Switch to light theme")
    : t("theme.switchToDark", "Switch to dark theme");
}

function resolveDarkTooltip(
  isDark: boolean,
  t: (key: string, def: string) => string,
): string {
  return isDark
    ? t("theme.darkActive", "Dark mode active")
    : t("theme.lightActive", "Light mode active");
}

export const ZenithSwitch = forwardRef<HTMLButtonElement, ZenithSwitchProps>(
  (props, ref) => {
    const {
      mode,
      checked,
      onToggle,
      onChangeMode,
      size = "medium",
      disabled = false,
      className = "",
      "data-testid": dataTestId = "zenith-theme-switch",
      ...restProps
    } = props;

    const { mode: contextMode } = useThemeMode();
    const { t } = useTranslation("common");
    const isDark = resolveIsDark(checked, mode, contextMode);
    const ariaLabel = resolveDarkAria(isDark, t);
    const tooltipTitle = resolveDarkTooltip(isDark, t);

    const handleToggle = (nextChecked: boolean) => {
      onToggle?.(nextChecked);
      onChangeMode?.(nextChecked ? "dark" : "light");
    };

    return (
      <FancySwitch
        ref={ref}
        checked={isDark}
        onChange={handleToggle}
        size={size}
        disabled={disabled}
        ariaLabel={ariaLabel}
        tooltipTitle={tooltipTitle}
        className={className}
        data-testid={dataTestId}
        thumbSpring={M3_SPRINGS.celestialThumb}
        thumbContent={({ cfg }) => (
          <ActiveZenithGlyph isDark={isDark} iconSize={cfg.thumbIconSize} />
        )}
        peekingElement={({ isHovered, cfg, disabled: isDis }) =>
          !isDis && (
            <AnimatePresence>
              <HorizonPeekPreview
                isHovered={isHovered}
                isDark={isDark}
                cfg={cfg}
              />
            </AnimatePresence>
          )
        }
        backgroundDecorations={({ cfg }) => <CelestialArcLine cfg={cfg} />}
        overlayDecorations={({ isHovered, cfg, disabled: isDis }) => (
          <AnimatePresence>
            {isHovered && !isDis && (
              <StateRippleLayer
                $cfg={cfg}
                $isDark={isDark}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={M3_SPRINGS.expressive.effects.fast}
              />
            )}
          </AnimatePresence>
        )}
        {...restProps}
      />
    );
  },
);

ZenithSwitch.displayName = "ZenithSwitch";

export function ThemeSwitch({
  className,
  size = "small",
  disabled = false,
  "data-testid": dataTestId = "theme-toggle",
}: ThemeSwitchProps) {
  const { t } = useTranslation("common");
  const { mode, toggleColorMode } = useThemeMode();

  return (
    <ToggleWrapper
      className={className}
      role="region"
      aria-label={t("theme.toggleLabel", "Select color mode")}
    >
      <ZenithSwitch
        mode={mode}
        size={size}
        disabled={disabled}
        data-testid={dataTestId}
        onToggle={() => toggleColorMode()}
      />
    </ToggleWrapper>
  );
}
