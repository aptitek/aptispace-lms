import type { Meta, StoryObj } from "@storybook/react-vite";
import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";
import {
  ZenithSwitch,
  MeridianSwitch,
  ClockFormatSwitch,
  AttendanceSwitch,
  type ClockFormat,
  type AttendanceMode,
  type SupportedLanguage,
  type SwitchSize,
} from "~/components/molecules/FancySwitch";

const meta = {
  title: "Molecules/FancySwitch",
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta;

export default meta;

const ShowcasePanel = styled(Paper)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(3),
  padding: theme.spacing(3.5),
  minWidth: 420,
  borderRadius: 16,
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: theme.shadows[4],
}));

const SwitchRow = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: theme.spacing(3),
}));

const LabelGroup = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(0.25),
}));

const SIZE_PRESETS: SwitchSize[] = ["small", "medium", "large"];

const AllFancySwitchesStoryComponent: React.FC = () => {
  const [isDark, setIsDark] = useState(false);
  const [lang, setLang] = useState<SupportedLanguage>("en");
  const [clockFormat, setClockFormat] = useState<ClockFormat>("12h");
  const [attendanceMode, setAttendanceMode] =
    useState<AttendanceMode>("in-person");
  const [size, setSize] = useState<SwitchSize>("medium");

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 3,
        alignItems: "center",
      }}
    >
      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
        <Typography variant="caption" sx={{ fontWeight: 700, mr: 1 }}>
          Size Preset:
        </Typography>
        {SIZE_PRESETS.map((s) => (
          <Button
            key={s}
            size="small"
            variant={size === s ? "contained" : "outlined"}
            onClick={() => setSize(s)}
            sx={{ minWidth: 64, textTransform: "uppercase" }}
          >
            {s}
          </Button>
        ))}
      </Box>

      <ShowcasePanel elevation={2}>
        <Typography
          variant="h6"
          sx={{ fontWeight: 800, letterSpacing: "-0.02em" }}
        >
          M3 Fancy Switch Suite
        </Typography>

        <SwitchRow>
          <LabelGroup>
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
              Celestial Theme
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {isDark ? "Dark Mode (Moon)" : "Light Mode (Sun)"}
            </Typography>
          </LabelGroup>
          <ZenithSwitch
            checked={isDark}
            onChange={setIsDark}
            size={size}
            data-testid="showcase-theme-switch"
          />
        </SwitchRow>

        <Divider />

        <SwitchRow>
          <LabelGroup>
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
              Meridian Flight
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {lang === "fr" ? "Français (France)" : "English (UK)"}
            </Typography>
          </LabelGroup>
          <MeridianSwitch
            language={lang}
            onLanguageChange={setLang}
            size={size}
            data-testid="showcase-language-switch"
          />
        </SwitchRow>

        <Divider />

        <SwitchRow>
          <LabelGroup>
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
              Clock 12h / 24h
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {clockFormat === "24h"
                ? "24-Hour Military Time"
                : "12-Hour AM/PM Time"}
            </Typography>
          </LabelGroup>
          <ClockFormatSwitch
            format={clockFormat}
            onChangeFormat={setClockFormat}
            size={size}
            data-testid="showcase-clock-switch"
          />
        </SwitchRow>

        <Divider />

        <SwitchRow>
          <LabelGroup>
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
              Attendance Mode
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {attendanceMode === "in-person"
                ? "In-Person (On-Site Pin)"
                : "Remote (Workstation / Walking Pedestrian)"}
            </Typography>
          </LabelGroup>
          <AttendanceSwitch
            mode={attendanceMode}
            onChangeMode={setAttendanceMode}
            size={size}
            data-testid="showcase-attendance-switch"
          />
        </SwitchRow>
      </ShowcasePanel>
    </Box>
  );
};

export const AllFancySwitchesShowcase: StoryObj = {
  render: () => <AllFancySwitchesStoryComponent />,
};

const ThemeSwitchLightStoryComponent: React.FC = () => {
  const [isDark, setIsDark] = useState(false);
  return <ZenithSwitch checked={isDark} onChange={setIsDark} size="medium" />;
};

export const ThemeSwitchLight: StoryObj<typeof ZenithSwitch> = {
  render: () => <ThemeSwitchLightStoryComponent />,
};

const ThemeSwitchDarkStoryComponent: React.FC = () => {
  const [isDark, setIsDark] = useState(true);
  return <ZenithSwitch checked={isDark} onChange={setIsDark} size="medium" />;
};

export const ThemeSwitchDark: StoryObj<typeof ZenithSwitch> = {
  render: () => <ThemeSwitchDarkStoryComponent />,
};

const LanguageSwitchEnglishStoryComponent: React.FC = () => {
  const [lang, setLang] = useState<SupportedLanguage>("en");
  return (
    <MeridianSwitch language={lang} onLanguageChange={setLang} size="medium" />
  );
};

export const LanguageSwitchEnglish: StoryObj<typeof MeridianSwitch> = {
  render: () => <LanguageSwitchEnglishStoryComponent />,
};

const LanguageSwitchFrenchStoryComponent: React.FC = () => {
  const [lang, setLang] = useState<SupportedLanguage>("fr");
  return (
    <MeridianSwitch language={lang} onLanguageChange={setLang} size="medium" />
  );
};

export const LanguageSwitchFrench: StoryObj<typeof MeridianSwitch> = {
  render: () => <LanguageSwitchFrenchStoryComponent />,
};

const ClockSwitch12hStoryComponent: React.FC = () => {
  const [format, setFormat] = useState<ClockFormat>("12h");
  return (
    <ClockFormatSwitch
      format={format}
      onChangeFormat={setFormat}
      size="medium"
    />
  );
};

export const ClockSwitch12h: StoryObj<typeof ClockFormatSwitch> = {
  render: () => <ClockSwitch12hStoryComponent />,
};

const ClockSwitch24hStoryComponent: React.FC = () => {
  const [format, setFormat] = useState<ClockFormat>("24h");
  return (
    <ClockFormatSwitch
      format={format}
      onChangeFormat={setFormat}
      size="medium"
    />
  );
};

export const ClockSwitch24h: StoryObj<typeof ClockFormatSwitch> = {
  render: () => <ClockSwitch24hStoryComponent />,
};

const AttendanceSwitchInPersonStoryComponent: React.FC = () => {
  const [mode, setMode] = useState<AttendanceMode>("in-person");
  return <AttendanceSwitch mode={mode} onChangeMode={setMode} size="medium" />;
};

export const AttendanceSwitchInPerson: StoryObj<typeof AttendanceSwitch> = {
  render: () => <AttendanceSwitchInPersonStoryComponent />,
};

const AttendanceSwitchRemoteStoryComponent: React.FC = () => {
  const [mode, setMode] = useState<AttendanceMode>("remote");
  return <AttendanceSwitch mode={mode} onChangeMode={setMode} size="medium" />;
};

export const AttendanceSwitchRemote: StoryObj<typeof AttendanceSwitch> = {
  render: () => <AttendanceSwitchRemoteStoryComponent />,
};
