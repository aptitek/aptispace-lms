import { useState } from "react";
import Box from "@mui/material/Box";
import FullScreenModal from "~/components/molecules/FullScreenModal/FullScreenModal";
import ProfileCard from "~/components/organisms/ProfileCard/ProfileCard";
import type { AuthUser } from "~/utils/auth";
import type { Td1MrzData } from "~/utils/icao9303";
import type { CohortConfig } from "~/types/institution";

function parseUserNames(name?: string) {
  if (!name) return { firstName: "USER", familyName: "" };
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return { firstName: parts[0], familyName: "" };
  }
  return {
    firstName: parts.slice(0, -1).join(" "),
    familyName: parts[parts.length - 1],
  };
}

function resolveModalEmail(email?: string, domain?: string) {
  const hasFixedDomain = Boolean(domain && domain.trim().length > 0);
  if (!hasFixedDomain) {
    return { emailPrefix: email, emailDomain: undefined };
  }
  const emailPrefix = email?.includes("@") ? email.split("@")[0] : email;
  const emailDomain = domain?.startsWith("@") ? domain : `@${domain}`;
  return { emailPrefix, emailDomain };
}

function resolveModalDocNumber(id?: string): string {
  if (!id) return "0942";
  return (
    id
      .replace(/[^A-Za-z0-9]/g, "")
      .slice(0, 9)
      .toUpperCase() || "0942"
  );
}

function resolveModalMrzData(
  user: AuthUser,
  firstName: string,
  familyName: string,
): Td1MrzData {
  return {
    documentNumber: resolveModalDocNumber(user.id),
    surname: (familyName || firstName || "USER").toUpperCase(),
    givenNames: (firstName || "USER").toUpperCase(),
    birthDate: "000101",
    expiryDate: "300828",
    sex: "M",
    issuingState: "APT",
    nationality: "APT",
  };
}

const DEFAULT_MODAL_COHORT: CohortConfig = {
  diploma: "M",
  year: 1,
  tags: ["IA", "Dev"],
};

function resolveModalCohort(cohort?: CohortConfig): CohortConfig {
  if (!cohort) return DEFAULT_MODAL_COHORT;
  return {
    id: cohort.id,
    name: cohort.name ?? undefined,
    diploma: cohort.diploma ?? undefined,
    year: cohort.year ?? undefined,
    tags: cohort.tags ?? undefined,
  };
}

export interface SidebarProfileModalProps {
  user: AuthUser;
  isOpen: boolean;
  onClose: () => void;
  onUserUpdated?: (updatedUser: AuthUser) => void;
}

export function SidebarProfileModal({
  user,
  isOpen,
  onClose,
  onUserUpdated,
}: SidebarProfileModalProps) {
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl);

  const handleAvatarChange = (newUrl: string) => {
    setAvatarUrl(newUrl);
    onUserUpdated?.({ ...user, avatarUrl: newUrl });
  };

  const parsed = parseUserNames(user.name);
  const firstName = user.firstName ?? parsed.firstName;
  const familyName = user.familyName ?? parsed.familyName;

  const { emailPrefix, emailDomain } = resolveModalEmail(
    user.email,
    user.emailDomain,
  );
  const mrzData = resolveModalMrzData(user, firstName, familyName);
  const cohort = resolveModalCohort(user.cohort);

  return (
    <FullScreenModal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth={620}
      testId="sidebar-profile-card-modal"
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 600,
          p: { xs: 1, sm: 2 },
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ProfileCard
          schoolLogoUrl={user.schoolLogoUrl || "/aptitek-logo.svg"}
          institutionName={user.institutionName || "Aptitek"}
          cohort={user.role === "admin" ? undefined : cohort}
          year={user.role === "admin" ? undefined : user.cohortYear || "2026"}
          avatarUrl={avatarUrl}
          role={user.role}
          githubUsername={user.githubUsername}
          firstName={firstName}
          familyName={familyName}
          emailPrefix={emailPrefix}
          emailDomain={emailDomain}
          usernamePattern={user.usernamePattern || "{first}.{last}"}
          mrzData={mrzData}
          editableAvatar={true}
          onAvatarChange={handleAvatarChange}
          sx={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            width: "100%",
            maxWidth: 600,
          }}
        />
      </Box>
    </FullScreenModal>
  );
}

export default SidebarProfileModal;
