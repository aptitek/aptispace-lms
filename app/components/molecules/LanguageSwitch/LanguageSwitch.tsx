import { forwardRef } from "react";
import {
  motion,
  AnimatePresence,
  type HTMLMotionProps,
  type TargetAndTransition,
  type Transition,
} from "framer-motion";
import { useTranslation } from "react-i18next";
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
  FLIGHT_SPRING,
  FlightArcSvg,
  CountryMapZone,
  ToggleWrapper,
  PeekingAirplane,
} from "./LanguageSwitch.styles";
import { M3_SPRINGS } from "~/tokens/motion";
import FancySwitch from "~/components/molecules/FancySwitch";

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
  isFlying,
  flightDirection,
}: {
  cfg: MeridianSizeConfig;
  isFrench: boolean;
  isHovered: boolean;
  isFlying: boolean;
  flightDirection: "forward" | "backward";
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

  if (isFlying) {
    const isToFr = flightDirection === "forward";
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
 * Powered by generic FancySwitch.
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
    className = "",
    "data-testid": dataTestId = "meridian-language-switch",
    ...restProps
  } = props;

  const { t, i18n } = useTranslation("common");
  const currentLang = resolveCurrentLanguage(language, i18n.language);
  const isFrench = currentLang === "fr";
  const ariaLabel = getLanguageAriaLabel(isFrench, t);

  const handleToggle = (nextChecked: boolean) => {
    const nextLang: SupportedLanguage = nextChecked ? "fr" : "en";
    onLanguageChange?.(nextLang);
  };

  return (
    <FancySwitch
      ref={ref}
      checked={isFrench}
      onChange={handleToggle}
      size={size}
      disabled={disabled}
      ariaLabel={ariaLabel}
      tooltipTitle={ariaLabel}
      className={className}
      data-testid={dataTestId}
      data-lang={currentLang}
      bimodal={true}
      thumbSpring={FLIGHT_SPRING}
      thumbContent={({ cfg }) => (
        <FlagGraphic isFrench={isFrench} flagSize={cfg.flagSize} />
      )}
      peekingElement={({
        isHovered,
        isToggling,
        toggleDirection,
        cfg,
        disabled: isDis,
      }) => (
        <FlightAirplane
          cfg={cfg}
          isFrench={isFrench}
          isHovered={isHovered && !isDis}
          isFlying={isToggling}
          flightDirection={toggleDirection}
        />
      )}
      backgroundDecorations={({ cfg, isHovered }) => (
        <>
          <MeridianFlightTrajectory cfg={cfg} />
          <CountrySilhouettes
            cfg={cfg}
            isFrench={isFrench}
            isHovered={isHovered}
          />
        </>
      )}
      {...restProps}
    />
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
