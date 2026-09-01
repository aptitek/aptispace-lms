import { styled, alpha } from "@mui/material/styles";
import TextField from "@mui/material/TextField";

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
  return {
    width: "100%",
    "& .MuiOutlinedInput-root": {
      backgroundColor: alpha(theme.palette.background.paper, 0.8),
      borderRadius: "12px",
      fontSize: "0.875rem",
      "& fieldset": {
        borderColor: theme.palette.divider,
      },
      "&:hover fieldset": {
        borderColor: theme.palette.primary.main,
      },
      "&.Mui-focused fieldset": {
        borderColor: theme.palette.primary.main,
      },
      ...theme.applyStyles("dark", {
        backgroundColor: alpha(theme.palette.background.paper, 0.6),
        "&:hover fieldset": {
          borderColor: theme.palette.primary.light,
        },
        "&.Mui-focused fieldset": {
          borderColor: theme.palette.primary.light,
        },
      }),
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
  return {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing(6, 3),
    borderRadius: "16px",
    border: `1px dashed ${theme.palette.divider}`,
    backgroundColor: alpha(theme.palette.background.paper, 0.4),
    gap: theme.spacing(1.5),
    textAlign: "center",
    color: theme.palette.text.secondary,
    ...theme.applyStyles("dark", {
      backgroundColor: alpha(theme.palette.background.paper, 0.3),
    }),
  };
});

export const EmptyStateWrapper = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  gap: theme.spacing(3),
}));

export const EmptyPlaceholderGrid = styled("div")(({ theme }) => ({
  display: "grid",
  width: "100%",
  gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
  gap: theme.spacing(2.5),
  justifyItems: "stretch",
  alignItems: "stretch",
}));

export const LoadingSentinel = styled("div")({
  width: "100%",
  height: "24px",
  pointerEvents: "none",
});
