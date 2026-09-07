import {
  forwardRef,
  useState,
  useCallback,
  useRef,
  useEffect,
  type KeyboardEvent,
  type MouseEvent,
} from "react";
import {
  motion,
  AnimatePresence,
  type HTMLMotionProps,
  type TargetAndTransition,
  type Transition,
} from "framer-motion";
import { useTranslation } from "react-i18next";
import Tooltip from "~/components/atoms/Tooltip";
import { LANGUAGE_STORAGE_KEY, type SupportedLanguage } from "~/i18n";
import {
  UkFlag,
  FrFlag,
  UkMapSilhouette,
  FranceMapSilhouette,
  MdiAirplaneGlyph,
} from "./MeridianGlyphs";
import {
  type SwitchSize,
  type MeridianSizeConfig,
  MERIDIAN_SIZE_CONFIGS,
  FLIGHT_SPRING,
  MeridianTrack,
  FlightArcSvg,
  CountryMapZone,
  FlightPuck,
  StateRippleLayer,
  ToggleWrapper,
  DisabledTooltipWrapper,
  PeekingAirplane,
} from "./LanguageSwitch.styles";
import { M3_SPRINGS } from "~/tokens/motion";

export type { SwitchSize, MeridianSizeConfig };

export interface MeridianSwitchProps extends Omit<
  HTMLMotionProps<"button">,
  "size" | "onChange" | "onToggle" | "children"
> {
  language?: SupportedLanguage;
  size?: SwitchSize;
  onLanguageChange?: (lang: SupportedLanguage) => void;
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

function resolveMeridianConfig(size?: SwitchSize): MeridianSizeConfig {
  return (
    MERIDIAN_SIZE_CONFIGS[size ?? "medium"] ?? MERIDIAN_SIZE_CONFIGS.medium
  );
}

function getLanguageAriaLabel(
  isFrench: boolean,
  t: (k: string, f: string) => string,
): string {
  return isFrench
    ? t("language.switchToEn", "Switch to English")
    : t("language.switchToFr", "Switch to French");
}

function MeridianFlightTrajectory({ cfg }: { cfg: MeridianSizeConfig }) {
  const startX = cfg.padX + 4;
  const endX = cfg.width - cfg.padX - 4;
  const midX = cfg.width / 2;
  const pathD = `M ${startX} ${cfg.height - 7} Q ${midX} 4 ${endX} ${cfg.height - 7}`;

  return (
    <FlightArcSvg viewBox={`0 0 ${cfg.width} ${cfg.height}`}>
      <path
        d={pathD}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeDasharray="2 3"
        opacity={0.4}
      />
    </FlightArcSvg>
  );
}

function CountrySilhouettes({
  cfg,
  isFrench,
  isHovered,
}: {
  cfg: MeridianSizeConfig;
  isFrench: boolean;
  isHovered: boolean;
}) {
  return (
    <>
      <CountryMapZone $position="left" $cfg={cfg}>
        <UkMapSilhouette
          size={cfg.mapWidth}
          active={!isFrench || (isHovered && isFrench)}
        />
      </CountryMapZone>
      <CountryMapZone $position="right" $cfg={cfg}>
        <FranceMapSilhouette
          size={cfg.mapWidth}
          active={isFrench || (isHovered && !isFrench)}
        />
      </CountryMapZone>
    </>
  );
}

function FlightAirplane({
  cfg,
  isFrench,
  isHovered,
  flightState,
}: {
  cfg: MeridianSizeConfig;
  isFrench: boolean;
  isHovered: boolean;
  flightState: { isFlying: boolean; direction: "to-fr" | "to-en" };
}) {
  const leftCenterX = cfg.padX - 2 + cfg.puckSize / 2;
  const rightCenterX = cfg.padX - 2 + cfg.travelX + cfg.puckSize / 2;
  const halfPlane = cfg.planeSize / 2;
  const peekOffset = cfg.puckSize * 0.72;

  const leftTuckedX = leftCenterX - halfPlane;
  const leftPeekX = leftTuckedX + peekOffset;

  const rightTuckedX = rightCenterX - halfPlane;
  const rightPeekX = rightTuckedX - peekOffset;

  let animateProps: TargetAndTransition;
  let transitionProps: Transition;

  if (flightState.isFlying) {
    const isToFr = flightState.direction === "to-fr";
    const startX = isToFr ? leftPeekX : rightPeekX;
    const endX = isToFr ? cfg.width - cfg.padX : 0;
    const initialRot = isToFr ? 90 : -90;

    animateProps = {
      x: [startX, endX],
      y: 0,
      rotate: initialRot,
      rotateX: 0,
      scale: [1, 1, 0.6],
      opacity: [1, 1, 0],
    };
    transitionProps = M3_SPRINGS.expressive.effects.default;
  } else if (isHovered) {
    animateProps = {
      x: isFrench ? rightPeekX : leftPeekX,
      y: 0,
      rotate: isFrench ? -90 : 90,
      rotateX: 0,
      scale: 1,
      opacity: 0.95,
    };
    transitionProps = M3_SPRINGS.celestialPeek;
  } else {
    animateProps = {
      x: isFrench ? rightTuckedX : leftTuckedX,
      y: 0,
      rotate: isFrench ? -90 : 90,
      rotateX: 0,
      scale: 0.3,
      opacity: 0,
    };
    transitionProps = M3_SPRINGS.standard.effects.fast;
  }

  return (
    <PeekingAirplane
      $cfg={cfg}
      data-testid="peeking-airplane"
      initial={false}
      animate={animateProps}
      transition={transitionProps}
    >
      <MdiAirplaneGlyph size={cfg.planeSize} />
    </PeekingAirplane>
  );
}

function FlagGraphic({
  isFrench,
  flagSize,
}: {
  isFrench: boolean;
  flagSize: number;
}) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      {isFrench ? (
        <motion.div
          key="fr-flag"
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.6 }}
          transition={M3_SPRINGS.expressive.effects.fast}
        >
          <FrFlag size={flagSize} />
        </motion.div>
      ) : (
        <motion.div
          key="uk-flag"
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.6 }}
          transition={M3_SPRINGS.expressive.effects.fast}
        >
          <UkFlag size={flagSize} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function FlightPuckWithFlag({
  cfg,
  isFrench,
  isFlying,
}: {
  cfg: MeridianSizeConfig;
  isFrench: boolean;
  isFlying: boolean;
}) {
  return (
    <FlightPuck
      $cfg={cfg}
      data-testid="flight-puck"
      animate={{
        x: isFrench ? cfg.travelX : 0,
        scale: isFlying ? 1.08 : 1,
      }}
      transition={FLIGHT_SPRING}
    >
      <FlagGraphic isFrench={isFrench} flagSize={cfg.flagSize} />
    </FlightPuck>
  );
}

interface ControllerConfig {
  disabled: boolean;
  currentLang: SupportedLanguage;
  onLanguageChange?: (lang: SupportedLanguage) => void;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  onKeyDown?: (e: KeyboardEvent<HTMLButtonElement>) => void;
  onMouseEnter?: (e: MouseEvent<HTMLButtonElement>) => void;
  onMouseLeave?: (e: MouseEvent<HTMLButtonElement>) => void;
}

function useMeridianController(config: ControllerConfig) {
  const [isHovered, setIsHovered] = useState(false);
  const flightTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [flightState, setFlightState] = useState<{
    isFlying: boolean;
    direction: "to-fr" | "to-en";
  }>({
    isFlying: false,
    direction: "to-fr",
  });

  useEffect(() => {
    return () => {
      if (flightTimerRef.current) {
        clearTimeout(flightTimerRef.current);
      }
    };
  }, []);

  const handleFlight = useCallback(() => {
    if (config.disabled) return;
    const isCurrentlyFrench = config.currentLang === "fr";
    const nextLang: SupportedLanguage = isCurrentlyFrench ? "en" : "fr";
    const direction: "to-fr" | "to-en" = isCurrentlyFrench ? "to-en" : "to-fr";

    setFlightState({ isFlying: true, direction });
    config.onLanguageChange?.(nextLang);
    if (flightTimerRef.current) {
      clearTimeout(flightTimerRef.current);
    }
    flightTimerRef.current = setTimeout(() => {
      setFlightState((prev) => ({ ...prev, isFlying: false }));
    }, 300);
  }, [config]);

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    config.onClick?.(e);
    if (!e.defaultPrevented) handleFlight();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    config.onKeyDown?.(e);
    if (!e.defaultPrevented && (e.key === " " || e.key === "Enter")) {
      e.preventDefault();
      handleFlight();
    }
  };

  const handleMouseEnter = (e: MouseEvent<HTMLButtonElement>) => {
    setIsHovered(true);
    config.onMouseEnter?.(e);
  };

  const handleMouseLeave = (e: MouseEvent<HTMLButtonElement>) => {
    setIsHovered(false);
    config.onMouseLeave?.(e);
  };

  return {
    isHovered,
    isFlying: flightState.isFlying,
    flightState,
    handleClick,
    handleKeyDown,
    handleMouseEnter,
    handleMouseLeave,
  };
}

function resolveCurrentLanguage(
  languageProp: SupportedLanguage | undefined,
  i18nLang: string | undefined,
): SupportedLanguage {
  if (languageProp) return languageProp;
  if (i18nLang?.startsWith("fr")) return "fr";
  return "en";
}

/**
 * Meridian Language Switch
 * Travel between countries with country map silhouettes, peeking flight airplane, and animated flag puck indicator.
 */
export const MeridianSwitch = forwardRef<
  HTMLButtonElement,
  MeridianSwitchProps
>((props, ref) => {
  const {
    language,
    size = "medium",
    onLanguageChange,
    disabled = false,
    className,
    "data-testid": dataTestId,
    onClick,
    onKeyDown,
    onMouseEnter,
    onMouseLeave,
    ...restProps
  } = props;

  const { t, i18n } = useTranslation("common");
  const currentLang = resolveCurrentLanguage(language, i18n.language);
  const isFrench = currentLang === "fr";
  const cfg = resolveMeridianConfig(size);
  const isSwitchDisabled = Boolean(disabled);

  const controller = useMeridianController({
    disabled: isSwitchDisabled,
    currentLang,
    onLanguageChange,
    onClick,
    onKeyDown,
    onMouseEnter,
    onMouseLeave,
  });

  const ariaLabel = getLanguageAriaLabel(isFrench, t);

  const trackNode = (
    <MeridianTrack
      ref={ref}
      type="button"
      role="switch"
      aria-checked={isFrench}
      aria-label={ariaLabel}
      disabled={isSwitchDisabled}
      $cfg={cfg}
      $isFrench={isFrench}
      $disabled={isSwitchDisabled}
      className={className ?? ""}
      data-testid={dataTestId ?? "meridian-language-switch"}
      data-lang={currentLang}
      onClick={controller.handleClick}
      onKeyDown={controller.handleKeyDown}
      onMouseEnter={controller.handleMouseEnter}
      onMouseLeave={controller.handleMouseLeave}
      whileTap={isSwitchDisabled ? undefined : { scale: 0.96 }}
      {...restProps}
    >
      <AnimatePresence>
        {controller.isHovered && !isSwitchDisabled && (
          <StateRippleLayer
            $cfg={cfg}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={M3_SPRINGS.expressive.effects.fast}
          />
        )}
      </AnimatePresence>

      <MeridianFlightTrajectory cfg={cfg} />

      <CountrySilhouettes
        cfg={cfg}
        isFrench={isFrench}
        isHovered={controller.isHovered}
      />

      <FlightAirplane
        cfg={cfg}
        isFrench={isFrench}
        isHovered={controller.isHovered && !isSwitchDisabled}
        flightState={controller.flightState}
      />

      <FlightPuckWithFlag
        cfg={cfg}
        isFrench={isFrench}
        isFlying={controller.isFlying}
      />
    </MeridianTrack>
  );

  return (
    <Tooltip title={ariaLabel} placement="bottom">
      {isSwitchDisabled ? (
        <DisabledTooltipWrapper>{trackNode}</DisabledTooltipWrapper>
      ) : (
        trackNode
      )}
    </Tooltip>
  );
});

MeridianSwitch.displayName = "MeridianSwitch";

/**
 * LanguageSwitch Molecule Component
 * Connected to `react-i18next` and localStorage.
 */
export default function LanguageSwitch({
  className,
  size = "small",
  disabled = false,
  "data-testid": dataTestId = "language-toggle",
}: LanguageSwitchProps) {
  const { i18n, t } = useTranslation("common");

  const handleLanguageChange = (nextLang: SupportedLanguage) => {
    void i18n.changeLanguage(nextLang);
    if (typeof document !== "undefined") {
      document.documentElement.lang = nextLang;
    }
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, nextLang);
    } catch {
      // Ignore storage access errors
    }
  };

  return (
    <ToggleWrapper
      className={className}
      role="region"
      aria-label={t("language.toggleLabel", "Select language")}
    >
      <MeridianSwitch
        size={size}
        disabled={disabled}
        data-testid={dataTestId}
        onLanguageChange={handleLanguageChange}
      />
    </ToggleWrapper>
  );
}
