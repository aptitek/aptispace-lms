import React from "react";
import { styled } from "@mui/material/styles";
import BugReportRoundedIcon from "@mui/icons-material/BugReportRounded";
import Tooltip from "../Tooltip/Tooltip";
import Switch from "../Switch/Switch";
import { useThemeMode } from "../../../utils/themeContext";

export interface DebugThemeToggleProps {
  className?: string;
  forceShow?: boolean;
  "data-testid"?: string;
}

const ToggleSpan = styled("span")({
  display: "inline-flex",
  alignItems: "center",
});

/**
 * Dev-Only Material Design 3 Switch for M3 Neon Debug Theme
 *
 * Placed next to the Celestial Theme Toggle to test high-contrast neon debug tokens
 * and hunt down un-themed or improperly styled elements.
 */
export default function DebugThemeToggle({
  className,
  forceShow = false,
  "data-testid": dataTestId = "debug-theme-toggle",
}: DebugThemeToggleProps) {
  const { isDebugTheme, toggleDebugTheme } = useThemeMode();

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
          aria-label="Toggle Debug Theme"
          data-testid={dataTestId}
          icon={(checked) => (
            <BugReportRoundedIcon
              sx={{
                fontSize: 14,
                color: checked ? "inherit" : "text.secondary",
              }}
            />
          )}
        />
      </ToggleSpan>
    </Tooltip>
  );
}
