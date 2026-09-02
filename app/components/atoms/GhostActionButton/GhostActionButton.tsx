import AddRoundedIcon from "@mui/icons-material/AddRounded";
import Tooltip from "@mui/material/Tooltip";
import type { GhostActionButtonProps } from "./GhostActionButton.types";
import { MD3FloatingActionButton } from "./GhostActionButton.styles";

export function GhostActionButton({
  tooltip,
  onClick,
  className,
  testId = "ghost-fab-btn",
}: GhostActionButtonProps) {
  return (
    <Tooltip title={tooltip} arrow placement="top">
      <MD3FloatingActionButton
        onClick={onClick}
        aria-label={tooltip}
        data-testid={testId}
        className={`md3-ghost-fab ${className || ""}`.trim()}
      >
        <AddRoundedIcon sx={{ fontSize: 28 }} />
      </MD3FloatingActionButton>
    </Tooltip>
  );
}

export default GhostActionButton;
