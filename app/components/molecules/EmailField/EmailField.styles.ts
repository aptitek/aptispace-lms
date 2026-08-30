import { styled } from "@mui/material/styles";
import { motion } from "framer-motion";
import type { EmailFieldSize } from "./EmailField.types";

export interface Metrics {
  iconSize: number;
  clearBtnSize: number;
  lockIconSize: number;
  suffixSize: string;
}

export const MotionDomainSpan = styled(motion.span)({
  display: "inline-block",
  whiteSpace: "nowrap",
  overflow: "hidden",
});

export function getFieldMetrics(
  sizePreset: EmailFieldSize = "medium",
): Metrics {
  if (sizePreset === "small") {
    return {
      iconSize: 18,
      clearBtnSize: 16,
      lockIconSize: 16,
      suffixSize: "0.8125rem",
    };
  }
  return {
    iconSize: 20,
    clearBtnSize: 18,
    lockIconSize: 18,
    suffixSize: "0.875rem",
  };
}
