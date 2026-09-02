import { styled, type SxProps, type Theme } from "@mui/material/styles";
import { holoGradient } from "../../../tokens/holo";

export interface LogoProps {
  size?: "small" | "medium" | "large";
  holo?: boolean;
  sx?: SxProps<Theme>;
}

const LogoRoot = styled("div", {
  shouldForwardProp: (prop) => prop !== "logoSize",
})<{ logoSize: "small" | "medium" | "large" }>(({ theme, logoSize }) => ({
  display: "inline-flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  gap:
    logoSize === "small"
      ? theme.spacing(1)
      : logoSize === "large"
        ? theme.spacing(2)
        : theme.spacing(1.5),
  userSelect: "none",
}));

const LogoImage = styled("img", {
  shouldForwardProp: (prop) => prop !== "logoSize",
})<{ logoSize: "small" | "medium" | "large" }>(({ logoSize }) => {
  const dim = logoSize === "small" ? 36 : logoSize === "large" ? 64 : 48;
  return {
    width: dim,
    height: dim,
    objectFit: "contain",
    display: "block",
    flexShrink: 0,
  };
});

const LogoImageHoloWrapper = styled("span")({
  position: "relative",
  display: "inline-flex",
  "&::after": {
    content: '""',
    position: "absolute",
    inset: 0,
    backgroundImage: holoGradient,
    backgroundSize: "200% 200%",
    backgroundPosition: "center",
    maskImage: 'url("/favicon.svg")',
    WebkitMaskImage: 'url("/favicon.svg")',
    maskSize: "contain",
    WebkitMaskSize: "contain",
    maskPosition: "center",
    WebkitMaskPosition: "center",
    maskRepeat: "no-repeat",
    WebkitMaskRepeat: "no-repeat",
    mixBlendMode: "screen",
    pointerEvents: "none",
  },
});

const TextContainer = styled("div", {
  shouldForwardProp: (prop) => prop !== "logoSize",
})<{
  logoSize: "small" | "medium" | "large";
}>(({ logoSize }) => {
  const fontSize =
    logoSize === "small"
      ? "1.75rem"
      : logoSize === "large"
        ? "3rem"
        : "2.35rem";

  return {
    display: "inline-flex",
    alignItems: "baseline",
    fontSize,
    lineHeight: 1,
  };
});

const AptiSpan = styled("span")(({ theme }) => ({
  fontFamily: '"Milkshake", cursive, sans-serif',
  fontWeight: "normal",
  fontStyle: "normal",
  color: theme.palette.success.main,
  letterSpacing: "0.02em",
  marginRight: "0.1em",
  display: "inline-block",
}));

const SpaceSpan = styled("span")(({ theme }) => ({
  fontFamily: '"Recursive", sans-serif',
  fontVariationSettings: '"CASL" 0, "CRSV" 0, "MONO" 0, "slnt" 0',
  fontWeight: 800,
  color: theme.palette.secondary.main,
  letterSpacing: "-0.03em",
  display: "inline-block",
}));

const textHoloStyles = {
  background: `${holoGradient}, linear-gradient(currentColor, currentColor)`,
  backgroundSize: "200% 200%, 100% 100%",
  backgroundPosition: "center, center",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundBlendMode: "screen",
};

export default function Logo({ size = "medium", holo = false, sx }: LogoProps) {
  return (
    <LogoRoot logoSize={size} sx={sx}>
      {holo ? (
        <LogoImageHoloWrapper>
          <LogoImage src="/favicon.svg" alt="AptiSpace Icon" logoSize={size} />
        </LogoImageHoloWrapper>
      ) : (
        <LogoImage src="/favicon.svg" alt="AptiSpace Icon" logoSize={size} />
      )}
      <TextContainer logoSize={size}>
        <AptiSpan sx={holo ? textHoloStyles : undefined}>Apti</AptiSpan>
        <SpaceSpan sx={holo ? textHoloStyles : undefined}>Space</SpaceSpan>
      </TextContainer>
    </LogoRoot>
  );
}
