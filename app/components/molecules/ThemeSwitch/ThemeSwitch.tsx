import { forwardRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import Tooltip from "~/components/atoms/Tooltip/Tooltip";
import { useThemeMode } from "~/utils/themeContext";
import type { ThemeMode } from "~/tokens/theme";
import type {
  MD3SwitchProps,
  SwitchSize,
  SwitchSizeConfig,
} from "~/components/atoms/Switch";
import {
  HighContrastSunGlyph,
  HighContrastMoonGlyph,
  PeekingSunIcon,
  PeekingMoonIcon,
} from "./CelestialGlyphs";
import {
  SIZE_CONFIGS,
  PEEK_SPRING,
  ZenithBaseSwitch,
  ArcOverlaySvg,
  HorizonPeekWrapper,
  IconFlexWrapper,
  ToggleWrapper,
  DisabledTooltipWrapper,
} from "./ThemeSwitch.styles";
import { M3_SPRINGS } from "~/tokens/motion";

export type { SwitchSize };

export interface ZenithSwitchProps extends Omit<
  MD3SwitchProps,
  "icon" | "children" | "onChange" | "onToggle"
> {
  checked?: boolean; // true = dark mode (Moon at Zenith), false = light mode (Sun at Zenith)
  mode?: ThemeMode;
  onToggle?: (checked: boolean) => void;
  onChangeMode?: (mode: ThemeMode) => void;
}

export interface ThemeSwitchProps {
  className?: string;
  size?: SwitchSize;
  disabled?: boolean;
  "data-testid"?: string;
}

function HorizonPeekPreview({
  isHovered,
  isDark,
  cfg,
}: {
  isHovered: boolean;
  isDark: boolean;
  cfg: SwitchSizeConfig;
}) {
  if (!isHovered) return null;

  return isDark ? (
    <HorizonPeekWrapper
      $position="right"
      $cfg={cfg}
      key="peek-sun"
      initial={{ opacity: 0, y: 10, scale: 0.6 }}
      animate={{ opacity: 0.9, y: -2, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.6 }}
      transition={PEEK_SPRING}
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
      >
        <PeekingSunIcon size={cfg.peekIconSize} />
      </motion.div>
    </HorizonPeekWrapper>
  ) : (
    <HorizonPeekWrapper
      $position="left"
      $cfg={cfg}
      key="peek-moon"
      initial={{ opacity: 0, y: 10, scale: 0.6 }}
      animate={{ opacity: 0.9, y: -2, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.6 }}
      transition={PEEK_SPRING}
    >
      <motion.div
        animate={{ y: [0, -1.5, 0] }}
        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
      >
        <PeekingMoonIcon size={cfg.peekIconSize} />
      </motion.div>
    </HorizonPeekWrapper>
  );
}

function ActiveZenithGlyph({
  isDark,
  iconSize,
}: {
  isDark: boolean;
  iconSize: number;
}) {
  return isDark ? (
    <motion.div
      key="zenith-moon"
      initial={{ opacity: 0, rotate: -45, scale: 0.5 }}
      animate={{ opacity: 1, rotate: 0, scale: 1 }}
      exit={{ opacity: 0, rotate: 45, scale: 0.5 }}
      transition={M3_SPRINGS.expressive.effects.fast}
    >
      <IconFlexWrapper>
        <HighContrastMoonGlyph size={iconSize} />
      </IconFlexWrapper>
    </motion.div>
  ) : (
    <motion.div
      key="zenith-sun"
      initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
      animate={{ opacity: 1, rotate: 0, scale: 1 }}
      exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
      transition={M3_SPRINGS.expressive.effects.fast}
    >
      <IconFlexWrapper>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 18, ease: "linear" }}
        >
          <HighContrastSunGlyph size={iconSize} />
        </motion.div>
      </IconFlexWrapper>
    </motion.div>
  );
}

function CelestialArcLine({ cfg }: { cfg: SwitchSizeConfig }) {
  const arcStartX = cfg.padX + 2;
  const arcEndX = cfg.width - cfg.padX - 2;
  const arcMidX = cfg.width / 2;
  const arcPath = `M ${arcStartX} ${cfg.arcBaseY} Q ${arcMidX} ${cfg.arcPeakY} ${arcEndX} ${cfg.arcBaseY}`;

  return (
    <ArcOverlaySvg viewBox={`0 0 ${cfg.width} ${cfg.height}`}>
      <path
        d={arcPath}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeDasharray="2.5 3"
        opacity={0.5}
      />
    </ArcOverlaySvg>
  );
}

function resolveIsDark(
  checked: boolean | undefined,
  mode: ThemeMode | undefined,
): boolean {
  if (checked !== undefined) return checked;
  if (mode !== undefined) return mode === "dark";
  return true;
}

/**
 * Material Design 3 Celestial Zenith Switch
 * Extends base Switch with celestial mechanics and dynamic decorations.
 */
export const ZenithSwitch = forwardRef<HTMLButtonElement, ZenithSwitchProps>(
  (props, ref) => {
    const {
      checked,
      mode,
      size = "medium",
      onToggle,
      onChangeMode,
      disabled = false,
      className,
      "data-testid": dataTestId,
      ...restProps
    } = props;

    const { t } = useTranslation("common");
    const isDark = resolveIsDark(checked, mode);
    const cfg = SIZE_CONFIGS[size] ?? SIZE_CONFIGS.medium;

    const labelText = isDark
      ? t("theme.switchToLight", "Switch to Light Mode")
      : t("theme.switchToDark", "Switch to Dark Mode");

    const handleSwitchChange = (nextChecked: boolean) => {
      onToggle?.(nextChecked);
      onChangeMode?.(nextChecked ? "dark" : "light");
    };

    const switchNode = (
      <ZenithBaseSwitch
        ref={ref}
        size={size}
        checked={isDark}
        onChange={handleSwitchChange}
        disabled={disabled}
        aria-label={labelText}
        className={className}
        data-testid={dataTestId ?? "zenith-theme-switch"}
        data-mode={isDark ? "dark" : "light"}
        $isDark={isDark}
        icon={(isChecked) => (
          <AnimatePresence mode="wait" initial={false}>
            <ActiveZenithGlyph
              isDark={isChecked}
              iconSize={cfg.thumbIconSize}
            />
          </AnimatePresence>
        )}
        {...restProps}
      >
        {({ isHovered, isChecked }) => (
          <>
            <CelestialArcLine cfg={cfg} />
            <AnimatePresence>
              {!disabled && (
                <HorizonPeekPreview
                  isHovered={isHovered}
                  isDark={isChecked}
                  cfg={cfg}
                />
              )}
            </AnimatePresence>
          </>
        )}
      </ZenithBaseSwitch>
    );

    return (
      <Tooltip title={labelText} placement="bottom">
        {disabled ? (
          <DisabledTooltipWrapper>{switchNode}</DisabledTooltipWrapper>
        ) : (
          switchNode
        )}
      </Tooltip>
    );
  },
);

ZenithSwitch.displayName = "ZenithSwitch";

/**
 * ThemeSwitch Molecule Component
 * Bound directly to the application ThemeContext (`useThemeMode()`).
 */
export default function ThemeSwitch({
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
