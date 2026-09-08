import React, { forwardRef } from "react";
import { useTranslation } from "react-i18next";
import { M3_MOTION_DURATIONS } from "~/tokens/motion";
import FancySwitch from "../FancySwitch";
import {
  TransitClockWrapper,
  InactiveDigitalSlot,
} from "../FancySwitch.styles";
import type { ClockFormatSwitchProps, ClockFormat } from "../FancySwitch.types";
import {
  ClockPuckDisplay,
  AnalogClockGlyph,
  DigitalClockGlyph,
} from "../FancySwitch.glyphs";

function resolveIs24h(format?: ClockFormat): boolean {
  return format === "24h";
}

export const ClockFormatSwitch = forwardRef<
  HTMLButtonElement,
  ClockFormatSwitchProps
>((props, ref) => {
  const {
    format = "12h",
    onChangeFormat,
    onChange,
    onToggle,
    size = "medium",
    disabled = false,
    className = "",
    "data-testid": dataTestId = "clock-format-switch",
    ...restProps
  } = props;

  const { t } = useTranslation("common");
  const is24h = resolveIs24h(format);

  const ariaLabel = is24h
    ? t("clock.switchTo12h", "Switch to 12-hour AM/PM time")
    : t("clock.switchTo24h", "Switch to 24-hour military time");

  const tooltipTitle = is24h
    ? t("clock.format24h", "24-Hour Time (Click for 12h)")
    : t("clock.format12h", "12-Hour Time (Click for 24h)");

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
      data-format={format}
      bimodal={true}
      toggleDurationMs={450}
      thumbContent={({ cfg, isToggling }) =>
        isToggling ? (
          <TransitClockWrapper
            key="transit-clock"
            data-testid="transit-clock"
            initial={{ opacity: 0, scale: 0.5, rotate: -30 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.5, rotate: 30 }}
            transition={{ duration: M3_MOTION_DURATIONS.s.short3 }}
          >
            <AnalogClockGlyph
              size={cfg.thumbSize - 2}
              isAnimating={isToggling}
            />
          </TransitClockWrapper>
        ) : (
          <ClockPuckDisplay
            key={`puck-${is24h ? "24" : "12"}`}
            is24h={is24h}
            fontSize={cfg.thumbIconSize}
          />
        )
      }
      backgroundDecorations={({ cfg, isHovered }) => {
        const inactivePosition = is24h ? "left" : "right";
        const inactiveFormat: ClockFormat = is24h ? "12h" : "24h";

        return (
          <InactiveDigitalSlot
            data-testid="inactive-digital-slot"
            $position={inactivePosition}
            $cfg={cfg}
          >
            <DigitalClockGlyph
              format={inactiveFormat}
              fontSize={Math.max(9, cfg.thumbIconSize - 4)}
              isHovered={isHovered}
            />
          </InactiveDigitalSlot>
        );
      }}
      {...restProps}
    />
  );
});

ClockFormatSwitch.displayName = "ClockFormatSwitch";
