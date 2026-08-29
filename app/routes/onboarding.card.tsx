import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import BiometricAvatar from "~/components/atoms/BiometricAvatar/BiometricAvatar";
import type { Id1CardOrientation } from "~/components/molecules/Id1Card/Id1Card.types";

export interface CadetProfile {
  id: string;
  name: string;
  email?: string;
  callSign: string;
  division: string;
  clearanceLevel: string;
  securityCode: string;
  avatarUrl: string;
}

interface CardFrontProps {
  profile: CadetProfile;
  orientation: Id1CardOrientation;
}

export function CardFrontContent({ profile, orientation }: CardFrontProps) {
  const isLandscape = orientation === "landscape";
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        justifyContent: "space-between",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 1.5,
        }}
      >
        <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
          <BiometricAvatar
            src={profile.avatarUrl}
            alt={profile.name}
            showReticle={true}
            height={isLandscape ? "75px" : "90px"}
          />
          <Box>
            <Typography
              variant="overline"
              sx={{
                fontWeight: 800,
                color: "primary.light",
                letterSpacing: 1.5,
              }}
            >
              APTISPACE ACADEMY
            </Typography>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                color: "text.primary",
                fontSize: "1.1rem",
              }}
            >
              {profile.name || "CADET"}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {profile.callSign
                ? `CALLSIGN: ${profile.callSign}`
                : "ACTIVE CADET"}
            </Typography>
          </Box>
        </Box>
        <Typography
          variant="caption"
          sx={{
            px: 1,
            py: 0.5,
            borderRadius: 1,
            bgcolor: "action.selected",
            color: "primary.light",
            fontWeight: 800,
            border: 1,
            borderColor: "divider",
          }}
        >
          {profile.clearanceLevel}
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
        }}
      >
        <Typography variant="caption" color="text.secondary">
          {profile.division}
        </Typography>
        <Typography
          variant="caption"
          sx={{ fontWeight: 700, letterSpacing: 1 }}
        >
          {profile.id}
        </Typography>
      </Box>
    </Box>
  );
}

export function CardBackContent({ profile }: { profile: CadetProfile }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
        gap: 1,
        textAlign: "center",
      }}
    >
      <Typography
        variant="caption"
        sx={{ fontWeight: 800, letterSpacing: 2, color: "primary.light" }}
      >
        ISO/IEC 7810 ID-1 STANDARD
      </Typography>
      {profile.email ? (
        <Typography
          variant="caption"
          sx={{
            fontFamily: "monospace",
            color: "text.primary",
            px: 1,
            py: 0.25,
            borderRadius: 1,
            bgcolor: "action.hover",
            border: 1,
            borderColor: "divider",
          }}
        >
          {profile.email}
        </Typography>
      ) : null}
      <Typography variant="caption" color="text.secondary">
        SEC: {profile.securityCode} • CLEARANCE {profile.clearanceLevel}
      </Typography>
      <Typography
        variant="overline"
        sx={{ letterSpacing: 1, color: "text.disabled" }}
      >
        APTISPACE INTERSTELLAR LOGISTICS
      </Typography>
    </Box>
  );
}
