import { styled, alpha } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import { SOLARIZED_BASE } from "~/tokens/theme";

export const GridContainer = styled("section")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  gap: theme.spacing(3),
  boxSizing: "border-box",
}));

export const ControlsHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  flexWrap: "wrap",
  gap: theme.spacing(2),
  width: "100%",
  padding: theme.spacing(1, 0),
}));

export const ControlsLeft = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1.5),
}));

export const CollectionTitle = styled("div")(({ theme }) => ({
  fontSize: "1.125rem",
  fontWeight: 700,
  color: theme.palette.text.primary,
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
}));

export const ControlsRight = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1.5),
  minWidth: "260px",
  flex: "0 1 360px",

  [theme.breakpoints.down("sm")]: {
    flex: "1 1 100%",
    minWidth: "100%",
  },
}));

export const GridSearchField = styled(TextField)(({ theme }) => {
  const isDark = theme.palette.mode === "dark";
  return {
    width: "100%",
    "& .MuiOutlinedInput-root": {
      backgroundColor: isDark
        ? alpha(SOLARIZED_BASE.base02, 0.6)
        : alpha(theme.palette.background.paper, 0.8),
      borderRadius: "12px",
      fontSize: "0.875rem",
      "& fieldset": {
        borderColor: theme.palette.divider,
      },
      "&:hover fieldset": {
        borderColor: isDark ? SOLARIZED_BASE.cyan : SOLARIZED_BASE.blue,
      },
      "&.Mui-focused fieldset": {
        borderColor: isDark ? SOLARIZED_BASE.cyan : SOLARIZED_BASE.blue,
      },
    },
  };
});

export const ZoneWrapper = styled("div")(({ theme }) => ({
  width: "100%",
  position: "relative",

  "& .grid": {
    display: "grid",
    width: "100%",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr)) !important",
    gap: `${theme.spacing(2.5)} !important`,
    justifyItems: "stretch",
    alignItems: "stretch",
  },
}));

export const EmptyGridContainer = styled("div")(({ theme }) => {
  const isDark = theme.palette.mode === "dark";
  return {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing(8, 3),
    borderRadius: "16px",
    border: `1px dashed ${theme.palette.divider}`,
    backgroundColor: isDark
      ? alpha(SOLARIZED_BASE.base02, 0.3)
      : alpha(theme.palette.background.paper, 0.4),
    gap: theme.spacing(1.5),
    textAlign: "center",
    color: theme.palette.text.secondary,
  };
});
