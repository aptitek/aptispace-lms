import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";

export const RootContainer = styled(Box)(({ theme }) => ({
  width: "100%",
  maxWidth: "1400px",
  margin: "0 auto",
  padding: theme.spacing(4, 3),
  boxSizing: "border-box",
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(3),
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(2, 1.5),
    gap: theme.spacing(2),
  },
}));
