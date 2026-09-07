import type React from "react";
import type { ReactNode } from "react";

export interface FloatingActionButtonProps {
  tooltip: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  testId?: string;
  icon?: ReactNode;
}
