import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { styled, alpha } from "@mui/material/styles";
import { M3_SHAPE_CORNER_STRINGS } from "~/tokens/shapes";

export const FilterContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexWrap: "wrap",
  gap: theme.spacing(2),
  alignItems: "center",
  width: "100%",
  padding: theme.spacing(2),
  marginBottom: theme.spacing(3),
  borderRadius: M3_SHAPE_CORNER_STRINGS?.large || "12px",
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: `0 1px 3px ${alpha(theme.palette.common.black, 0.04)}`,
  transition: theme.transitions.create(["box-shadow", "border-color"], {
    duration: theme.transitions.duration.shorter,
  }),
}));

export const FilterClearButton = styled(Button)(({ theme }) => ({
  textTransform: "none",
  borderRadius: "8px",
  color: theme.palette.text.secondary,
  borderColor: theme.palette.divider,
  height: 38,
  paddingLeft: theme.spacing(1.5),
  paddingRight: theme.spacing(1.5),
  "&:hover": {
    borderColor: theme.palette.text.secondary,
    backgroundColor: alpha(theme.palette.text.primary, 0.04),
  },
}));
