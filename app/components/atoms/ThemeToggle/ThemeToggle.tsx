import { styled } from "@mui/material/styles";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import { useTranslation } from "react-i18next";
import { useThemeMode } from "~/utils/themeContext";
import type { ThemeMode } from "~/tokens/theme";

export interface ThemeToggleProps {
  className?: string;
  size?: "small" | "medium";
}

const ToggleWrapper = styled("div")(({ theme }) => ({
  display: "inline-flex",
  alignItems: "center",
  gap: theme.spacing(0.75),
}));

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => {
  const radius = Number(theme.shape.borderRadius) || 8;
  return {
    backgroundColor: theme.palette.action.hover,
    borderRadius: radius * 1.25,
    padding: theme.spacing(0.25),
    border: `1px solid ${theme.palette.divider}`,
    height: 30,

    "& .MuiToggleButtonGroup-grouped": {
      border: 0,
      borderRadius: radius,
      color: theme.palette.text.secondary,
      padding: theme.spacing(0.25, 0.75),
      fontSize: "0.75rem",
      fontWeight: 700,
      minWidth: 32,
      lineHeight: 1,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      transition: theme.transitions.create(
        ["background-color", "color", "box-shadow", "transform"],
        {
          duration: theme.transitions.duration.shorter,
        },
      ),

      "& .MuiSvgIcon-root": {
        fontSize: "1rem",
      },

      "&:hover": {
        backgroundColor: theme.palette.action.selected,
        color: theme.palette.text.primary,
      },

      "&.Mui-selected": {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        boxShadow: `0 2px 8px ${theme.palette.action.focus}`,

        "&:hover": {
          backgroundColor: theme.palette.primary.dark,
        },
      },

      "&:not(:first-of-type)": {
        marginLeft: theme.spacing(0.25),
      },
    },
  };
});

export default function ThemeToggle({
  className,
  size = "small",
}: ThemeToggleProps) {
  const { t } = useTranslation("common");
  const { mode, setColorMode } = useThemeMode();

  const handleModeChange = (
    _event: React.MouseEvent<HTMLElement>,
    nextMode: ThemeMode | null,
  ) => {
    if (nextMode && nextMode !== mode) {
      setColorMode(nextMode);
    }
  };

  return (
    <ToggleWrapper
      className={className}
      role="region"
      aria-label={t("theme.toggleLabel")}
    >
      <StyledToggleButtonGroup
        value={mode}
        exclusive
        onChange={handleModeChange}
        aria-label={t("theme.toggleLabel")}
        size={size}
      >
        <ToggleButton
          value="dark"
          aria-label={t("theme.switchToDark")}
          title={t("theme.dark")}
        >
          <DarkModeOutlinedIcon />
        </ToggleButton>
        <ToggleButton
          value="light"
          aria-label={t("theme.switchToLight")}
          title={t("theme.light")}
        >
          <LightModeOutlinedIcon />
        </ToggleButton>
      </StyledToggleButtonGroup>
    </ToggleWrapper>
  );
}
