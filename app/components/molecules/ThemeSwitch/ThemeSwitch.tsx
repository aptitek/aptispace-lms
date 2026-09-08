import { forwardRef } from "react";
import { motion, AnimatePresence, type HTMLMotionProps } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useTheme } from "@mui/material/styles";
import { useThemeMode } from "~/utils/themeContext";
import type { ThemeMode } from "~/tokens/theme";
import {
  HighContrastSunGlyph,
  HighContrastMoonGlyph,
  PeekingSunIcon,
  PeekingMoonIcon,
} from "./CelestialGlyphs";
import {
  type SwitchSize,
  type SwitchSizeConfig,
  SPRING_TRANSITION,
  PEEK_SPRING,
  ArcOverlaySvg,
  HorizonPeekWrapper,
  StateRippleLayer,
  IconFlexWrapper,
  ToggleWrapper,
} from "./ThemeSwitch.styles";
import { M3_SPRINGS } from "~/tokens/motion";
import FancySwitch from "~/components/molecules/FancySwitch";

export type { SwitchSize, SwitchSizeConfig };

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
      data-testid="peeking-sun-preview"
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
      data-testid="peeking-moon-preview"
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
 * Powered by generic FancySwitch.
 */
export const ZenithSwitch = forwardRef<HTMLButtonElement, ZenithSwitchProps>(
  (props, ref) => {
    const {
      checked,
      mode,
      size = "medium",
      onToggle,
      onChange,
      onChangeMode,
      disabled = false,
      className = "",
      "data-testid": dataTestId = "zenith-theme-switch",
      ...restProps
    } = props;

    const theme = useTheme();
    const { t } = useTranslation("common");
    const isDark = resolveIsDark(checked, mode);
    const labelText = isDark
      ? t("theme.switchToLight", "Switch to Light Mode")
      : t("theme.switchToDark", "Switch to Dark Mode");

    const handleToggle = (nextDark: boolean) => {
      onToggle?.(nextDark);
      onChange?.(nextDark);
      onChangeMode?.(nextDark ? "dark" : "light");
    };

    return (
      <FancySwitch
        ref={ref}
        checked={isDark}
        onChange={handleToggle}
        size={size}
        disabled={disabled}
        ariaLabel={labelText}
        tooltipTitle={labelText}
        className={className}
        data-testid={dataTestId}
        data-mode={isDark ? "dark" : "light"}
        bimodal={true}
        thumbReverseTravel={true}
        thumbSpring={SPRING_TRANSITION}
        customThumbColor={() =>
          isDark ? theme.palette.primary.main : theme.palette.warning.main
        }
        thumbContent={({ cfg }) => (
          <AnimatePresence mode="wait" initial={false}>
            <ActiveZenithGlyph isDark={isDark} iconSize={cfg.thumbIconSize} />
          </AnimatePresence>
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
