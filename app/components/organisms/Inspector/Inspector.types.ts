import type { ReactNode, CSSProperties } from "react";

export interface InspectorProps {
  children: ReactNode;
  title?: ReactNode;
  onClose?: () => void;
  closeAriaLabel?: string;
  headerExtra?: ReactNode;
  maxHeight?: string | number;
  className?: string;
  style?: CSSProperties;
  "data-testid"?: string;
}

export interface InspectorHeaderProps {
  title: ReactNode;
  onClose?: () => void;
  closeAriaLabel?: string;
  extra?: ReactNode;
  "data-testid"?: string;
}

export interface InspectorBodyProps {
  children: ReactNode;
  gap?: number;
  className?: string;
  style?: CSSProperties;
  "data-testid"?: string;
}

export interface InspectorActionsProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  "data-testid"?: string;
}
