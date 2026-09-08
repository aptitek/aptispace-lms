import React, { forwardRef } from "react";
import { AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useTheme } from "@mui/material/styles";
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
      onChange,
      onChangeMode,
      size = "medium",
      disabled = false,
      className = "",
      "data-testid": dataTestId = "zenith-theme-switch",
      ...restProps
    } = props;

    const theme = useTheme();
    const { mode: contextMode } = useThemeMode();
    const { t } = useTranslation("common");
    const isDark = resolveIsDark(checked, mode, contextMode);
    const ariaLabel = resolveDarkAria(isDark, t);
    const tooltipTitle = resolveDarkTooltip(isDark, t);

    const handleToggle = (nextChecked: boolean) => {
      onToggle?.(nextChecked);
      onChange?.(nextChecked);
      onChangeMode?.(nextChecked ? "dark" : "light");
    };

    const bgPaper = theme.palette.background.paper;
    const bgDefault = theme.palette.background.default;
    const primaryMain = theme.palette.primary.main;
    const warningMain = theme.palette.warning.main;
    const warningLight = theme.palette.warning.light;

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
        data-mode={isDark ? "dark" : "light"}
        bimodal={true}
        thumbReverseTravel={true}
        thumbSpring={M3_SPRINGS.celestialThumb}
        customTrackBackground={() =>
          isDark
            ? `linear-gradient(180deg, ${bgPaper} 0%, ${bgDefault} 100%)`
            : `linear-gradient(180deg, ${bgDefault} 0%, ${bgPaper} 100%)`
        }
        customTrackBorder={({ isHovered }) =>
          isHovered
            ? isDark
              ? primaryMain
              : warningMain
            : theme.palette.divider
        }
        customTrackShadow={({ isHovered }) =>
          isDark
            ? isHovered
              ? `inset 0 1px 3px rgba(0, 0, 0, 0.3), 0 0 12px ${primaryMain}`
              : `0 0 0 1px ${theme.palette.divider}`
            : isHovered
              ? `inset 0 1px 3px rgba(0, 0, 0, 0.15), 0 0 12px ${warningLight}`
              : "inset 0 1px 3px rgba(0, 0, 0, 0.15)"
        }
        customThumbColor={() =>
          isDark
            ? `linear-gradient(135deg, ${primaryMain} 0%, ${theme.palette.primary.dark} 100%)`
            : `linear-gradient(135deg, ${warningLight} 0%, ${warningMain} 100%)`
        }
        customThumbShadow={() =>
          isDark
            ? `0 0 12px ${primaryMain}, 0 0 0 1px rgba(255, 255, 255, 0.2)`
            : `0 0 14px ${warningLight}, 0 2px 5px rgba(0, 0, 0, 0.2)`
        }
        thumbContent={({ cfg }) => (
          <AnimatePresence mode="wait" initial={false}>
            <ActiveZenithGlyph isDark={isDark} iconSize={cfg.thumbIconSize} />
          </AnimatePresence>
        )}
        peekingElement={({ isHovered, cfg, disabled: isDis }) =>
          !isDis && (
            <HorizonPeekPreview
              isHovered={isHovered}
              isDark={isDark}
              cfg={cfg}
            />
          )
        }
        backgroundDecorations={({ cfg }) => <CelestialArcLine cfg={cfg} />}
        overlayDecorations={({ isHovered, cfg, disabled: isDis }) =>
          isHovered && !isDis ? (
            <StateRippleLayer
              $cfg={cfg}
              $isDark={isDark}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={M3_SPRINGS.expressive.effects.fast}
            />
          ) : null
        }
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
