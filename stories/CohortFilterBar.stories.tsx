import type { Meta, StoryObj } from "@storybook/react-vite";
import Box from "@mui/material/Box";
import CohortFilterBar from "../app/components/molecules/CohortFilterBar/CohortFilterBar";

const meta: Meta<typeof CohortFilterBar> = {
  title: "Molecules/CohortFilterBar",
  component: CohortFilterBar,
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <Box sx={{ width: 800, maxWidth: "100%", p: 2 }}>
        <Story />
      </Box>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof CohortFilterBar>;

export const Default: Story = {
  args: {
    query: "",
    onQueryChange: () => {},
    diplomaFilter: "all",
    onDiplomaFilterChange: () => {},
    yearFilter: "all",
    onYearFilterChange: () => {},
    tagFilter: "all",
    onTagFilterChange: () => {},
    availableTags: ["IA", "Dev", "Cyber", "IoT", "Network"],
  },
};

export const Filtered: Story = {
  args: {
    query: "Master",
    onQueryChange: () => {},
    diplomaFilter: "M",
    onDiplomaFilterChange: () => {},
    yearFilter: 1,
    onYearFilterChange: () => {},
    tagFilter: "IA",
    onTagFilterChange: () => {},
    availableTags: ["IA", "Dev", "Cyber", "IoT", "Network"],
  },
};
