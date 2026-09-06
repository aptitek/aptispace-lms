import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import NumberPicker from "~/components/atoms/NumberPicker/NumberPicker";

const meta = {
  title: "Atoms/NumberPicker",
  component: NumberPicker,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof NumberPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

function SingleNumberDemo() {
  const [year, setYear] = useState<number | string>(1);
  return (
    <Box sx={{ width: 200 }}>
      <NumberPicker
        label="Cohort Year"
        value={year}
        onChange={setYear}
        min={1}
        max={10}
      />
    </Box>
  );
}

export const SingleNumberWithStepButtons: Story = {
  render: () => <SingleNumberDemo />,
};

function RangeModeDemo() {
  const [minYear, setMinYear] = useState<number | null>(2022);
  const [maxYear, setMaxYear] = useState<number | null>(2026);
  return (
    <NumberPicker
      mode="range"
      label="Start Year"
      minValue={minYear}
      maxValue={maxYear}
      onMinChange={setMinYear}
      onMaxChange={setMaxYear}
    />
  );
}

export const RangeModeUnified: Story = {
  name: "Range Mode (MD3 Unified)",
  render: () => <RangeModeDemo />,
};

function EmptyRangeModeDemo() {
  const [minYear, setMinYear] = useState<number | null>(null);
  const [maxYear, setMaxYear] = useState<number | null>(null);
  return (
    <NumberPicker
      mode="range"
      label="Academic Year"
      minValue={minYear}
      maxValue={maxYear}
      onMinChange={setMinYear}
      onMaxChange={setMaxYear}
    />
  );
}

export const RangeModeEmpty: Story = {
  name: "Range Mode (Empty / Unpopulated)",
  render: () => <EmptyRangeModeDemo />,
};

function SplitRangeModeDemo() {
  const [minYear, setMinYear] = useState<number | null>(2021);
  const [maxYear, setMaxYear] = useState<number | null>(2025);
  return (
    <NumberPicker
      mode="range"
      variant="split"
      label="Year Range"
      minValue={minYear}
      maxValue={maxYear}
      onMinChange={setMinYear}
      onMaxChange={setMaxYear}
    />
  );
}

export const RangeModeSplit: Story = {
  name: "Range Mode (Split Variant)",
  render: () => <SplitRangeModeDemo />,
};

function SizeComparisonDemo() {
  const [singleSmall, setSingleSmall] = useState<number | string>(3);
  const [smallMin, setSmallMin] = useState<number | null>(2020);
  const [smallMax, setSmallMax] = useState<number | null>(2024);
  const [singleMed, setSingleMed] = useState<number | string>(3);
  const [medMin, setMedMin] = useState<number | null>(2020);
  const [medMax, setMedMax] = useState<number | null>(2024);

  return (
    <Stack spacing={4}>
      <Box>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: "block", mb: 1, fontWeight: 600 }}
        >
          Small (40px height — Single & Range)
        </Typography>
        <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
          <NumberPicker
            label="Cohort Year"
            value={singleSmall}
            onChange={setSingleSmall}
            min={1}
            max={10}
            size="small"
            sx={{ width: 190 }}
          />
          <NumberPicker
            mode="range"
            size="small"
            label="Start Year"
            minValue={smallMin}
            maxValue={smallMax}
            onMinChange={setSmallMin}
            onMaxChange={setSmallMax}
            sx={{ width: 190 }}
          />
        </Stack>
      </Box>
      <Box>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: "block", mb: 1, fontWeight: 600 }}
        >
          Medium (56px height — Single & Range)
        </Typography>
        <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
          <NumberPicker
            label="Cohort Year"
            value={singleMed}
            onChange={setSingleMed}
            min={1}
            max={10}
            size="medium"
            sx={{ width: 190 }}
          />
          <NumberPicker
            mode="range"
            size="medium"
            label="Start Year"
            minValue={medMin}
            maxValue={medMax}
            onMinChange={setMedMin}
            onMaxChange={setMedMax}
            sx={{ width: 190 }}
          />
        </Stack>
      </Box>
    </Stack>
  );
}

export const SizeComparison: Story = {
  name: "Sizes (Small vs Medium)",
  render: () => <SizeComparisonDemo />,
};

function VisualParityDemo() {
  const [singleVal, setSingleVal] = useState<number | string>(3);
  const [minYear, setMinYear] = useState<number | null>(2022);
  const [maxYear, setMaxYear] = useState<number | null>(2026);

  return (
    <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
      <NumberPicker
        label="Cohort Year"
        value={singleVal}
        onChange={setSingleVal}
        min={1}
        max={10}
        size="small"
        sx={{ width: 190 }}
      />
      <NumberPicker
        mode="range"
        label="Start Year"
        minValue={minYear}
        maxValue={maxYear}
        onMinChange={setMinYear}
        onMaxChange={setMaxYear}
        size="small"
        sx={{ width: 190 }}
      />
    </Stack>
  );
}

export const VisualParityWithSingle: Story = {
  name: "Visual Parity with Single NumberPicker",
  render: () => <VisualParityDemo />,
};
