import { styled } from "@mui/material/styles";
import {
  StyledExpressiveCard,
  DashedSkeletonCard,
  GhostFabOverlay,
} from "../../atoms/ExpressiveCard";

export { GhostFabOverlay };

export const CardContainer = styled(StyledExpressiveCard)(({ theme }) => ({
  padding: theme.spacing(2.5),
  gap: theme.spacing(1),
}));

export const CohortName = styled("div")(({ theme }) => ({
  fontSize: "1.05rem",
  fontWeight: 700,
  color: theme.palette.text.primary,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
}));

export const CohortDescription = styled("div")(({ theme }) => ({
  fontSize: "0.85rem",
  color: theme.palette.text.secondary,
  display: "-webkit-box",
  WebkitLineClamp: 2,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
  textOverflow: "ellipsis",
  minHeight: "2.5em",
}));

export const CohortDates = styled("div")(({ theme }) => ({
  fontSize: "0.75rem",
  color: theme.palette.text.disabled,
  marginTop: theme.spacing(1),
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: "0.05em",
}));

export const SkeletonContainer = styled(DashedSkeletonCard)(({ theme }) => ({
  padding: theme.spacing(2.5),
}));
