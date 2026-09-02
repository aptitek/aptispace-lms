import TextField from "@mui/material/TextField";
import { styled, alpha } from "@mui/material/styles";

export const ProfileTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    backgroundColor: alpha(theme.palette.background.paper, 0.9),
    backdropFilter: "blur(8px)",
    borderRadius: "8px",
    color: theme.palette.text.primary,
    fontWeight: 500,
    "& fieldset": {
      borderColor: theme.palette.divider,
      borderWidth: "1.5px",
    },
    "&:hover fieldset": {
      borderColor: theme.palette.primary.main,
    },
    "&.Mui-focused fieldset": {
      borderColor: theme.palette.primary.main,
      borderWidth: "2px",
    },
    ...theme.applyStyles("dark", {
      backgroundColor: alpha(theme.palette.background.default, 0.85),
      color: theme.palette.text.primary,
      "& fieldset": {
        borderColor: alpha(theme.palette.text.secondary, 0.45),
      },
      "&:hover fieldset": {
        borderColor: theme.palette.primary.light,
      },
      "&.Mui-focused fieldset": {
        borderColor: theme.palette.primary.light,
      },
    }),
  },
  "& .MuiInputLabel-root": {
    color: theme.palette.text.secondary,
    fontWeight: 600,
    "&.Mui-focused": {
      color: theme.palette.primary.main,
    },
    ...theme.applyStyles("dark", {
      color: theme.palette.text.secondary,
      "&.Mui-focused": {
        color: theme.palette.primary.light,
      },
    }),
  },
}));
