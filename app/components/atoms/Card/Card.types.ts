import type { HTMLAttributes, ReactNode } from "react";
import type { SxProps, Theme } from "@mui/material/styles";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  isInteractive?: boolean;
  isSelected?: boolean;
  isNested?: boolean;
  variant?: "elevated" | "elevation" | "outlined" | "dashed";
  className?: string;
  sx?: SxProps<Theme>;
}

export interface FabOverlayProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  className?: string;
}

export interface DashedSkeletonCardProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  isInteractive?: boolean;
  className?: string;
}
