import { styled, type SxProps, type Theme } from "@mui/material/styles";
import HoloDecorator from "../HoloDecorator/HoloDecorator";

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

export default function Logo({ size = "medium", holo = false, sx }: LogoProps) {
  return (
    <LogoRoot logoSize={size} sx={sx}>
      <HoloDecorator active={holo} type="image" maskUrl="/favicon.svg">
        <LogoImage src="/favicon.svg" alt="AptiSpace Icon" logoSize={size} />
      </HoloDecorator>
      <TextContainer logoSize={size}>
        <HoloDecorator active={holo}>
          <AptiSpan>Apti</AptiSpan>
        </HoloDecorator>
        <HoloDecorator active={holo}>
          <SpaceSpan>Space</SpaceSpan>
        </HoloDecorator>
      </TextContainer>
    </LogoRoot>
  );
}
