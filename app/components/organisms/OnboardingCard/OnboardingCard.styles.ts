import { styled } from "@mui/material/styles";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";

export const CardFrontContainer = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  height: "100%",
  width: "100%",
  padding: theme.spacing(1.25, 1.75),
  boxSizing: "border-box",
  position: "relative",
  zIndex: 10,
  userSelect: "none",
}));

export const SchoolHeaderRow = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  width: "100%",
  paddingBottom: theme.spacing(0.75),
  borderBottom: `1px solid ${theme.palette.divider}`,
  gap: theme.spacing(1),
}));

export const SchoolBrandingHolder = styled("div")(({ theme }) => ({
  display: "inline-flex",
  alignItems: "center",
  gap: theme.spacing(1),
  maxWidth: "55%",
  height: "40px",
  overflow: "hidden",
}));

export const SchoolFallbackText = styled("span")(({ theme }) => ({
  fontSize: "1rem",
  fontWeight: 800,
  letterSpacing: "0.04em",
  textTransform: "uppercase",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  color: theme.palette.text.primary,
}));

export const CohortValidityContainer = styled("div")(({ theme }) => ({
  display: "inline-flex",
  alignItems: "center",
  gap: theme.spacing(0.75),
  flexShrink: 0,
}));

export const CardMainBody = styled("div")(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "130px 1fr",
  gap: theme.spacing(1.5),
  alignItems: "center",
  flex: 1,
  paddingTop: theme.spacing(0.75),
  paddingBottom: theme.spacing(0.5),
}));

export const AvatarCol = styled("div")({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  position: "relative",
  flexShrink: 0,
  width: "128px",
  height: "156px",
  overflow: "hidden",
  "& .MuiAvatar-root, & .biometric-avatar-container": {
    width: "100%",
    height: "100%",
  },
});

export const FieldsList = styled(List)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(0.75),
  width: "100%",
  minWidth: 0,
  padding: 0,
  margin: 0,
}));

export const FieldListItem = styled(ListItem)({
  padding: 0,
  margin: 0,
  width: "100%",
});

export const FieldsCol = FieldsList;

export const CardBackContainer = styled("div")({
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  height: "100%",
  width: "100%",
  padding: 0,
  boxSizing: "border-box",
  position: "relative",
  zIndex: 10,
});

export const BackMainArea = styled("div")(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "140px 1fr",
  gap: theme.spacing(1),
  alignItems: "center",
  padding: theme.spacing(1.5, 1.75, 0.5, 1.75),
  flex: 1,
}));

export const BackLeftContactCol = styled("div")({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  justifyContent: "center",
  position: "relative",
  minHeight: "80px",
});

export const BackRightContentCol = styled("div")({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  height: "70px",
  width: "100%",
  position: "relative",
});

export const BackAptispaceLogo = styled("img")({
  maxHeight: "46px",
  maxWidth: "85%",
  width: "auto",
  height: "auto",
  objectFit: "contain",
  userSelect: "none",
  pointerEvents: "none",
});

export const FullWidthMrzHolder = styled("div")(({ theme }) => ({
  width: "100%",
  padding: theme.spacing(0, 1.25, 1, 1.25),
  boxSizing: "border-box",
  "& pre": {
    margin: 0,
    width: "100%",
  },
}));
