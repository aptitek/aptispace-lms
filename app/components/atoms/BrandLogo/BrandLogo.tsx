import { styled } from "@mui/material/styles";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";

export interface BrandLogoProps {
  showSubtitle?: boolean;
  size?: "small" | "medium" | "large";
}

const LogoRoot = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: theme.spacing(1),
  userSelect: "none",
}));

const IconBadge = styled("div")<{ logoSize?: "small" | "medium" | "large" }>(({
  theme,
  logoSize,
}) => {
  const dim = logoSize === "small" ? 40 : logoSize === "large" ? 64 : 52;
  const radius = Number(theme.shape.borderRadius) || 8;
  return {
    width: dim,
    height: dim,
    borderRadius: radius * 1.5,
    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: theme.palette.primary.contrastText,
    boxShadow: `0 8px 24px ${theme.palette.action.focus}`,
    "& .MuiSvgIcon-root": {
      fontSize: dim * 0.55,
    },
  };
});

const TitleText = styled("h1")<{ logoSize?: "small" | "medium" | "large" }>(
  ({ theme, logoSize }) => ({
    margin: 0,
    fontFamily: theme.typography.fontFamily,
    fontSize:
      logoSize === "small"
        ? theme.typography.h6.fontSize
        : logoSize === "large"
          ? theme.typography.h4.fontSize
          : theme.typography.h5.fontSize,
    fontWeight: 700,
    letterSpacing: "-0.02em",
    color: theme.palette.text.primary,
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(0.5),

    "& span": {
      color: theme.palette.secondary.main,
    },
  }),
);

const SubtitleText = styled("p")(({ theme }) => ({
  margin: 0,
  fontSize: theme.typography.caption.fontSize ?? "0.8rem",
  color: theme.palette.text.secondary,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  fontWeight: 600,
}));

export default function BrandLogo({
  showSubtitle = true,
  size = "medium",
}: BrandLogoProps) {
  return (
    <LogoRoot>
      <IconBadge logoSize={size}>
        <RocketLaunchIcon />
      </IconBadge>
      <TitleText logoSize={size}>
        AptiSpace <span>LMS</span>
      </TitleText>
      {showSubtitle && <SubtitleText>Orbital Learning Platform</SubtitleText>}
    </LogoRoot>
  );
}
