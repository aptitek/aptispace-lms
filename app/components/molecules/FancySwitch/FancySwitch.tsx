import React, { forwardRef, useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import Tooltip from "~/components/atoms/Tooltip/Tooltip";
import {
  type SwitchSize,
  type SwitchSizeConfig,
  SWITCH_SIZE_CONFIGS,
  DEFAULT_THUMB_SPRING,
  FancyTrack,
  FancyThumb,
  DisabledTooltipWrapper,
} from "./FancySwitch.styles";
import type {
  FancySwitchProps,
  FancySwitchRenderState,
} from "./FancySwitch.types";

export type { SwitchSize, SwitchSizeConfig };
export { SWITCH_SIZE_CONFIGS };

function resolveTargetThumbX(
  checked: boolean,
  reverse: boolean,
  travelX: number,
): number {
  if (reverse) {
    return checked ? 0 : travelX;
  }
  return checked ? travelX : 0;
}

function resolveThumbScale(isPressed: boolean, isHovered: boolean): number {
  if (isPressed) return 0.92;
  if (isHovered) return 1.05;
  return 1;
}

function wrapWithTooltip(
  content: React.ReactNode,
  title?: string,
  disabled?: boolean,
): React.ReactElement {
  if (!title) {
    return <>{content}</>;
  }
  const node = disabled ? (
    <DisabledTooltipWrapper tabIndex={0}>{content}</DisabledTooltipWrapper>
  ) : (
    (content as React.ReactElement)
  );

  return (
    <Tooltip title={title} placement="top" arrow>
      {node}
    </Tooltip>
  );
}

function TrackDecorations({
  state,
  backgroundDecorations,
  overlayDecorations,
}: {
  state: FancySwitchRenderState;
  backgroundDecorations?: (state: FancySwitchRenderState) => React.ReactNode;
  overlayDecorations?: (state: FancySwitchRenderState) => React.ReactNode;
}): React.ReactElement {
  return (
    <>
      {backgroundDecorations?.(state)}
      {overlayDecorations?.(state)}
    </>
  );
}

interface SwitchInteractionOptions {
  checked: boolean;
  disabled: boolean;
  toggleDurationMs: number;
  onChange?: (checked: boolean) => void;
  onToggle?: (checked: boolean) => void;
}

function useSwitchInteraction(options: SwitchInteractionOptions) {
  const { checked, disabled, toggleDurationMs, onChange, onToggle } = options;
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const [toggleDirection, setToggleDirection] = useState<
    "forward" | "backward"
  >("forward");

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    if (isToggling) {
      timer = setTimeout(() => {
        setIsToggling(false);
      }, toggleDurationMs);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isToggling, toggleDurationMs]);

  const handleClick = (e?: React.MouseEvent | React.KeyboardEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (disabled) return;
    const nextChecked = !checked;
    setToggleDirection(nextChecked ? "forward" : "backward");
    setIsToggling(true);
    onChange?.(nextChecked);
    onToggle?.(nextChecked);
  };

  const handleMouseEnter = () => {
    if (!disabled) setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setIsPressed(false);
  };

  const handleMouseDown = () => {
    if (!disabled) setIsPressed(true);
  };

  const handleMouseUp = () => {
    setIsPressed(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      handleClick();
    }
  };

  return {
    isHovered,
    isPressed,
    isToggling,
    toggleDirection,
    handlers: {
      onClick: handleClick,
      onKeyDown: handleKeyDown,
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
      onMouseDown: handleMouseDown,
      onMouseUp: handleMouseUp,
    },
  };
}

interface NormalizedSwitchConfig {
  cfg: SwitchSizeConfig;
  disabled: boolean;
  bimodal: boolean;
  thumbReverseTravel: boolean;
  thumbSpring: typeof DEFAULT_THUMB_SPRING;
  toggleDurationMs: number;
}

function normalizeSwitchConfig(
  props: FancySwitchProps,
): NormalizedSwitchConfig {
  const sizeKey = props.size ?? "medium";
  return {
    cfg: SWITCH_SIZE_CONFIGS[sizeKey] ?? SWITCH_SIZE_CONFIGS.medium,
    disabled: Boolean(props.disabled),
    bimodal: Boolean(props.bimodal),
    thumbReverseTravel: Boolean(props.thumbReverseTravel),
    thumbSpring: props.thumbSpring ?? DEFAULT_THUMB_SPRING,
    toggleDurationMs: props.toggleDurationMs ?? 300,
  };
}

const RESERVED_PROP_KEYS = new Set([
  "checked",
  "onChange",
  "onToggle",
  "size",
  "disabled",
  "ariaLabel",
  "tooltipTitle",
  "className",
  "data-testid",
  "bimodal",
  "thumbContent",
  "peekingElement",
  "backgroundDecorations",
  "overlayDecorations",
  "thumbReverseTravel",
  "thumbSpring",
  "toggleDurationMs",
  "customThumbColor",
  "customThumbShadow",
  "customTrackBackground",
  "customTrackBorder",
  "customTrackShadow",
]);

function getCleanRestProps(props: FancySwitchProps): Record<string, unknown> {
  const clean: Record<string, unknown> = {};
  for (const key of Object.keys(props)) {
    if (!RESERVED_PROP_KEYS.has(key)) {
      clean[key] = (props as unknown as Record<string, unknown>)[key];
    }
  }
  return clean;
}

export const FancySwitch = forwardRef<HTMLButtonElement, FancySwitchProps>(
  (props, ref) => {
    const config = normalizeSwitchConfig(props);
    const restProps = getCleanRestProps(props);

    const interaction = useSwitchInteraction({
      checked: props.checked,
      disabled: config.disabled,
      toggleDurationMs: config.toggleDurationMs,
      onChange: props.onChange,
      onToggle: props.onToggle,
    });

    const targetX = resolveTargetThumbX(
      props.checked,
      config.thumbReverseTravel,
      config.cfg.travelX,
    );
    const scale = resolveThumbScale(
      interaction.isPressed,
      interaction.isHovered,
    );

    const renderState: FancySwitchRenderState = {
      checked: props.checked,
      isHovered: interaction.isHovered,
      isPressed: interaction.isPressed,
      isToggling: interaction.isToggling,
      toggleDirection: interaction.toggleDirection,
      cfg: config.cfg,
      disabled: config.disabled,
    };

    const trackChecked = config.bimodal ? false : props.checked;

    const trackElement = (
      <FancyTrack
        ref={ref}
        type="button"
        role="switch"
        aria-checked={props.checked}
        aria-label={props.ariaLabel}
        disabled={config.disabled}
        className={props.className}
        data-testid={props["data-testid"]}
        $cfg={config.cfg}
        $checked={trackChecked}
        $disabled={config.disabled}
        $customBackground={props.customTrackBackground?.(renderState)}
        $customBorder={props.customTrackBorder?.(renderState)}
        $customShadow={props.customTrackShadow?.(renderState)}
        {...interaction.handlers}
        {...restProps}
      >
        <TrackDecorations
          state={renderState}
          backgroundDecorations={props.backgroundDecorations}
          overlayDecorations={props.overlayDecorations}
        />

        <AnimatePresence>{props.peekingElement?.(renderState)}</AnimatePresence>

        <FancyThumb
          $cfg={config.cfg}
          $checked={trackChecked}
          $customColor={props.customThumbColor?.(renderState)}
          $customShadow={props.customThumbShadow?.(renderState)}
          animate={{ x: targetX, scale }}
          transition={config.thumbSpring}
        >
          {props.thumbContent(renderState)}
        </FancyThumb>
      </FancyTrack>
    );

    return wrapWithTooltip(trackElement, props.tooltipTitle, config.disabled);
  },
);

FancySwitch.displayName = "FancySwitch";

export default FancySwitch;
