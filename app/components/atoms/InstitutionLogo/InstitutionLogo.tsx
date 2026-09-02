import { useState, useEffect, type ReactElement } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import HoloDecorator from "../HoloDecorator/HoloDecorator";
import type { InstitutionLogoProps } from "./InstitutionLogo.types";

interface ContentWrapperProps {
  holo: boolean;
  maskUrl?: string;
  children: ReactElement;
}

function HoloWrapper({ holo, maskUrl, children }: ContentWrapperProps) {
  if (!holo) return children;
  if (maskUrl) {
    return (
      <HoloDecorator type="image" maskUrl={maskUrl}>
        {children}
      </HoloDecorator>
    );
  }
  return <HoloDecorator>{children}</HoloDecorator>;
}

/**
 * InstitutionLogo Atom Component
 *
 * Displays an institution's logo image with automatic, graceful fallback
 * to the institution's name when the logo is missing or fails to load.
 */
export function InstitutionLogo({
  logoUrl,
  name,
  height = 40,
  maxWidth = 160,
  holo = false,
  fallback,
  showText = false,
  testId = "institution-logo",
  sx,
}: InstitutionLogoProps) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [logoUrl]);

  const hasValidLogo = Boolean(logoUrl && !hasError);

  if (!hasValidLogo) {
    if (fallback) {
      return (
        <Box data-testid={testId} sx={sx}>
          <HoloWrapper holo={holo}>
            <Box component="span" sx={{ display: "inline-flex" }}>
              {fallback}
            </Box>
          </HoloWrapper>
        </Box>
      );
    }

    return (
      <Box data-testid={testId} sx={sx}>
        <HoloWrapper holo={holo}>
          <Typography
            variant="h6"
            sx={{ fontWeight: 700, letterSpacing: "-0.01em" }}
            data-testid={`${testId}-fallback-text`}
          >
            {name}
          </Typography>
        </HoloWrapper>
      </Box>
    );
  }

  const logoImage = (
    <Box
      component="img"
      src={logoUrl as string}
      alt={name}
      onError={() => setHasError(true)}
      data-testid={`${testId}-image`}
      sx={{
        height,
        maxWidth,
        objectFit: "contain",
        borderRadius: 1,
        display: "block",
      }}
    />
  );

  return (
    <Box
      data-testid={testId}
      sx={{ display: "inline-flex", alignItems: "center", gap: 1, ...sx }}
    >
      <HoloWrapper holo={holo} maskUrl={logoUrl as string}>
        {logoImage}
      </HoloWrapper>
      {showText && (
        <HoloWrapper holo={holo}>
          <Typography
            variant="body2"
            sx={{ fontWeight: 600 }}
            data-testid={`${testId}-label`}
          >
            {name}
          </Typography>
        </HoloWrapper>
      )}
    </Box>
  );
}

export default InstitutionLogo;
