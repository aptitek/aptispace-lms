import React from "react";
import { styled } from "@mui/material/styles";
import BugReportRoundedIcon from "@mui/icons-material/BugReportRounded";
import Tooltip from "~/components/atoms/Tooltip/Tooltip";
import Switch, {
  type SwitchSize,
  SWITCH_SIZE_CONFIGS,
} from "~/components/atoms/Switch";
import { useThemeMode } from "~/utils/themeContext";

export interface DebugThemeSwitchProps {
  className?: string;
  forceShow?: boolean;
  size?: SwitchSize;
  "data-testid"?: string;
}

const ToggleSpan = styled("span")({
  display: "inline-flex",
  alignItems: "center",
});

/**
 * Dev-Only Material Design 3 Switch for M3 Neon Debug Theme
 * Extends base Switch with debug theme context binding.
 */
export default function DebugThemeSwitch({
  className,
  forceShow = false,
  size = "small",
  "data-testid": dataTestId = "debug-theme-toggle",
}: DebugThemeSwitchProps) {
  const { isDebugTheme, toggleDebugTheme } = useThemeMode();
  const cfg = SWITCH_SIZE_CONFIGS[size] ?? SWITCH_SIZE_CONFIGS.small;

  // Only render in development mode or when forceShow is set
  if (!import.meta.env.DEV && !forceShow) {
    return null;
  }

  return (
    <Tooltip
      title={
        isDebugTheme
          ? "Disable Debug Theme (Dev Only)"
          : "Enable M3 Neon Debug Theme (Dev Only)"
      }
      placement="bottom"
    >
      <ToggleSpan className={className}>
        <Switch
          checked={isDebugTheme}
          onChange={toggleDebugTheme}
          size={size}
          aria-label="Toggle Debug Theme"
          data-testid={dataTestId}
          icon={(checked) => (
            <BugReportRoundedIcon
              sx={{
                fontSize: cfg.thumbIconSize,
                color: checked ? "inherit" : "text.secondary",
              }}
            />
          )}
        />
      </ToggleSpan>
    </Tooltip>
  );
}

export { DebugThemeSwitch as DebugThemeToggle };
