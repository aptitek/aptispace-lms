import { styled } from "@mui/material/styles";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";

export const CardFrontContainer = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  height: "100%",
  width: "100%",
  padding: theme.spacing(0.75, 1.25),
  boxSizing: "border-box",
  position: "relative",
  zIndex: 10,
  userSelect: "none",
  gap: theme.spacing(1),
}));

export const SchoolHeaderRow = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  width: "100%",
  paddingBottom: theme.spacing(0.5),
  borderBottom: `1px solid ${theme.palette.divider}`,
  gap: theme.spacing(1),
  flexShrink: 0,
}));

export const SchoolBrandingHolder = styled("div")(({ theme }) => ({
  display: "inline-flex",
  alignItems: "center",
  gap: theme.spacing(1),
  maxWidth: "55%",
  height: "36px",
  overflow: "hidden",
}));

export const SchoolLogoImg = styled("img")({
  maxHeight: "32px",
  maxWidth: "100%",
  width: "auto",
  height: "auto",
  objectFit: "contain",
  userSelect: "none",
  pointerEvents: "none",
});

export const SchoolFallbackText = styled("span")(({ theme }) => ({
  fontSize: "0.95rem",
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
  gridTemplateColumns: "140px 1fr",
  gap: theme.spacing(1.5),
  alignItems: "flex-start",
  width: "100%",
  paddingTop: 0,
  paddingBottom: 0,
}));

export const AvatarCol = styled("div")({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "flex-start",
  position: "relative",
  flexShrink: 0,
  width: "140px",
  height: "180px",
  overflow: "hidden",
  "& .MuiBox-root, & [data-testid='card-editable-avatar'], & [data-testid='card-editable-avatar'] > div":
    {
      width: "100%",
      height: "100% !important",
      maxHeight: "100%",
    },
  "& .MuiAvatar-root, & [data-testid='avatar']": {
    width: "100% !important",
    height: "100% !important",
  },
});

export const FieldsList = styled(List)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(0.6),
  width: "100%",
  minWidth: 0,
  padding: 0,
  margin: 0,
  justifyContent: "flex-start",
}));

export const FieldListItem = styled(ListItem)({
  padding: 0,
  margin: 0,
  width: "100%",
});

export const FieldsCol = FieldsList;

export const CardBackContainer = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  height: "100%",
  width: "100%",
  padding: theme.spacing(0.75, 1.25),
  boxSizing: "border-box",
  position: "relative",
  zIndex: 10,
}));

export const BackMainArea = styled("div")(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "140px 1fr",
  gap: theme.spacing(1.5),
  alignItems: "center",
  paddingTop: theme.spacing(0.5),
  paddingBottom: theme.spacing(0.5),
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
  height: "60px",
  width: "100%",
  position: "relative",
});

export const BackAptispaceLogo = styled("img")({
  maxHeight: "64px",
  maxWidth: "80%",
  width: "auto",
  height: "auto",
  objectFit: "contain",
  userSelect: "none",
  pointerEvents: "none",
});

export const FullWidthMrzHolder = styled("div")({
  width: "100%",
  padding: 0,
  boxSizing: "border-box",
  "& pre": {
    margin: 0,
    width: "100%",
  },
});
