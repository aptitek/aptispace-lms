import type { Meta, StoryObj } from "@storybook/react-vite";
import Box from "@mui/material/Box";
import CohortInspector from "../app/components/organisms/CohortInspector/CohortInspector";
import type { CohortConfig } from "../app/types/institution";

const mockCohort: CohortConfig = {
  id: "cohort-1",
  name: "Web Development 2026",
  description:
    "Full-stack intensive curriculum covering modern frontend and cloud architecture.",
  institutionId: "school-aptitek",
  startDate: "2026-09-01",
  endDate: "2027-06-30",
};

const meta: Meta<typeof CohortInspector> = {
  title: "Organisms/CohortInspector",
  component: CohortInspector,
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <Box sx={{ width: 400, maxWidth: "100%", p: 2 }}>
        <Story />
      </Box>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof CohortInspector>;

export const EditCohort: Story = {
  args: {
    cohort: mockCohort,
    onClose: () => {},
    onSave: () => {},
  },
};

export const AddCohort: Story = {
  args: {
    cohort: {
      name: "",
      institutionId: "school-aptitek",
    },
    onClose: () => {},
    onSave: () => {},
  },
};
