import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import PublicRoundedIcon from "@mui/icons-material/PublicRounded";
import DevicesRoundedIcon from "@mui/icons-material/DevicesRounded";
import PersonOffRoundedIcon from "@mui/icons-material/PersonOffRounded";
import { useTranslation } from "react-i18next";
import type { EntityCardData } from "~/components/molecules/EntityCard/EntityCard.types";
import type { SchoolConfig, CohortConfig } from "~/types/institution";
import EntityCard from "~/components/molecules/EntityCard/EntityCard";
import { NetworkMetaCard } from "./MissionCenter.styles";

export interface MissionCenterUserProfileCardProps {
  user?: EntityCardData | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  title?: string;
  isSecurityInfraction?: boolean;
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

const anonymousEntity: EntityCardData = {
  id: "anonymous",
  firstName: "Anonymous",
  familyName: "Visitor",
  displayName: "Anonymous Visitor",
  email: "unauthenticated@guest.aptispace.io",
  role: "student",
  institutionName: "AptiSpace Platform",
  cohortName: "Public Web",
};

function resolveSchoolConfig(user?: EntityCardData | null): SchoolConfig {
  return {
    id: user?.institutionId || "aptispace",
    name: user?.institutionName || "AptiSpace Platform",
    logoUrl: "/aptitek-logo.svg",
  };
}

function resolveCohortConfig(
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

function canImpersonateUser(user?: EntityCardData | null): boolean {
  if (!user || !user.id) return false;
  return user.id !== "anonymous";
}

export function MissionCenterUserProfileCard({
  user,
  ipAddress,
  userAgent,
  title,
  isSecurityInfraction = false,
}: MissionCenterUserProfileCardProps) {
  const titleColor = isSecurityInfraction ? "error.main" : "text.primary";
  const entity = user || anonymousEntity;
  const school = resolveSchoolConfig(user);
  const cohort = resolveCohortConfig(user);
  const showImpersonate = canImpersonateUser(user);
  const hasNetworkData = Boolean(ipAddress || userAgent);

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

      {/* User Grid Card (EntityCard) Render */}
      <Box sx={{ width: "100%" }}>
        <EntityCard
          entity={entity}
          school={school}
          cohort={cohort}
          interactive={false}
          showDelete={false}
          showImpersonate={showImpersonate}
          variant="outlined"
          testId="mission-center-entity-card"
        />
      </Box>

      {hasNetworkData && (
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

export const MissionCenterUserGridCard = MissionCenterUserProfileCard;
