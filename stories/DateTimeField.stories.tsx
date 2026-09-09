import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import dayjs, { type Dayjs } from "dayjs";

import DateTimeField, {
  CompactDateTimeField,
} from "~/components/atoms/DateTimeField";
import ClockCard from "~/components/organisms/ClockCard";
import TextField, {
  CompactTextField,
} from "~/components/atoms/TextField/TextField";

const meta = {
  title: "Atoms/DateTimeField",
  component: DateTimeField,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof DateTimeField>;

export default meta;
type Story = StoryObj<typeof meta>;

function SingleTimeDemo() {
  const [time, setTime] = useState<Dayjs | null>(dayjs("2026-09-09T14:30:00"));

  return (
    <Stack spacing={2} sx={{ minWidth: 320 }}>
      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
        24-Hour Military Format:
      </Typography>
      <DateTimeField
        mode="time"
        hourFormat="24h"
        value={time}
        onChange={(nextValue) => setTime(nextValue as Dayjs | null)}
        label="Event Start"
      />
      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
        12-Hour AM/PM Format:
      </Typography>
      <DateTimeField
        mode="time"
        hourFormat="12h"
        value={time}
        onChange={(nextValue) => setTime(nextValue as Dayjs | null)}
        label="Event Start"
      />
    </Stack>
  );
}

export const SingleTimeVariants: Story = {
  name: "Time Only (12h vs 24h)",
  render: () => <SingleTimeDemo />,
};

function TimeRangePeriodDemo() {
  const [start, setStart] = useState<Dayjs | null>(
    dayjs("2026-09-09T09:00:00"),
  );
  const [end, setEnd] = useState<Dayjs | null>(dayjs("2026-09-09T17:30:00"));

  return (
    <Stack spacing={2} sx={{ minWidth: 360 }}>
      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
        Period / Range (24-Hour):
      </Typography>
      <DateTimeField
        mode="time"
        variant="range"
        hourFormat="24h"
        startValue={start}
        endValue={end}
        onStartTimeChange={setStart}
        onEndTimeChange={setEnd}
        label="Session Hours"
        helperText="Working hours schedule"
      />
      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
        Period / Range (12-Hour AM/PM):
      </Typography>
      <DateTimeField
        mode="time"
        variant="range"
        hourFormat="12h"
        startValue={start}
        endValue={end}
        onStartTimeChange={setStart}
        onEndTimeChange={setEnd}
        label="Session Hours"
      />
    </Stack>
  );
}

export const PeriodRangeTimeVariants: Story = {
  name: "Period / Range Time",
  render: () => <TimeRangePeriodDemo />,
};

function IsoDateDemo() {
  const [date, setDate] = useState<Dayjs | null>(dayjs("2026-09-09"));
  const [startDate, setStartDate] = useState<Dayjs | null>(dayjs("2026-09-01"));
  const [endDate, setEndDate] = useState<Dayjs | null>(dayjs("2026-09-15"));

  return (
    <Stack spacing={2} sx={{ minWidth: 380 }}>
      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
        Single Date in ISO Format (YYYY-MM-DD):
      </Typography>
      <DateTimeField
        mode="date"
        dateFormat="iso"
        value={date}
        onChange={(nextValue) => setDate(nextValue as Dayjs | null)}
        label="Academic Term Start"
      />
      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
        Date Period in ISO Format (YYYY-MM-DD):
      </Typography>
      <DateTimeField
        mode="date"
        variant="range"
        dateFormat="iso"
        startValue={startDate}
        endValue={endDate}
        onStartChange={setStartDate}
        onEndChange={setEndDate}
        label="Semester Range"
      />
    </Stack>
  );
}

export const IsoDateVariants: Story = {
  name: "Dates in ISO Format (YYYY-MM-DD)",
  render: () => <IsoDateDemo />,
};

function IsoDateTimeBothDemo() {
  const [start, setStart] = useState<Dayjs | null>(
    dayjs("2026-09-09T09:30:00"),
  );
  const [end, setEnd] = useState<Dayjs | null>(dayjs("2026-09-09T18:00:00"));

  return (
    <Stack spacing={2} sx={{ minWidth: 540 }}>
      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
        Combined Date & Time Single (ISO 24h):
      </Typography>
      <DateTimeField
        mode="datetime"
        dateFormat="iso"
        hourFormat="24h"
        value={start}
        onChange={(nextValue) => setStart(nextValue as Dayjs | null)}
        label="Exam Start Timestamp"
      />
      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
        Combined Date & Time Period Range (ISO 24h):
      </Typography>
      <DateTimeField
        mode="datetime"
        variant="range"
        dateFormat="iso"
        hourFormat="24h"
        startValue={start}
        endValue={end}
        onStartChange={setStart}
        onEndChange={setEnd}
        label="Assessment Window"
      />
    </Stack>
  );
}

export const IsoDateTimeBoth: Story = {
  name: "Both Date & Time (ISO)",
  render: () => <IsoDateTimeBothDemo />,
};

const SIZE_OPTIONS = [
  { size: "compact", label: "Compact:" },
  { size: "small", label: "Small:" },
  { size: "medium", label: "Medium:" },
  { size: "large", label: "Large:" },
] as const;

function SizesComparisonDemo() {
  const start = dayjs("2026-09-09T10:00:00");
  const end = dayjs("2026-09-09T12:30:00");

  return (
    <Stack spacing={2.5} sx={{ minWidth: 420 }}>
      {SIZE_OPTIONS.map((option) => (
        <Box key={option.size}>
          <Typography
            variant="caption"
            sx={{ fontWeight: 700, display: "block" }}
          >
            {option.label}
          </Typography>
          <DateTimeField
            size={option.size}
            mode="time"
            variant="range"
            hourFormat="24h"
            startValue={start}
            endValue={end}
          />
        </Box>
      ))}
    </Stack>
  );
}

export const SizeOptions: Story = {
  name: "Size Hierarchy (Compact to Large)",
  render: () => <SizesComparisonDemo />,
};

function ClockCardIntegrationDemo() {
  const [start, setStart] = useState<Dayjs>(dayjs("2026-09-09T14:00:00"));
  const [end, setEnd] = useState<Dayjs>(dayjs("2026-09-09T16:30:00"));

  return (
    <Stack spacing={3} sx={{ alignItems: "center" }}>
      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
        ClockCard with Integrated DateTimeField Editable Pickers:
      </Typography>
      <ClockCard
        startTime={start}
        endTime={end}
        editable={true}
        hourFormat="24h"
        onStartTimeChange={setStart}
        onEndTimeChange={setEnd}
      />
    </Stack>
  );
}

export const ClockCardIntegration: Story = {
  name: "ClockCard Integration",
  render: () => <ClockCardIntegrationDemo />,
};

function ComparisonSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Box
      sx={{
        p: 2,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        display: "flex",
        flexDirection: "column",
        gap: 1.5,
      }}
    >
      <Typography variant="caption" sx={{ fontWeight: 700 }}>
        {title}
      </Typography>
      {children}
    </Box>
  );
}

function CompactField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <Box>
      <Typography
        variant="caption"
        sx={{ display: "block", mb: 0.5, color: "text.secondary" }}
      >
        {label}
      </Typography>
      {children}
    </Box>
  );
}

function FormComparisonDemo() {
  const [time, setTime] = useState<Dayjs | null>(dayjs("2026-09-09T14:30:00"));
  const [start, setStart] = useState<Dayjs | null>(
    dayjs("2026-09-09T09:00:00"),
  );
  const [end, setEnd] = useState<Dayjs | null>(dayjs("2026-09-09T17:00:00"));

  return (
    <Stack spacing={3} sx={{ width: "100%", maxWidth: 640 }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
        Side-by-Side Comparison: TextField vs DateTimeField
      </Typography>

      <ComparisonSection title="Standard Medium (56px) Outlined">
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
            gap: 2,
          }}
        >
          <TextField
            label="Student Identifier"
            defaultValue="STU-8092"
            size="medium"
            fullWidth
            helperText="Matriculation code"
          />
          <DateTimeField
            mode="datetime"
            label="Enrollment Timestamp"
            value={time}
            onChange={(nextValue) => setTime(nextValue as Dayjs | null)}
            size="medium"
            fullWidth
            helperText="Course matriculation"
          />
        </Box>
      </ComparisonSection>

      <ComparisonSection title="Form Layout with Period Range Field">
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
              gap: 2,
            }}
          >
            <TextField
              label="Session Title"
              defaultValue="Algorithms Lab"
              size="small"
              fullWidth
            />
            <TextField
              label="Room Location"
              defaultValue="Room 304"
              size="small"
              fullWidth
            />
          </Box>
          <DateTimeField
            mode="time"
            variant="range"
            hourFormat="24h"
            startValue={start}
            endValue={end}
            onStartTimeChange={setStart}
            onEndTimeChange={setEnd}
            size="small"
            fullWidth
            label="Session Hours"
          />
        </Box>
      </ComparisonSection>
    </Stack>
  );
}

export const MatchingTextFieldStyle: Story = {
  name: "Matching TextField Style",
  render: () => <FormComparisonDemo />,
};

function CompactShowcaseDemo() {
  const [time12, setTime12] = useState<Dayjs | null>(
    dayjs("2026-09-09T14:30:00"),
  );
  const [rangeStart, setRangeStart] = useState<Dayjs | null>(
    dayjs("2026-09-09T09:00:00"),
  );
  const [rangeEnd, setRangeEnd] = useState<Dayjs | null>(
    dayjs("2026-09-09T17:00:00"),
  );
  const [dateRangeStart, setDateRangeStart] = useState<Dayjs | null>(
    dayjs("2026-09-01"),
  );
  const [dateRangeEnd, setDateRangeEnd] = useState<Dayjs | null>(
    dayjs("2026-09-30"),
  );
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <Stack spacing={3} sx={{ width: "100%", maxWidth: 740 }}>
      <Typography variant="h6" sx={{ fontWeight: 700 }}>
        Compact Version (32px Height)
      </Typography>

      <ComparisonSection title="Compact Time & Date Variants">
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: 2,
          }}
        >
          <CompactField label="12h Single (104px)">
            <CompactDateTimeField
              mode="time"
              hourFormat="12h"
              value={time12}
              onChange={(nextValue) => setTime12(nextValue as Dayjs | null)}
            />
          </CompactField>
          <CompactField label="24h Range (~204px)">
            <CompactDateTimeField
              mode="time"
              variant="range"
              hourFormat="24h"
              startValue={rangeStart}
              endValue={rangeEnd}
              onStartTimeChange={setRangeStart}
              onEndTimeChange={setRangeEnd}
            />
          </CompactField>
          <CompactField label="ISO Date Range (~244px)">
            <CompactDateTimeField
              mode="date"
              variant="range"
              dateFormat="iso"
              startValue={dateRangeStart}
              endValue={dateRangeEnd}
              onStartChange={setDateRangeStart}
              onEndChange={setDateRangeEnd}
            />
          </CompactField>
        </Box>
      </ComparisonSection>

      <ComparisonSection title="Dense Table / Toolbar Alignment">
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 1.5,
            p: 1.5,
            bgcolor: "background.paper",
            borderRadius: 1.5,
            border: "1px dashed",
            borderColor: "divider",
          }}
        >
          <CompactTextField
            variant="search"
            placeholder="Search roster..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onClear={() => setSearchQuery("")}
            sx={{ width: 160 }}
          />
          <CompactTextField
            placeholder="Room code"
            defaultValue="LAB-3"
            sx={{ width: 100 }}
          />
          <CompactDateTimeField
            mode="time"
            variant="range"
            hourFormat="24h"
            startValue={rangeStart}
            endValue={rangeEnd}
            onStartTimeChange={setRangeStart}
            onEndTimeChange={setRangeEnd}
          />
        </Box>
      </ComparisonSection>
    </Stack>
  );
}

export const CompactVersion: Story = {
  name: "Compact Version (32px Density)",
  render: () => <CompactShowcaseDemo />,
};
