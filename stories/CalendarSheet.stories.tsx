import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import dayjs from "dayjs";

import CalendarSheet from "~/components/organisms/CalendarSheet/CalendarSheet";

const meta: Meta<typeof CalendarSheet> = {
  title: "Organisms/CalendarSheet",
  component: CalendarSheet,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "CalendarSheet component displaying a tear-off calendar sheet with month/year header, prominent day number, weekday, and a localized relative time chip powered by dayjs.",
      },
    },
  },
  argTypes: {
    size: {
      control: "radio",
      options: ["small", "medium", "large"],
      description: "Dimensions of the calendar sheet",
    },
    orientation: {
      control: "radio",
      options: ["vertical", "horizontal"],
      description: "Layout direction",
    },
    headerColor: {
      control: "select",
      options: ["primary", "secondary", "error", "default"],
      description: "Color theme for the top binder strip",
    },
    showChip: {
      control: "boolean",
      description: "Whether to render the relative time chip",
    },
    showTime: {
      control: "boolean",
      description: "Whether to include time string",
    },
    showPerforations: {
      control: "boolean",
      description: "Whether to render binder punch holes",
    },
  },
};

export default meta;
type Story = StoryObj<typeof CalendarSheet>;

const baseDate = new Date();

export const Today: Story = {
  args: {
    date: baseDate,
    size: "medium",
    showChip: true,
    headerColor: "primary",
  },
};

export const UpcomingIn3Days: Story = {
  args: {
    date: dayjs(baseDate).add(3, "day").toDate(),
    size: "medium",
    showChip: true,
    headerColor: "primary",
  },
};

export const Tomorrow: Story = {
  args: {
    date: dayjs(baseDate).add(1, "day").toDate(),
    size: "medium",
    showChip: true,
    headerColor: "primary",
  },
};

export const PastEvent: Story = {
  args: {
    date: dayjs(baseDate).subtract(4, "day").toDate(),
    size: "medium",
    showChip: true,
    headerColor: "default",
  },
};

export const ClassicRedTearOff: Story = {
  args: {
    date: baseDate,
    size: "medium",
    headerColor: "error",
    showChip: true,
  },
};

export const WithScheduledTime: Story = {
  args: {
    date: dayjs(baseDate).hour(14).minute(0).toDate(),
    endDate: dayjs(baseDate).hour(16).minute(30).toDate(),
    showTime: true,
    size: "medium",
  },
};

export const FrenchLocalized: Story = {
  args: {
    date: dayjs(baseDate).add(3, "day").toDate(),
    locale: "fr",
    size: "medium",
    showChip: true,
  },
};

export const HorizontalLayout: Story = {
  args: {
    date: dayjs(baseDate).add(2, "day").toDate(),
    orientation: "horizontal",
    size: "medium",
    showChip: true,
  },
};

export const SizeComparison: Story = {
  render: () => (
    <Box sx={{ display: "flex", gap: 3, alignItems: "flex-end" }}>
      <Box sx={{ textAlign: "center" }}>
        <Typography
          variant="caption"
          sx={{ display: "block", mb: 1, fontWeight: 700 }}
        >
          Small
        </Typography>
        <CalendarSheet date={baseDate} size="small" />
      </Box>
      <Box sx={{ textAlign: "center" }}>
        <Typography
          variant="caption"
          sx={{ display: "block", mb: 1, fontWeight: 700 }}
        >
          Medium
        </Typography>
        <CalendarSheet date={baseDate} size="medium" />
      </Box>
      <Box sx={{ textAlign: "center" }}>
        <Typography
          variant="caption"
          sx={{ display: "block", mb: 1, fontWeight: 700 }}
        >
          Large
        </Typography>
        <CalendarSheet date={baseDate} size="large" />
      </Box>
    </Box>
  ),
};

export const HeaderThemeVariants: Story = {
  render: () => (
    <Box sx={{ display: "flex", gap: 2.5 }}>
      <CalendarSheet date={baseDate} headerColor="primary" />
      <CalendarSheet date={baseDate} headerColor="error" />
      <CalendarSheet date={baseDate} headerColor="secondary" />
      <CalendarSheet date={baseDate} headerColor="default" />
    </Box>
  ),
};
