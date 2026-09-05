import type { HTMLAttributes, ReactNode } from "react";

export interface ExpressiveCardProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  isInteractive?: boolean;
  isSelected?: boolean;
  variant?: "elevated" | "elevation" | "outlined" | "dashed";
  className?: string;
}

export interface GhostFabOverlayProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  className?: string;
}

export interface DashedSkeletonCardProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  isInteractive?: boolean;
  className?: string;
}
