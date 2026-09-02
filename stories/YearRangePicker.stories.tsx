import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import Box from "@mui/material/Box";
import YearRangePicker from "../app/components/molecules/YearRangePicker/YearRangePicker";

const meta: Meta<typeof YearRangePicker> = {
  title: "Molecules/YearRangePicker",
  component: YearRangePicker,
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <Box sx={{ p: 4 }}>
        <Story />
      </Box>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof YearRangePicker>;

function DefaultStory() {
  const [minYear, setMinYear] = useState<number | null>(null);
  const [maxYear, setMaxYear] = useState<number | null>(null);

  return (
    <YearRangePicker
      startYearMin={minYear}
      startYearMax={maxYear}
      onStartYearMinChange={setMinYear}
      onStartYearMaxChange={setMaxYear}
    />
  );
}

export const Default: Story = {
  render: () => <DefaultStory />,
};

function PreselectedRangeStory() {
  const [minYear, setMinYear] = useState<number | null>(2025);
  const [maxYear, setMaxYear] = useState<number | null>(2027);

  return (
    <YearRangePicker
      startYearMin={minYear}
      startYearMax={maxYear}
      onStartYearMinChange={setMinYear}
      onStartYearMaxChange={setMaxYear}
    />
  );
}

export const PreselectedRange: Story = {
  render: () => <PreselectedRangeStory />,
};
