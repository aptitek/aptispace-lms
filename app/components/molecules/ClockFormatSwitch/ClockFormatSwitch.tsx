import { forwardRef } from "react";
import type { HTMLMotionProps } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useTheme } from "@mui/material/styles";
import FancySwitch, {
  type SwitchSize,
  type SwitchSizeConfig,
} from "~/components/molecules/FancySwitch";
import { M3_MOTION_DURATIONS } from "~/tokens/motion";
import {
  AnalogClockGlyph,
  ClockPuckDisplay,
  DigitalClockGlyph,
} from "./ClockGlyphs";
import {
  InactiveDigitalSlot,
  TransitClockWrapper,
} from "./ClockFormatSwitch.styles";

export type ClockFormat = "12h" | "24h";

export interface ClockFormatSwitchProps extends Omit<
  HTMLMotionProps<"button">,
  "size" | "onChange" | "onToggle" | "children"
> {
  format?: ClockFormat;
  checked?: boolean; // false = 12h, true = 24h
  onChangeFormat?: (format: ClockFormat) => void;
  onChange?: (checked: boolean) => void;
  onToggle?: (checked: boolean) => void;
  size?: SwitchSize;
  disabled?: boolean;
  className?: string;
  "data-testid"?: string;
}

function resolveIs24h(
  checked: boolean | undefined,
  format: ClockFormat | undefined,
): boolean {
  if (checked !== undefined) return checked;
  if (format !== undefined) return format === "24h";
  return false;
}

function resolvePuckFontSize(cfg: SwitchSizeConfig): number {
  if (cfg.thumbSize <= 20) return 10.5;
  if (cfg.thumbSize <= 25) return 12;
  return 14.5;
}

/**
 * 12-24 Clock Switch
 * - Bimodal switch (no ON/OFF states): balanced neutral track and consistent thumb styling.
 * - Uses the analog clock with spinning needles as the transition inside the switch circle on toggle.
 * - Shows an ultra-compact digital clock on the inactive side with animated blinking colon ':' on hover.
 */
export const ClockFormatSwitch = forwardRef<
  HTMLButtonElement,
  ClockFormatSwitchProps
>((props, ref) => {
  const {
    format,
    checked,
    onChangeFormat,
    onChange,
    onToggle,
    size = "medium",
    disabled = false,
    className = "",
    "data-testid": dataTestId = "clock-format-switch",
    ...restProps
  } = props;

  const theme = useTheme();
  const { t } = useTranslation("common");
  const is24h = resolveIs24h(checked, format);

  const ariaLabel = is24h
    ? t("clock.switchTo12", "Switch to 12-hour format")
    : t("clock.switchTo24", "Switch to 24-hour format");

  const tooltipTitle = is24h
    ? t("clock.format24", "24-Hour Format (Click for 12h)")
    : t("clock.format12", "12-Hour Format (Click for 24h)");

  const handleToggle = (nextChecked: boolean) => {
    const nextFormat: ClockFormat = nextChecked ? "24h" : "12h";
    onChangeFormat?.(nextFormat);
    onChange?.(nextChecked);
    onToggle?.(nextChecked);
  };

  return (
    <FancySwitch
      ref={ref}
      checked={is24h}
      onChange={handleToggle}
      size={size}
      disabled={disabled}
      ariaLabel={ariaLabel}
      tooltipTitle={tooltipTitle}
      className={className}
      data-testid={dataTestId}
      data-format={is24h ? "24h" : "12h"}
      bimodal={true}
      toggleDurationMs={380}
      customThumbColor={() => theme.palette.primary.main}
      thumbContent={({ isToggling, cfg }) =>
        isToggling ? (
          <TransitClockWrapper
            key="transit-clock"
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.6, opacity: 0 }}
            transition={{ duration: M3_MOTION_DURATIONS.s.short3 }}
            data-testid="transit-clock"
          >
            <AnalogClockGlyph size={cfg.thumbSize - 2} isAnimating={true} />
          </TransitClockWrapper>
        ) : (
          <ClockPuckDisplay
            key={is24h ? "puck-24" : "puck-12"}
            is24h={is24h}
            fontSize={resolvePuckFontSize(cfg)}
          />
        )
      }
      backgroundDecorations={({ isHovered, cfg }) => (
        <InactiveDigitalSlot
          $position={is24h ? "left" : "right"}
          $cfg={cfg}
          data-testid="inactive-digital-slot"
        >
          <DigitalClockGlyph
            format={is24h ? "12h" : "24h"}
            isHovered={isHovered}
            cfg={cfg}
          />
        </InactiveDigitalSlot>
      )}
      {...restProps}
    />
  );
});

ClockFormatSwitch.displayName = "ClockFormatSwitch";
export default ClockFormatSwitch;
