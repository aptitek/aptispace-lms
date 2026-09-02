import type React from "react";

export interface GhostActionButtonProps {
  tooltip: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  testId?: string;
}
