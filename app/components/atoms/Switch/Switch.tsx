import {
  forwardRef,
  useState,
  useCallback,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
} from "react";
import { AnimatePresence, type HTMLMotionProps } from "framer-motion";
import { M3_SPRINGS } from "~/tokens/motion";
import {
  type SwitchSize,
  type SwitchSizeConfig,
  SWITCH_SIZE_CONFIGS,
  SwitchTrack,
  SwitchThumb,
  SwitchRippleLayer,
  filterDollarProp,
} from "./Switch.styles";

export type { SwitchSize, SwitchSizeConfig };
export {
  SWITCH_SIZE_CONFIGS,
  SwitchTrack,
  SwitchThumb,
  SwitchRippleLayer,
  filterDollarProp,
};

export interface SwitchRenderProps {
  isChecked: boolean;
  isHovered: boolean;
  isPressed: boolean;
  disabled: boolean;
  size: SwitchSize;
  cfg: SwitchSizeConfig;
}

export interface MD3SwitchProps extends Omit<
  HTMLMotionProps<"button">,
  "size" | "onChange" | "children" | "ref"
> {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  size?: SwitchSize;
  icon?:
    | ReactNode
    | ((checked: boolean, renderProps: SwitchRenderProps) => ReactNode);
  children?: ReactNode | ((renderProps: SwitchRenderProps) => ReactNode);
  className?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "data-testid"?: string;
  id?: string;
}

export interface SwitchControllerOptions {
  controlledChecked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  onKeyDown?: (e: KeyboardEvent<HTMLButtonElement>) => void;
  onMouseEnter?: (e: MouseEvent<HTMLButtonElement>) => void;
  onMouseLeave?: (e: MouseEvent<HTMLButtonElement>) => void;
  onMouseDown?: (e: MouseEvent<HTMLButtonElement>) => void;
  onMouseUp?: (e: MouseEvent<HTMLButtonElement>) => void;
}

export function useSwitchController({
  controlledChecked,
  defaultChecked = false,
  disabled = false,
  onChange,
  onClick,
  onKeyDown,
  onMouseEnter,
  onMouseLeave,
  onMouseDown,
  onMouseUp,
}: SwitchControllerOptions) {
  const [uncontrolledChecked, setUncontrolledChecked] =
    useState(defaultChecked);
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const isChecked =
    controlledChecked !== undefined ? controlledChecked : uncontrolledChecked;

  const handleToggle = useCallback(() => {
    if (disabled) return;
    const nextChecked = !isChecked;
    if (controlledChecked === undefined) {
      setUncontrolledChecked(nextChecked);
    }
    onChange?.(nextChecked);
  }, [disabled, isChecked, controlledChecked, onChange]);

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    onClick?.(e);
    if (!e.defaultPrevented) {
      e.preventDefault();
      handleToggle();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    onKeyDown?.(e);
    if (!e.defaultPrevented && (e.key === " " || e.key === "Enter")) {
      e.preventDefault();
      handleToggle();
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
    isChecked,
    isHovered,
    isPressed,
    setIsHovered,
    setIsPressed,
    handleToggle,
    handleClick,
    handleKeyDown,
    handleMouseEnter,
    handleMouseLeave,
    handleMouseDown,
    handleMouseUp,
  };
}

export function resolveThumbMetrics(
  cfg: SwitchSizeConfig,
  isChecked: boolean,
  hasIcon: boolean,
  isPressed: boolean,
) {
  const size = isPressed
    ? cfg.thumbSize + 2
    : isChecked || hasIcon
      ? cfg.thumbSize
      : cfg.thumbSizeUnchecked;

  const insetDiff = (cfg.thumbSize - size) / 2;
  const travelX = isChecked ? cfg.travelX : insetDiff;
  const offsetY = isChecked || hasIcon ? 0 : insetDiff;

  return { size, travelX, offsetY };
}

function renderSwitchIcon(
  icon: MD3SwitchProps["icon"],
  isChecked: boolean,
  renderProps: SwitchRenderProps,
) {
  if (typeof icon === "function") {
    return icon(isChecked, renderProps);
  }
  return icon;
}

function renderSwitchChildren(
  children: MD3SwitchProps["children"],
  renderProps: SwitchRenderProps,
) {
  if (typeof children === "function") {
    return children(renderProps);
  }
  return children;
}

function extractCleanDomProps(restProps: Record<string, unknown>) {
  return Object.fromEntries(
    Object.entries(restProps).filter(([key]) => !key.startsWith("$")),
  );
}

/**
 * Canonical Material Design 3 Switch Atom
 */
export const Switch = forwardRef<HTMLButtonElement, MD3SwitchProps>(
  (props, ref) => {
    const {
      checked: controlledChecked,
      defaultChecked,
      onChange,
      disabled,
      size = "medium",
      icon,
      children,
      className,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledBy,
      "data-testid": dataTestId = "md3-switch",
      id,
      onClick,
      onKeyDown,
      onMouseEnter,
      onMouseLeave,
      onMouseDown,
      onMouseUp,
      ...restProps
    } = props;

    const isSwitchDisabled = Boolean(disabled);
    const cfg = SWITCH_SIZE_CONFIGS[size] ?? SWITCH_SIZE_CONFIGS.medium;

    const controller = useSwitchController({
      controlledChecked,
      defaultChecked,
      disabled: isSwitchDisabled,
      onChange,
      onClick,
      onKeyDown,
      onMouseEnter,
      onMouseLeave,
      onMouseDown,
      onMouseUp,
    });

    const hasIcon = Boolean(icon);
    const {
      size: thumbSize,
      travelX: thumbTravelX,
      offsetY: thumbOffsetY,
    } = resolveThumbMetrics(
      cfg,
      controller.isChecked,
      hasIcon,
      controller.isPressed,
    );

    const renderProps: SwitchRenderProps = {
      isChecked: controller.isChecked,
      isHovered: controller.isHovered,
      isPressed: controller.isPressed,
      disabled: isSwitchDisabled,
      size,
      cfg,
    };

    const renderedIcon = renderSwitchIcon(
      icon,
      controller.isChecked,
      renderProps,
    );
    const renderedChildren = renderSwitchChildren(children, renderProps);
    const cleanDomProps = extractCleanDomProps(restProps);
    const trackClassName = className
      ? `md3-switch-track ${className}`
      : "md3-switch-track";
    const tapAnimation = isSwitchDisabled ? undefined : { scale: 0.96 };

    return (
      <SwitchTrack
        ref={ref}
        id={id}
        type="button"
        role="switch"
        aria-checked={controller.isChecked}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        disabled={isSwitchDisabled}
        $cfg={cfg}
        $checked={controller.isChecked}
        $disabled={isSwitchDisabled}
        className={trackClassName}
        data-testid={dataTestId}
        onClick={controller.handleClick}
        onKeyDown={controller.handleKeyDown}
        onMouseEnter={controller.handleMouseEnter}
        onMouseLeave={controller.handleMouseLeave}
        onMouseDown={controller.handleMouseDown}
        onMouseUp={controller.handleMouseUp}
        whileTap={tapAnimation}
        {...cleanDomProps}
      >
        <AnimatePresence>
          {controller.isHovered && !isSwitchDisabled && (
            <SwitchRippleLayer
              className="md3-switch-ripple"
              $cfg={cfg}
              $checked={controller.isChecked}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 0.12, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={M3_SPRINGS.expressive.effects.fast}
            />
          )}
        </AnimatePresence>

        {renderedChildren}

        <SwitchThumb
          className="md3-switch-thumb"
          $cfg={cfg}
          $checked={controller.isChecked}
          $isPressed={controller.isPressed}
          $hasIcon={hasIcon}
          animate={{
            x: thumbTravelX,
            y: thumbOffsetY,
            width: thumbSize,
            height: thumbSize,
          }}
          transition={M3_SPRINGS.switchThumb}
        >
          {renderedIcon}
        </SwitchThumb>
      </SwitchTrack>
    );
  },
);

Switch.displayName = "Switch";
export default Switch;
