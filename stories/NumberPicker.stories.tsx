import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import Box from "@mui/material/Box";
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

export const RangeMode: Story = {
  render: () => <RangeModeDemo />,
};
