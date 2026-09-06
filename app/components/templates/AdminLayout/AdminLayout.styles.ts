import { styled } from "@mui/material/styles";

export const PageRoot = styled("div")({
  flex: 1,
  width: "100%",
  display: "flex",
  flexDirection: "column",
  position: "relative",
});

export const AdminMainWorkspace = styled("div")(({ theme }) => ({
  flex: 1,
  display: "flex",
  flexDirection: "column",
  padding: theme.spacing(3, 4),
  gap: theme.spacing(3),
  maxWidth: "1600px",
  width: "100%",
  margin: "0 auto",
  boxSizing: "border-box",
}));
