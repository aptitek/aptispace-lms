import {
  forwardRef,
  useState,
  useCallback,
  type KeyboardEvent,
  type MouseEvent,
} from "react";
import { motion, AnimatePresence, type HTMLMotionProps } from "framer-motion";
import { useTranslation } from "react-i18next";
import Tooltip from "../Tooltip/Tooltip";
import { useThemeMode } from "../../../utils/themeContext";
import type { ThemeMode } from "../../../tokens/theme";
import {
  HighContrastSunGlyph,
  HighContrastMoonGlyph,
  PeekingSunIcon,
  PeekingMoonIcon,
} from "./CelestialGlyphs";
import {
  type SwitchSize,
  SIZE_CONFIGS,
  SPRING_TRANSITION,
  PEEK_SPRING,
  SwitchTrack,
  ArcOverlaySvg,
  CelestialThumb,
  HorizonPeekWrapper,
  StateRippleLayer,
  IconFlexWrapper,
  ToggleWrapper,
} from "./ThemeToggle.styles";

export type { SwitchSize };

export interface ZenithSwitchProps extends Omit<
  HTMLMotionProps<"button">,
  "size" | "onChange" | "onToggle" | "children"
> {
  checked?: boolean; // true = dark mode (Moon at Zenith), false = light mode (Sun at Zenith)
  mode?: ThemeMode;
  size?: SwitchSize;
  onToggle?: (checked: boolean) => void;
  onChangeMode?: (mode: ThemeMode) => void;
  disabled?: boolean;
  className?: string;
  "data-testid"?: string;
}

export interface ThemeToggleProps {
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
  cfg: (typeof SIZE_CONFIGS)[SwitchSize];
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
      transition={{ duration: 0.22 }}
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
      transition={{ duration: 0.22 }}
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

function CelestialArcLine({ cfg }: { cfg: (typeof SIZE_CONFIGS)[SwitchSize] }) {
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

interface SwitchControllerConfig {
  disabled: boolean;
  isDark: boolean;
  onToggle?: (checked: boolean) => void;
  onChangeMode?: (mode: ThemeMode) => void;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  onKeyDown?: (e: KeyboardEvent<HTMLButtonElement>) => void;
  onMouseEnter?: (e: MouseEvent<HTMLButtonElement>) => void;
  onMouseLeave?: (e: MouseEvent<HTMLButtonElement>) => void;
}

function useZenithSwitchController(config: SwitchControllerConfig) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const handleToggleAction = useCallback(() => {
    if (config.disabled) return;
    const nextDark = !config.isDark;
    config.onToggle?.(nextDark);
    config.onChangeMode?.(nextDark ? "dark" : "light");
  }, [config]);

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    config.onClick?.(e);
    if (!e.defaultPrevented) handleToggleAction();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    config.onKeyDown?.(e);
    if (!e.defaultPrevented && (e.key === " " || e.key === "Enter")) {
      e.preventDefault();
      handleToggleAction();
    }
  };

  const handleMouseEnter = (e: MouseEvent<HTMLButtonElement>) => {
    setIsHovered(true);
    config.onMouseEnter?.(e);
  };

  const handleMouseLeave = (e: MouseEvent<HTMLButtonElement>) => {
    setIsHovered(false);
    setIsPressed(false);
    config.onMouseLeave?.(e);
  };

  const handleMouseDown = () => setIsPressed(true);
  const handleMouseUp = () => setIsPressed(false);

  return {
    isHovered,
    isPressed,
    handleClick,
    handleKeyDown,
    handleMouseEnter,
    handleMouseLeave,
    handleMouseDown,
    handleMouseUp,
  };
}

function SwitchRippleIndicator({
  isHovered,
  disabled,
  cfg,
  isDark,
}: {
  isHovered: boolean;
  disabled: boolean;
  cfg: (typeof SIZE_CONFIGS)[SwitchSize];
  isDark: boolean;
}) {
  if (!isHovered || disabled) return null;
  return (
    <StateRippleLayer
      $cfg={cfg}
      $isDark={isDark}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.2 }}
    />
  );
}

function SwitchActiveThumb({
  cfg,
  isDark,
  isPressed,
}: {
  cfg: (typeof SIZE_CONFIGS)[SwitchSize];
  isDark: boolean;
  isPressed: boolean;
}) {
  return (
    <CelestialThumb
      $cfg={cfg}
      $isDark={isDark}
      animate={{
        x: isDark ? 0 : cfg.travelX,
        scaleX: isPressed ? 1.15 : 1,
        scaleY: isPressed ? 0.92 : 1,
      }}
      transition={SPRING_TRANSITION}
    >
      <AnimatePresence mode="wait" initial={false}>
        <ActiveZenithGlyph isDark={isDark} iconSize={cfg.thumbIconSize} />
      </AnimatePresence>
    </CelestialThumb>
  );
}

/**
 * Material Design 3 Celestial Zenith Switch
 */
export const ZenithSwitch = forwardRef<HTMLButtonElement, ZenithSwitchProps>(
  (props, ref) => {
    const {
      checked,
      mode,
      size,
      onToggle,
      onChangeMode,
      disabled,
      className,
      "data-testid": dataTestId,
      onClick,
      onKeyDown,
      onMouseEnter,
      onMouseLeave,
      ...restProps
    } = props;

    const { t } = useTranslation("common");
    const isDark = resolveIsDark(checked, mode);
    const resolvedSize = size ?? "medium";
    const cfg = SIZE_CONFIGS[resolvedSize] ?? SIZE_CONFIGS.medium;
    const isSwitchDisabled = Boolean(disabled);

    const controller = useZenithSwitchController({
      disabled: isSwitchDisabled,
      isDark,
      onToggle,
      onChangeMode,
      onClick,
      onKeyDown,
      onMouseEnter,
      onMouseLeave,
    });

    const labelText = isDark
      ? t("theme.switchToLight", "Switch to Light Mode")
      : t("theme.switchToDark", "Switch to Dark Mode");

    return (
      <Tooltip title={labelText} placement="bottom">
        <SwitchTrack
          ref={ref}
          type="button"
          role="switch"
          aria-checked={isDark}
          aria-label={labelText}
          disabled={isSwitchDisabled}
          $cfg={cfg}
          $isDark={isDark}
          $disabled={isSwitchDisabled}
          className={className ?? ""}
          data-testid={dataTestId ?? "zenith-theme-switch"}
          data-mode={isDark ? "dark" : "light"}
          onClick={controller.handleClick}
          onKeyDown={controller.handleKeyDown}
          onMouseEnter={controller.handleMouseEnter}
          onMouseLeave={controller.handleMouseLeave}
          onMouseDown={controller.handleMouseDown}
          onMouseUp={controller.handleMouseUp}
          whileTap={isSwitchDisabled ? undefined : { scale: 0.96 }}
          {...restProps}
        >
          <AnimatePresence>
            <SwitchRippleIndicator
              isHovered={controller.isHovered}
              disabled={isSwitchDisabled}
              cfg={cfg}
              isDark={isDark}
            />
          </AnimatePresence>

          <CelestialArcLine cfg={cfg} />

          <AnimatePresence>
            {!isSwitchDisabled && (
              <HorizonPeekPreview
                isHovered={controller.isHovered}
                isDark={isDark}
                cfg={cfg}
              />
            )}
          </AnimatePresence>

          <SwitchActiveThumb
            cfg={cfg}
            isDark={isDark}
            isPressed={controller.isPressed}
          />
        </SwitchTrack>
      </Tooltip>
    );
  },
);

ZenithSwitch.displayName = "ZenithSwitch";

/**
 * ThemeToggle Component
 * Bound directly to the application ThemeContext (`useThemeMode()`).
 */
export default function ThemeToggle({
  className,
  size = "small",
  disabled = false,
  "data-testid": dataTestId = "theme-toggle",
}: ThemeToggleProps) {
  const { mode, toggleColorMode } = useThemeMode();

  return (
    <ToggleWrapper className={className} role="region" aria-label="Theme Mode">
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
