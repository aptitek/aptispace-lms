import {
  forwardRef,
  useState,
  useCallback,
  type KeyboardEvent,
  type MouseEvent,
} from "react";
import { motion, AnimatePresence, type HTMLMotionProps } from "framer-motion";
import { useTranslation } from "react-i18next";
import type { SupportedLanguage } from "~/i18n";
import {
  UkFlag,
  FrFlag,
  UkMapSilhouette,
  FranceMapSilhouette,
  AirplaneIcon,
} from "./MeridianGlyphs";
import {
  type MeridianSize,
  MERIDIAN_SIZE_CONFIGS,
  FLIGHT_SPRING,
  BEACON_SPRING,
  MeridianTrack,
  FlightArcSvg,
  CountryMapZone,
  FlightPuck,
  AirplaneFlightContainer,
  AirportCodeBadge,
  StateRippleLayer,
  ToggleWrapper,
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

function FlightPuckWithAirplane({
  cfg,
  isFrench,
  isHovered,
  isFlying,
}: {
  cfg: (typeof MERIDIAN_SIZE_CONFIGS)[MeridianSize];
  isFrench: boolean;
  isHovered: boolean;
  isFlying: boolean;
}) {
  const bankAngle = isFlying ? (isFrench ? 22 : -22) : 0;
  const altitudeY = isFlying ? -4 : isHovered ? -2 : 0;

  return (
    <FlightPuck
      $cfg={cfg}
      animate={{
        x: isFrench ? cfg.travelX : 0,
        scale: isFlying ? 1.08 : 1,
      }}
      transition={FLIGHT_SPRING}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isFrench ? (
          <motion.div
            key="fr-flag"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.18 }}
          >
            <FrFlag size={cfg.flagSize} />
          </motion.div>
        ) : (
          <motion.div
            key="uk-flag"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.18 }}
          >
            <UkFlag size={cfg.flagSize} />
          </motion.div>
        )}
      </AnimatePresence>

      <AirplaneFlightContainer
        animate={{
          y: altitudeY,
          rotate: bankAngle,
          scale: isHovered || isFlying ? 1.15 : 0.95,
        }}
        transition={BEACON_SPRING}
      >
        <AirplaneIcon size={cfg.planeSize} />
      </AirplaneFlightContainer>
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
  const [isFlying, setIsFlying] = useState(false);

  const handleFlight = useCallback(() => {
    if (config.disabled) return;
    const nextLang: SupportedLanguage =
      config.currentLang === "fr" ? "en" : "fr";
    setIsFlying(true);
    config.onLanguageChange?.(nextLang);
    setTimeout(() => setIsFlying(false), 380);
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
    setIsFlying(false);
    config.onMouseLeave?.(e);
  };

  return {
    isHovered,
    isFlying,
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
 * Take flight between countries! The airplane takes off from one country map outline
 * and lands on the other with flag badges, flight contrails, and runway radar pulses.
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

      <AirportCodeBadge $cfg={cfg}>{isFrench ? "FR" : "EN"}</AirportCodeBadge>

      <FlightPuckWithAirplane
        cfg={cfg}
        isFrench={isFrench}
        isHovered={controller.isHovered}
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
