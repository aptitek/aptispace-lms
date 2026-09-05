import { styled } from "@mui/material/styles";
import {
  StyledExpressiveCard,
  DashedSkeletonCard,
  GhostFabOverlay,
} from "../../atoms/ExpressiveCard";

export { GhostFabOverlay };

export const CardContainer = styled(StyledExpressiveCard)(({ theme }) => ({
  padding: theme.spacing(3),
  alignItems: "center",
  justifyContent: "center",
  gap: theme.spacing(2),
}));

export const LogoContainer = styled("div")({
  height: "60px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
});

export const LogoImage = styled("img")({
  maxHeight: "100%",
  maxWidth: "100%",
  objectFit: "contain",
});

export const SchoolName = styled("div")(({ theme }) => ({
  fontSize: "1.1rem",
  fontWeight: 700,
  color: theme.palette.text.primary,
  textAlign: "center",
  width: "100%",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
}));

export const SkeletonContainer = styled(DashedSkeletonCard)(({ theme }) => ({
  padding: theme.spacing(3),
}));
