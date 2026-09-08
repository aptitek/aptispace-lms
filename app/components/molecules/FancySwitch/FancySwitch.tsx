import {
  forwardRef,
  useState,
  useCallback,
  useRef,
  useEffect,
  type KeyboardEvent,
  type MouseEvent,
} from "react";
import Tooltip from "~/components/atoms/Tooltip";
import {
  type FancySwitchProps,
  type FancySwitchRenderState,
} from "./FancySwitch.types";
import {
  SWITCH_SIZE_CONFIGS,
  DEFAULT_THUMB_SPRING,
  FancyTrack,
  FancyThumb,
  DisabledTooltipWrapper,
} from "./FancySwitch.styles";

export function useFancySwitchController({
  disabled,
  checked,
  onChange,
  onToggle,
  toggleDurationMs = 320,
  onClick,
  onKeyDown,
  onMouseEnter,
  onMouseLeave,
  onMouseDown,
  onMouseUp,
}: {
  disabled: boolean;
  checked: boolean;
  onChange?: (checked: boolean) => void;
  onToggle?: (checked: boolean) => void;
  toggleDurationMs?: number;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  onKeyDown?: (e: KeyboardEvent<HTMLButtonElement>) => void;
  onMouseEnter?: (e: MouseEvent<HTMLButtonElement>) => void;
  onMouseLeave?: (e: MouseEvent<HTMLButtonElement>) => void;
  onMouseDown?: (e: MouseEvent<HTMLButtonElement>) => void;
  onMouseUp?: (e: MouseEvent<HTMLButtonElement>) => void;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const [toggleDirection, setToggleDirection] = useState<
    "forward" | "backward"
  >("forward");
  const toggleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (toggleTimerRef.current) clearTimeout(toggleTimerRef.current);
    };
  }, []);

  const handleToggleAction = useCallback(() => {
    if (disabled) return;
    const nextChecked = !checked;
    setToggleDirection(nextChecked ? "forward" : "backward");
    setIsToggling(true);

    if (toggleTimerRef.current) clearTimeout(toggleTimerRef.current);
    toggleTimerRef.current = setTimeout(() => {
      setIsToggling(false);
    }, toggleDurationMs);

    onChange?.(nextChecked);
    onToggle?.(nextChecked);
  }, [disabled, checked, toggleDurationMs, onChange, onToggle]);

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    onClick?.(e);
    if (!e.defaultPrevented) handleToggleAction();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    onKeyDown?.(e);
    if (!e.defaultPrevented && (e.key === " " || e.key === "Enter")) {
      e.preventDefault();
      handleToggleAction();
    }
  };

  const handleMouseEnter = (e: MouseEvent<HTMLButtonElement>) => {
    setIsHovered(true);
    onMouseEnter?.(e);
  };

  const handleMouseLeave = (e: MouseEvent<HTMLButtonElement>) => {
    setIsHovered(false);
    setIsPressed(false);
    onMouseLeave?.(e);
  };

  const handleMouseDown = (e: MouseEvent<HTMLButtonElement>) => {
    setIsPressed(true);
    onMouseDown?.(e);
  };

  const handleMouseUp = (e: MouseEvent<HTMLButtonElement>) => {
    setIsPressed(false);
    onMouseUp?.(e);
  };

  return {
    isHovered,
    isPressed,
    isToggling,
    toggleDirection,
    handleToggleAction,
    handleClick,
    handleKeyDown,
    handleMouseEnter,
    handleMouseLeave,
    handleMouseDown,
    handleMouseUp,
  };
}

function resolveTargetThumbX(
  checked: boolean,
  travelX: number,
  reverse: boolean,
): number {
  if (reverse) {
    return checked ? 0 : travelX;
  }
  return checked ? travelX : 0;
}

function resolveThumbScale(isPressed: boolean) {
  return {
    scaleX: isPressed ? 1.14 : 1,
    scaleY: isPressed ? 0.92 : 1,
  };
}

function wrapWithTooltip(
  node: React.ReactElement,
  tooltipTitle?: string,
  disabled?: boolean,
): React.ReactElement {
  if (!tooltipTitle) {
    return node;
  }
  return (
    <Tooltip title={tooltipTitle} placement="bottom">
      {disabled ? (
        <DisabledTooltipWrapper>{node}</DisabledTooltipWrapper>
      ) : (
        node
      )}
    </Tooltip>
  );
}

const DEFAULT_FANCY_SWITCH_PROPS = {
  size: "medium" as const,
  disabled: false,
  "data-testid": "fancy-switch",
  bimodal: false,
  thumbReverseTravel: false,
  thumbSpring: DEFAULT_THUMB_SPRING,
  toggleDurationMs: 320,
};

const TrackDecorations: React.FC<{
  state: FancySwitchRenderState;
  backgroundDecorations?: (state: FancySwitchRenderState) => React.ReactNode;
  peekingElement?: (state: FancySwitchRenderState) => React.ReactNode;
  overlayDecorations?: (state: FancySwitchRenderState) => React.ReactNode;
}> = ({ state, backgroundDecorations, peekingElement, overlayDecorations }) => (
  <>
    {backgroundDecorations ? backgroundDecorations(state) : null}
    {peekingElement ? peekingElement(state) : null}
    {overlayDecorations ? overlayDecorations(state) : null}
  </>
);

export const FancySwitch = forwardRef<HTMLButtonElement, FancySwitchProps>(
  (props, ref) => {
    const config = { ...DEFAULT_FANCY_SWITCH_PROPS, ...props };
    const {
      checked,
      onChange,
      onToggle,
      size,
      disabled,
      ariaLabel,
      tooltipTitle,
      className,
      "data-testid": dataTestId,
      bimodal,
      thumbContent,
      peekingElement,
      backgroundDecorations,
      overlayDecorations,
      thumbReverseTravel,
      thumbSpring,
      toggleDurationMs,
      customThumbColor,
      customTrackBackground,
      customTrackBorder,
      onClick,
      onKeyDown,
      onMouseEnter,
      onMouseLeave,
      onMouseDown,
      onMouseUp,
      ...restProps
    } = config;

    const cfg = SWITCH_SIZE_CONFIGS[size] ?? SWITCH_SIZE_CONFIGS.medium;
    const isSwitchDisabled = Boolean(disabled);

    const controller = useFancySwitchController({
      disabled: isSwitchDisabled,
      checked,
      onChange,
      onToggle,
      toggleDurationMs,
      onClick,
      onKeyDown,
      onMouseEnter,
      onMouseLeave,
      onMouseDown,
      onMouseUp,
    });

    const renderState: FancySwitchRenderState = {
      checked,
      isHovered: controller.isHovered,
      isPressed: controller.isPressed,
      isToggling: controller.isToggling,
      toggleDirection: controller.toggleDirection,
      cfg,
      disabled: isSwitchDisabled,
    };

    const targetThumbX = resolveTargetThumbX(
      checked,
      cfg.travelX,
      thumbReverseTravel,
    );
    const thumbScale = resolveThumbScale(controller.isPressed);

    const trackNode = (
      <FancyTrack
        ref={ref}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={ariaLabel}
        disabled={isSwitchDisabled}
        $cfg={cfg}
        $checked={bimodal ? false : checked}
        $disabled={isSwitchDisabled}
        $customBackground={customTrackBackground?.(renderState)}
        $customBorder={customTrackBorder?.(renderState)}
        className={className}
        data-testid={dataTestId}
        onClick={controller.handleClick}
        onKeyDown={controller.handleKeyDown}
        onMouseEnter={controller.handleMouseEnter}
        onMouseLeave={controller.handleMouseLeave}
        onMouseDown={controller.handleMouseDown}
        onMouseUp={controller.handleMouseUp}
        whileTap={isSwitchDisabled ? undefined : { scale: 0.96 }}
        {...restProps}
      >
        <TrackDecorations
          state={renderState}
          backgroundDecorations={backgroundDecorations}
          peekingElement={peekingElement}
          overlayDecorations={overlayDecorations}
        />

        <FancyThumb
          $cfg={cfg}
          $checked={checked}
          $customColor={customThumbColor?.(renderState)}
          animate={{
            x: targetThumbX,
            ...thumbScale,
          }}
          transition={thumbSpring}
        >
          {thumbContent(renderState)}
        </FancyThumb>
      </FancyTrack>
    );

    return wrapWithTooltip(trackNode, tooltipTitle, isSwitchDisabled);
  },
);

FancySwitch.displayName = "FancySwitch";
export default FancySwitch;
