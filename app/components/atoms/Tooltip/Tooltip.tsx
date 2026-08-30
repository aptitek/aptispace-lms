import { forwardRef } from "react";
import MuiTooltip, {
  type TooltipProps as MuiTooltipProps,
} from "@mui/material/Tooltip";

export type TooltipProps = MuiTooltipProps;

/**
 * MD3 Tooltip Atom Component
 *
 * Provides a standardized Material Design 3 Tooltip with:
 * - Automatic Solarized MD3 token styling via theme overrides
 * - Arrow enabled by default
 * - Calibrated MD3 motion enter/leave delays
 * - Full accessible aria binding
 */
export const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(
  function Tooltip(
    { arrow = true, enterDelay = 200, leaveDelay = 100, ...props },
    ref,
  ) {
    return (
      <MuiTooltip
        ref={ref}
        arrow={arrow}
        enterDelay={enterDelay}
        leaveDelay={leaveDelay}
        {...props}
      />
    );
  },
);

Tooltip.displayName = "Tooltip";
export default Tooltip;
