import { useState, useMemo } from "react";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Avatar from "@mui/material/Avatar";
import Badge from "@mui/material/Badge";
import IconButton from "@mui/material/IconButton";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import GitHubIcon from "@mui/icons-material/GitHub";
import Typography from "@mui/material/Typography";
import { styled, alpha, useTheme } from "@mui/material/styles";

import PhysicCard from "../../molecules/PhysicCard/PhysicCard";
import HoloDecorator from "../../atoms/HoloDecorator/HoloDecorator";
import Chip from "../../atoms/Chip/Chip";
import Logo from "../../atoms/Logo/Logo";
import MrzZone from "../../atoms/MrzZone/MrzZone";
import Guilloche, { generateGuillocheMaskDataUrl } from "../../atoms/Guilloche";
import Electronics from "../../atoms/Electronics/Electronics";
import type { ProfileCardProps } from "./ProfileCard.types";
import type { Td1MrzData } from "../../atoms/MrzZone/MrzZone.types";

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

const ProfileTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    backgroundColor: alpha(theme.palette.background.paper, 0.9),
    backdropFilter: "blur(8px)",
    borderRadius: "8px",
    color: theme.palette.text.primary,
    fontWeight: 500,
    "& fieldset": {
      borderColor: theme.palette.divider,
      borderWidth: "1.5px",
    },
    "&:hover fieldset": {
      borderColor: theme.palette.primary.main,
    },
    "&.Mui-focused fieldset": {
      borderColor: theme.palette.primary.main,
      borderWidth: "2px",
    },
    ...theme.applyStyles("dark", {
      backgroundColor: alpha(theme.palette.background.default, 0.85),
      color: theme.palette.text.primary,
      "& fieldset": {
        borderColor: alpha(theme.palette.text.secondary, 0.45),
      },
      "&:hover fieldset": {
        borderColor: theme.palette.primary.light,
      },
      "&.Mui-focused fieldset": {
        borderColor: theme.palette.primary.light,
      },
    }),
  },
  "& .MuiInputLabel-root": {
    color: theme.palette.text.secondary,
    fontWeight: 600,
    "&.Mui-focused": {
      color: theme.palette.primary.main,
    },
    ...theme.applyStyles("dark", {
      color: theme.palette.text.secondary,
      "&.Mui-focused": {
        color: theme.palette.primary.light,
      },
    }),
  },
}));

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
  const theme = useTheme();
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
        {schoolLogoUrl ? (
          <HoloDecorator type="image" maskUrl={schoolLogoUrl}>
            <Box
              component="img"
              src={schoolLogoUrl}
              alt={institutionName}
              sx={{ height: 40, objectFit: "contain", borderRadius: 1 }}
            />
          </HoloDecorator>
        ) : (
          <HoloDecorator>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              {institutionName}
            </Typography>
          </HoloDecorator>
        )}
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <Chip label={cohortName} size="small" variant="outlined" />
          <Chip label={year} size="small" color="secondary" />
        </Box>
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
            alignItems: "center",
            gap: 2,
            width: 120,
          }}
        >
          <Badge
            overlap="circular"
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            badgeContent={
              <IconButton
                size="small"
                onClick={onAvatarEdit}
                sx={{
                  bgcolor: "background.paper",
                  boxShadow: 1,
                  "&:hover": { bgcolor: "action.hover" },
                }}
              >
                <EditRoundedIcon fontSize="small" />
              </IconButton>
            }
          >
            <Avatar
              src={avatarUrl}
              sx={{ width: 96, height: 96, fontSize: "2.5rem" }}
            >
              {!avatarUrl && (internalFirstName?.[0] || "U")}
            </Avatar>
          </Badge>

          <Chip
            label={role.toUpperCase()}
            size="small"
            color={
              role === "admin"
                ? "error"
                : role === "instructor"
                  ? "secondary"
                  : "primary"
            }
            sx={{ width: "100%", fontWeight: "bold" }}
          />

          {githubUsername && (
            <Chip
              icon={<GitHubIcon fontSize="small" />}
              label={githubUsername}
              size="small"
              variant="outlined"
              sx={{ width: "100%", mt: "auto" }}
            />
          )}
        </Box>

        <Box sx={{ flex: 1 }}>
          <List
            disablePadding
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <ListItem disablePadding>
              <ProfileTextField
                fullWidth
                label="First Name"
                variant="outlined"
                size="small"
                value={internalFirstName}
                onChange={handleFirstNameChange}
              />
            </ListItem>
            <ListItem disablePadding>
              <ProfileTextField
                fullWidth
                label="Family Name"
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
                label="Email"
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

interface BackContentProps {
  mrzData?: Td1MrzData;
}

function BackContent({ mrzData }: BackContentProps) {
  const theme = useTheme();
  const guillocheMask = useMemo(
    () => generateGuillocheMaskDataUrl({ seed: "aptispace" }),
    [],
  );

  return (
    <Box
      sx={{
        position: "relative",
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
        side="back"
        chipView="front"
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
        <Guilloche seed="aptispace" opacity={0.3} />
      </HoloDecorator>

      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          p: 4,
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box sx={{ height: 48, mb: 2 }} />
        <Box sx={{ display: "flex", justifyContent: "flex-start", mb: "auto" }}>
          <Logo size="large" holo />
        </Box>
      </Box>

      <Box sx={{ width: "100%", position: "relative", zIndex: 1 }}>
        <MrzZone cardData={mrzData} fullWidth compact />
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
    <Box sx={{ ...sx }} {...props}>
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
        sx={{ width: "100%", maxWidth: 600 }}
      />
    </Box>
  );
}
