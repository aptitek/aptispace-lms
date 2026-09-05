import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import dayjs from "dayjs";

import TimeSheet from "~/components/molecules/TimeSheet/TimeSheet";
import CalendarSheet from "~/components/molecules/CalendarSheet/CalendarSheet";

const meta: Meta<typeof TimeSheet> = {
  title: "Molecules/TimeSheet",
  component: TimeSheet,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "TimeSheet component displaying a localized digital time interval, an analog clock with start/end needles and MD3 spring animation, an animated squiggly circular progress arc, and a conditional chip with squiggly M3 progress when happening now.",
      },
    },
  },
  argTypes: {
    size: {
      control: "radio",
      options: ["small", "medium", "large"],
      description: "Dimensions of the time card",
    },
    orientation: {
      control: "radio",
      options: ["vertical", "horizontal"],
      description: "Card layout direction",
    },
    hourFormat: {
      control: "radio",
      options: ["auto", "12h", "24h"],
      description: "Digital interval clock system",
    },
    color: {
      control: "select",
      options: ["primary", "secondary", "error", "default"],
      description: "Header and accent color theme",
    },
  },
};

export default meta;
type Story = StoryObj<typeof TimeSheet>;

const now = dayjs();

export const UpcomingToday: Story = {
  args: {
    startTime: now.add(2, "hour").toDate(),
    endTime: now.add(4, "hour").toDate(),
    referenceTime: now.toDate(),
    size: "medium",
    color: "primary",
  },
};

export const HappeningNow: Story = {
  args: {
    startTime: now.subtract(45, "minute").toDate(),
    endTime: now.add(45, "minute").toDate(),
    referenceTime: now.toDate(),
    size: "medium",
    color: "primary",
  },
};

export const TwelveHourFormat: Story = {
  args: {
    startTime: now.hour(14).minute(0).toDate(),
    endTime: now.hour(16).minute(30).toDate(),
    referenceTime: now.hour(12).minute(0).toDate(),
    hourFormat: "12h",
    size: "medium",
  },
};

export const TwentyFourHourFormat: Story = {
  args: {
    startTime: now.hour(14).minute(0).toDate(),
    endTime: now.hour(16).minute(30).toDate(),
    referenceTime: now.hour(12).minute(0).toDate(),
    hourFormat: "24h",
    size: "medium",
  },
};

export const FrenchLocalized: Story = {
  args: {
    startTime: now.subtract(30, "minute").toDate(),
    endTime: now.add(60, "minute").toDate(),
    referenceTime: now.toDate(),
    locale: "fr",
    size: "medium",
  },
};

export const NotTodayNoChip: Story = {
  args: {
    startTime: now.add(3, "day").hour(10).minute(0).toDate(),
    endTime: now.add(3, "day").hour(12).minute(0).toDate(),
    referenceTime: now.toDate(),
    size: "medium",
  },
};

export const SizeComparison: Story = {
  render: () => {
    const s = now.add(1, "hour").toDate();
    const e = now.add(3, "hour").toDate();
    return (
      <Box sx={{ display: "flex", gap: 3, alignItems: "flex-end" }}>
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="caption" sx={{ display: "block", mb: 1, fontWeight: 700 }}>
            Small
          </Typography>
          <TimeSheet startTime={s} endTime={e} size="small" />
        </Box>
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="caption" sx={{ display: "block", mb: 1, fontWeight: 700 }}>
            Medium
          </Typography>
          <TimeSheet startTime={s} endTime={e} size="medium" />
        </Box>
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="caption" sx={{ display: "block", mb: 1, fontWeight: 700 }}>
            Large
          </Typography>
          <TimeSheet startTime={s} endTime={e} size="large" />
        </Box>
      </Box>
    );
  },
};

export const PairedWithCalendarSheet: Story = {
  render: () => {
    const eventDate = now.add(2, "hour").toDate();
    const eventEnd = now.add(4, "hour").toDate();
    return (
      <Box sx={{ display: "flex", gap: 3, alignItems: "center" }}>
        <CalendarSheet date={eventDate} size="medium" />
        <TimeSheet startTime={eventDate} endTime={eventEnd} size="medium" />
      </Box>
    );
  },
};

export const ProgressThemeSpectrum: Story = {
  render: () => {
    const spectrumSamples = [
      { label: "5% • Purple / Violet (Start)", elapsed: 5 },
      { label: "25% • Blue", elapsed: 25 },
      { label: "40% • Cyan", elapsed: 40 },
      { label: "58% • Green", elapsed: 58 },
      { label: "72% • Yellow / Amber", elapsed: 72 },
      { label: "84% • Orange", elapsed: 84 },
      { label: "92% • Red", elapsed: 92 },
      { label: "98% • Magenta (Complete)", elapsed: 98 },
    ];

    return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3, p: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Progress Theme Color Progression (Purple → Blue → Cyan → Green → Yellow → Orange → Red → Magenta)
        </Typography>
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 3 }}>
          {spectrumSamples.map((sample) => (
            <Box key={sample.elapsed} sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Typography variant="caption" sx={{ fontWeight: 700, opacity: 0.85 }}>
                {sample.label}
              </Typography>
              <TimeSheet
                startTime={now.subtract(sample.elapsed, "minute").toDate()}
                endTime={now.add(100 - sample.elapsed, "minute").toDate()}
                referenceTime={now.toDate()}
                size="small"
              />
            </Box>
          ))}
        </Box>
      </Box>
    );
  },
};
