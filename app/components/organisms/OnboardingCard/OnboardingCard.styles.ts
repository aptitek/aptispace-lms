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

export const SchoolBrandingHolder = styled("div")({
  display: "flex",
  alignItems: "center",
  gap: "8px",
  minHeight: "36px",
});

export const SchoolLogoImg = styled("img")({
  maxHeight: "36px",
  maxWidth: "140px",
  width: "auto",
  height: "auto",
  objectFit: "contain",
  userSelect: "none",
  pointerEvents: "none",
});

export const SchoolLogoHoloPlaceholder = styled("span")({
  display: "inline-block",
  height: "36px",
  minWidth: "100px",
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
  gridTemplateColumns: "135px 1fr",
  gap: theme.spacing(1.5),
  alignItems: "center",
  width: "100%",
  paddingTop: "24px",
  paddingBottom: 0,
}));

export const AvatarCol = styled("div")({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "flex-start",
  position: "relative",
  flexShrink: 0,
  width: "135px",
  height: "164px",
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
  userSelect: "none",
}));

export const BackMainArea = styled("div")(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "1fr 135px",
  gap: theme.spacing(1.5),
  alignItems: "center",
  paddingTop: theme.spacing(1),
  paddingBottom: theme.spacing(0.5),
  flex: 1,
}));

export const BackLeftBrandingCol = styled("div")({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
  position: "relative",
});

export const BackRightContactCol = styled("div")({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-end",
  justifyContent: "center",
  position: "relative",
  minHeight: "48px",
});

// Backward compatibility alias
export const BackLeftContactCol = BackLeftBrandingCol;
export const BackRightContentCol = BackRightContactCol;

export const BackAptispaceLogo = styled("img")({
  maxHeight: "48px",
  maxWidth: "85%",
  width: "auto",
  height: "auto",
  objectFit: "contain",
  userSelect: "none",
  pointerEvents: "none",
});

export const BackAptispaceLogoPlaceholder = styled("span")({
  display: "inline-block",
  height: "48px",
  minWidth: "120px",
  pointerEvents: "none",
});

export const FullWidthMrzHolder = styled("div")({
  width: "100%",
  padding: 0,
  boxSizing: "border-box",
  flexShrink: 0,
  "& pre": {
    margin: 0,
    width: "100%",
  },
});
