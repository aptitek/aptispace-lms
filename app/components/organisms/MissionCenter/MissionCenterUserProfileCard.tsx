import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import PublicRoundedIcon from "@mui/icons-material/PublicRounded";
import DevicesRoundedIcon from "@mui/icons-material/DevicesRounded";
import PersonOffRoundedIcon from "@mui/icons-material/PersonOffRounded";
import { useTranslation } from "react-i18next";
import type { EntityCardData } from "~/components/molecules/EntityCard/EntityCard.types";
import type { CohortConfig } from "~/types/institution";
import ProfileCard from "~/components/organisms/ProfileCard/ProfileCard";
import { NetworkMetaCard } from "./MissionCenter.styles";

export interface MissionCenterUserProfileCardProps {
  user?: EntityCardData | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  title?: string;
  isSecurityInfraction?: boolean;
}

function resolveUserDocNumber(id?: string): string {
  if (!id) return "0942";
  const cleaned = id
    .replace(/[^A-Za-z0-9]/g, "")
    .slice(0, 9)
    .toUpperCase();
  return cleaned || "0942";
}

function buildEmailParts(email?: string) {
  const safeEmail = email || "";
  if (safeEmail.includes("@")) {
    const [prefix, domain] = safeEmail.split("@");
    return {
      prefix: prefix || "unauthenticated",
      domain: domain || "guest.aptispace.io",
    };
  }
  return {
    prefix: safeEmail || "unauthenticated",
    domain: "guest.aptispace.io",
  };
}

function buildMrzData(user?: EntityCardData | null) {
  const firstName = user?.firstName || (user ? "USER" : "ANONYMOUS");
  const familyName = user?.familyName || (user ? "" : "VISITOR");
  return {
    documentNumber: resolveUserDocNumber(user?.id),
    surname: (familyName || firstName).toUpperCase(),
    givenNames: (firstName || "USER").toUpperCase(),
    birthDate: "000101",
    expiryDate: "300828",
    sex: "M" as const,
    issuingState: "APT",
    nationality: "APT",
  };
}

function buildCohortConfig(
  user?: EntityCardData | null,
): CohortConfig | undefined {
  const primaryCohort = user?.cohorts?.[0];
  if (!primaryCohort) return undefined;
  return {
    id: primaryCohort.id,
    name: primaryCohort.name,
    diploma: primaryCohort.diploma ?? undefined,
    year: primaryCohort.year ?? undefined,
    tags: primaryCohort.tags ?? undefined,
  };
}

interface NetworkInfoProps {
  ipAddress?: string | null;
  userAgent?: string | null;
  isSecurity: boolean;
  hasUser: boolean;
}

function NetworkOriginCard({
  ipAddress,
  userAgent,
  isSecurity,
  hasUser,
}: NetworkInfoProps) {
  const { t } = useTranslation(["common"]);

  return (
    <NetworkMetaCard data-testid="network-meta-card">
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 1,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
          <PublicRoundedIcon
            sx={{
              fontSize: 18,
              color: isSecurity ? "error.main" : "primary.main",
            }}
          />
          <Typography
            variant="caption"
            sx={{ fontWeight: 700, textTransform: "uppercase" }}
          >
            {t(
              "common:admin.missionCenter.network.ipAddress",
              "Network Origin (IP)",
            )}
          </Typography>
        </Box>
        {ipAddress ? (
          <Chip
            label={ipAddress}
            size="small"
            color={isSecurity ? "error" : "default"}
            variant="outlined"
            sx={{
              fontFamily: "monospace",
              fontWeight: 700,
              fontSize: "0.75rem",
            }}
            data-testid="user-ip-badge"
          />
        ) : (
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            Not captured
          </Typography>
        )}
      </Box>

      {userAgent && (
        <Box
          sx={{ display: "flex", alignItems: "flex-start", gap: 0.75, mt: 0.5 }}
        >
          <DevicesRoundedIcon
            sx={{ fontSize: 16, color: "text.secondary", mt: 0.25 }}
          />
          <Typography
            variant="caption"
            sx={{
              color: "text.secondary",
              fontFamily: "monospace",
              fontSize: "0.72rem",
              wordBreak: "break-all",
            }}
            data-testid="user-agent-string"
          >
            {userAgent}
          </Typography>
        </Box>
      )}

      {!hasUser && (
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.5 }}>
          <PersonOffRoundedIcon
            sx={{ fontSize: 14, color: "text.secondary" }}
          />
          <Typography
            variant="caption"
            sx={{ color: "text.secondary", fontStyle: "italic" }}
          >
            {t(
              "common:admin.missionCenter.unauthenticated",
              "Unauthenticated / Anonymous Request",
            )}
          </Typography>
        </Box>
      )}
    </NetworkMetaCard>
  );
}

function resolveProfileCardAttributes(user?: EntityCardData | null) {
  if (!user) {
    return {
      firstName: "ANONYMOUS",
      familyName: "VISITOR",
      cohortName: "Public Web",
      institutionName: "AptiSpace Platform",
      role: "student" as const,
    };
  }
  return {
    firstName: user.firstName || "USER",
    familyName: user.familyName || "",
    cohortName: user.cohorts?.[0]?.name || user.cohortName || "Global",
    institutionName: user.institutionName || "AptiSpace Platform",
    role: user.role || "student",
  };
}

export function MissionCenterUserProfileCard({
  user,
  ipAddress,
  userAgent,
  title,
  isSecurityInfraction = false,
}: MissionCenterUserProfileCardProps) {
  const attrs = resolveProfileCardAttributes(user);
  const { prefix, domain } = buildEmailParts(user?.email);
  const mrzData = buildMrzData(user);
  const cohortConfig = buildCohortConfig(user);
  const titleColor = isSecurityInfraction ? "error.main" : "text.primary";

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", gap: 2 }}
      data-testid="mission-center-user-profile"
    >
      {title && (
        <Typography
          variant="subtitle2"
          sx={{ fontWeight: 700, color: titleColor }}
        >
          {title}
        </Typography>
      )}

      {/* Profile Card Render */}
      <Box sx={{ maxWidth: 360, mx: "auto", width: "100%" }}>
        <ProfileCard
          schoolLogoUrl="/aptitek-logo.svg"
          institutionName={attrs.institutionName}
          cohort={cohortConfig}
          cohortName={attrs.cohortName}
          avatarUrl={user?.avatarUrl}
          role={attrs.role}
          githubUsername={user?.githubUsername}
          firstName={attrs.firstName}
          familyName={attrs.familyName}
          emailPrefix={prefix}
          emailDomain={domain}
          mrzData={mrzData}
        />
      </Box>

      {(ipAddress || userAgent) && (
        <NetworkOriginCard
          ipAddress={ipAddress}
          userAgent={userAgent}
          isSecurity={isSecurityInfraction}
          hasUser={Boolean(user)}
        />
      )}
    </Box>
  );
}
