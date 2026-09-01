import { styled } from "@mui/material/styles";
import { motion } from "framer-motion";
import Card from "@mui/material/Card";

export const ModalBackdrop = styled(motion.div)(({ theme }) => ({
  position: "fixed",
  inset: 0,
  zIndex: 1200,
  backgroundColor: "rgba(0, 0, 0, 0.6)",
  backdropFilter: "blur(4px)",
  WebkitBackdropFilter: "blur(4px)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(2),
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(3),
  },
  boxSizing: "border-box",
}));

export const ModalCardSurface = styled(Card)(({ theme }) => ({
  width: "100%",
  maxHeight: "88vh",
  display: "flex",
  flexDirection: "column",
  borderRadius: theme.spacing(1.5),
  border: `1px solid ${theme.palette.divider}`,
  overflow: "hidden",
  backgroundColor: theme.palette.background.paper,
}));
