import type { Meta, StoryObj } from "@storybook/react-vite";
import Box from "@mui/material/Box";
import {
  CohortCard,
  CohortCardSkeleton,
} from "~/components/molecules/CohortCard/CohortCard";
import type { CohortConfig } from "~/types/institution";

const mockCohort: CohortConfig = {
  id: "cohort-dev-2026",
  name: "Cohort 2026 Alpha",
  diploma: "M",
  year: 1,
  tags: ["IA", "Dev"],
  institutionId: "aptitek",
  description:
    "Intensive master curriculum specializing in artificial intelligence and modern web architectures.",
  startDate: "2026-09-01",
  endDate: "2027-06-30",
};

const meta = {
  title: "Molecules/CohortCard",
  component: CohortCard,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <Box sx={{ width: 340, p: 2 }}>
        <Story />
      </Box>
    ),
  ],
  args: {
    cohort: mockCohort,
  },
} satisfies Meta<typeof CohortCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    cohort: mockCohort,
    studentCount: 28,
  },
};

export const Selected: Story = {
  args: {
    cohort: mockCohort,
    studentCount: 28,
    isSelected: true,
  },
};

export const Interactive: Story = {
  args: {
    cohort: mockCohort,
    studentCount: 42,
    onClick: (cohort) => alert(`Selected cohort: ${cohort.name}`),
  },
};

export const WithoutStudentCount: Story = {
  args: {
    cohort: {
      ...mockCohort,
      name: "B3 Cybersecurity",
      diploma: "B",
      year: 3,
      tags: ["Cyber", "Sec"],
      description:
        "Network security, penetration testing, and cryptographic defenses.",
    },
    studentCount: 0,
  },
};

export const SkeletonInteractiveAdd: Story = {
  render: () => (
    <CohortCardSkeleton onClick={() => alert("Add Cohort triggered")} />
  ),
};

export const SkeletonStaticLoading: Story = {
  render: () => <CohortCardSkeleton />,
};
