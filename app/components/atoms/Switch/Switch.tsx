import React, {
  forwardRef,
  useState,
  useCallback,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
} from "react";
import { styled } from "@mui/material/styles";
import { motion, AnimatePresence } from "framer-motion";

export interface MD3SwitchProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  icon?: ReactNode | ((checked: boolean) => ReactNode);
  className?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "data-testid"?: string;
  id?: string;
}

const filterDollarProp = (prop: PropertyKey) =>
  typeof prop === "string" && !prop.startsWith("$");

const Track = styled(motion.button, {
  shouldForwardProp: filterDollarProp,
})<{
  $checked: boolean;
  $disabled: boolean;
}>(({ theme, $checked, $disabled }) => {
  const primary = theme.palette.primary.main;
  const outline = theme.palette.text.secondary;
  const surfaceContainerHighest =
    theme.palette.surfaceContainerHighest || theme.palette.background.paper;

  return {
    position: "relative",
    display: "inline-flex",
    alignItems: "center",
    width: 52,
    height: 32,
    padding: 0,
    borderRadius: 16,
    cursor: $disabled ? "not-allowed" : "pointer",
    boxSizing: "border-box",
    border: $checked ? `2px solid ${primary}` : `2px solid ${outline}`,
    backgroundColor: $checked ? primary : surfaceContainerHighest,
    opacity: $disabled ? 0.38 : 1,
    outline: "none",
    userSelect: "none",
    WebkitTapHighlightColor: "transparent",
    transition:
      "background-color 0.2s ease, border-color 0.2s ease, opacity 0.2s ease",

    "&:focus-visible": {
      boxShadow: `0 0 0 2px ${theme.palette.background.default}, 0 0 0 4px ${primary}`,
    },
  };
});

const Thumb = styled(motion.span, {
  shouldForwardProp: filterDollarProp,
})<{
  $checked: boolean;
  $isPressed: boolean;
  $hasIcon: boolean;
}>(({ theme, $checked, $hasIcon }) => {
  const onPrimary =
    theme.palette.primary.contrastText || theme.palette.common.white;
  const outline = theme.palette.text.secondary;

  return {
    position: "absolute",
    left: 4,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
    backgroundColor: $checked ? onPrimary : outline,
    color: $checked
      ? theme.palette.primary.main
      : theme.palette.background.paper,
    pointerEvents: "none",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.2)",
    ...theme.applyStyles("dark", {
      boxShadow: "0 0 0 1px rgba(255, 255, 255, 0.12)",
    }),
    svg: {
      width: $checked || $hasIcon ? 14 : 12,
      height: $checked || $hasIcon ? 14 : 12,
    },
  };
});

const RippleStateLayer = styled(motion.span, {
  shouldForwardProp: filterDollarProp,
})<{
  $checked: boolean;
}>(({ theme, $checked }) => ({
  position: "absolute",
  width: 40,
  height: 40,
  borderRadius: "50%",
  backgroundColor: $checked
    ? theme.palette.primary.main
    : theme.palette.text.primary,
  opacity: 0.1,
  pointerEvents: "none",
}));

function resolveThumbMetrics(
  isChecked: boolean,
  hasIcon: boolean,
  isPressed: boolean,
) {
  const size = isPressed ? 26 : isChecked ? 24 : hasIcon ? 20 : 16;
  const travelX = isChecked ? 20 : hasIcon ? 2 : 4;
  return { size, travelX };
}

interface SwitchControllerOptions {
  controlledChecked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
}

function useSwitchController({
  controlledChecked,
  defaultChecked = false,
  disabled = false,
  onChange,
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
    e.preventDefault();
    handleToggle();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      handleToggle();
    }
  };

  return {
    isChecked,
    isHovered,
    isPressed,
    setIsHovered,
    setIsPressed,
    handleClick,
    handleKeyDown,
  };
}

/**
 * Canonical Material Design 3 Switch Atom
 */
export const Switch = forwardRef<HTMLButtonElement, MD3SwitchProps>(
  (props, ref) => {
    const {
      checked: controlledChecked,
      defaultChecked = false,
      onChange,
      disabled = false,
      icon,
      className,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledBy,
      "data-testid": dataTestId = "md3-switch",
      id,
    } = props;

    const controller = useSwitchController({
      controlledChecked,
      defaultChecked,
      disabled,
      onChange,
    });

    const hasIcon = Boolean(icon);
    const { size: thumbSize, travelX: thumbTravelX } = resolveThumbMetrics(
      controller.isChecked,
      hasIcon,
      controller.isPressed,
    );

    const renderedIcon =
      typeof icon === "function" ? icon(controller.isChecked) : icon;

    return (
      <Track
        ref={ref}
        id={id}
        type="button"
        role="switch"
        aria-checked={controller.isChecked}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        disabled={disabled}
        $checked={controller.isChecked}
        $disabled={disabled}
        className={className}
        data-testid={dataTestId}
        onClick={controller.handleClick}
        onKeyDown={controller.handleKeyDown}
        onMouseEnter={() => controller.setIsHovered(true)}
        onMouseLeave={() => {
          controller.setIsHovered(false);
          controller.setIsPressed(false);
        }}
        onMouseDown={() => controller.setIsPressed(true)}
        onMouseUp={() => controller.setIsPressed(false)}
        whileTap={disabled ? undefined : { scale: 0.96 }}
      >
        <AnimatePresence>
          {controller.isHovered && !disabled && (
            <RippleStateLayer
              $checked={controller.isChecked}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{
                opacity: 0.12,
                scale: 1,
                x: thumbTravelX - 8,
              }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.15 }}
            />
          )}
        </AnimatePresence>

        <Thumb
          $checked={controller.isChecked}
          $isPressed={controller.isPressed}
          $hasIcon={hasIcon}
          animate={{
            x: thumbTravelX,
            width: thumbSize,
            height: thumbSize,
          }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 30,
          }}
        >
          {renderedIcon}
        </Thumb>
      </Track>
    );
  },
);

Switch.displayName = "Switch";
export default Switch;
