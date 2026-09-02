import { useState, useEffect, useMemo } from "react";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import InputAdornment from "@mui/material/InputAdornment";
import GitHubIcon from "@mui/icons-material/GitHub";
import { alpha, useTheme } from "@mui/material/styles";

import { useTranslation } from "react-i18next";
import PhysicCard from "../../molecules/PhysicCard/PhysicCard";
import HoloDecorator from "../../atoms/HoloDecorator/HoloDecorator";
import Avatar from "../../atoms/Avatar/Avatar";
import Chip from "../../atoms/Chip/Chip";
import RoleChip from "../../atoms/RoleChip/RoleChip";
import InstitutionLogo from "../../atoms/InstitutionLogo/InstitutionLogo";
import Guilloche, { generateGuillocheMaskDataUrl } from "../../atoms/Guilloche";
import Electronics from "../../atoms/Electronics/Electronics";
import { getRoleConfig } from "../../../tokens/roles";
import { ProfileTextField } from "./ProfileCard.styles";
import { ProfileHeaderChips, BackContent } from "./ProfileCard.components";
import type { ProfileCardProps } from "./ProfileCard.types";

interface FrontContentProps {
  schoolLogoUrl?: string;
  institutionName: string;
  cohortName: string;
  year: string;
  avatarUrl?: string;
  role: "student" | "instructor" | "admin";
  githubUsername?: string;
  emailDomain: string;
  onAvatarEdit?: () => void;
  internalFirstName: string;
  internalFamilyName: string;
  internalEmailPrefix: string;
  handleFirstNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleFamilyNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function FrontContent({
  schoolLogoUrl,
  institutionName,
  cohortName,
  year,
  avatarUrl,
  role,
  githubUsername,
  emailDomain,
  onAvatarEdit,
  internalFirstName,
  internalFamilyName,
  internalEmailPrefix,
  handleFirstNameChange,
  handleFamilyNameChange,
  handleEmailChange,
}: FrontContentProps) {
  const { t } = useTranslation(["auth", "common"]);
  const theme = useTheme();
  const roleConfig = getRoleConfig(role);
  const guillocheMask = useMemo(
    () =>
      generateGuillocheMaskDataUrl({
        seed: institutionName || "Institution",
      }),
    [institutionName],
  );

  return (
    <Box
      sx={{
        position: "relative",
        p: 4,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: alpha(theme.palette.background.paper, 0.15),
        ...theme.applyStyles("dark", {
          bgcolor: alpha(theme.palette.background.default, 0.1),
        }),
      }}
    >
      <Electronics
        side="front"
        chipView="back"
        finish="gold"
        showNfcAntenna
        showInnerCoil
        showChip
        opacity={0.65}
      />
      <HoloDecorator
        type="image"
        maskUrl={guillocheMask}
        maskSize="100% 100%"
        sx={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 0,
        }}
      >
        <Guilloche seed={institutionName || "Institution"} opacity={0.3} />
      </HoloDecorator>

      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
          height: 48,
        }}
      >
        <InstitutionLogo
          logoUrl={schoolLogoUrl}
          name={institutionName}
          holo
          height={40}
          testId="profile-institution-logo"
        />
        <ProfileHeaderChips role={role} cohortName={cohortName} year={year} />
      </Box>

      <Divider sx={{ mb: 4, position: "relative", zIndex: 1 }} />

      <Box
        sx={{
          display: "flex",
          gap: 4,
          flex: 1,
          position: "relative",
          zIndex: 1,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: 2,
            width: 120,
            flexShrink: 0,
          }}
        >
          <Box
            sx={{
              position: "relative",
              display: "inline-flex",
              alignSelf: "center",
            }}
          >
            <Avatar
              src={avatarUrl}
              name={internalFirstName}
              role={role}
              shape={roleConfig.avatarShape}
              width={96}
              height={96}
              isPortrait={false}
              placeholderIcon={internalFirstName?.[0] || "U"}
            />

            {onAvatarEdit && (
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  onAvatarEdit();
                }}
                data-no-flip="true"
                aria-label={t("common:profile.editAvatar", "Edit avatar")}
                sx={{
                  position: "absolute",
                  top: -6,
                  right: -6,
                  zIndex: 3,
                  bgcolor: "background.paper",
                  boxShadow: 1,
                  "&:hover": { bgcolor: "action.hover" },
                }}
              >
                <EditRoundedIcon fontSize="small" />
              </IconButton>
            )}
          </Box>

          <RoleChip
            userRole={role}
            size="small"
            sx={{ width: "100%", fontWeight: "bold" }}
          />

          {githubUsername && (
            <Chip
              icon={<GitHubIcon fontSize="small" />}
              label={githubUsername}
              size="small"
              variant="outlined"
              sx={{
                width: "max-content",
                minWidth: "100%",
                maxWidth: 220,
                alignSelf: "flex-start",
                justifyContent: "flex-start",
                mt: "auto",
                zIndex: 2,
                "& .MuiChip-label": {
                  px: 1,
                  whiteSpace: "nowrap",
                },
              }}
            />
          )}
        </Box>

        <Box
          sx={{ flex: 1 }}
          onClick={(e) => e.stopPropagation()}
          data-no-flip="true"
        >
          <List
            disablePadding
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <ListItem disablePadding>
              <ProfileTextField
                fullWidth
                label={t("common:profile.firstName", "First Name")}
                variant="outlined"
                size="small"
                value={internalFirstName}
                onChange={handleFirstNameChange}
              />
            </ListItem>
            <ListItem disablePadding>
              <ProfileTextField
                fullWidth
                label={t("common:profile.familyName", "Family Name")}
                variant="outlined"
                size="small"
                value={internalFamilyName}
                onChange={handleFamilyNameChange}
                slotProps={{
                  htmlInput: { style: { textTransform: "uppercase" } },
                }}
              />
            </ListItem>
            <ListItem disablePadding>
              <ProfileTextField
                fullWidth
                label={t("common:profile.email", "Email")}
                variant="outlined"
                size="small"
                value={internalEmailPrefix}
                onChange={handleEmailChange}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment
                        position="end"
                        sx={{
                          "& .MuiTypography-root": {
                            color: "text.secondary",
                            fontWeight: 600,
                          },
                        }}
                      >
                        {emailDomain}
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </ListItem>
          </List>
        </Box>
      </Box>
    </Box>
  );
}

export default function ProfileCard({
  schoolLogoUrl,
  institutionName = "Institution",
  cohortName = "Cohort",
  year = "2026",
  avatarUrl,
  role = "student",
  githubUsername,
  firstName = "",
  familyName = "",
  emailPrefix = "",
  emailDomain = "@aptispace.com",
  mrzData,
  onChange,
  onAvatarEdit,
  sx,
  ...props
}: ProfileCardProps) {
  const [internalFirstName, setInternalFirstName] = useState(firstName);
  const [internalFamilyName, setInternalFamilyName] = useState(familyName);
  const [internalEmailPrefix, setInternalEmailPrefix] = useState(emailPrefix);

  useEffect(() => {
    setInternalFirstName(firstName);
  }, [firstName]);

  useEffect(() => {
    setInternalFamilyName(familyName);
  }, [familyName]);

  useEffect(() => {
    setInternalEmailPrefix(emailPrefix);
  }, [emailPrefix]);

  const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInternalFirstName(e.target.value);
    onChange?.("firstName", e.target.value);
  };

  const handleFamilyNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uppercaseValue = e.target.value.toUpperCase();
    setInternalFamilyName(uppercaseValue);
    onChange?.("familyName", uppercaseValue);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInternalEmailPrefix(e.target.value);
    onChange?.("emailPrefix", e.target.value);
  };

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 600,
        aspectRatio: "85.6/53.98",
        position: "relative",
        boxSizing: "border-box",
        ...sx,
      }}
      {...props}
    >
      <PhysicCard
        isTransparent
        interactive
        ratio="85.6/53.98"
        frontContent={
          <FrontContent
            schoolLogoUrl={schoolLogoUrl}
            institutionName={institutionName}
            cohortName={cohortName}
            year={year}
            avatarUrl={avatarUrl}
            role={role}
            githubUsername={githubUsername}
            emailDomain={emailDomain}
            onAvatarEdit={onAvatarEdit}
            internalFirstName={internalFirstName}
            internalFamilyName={internalFamilyName}
            internalEmailPrefix={internalEmailPrefix}
            handleFirstNameChange={handleFirstNameChange}
            handleFamilyNameChange={handleFamilyNameChange}
            handleEmailChange={handleEmailChange}
          />
        }
        backContent={<BackContent mrzData={mrzData} />}
        sx={{ width: "100%", height: "100%", maxWidth: "100%" }}
      />
    </Box>
  );
}
