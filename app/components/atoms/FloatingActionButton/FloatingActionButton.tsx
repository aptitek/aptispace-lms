import AddRoundedIcon from "@mui/icons-material/AddRounded";
import Tooltip from "@mui/material/Tooltip";
import type { FloatingActionButtonProps } from "./FloatingActionButton.types";
import { StyledFloatingActionButton } from "./FloatingActionButton.styles";

export function FloatingActionButton({
  tooltip,
  onClick,
  className,
  testId = "fab-btn",
  icon,
}: FloatingActionButtonProps) {
  return (
    <Tooltip title={tooltip} arrow placement="top">
      <StyledFloatingActionButton
        onClick={onClick}
        aria-label={tooltip}
        data-testid={testId}
        className={`md3-ghost-fab ${className || ""}`.trim()}
      >
        {icon || <AddRoundedIcon sx={{ fontSize: 28 }} />}
      </StyledFloatingActionButton>
    </Tooltip>
  );
}

export default FloatingActionButton;
