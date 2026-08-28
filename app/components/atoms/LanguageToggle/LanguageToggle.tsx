import {
  forwardRef,
  useState,
  useCallback,
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
import { LANGUAGE_STORAGE_KEY, type SupportedLanguage } from "../../../i18n";
import {
  UkFlag,
  FrFlag,
  UkMapSilhouette,
  FranceMapSilhouette,
  MdiAirplaneGlyph,
} from "./MeridianGlyphs";
import {
  type MeridianSize,
  MERIDIAN_SIZE_CONFIGS,
  FLIGHT_SPRING,
  MeridianTrack,
  FlightArcSvg,
  CountryMapZone,
  FlightPuck,
  StateRippleLayer,
  ToggleWrapper,
  PeekingAirplane,
} from "./LanguageToggle.styles";

export type { MeridianSize };

export interface MeridianToggleProps extends Omit<
  HTMLMotionProps<"button">,
  "size" | "onChange" | "onToggle" | "children"
> {
  language?: SupportedLanguage;
  size?: MeridianSize;
  onLanguageChange?: (lang: SupportedLanguage) => void;
  disabled?: boolean;
  className?: string;
  "data-testid"?: string;
}

export interface LanguageToggleProps {
  className?: string;
  size?: MeridianSize;
  disabled?: boolean;
  "data-testid"?: string;
}

function MeridianFlightTrajectory({
  cfg,
}: {
  cfg: (typeof MERIDIAN_SIZE_CONFIGS)[MeridianSize];
}) {
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
  cfg: (typeof MERIDIAN_SIZE_CONFIGS)[MeridianSize];
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
  cfg: (typeof MERIDIAN_SIZE_CONFIGS)[MeridianSize];
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
    transitionProps = {
      duration: 0.24,
      ease: [0.2, 0, 0, 1],
    };
  } else if (isHovered) {
    animateProps = {
      x: isFrench ? rightPeekX : leftPeekX,
      y: 0,
      rotate: isFrench ? -90 : 90,
      rotateX: 0,
      scale: 1,
      opacity: 0.95,
    };
    transitionProps = {
      type: "spring",
      stiffness: 380,
      damping: 22,
    };
  } else {
    animateProps = {
      x: isFrench ? rightTuckedX : leftTuckedX,
      y: 0,
      rotate: isFrench ? -90 : 90,
      rotateX: 0,
      scale: 0.3,
      opacity: 0,
    };
    transitionProps = {
      duration: 0.2,
      ease: "easeOut",
    };
  }

  return (
    <PeekingAirplane
      $cfg={cfg}
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
          transition={{ duration: 0.18 }}
        >
          <FrFlag size={flagSize} />
        </motion.div>
      ) : (
        <motion.div
          key="uk-flag"
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.6 }}
          transition={{ duration: 0.18 }}
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
  cfg: (typeof MERIDIAN_SIZE_CONFIGS)[MeridianSize];
  isFrench: boolean;
  isFlying: boolean;
}) {
  return (
    <FlightPuck
      $cfg={cfg}
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
  const [flightState, setFlightState] = useState<{
    isFlying: boolean;
    direction: "to-fr" | "to-en";
  }>({
    isFlying: false,
    direction: "to-fr",
  });

  const handleFlight = useCallback(() => {
    if (config.disabled) return;
    const isCurrentlyFrench = config.currentLang === "fr";
    const nextLang: SupportedLanguage = isCurrentlyFrench ? "en" : "fr";
    const direction: "to-fr" | "to-en" = isCurrentlyFrench ? "to-en" : "to-fr";

    setFlightState({ isFlying: true, direction });
    config.onLanguageChange?.(nextLang);
    setTimeout(() => {
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
 * Meridian Language Switch Toggle
 *
 * Travel between countries with country map silhouettes and animated flag puck indicator.
 */
export const MeridianToggle = forwardRef<
  HTMLButtonElement,
  MeridianToggleProps
>((props, ref) => {
  const {
    language,
    size,
    onLanguageChange,
    disabled,
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
  const resolvedSize = size ?? "medium";
  const cfg =
    MERIDIAN_SIZE_CONFIGS[resolvedSize] ?? MERIDIAN_SIZE_CONFIGS.medium;
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

  const ariaLabel = isFrench
    ? t("language.switchToEn", "Switch to English")
    : t("language.switchToFr", "Switch to French");

  return (
    <MeridianTrack
      ref={ref}
      type="button"
      role="button"
      aria-label={ariaLabel}
      title={ariaLabel}
      disabled={isSwitchDisabled}
      $cfg={cfg}
      $disabled={isSwitchDisabled}
      className={className ?? ""}
      data-testid={dataTestId ?? "meridian-language-toggle"}
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
            transition={{ duration: 0.2 }}
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
});

MeridianToggle.displayName = "MeridianToggle";

/**
 * LanguageToggle Component
 * Connected to `react-i18next`.
 */
export default function LanguageToggle({
  className,
  size = "small",
  disabled = false,
  "data-testid": dataTestId = "language-toggle",
}: LanguageToggleProps) {
  const { i18n } = useTranslation("common");

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
      aria-label="Language Selector"
    >
      <MeridianToggle
        size={size}
        disabled={disabled}
        data-testid={dataTestId}
        onLanguageChange={handleLanguageChange}
      />
    </ToggleWrapper>
  );
}
