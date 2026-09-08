import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import dayjs from "dayjs";

import CalendarCard from "~/components/organisms/CalendarCard/CalendarCard";

const meta: Meta<typeof CalendarCard> = {
  title: "Organisms/CalendarCard",
  component: CalendarCard,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "CalendarCard component displaying a tear-off calendar sheet with month/year header, prominent day number, weekday, and a localized relative time chip powered by dayjs.",
      },
    },
  },
  argTypes: {
    size: {
      control: "radio",
      options: ["small", "medium", "large"],
      description: "Dimensions of the calendar card",
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
    editable: {
      control: "boolean",
      description:
        "Whether the calendar card is editable via date picker on click",
    },
    disabled: {
      control: "boolean",
      description: "Whether interaction is disabled",
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
type Story = StoryObj<typeof CalendarCard>;

const baseDate = new Date();

export const InteractiveDatePicker: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Click the card to open MUI's DatePicker. Selecting a new date tears off the current sheet with an expressive physics animation and replaces it with the new values.",
      },
    },
  },
  args: {
    date: baseDate,
    editable: true,
    size: "medium",
    showChip: true,
    headerColor: "primary",
  },
};

function ControlledCalendarStory() {
  const [selectedDate, setSelectedDate] = React.useState(dayjs(baseDate));

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
      }}
    >
      <CalendarCard
        date={selectedDate}
        editable
        headerColor="primary"
        onDateChange={(newD) => setSelectedDate(newD)}
      />
      <Typography
        variant="body2"
        sx={{ color: "text.secondary", fontWeight: 600 }}
      >
        Selected Date: {selectedDate.format("dddd, MMMM D, YYYY")}
      </Typography>
    </Box>
  );
}

export const ControlledWithLiveFeedback: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Demonstrates controlled mode with live feedback displaying the selected date value from onDateChange.",
      },
    },
  },
  render: () => <ControlledCalendarStory />,
};

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
        <CalendarCard date={baseDate} size="small" />
      </Box>
      <Box sx={{ textAlign: "center" }}>
        <Typography
          variant="caption"
          sx={{ display: "block", mb: 1, fontWeight: 700 }}
        >
          Medium
        </Typography>
        <CalendarCard date={baseDate} size="medium" />
      </Box>
      <Box sx={{ textAlign: "center" }}>
        <Typography
          variant="caption"
          sx={{ display: "block", mb: 1, fontWeight: 700 }}
        >
          Large
        </Typography>
        <CalendarCard date={baseDate} size="large" />
      </Box>
    </Box>
  ),
};

export const HeaderThemeVariants: Story = {
  render: () => (
    <Box sx={{ display: "flex", gap: 2.5 }}>
      <CalendarCard date={baseDate} headerColor="primary" />
      <CalendarCard date={baseDate} headerColor="error" />
      <CalendarCard date={baseDate} headerColor="secondary" />
      <CalendarCard date={baseDate} headerColor="default" />
    </Box>
  ),
};
