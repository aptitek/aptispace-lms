import { styled } from "@mui/material/styles";
import {
  GridContainer,
  ControlsHeader,
  ControlsLeft,
  ControlsRight,
  MD3CollectionGrid,
  LoadingSentinel,
} from "./UserGrid.styles";

export { GridContainer, MD3CollectionGrid, LoadingSentinel };

export const SkeletonControlsHeader = styled(ControlsHeader)({
  pointerEvents: "none",
});

export const SkeletonHeaderLeft = styled(ControlsLeft)(({ theme }) => ({
  alignItems: "center",
  gap: theme.spacing(1.5),
}));

export const SkeletonHeaderRight = styled(ControlsRight)({
  alignItems: "center",
});

export const SkeletonTitleBox = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
}));

export const SkeletonSearchField = styled("div")(({ theme }) => ({
  width: "100%",
  maxWidth: "280px",
  height: "40px",
  borderRadius: "28px",
  backgroundColor:
    theme.palette.surfaceContainerHigh || theme.palette.surfaceContainer,
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 2),
  gap: theme.spacing(1.25),
}));

export const SkeletonLazyZone = styled("div")(({ theme }) => ({
  width: "100%",
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
  marginTop: theme.spacing(2),
}));
