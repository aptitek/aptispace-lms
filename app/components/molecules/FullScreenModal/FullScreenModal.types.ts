import type { ReactNode } from "react";
import type { SxProps, Theme } from "@mui/material/styles";

export interface FullScreenModalProps {
  /**
   * Whether the modal is open
   */
  isOpen: boolean;
  /**
   * Callback fired when closing the modal (clicking backdrop or pressing Escape)
   */
  onClose: () => void;
  /**
   * Main content inside the modal
   */
  children: ReactNode;
  /**
   * Optional max width for the inner content container (e.g. 720, "auto", "100%")
   */
  maxWidth?: number | string;
  /**
   * If true, wraps children in a styled surface card with elevation and borders (like StatusCenter)
   * @default false
   */
  asCard?: boolean;
  /**
   * Custom sx styling overrides for the content wrapper
   */
  sx?: SxProps<Theme>;
  /**
   * Custom className
   */
  className?: string;
  /**
   * Test identifier
   */
  testId?: string;
}
