import type { Meta, StoryObj } from "@storybook/react-vite";
import Box from "@mui/material/Box";
import CohortChip from "../app/components/molecules/CohortChip/CohortChip";

const meta: Meta<typeof CohortChip> = {
  title: "Molecules/CohortChip",
  component: CohortChip,
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <Box
        sx={{
          p: 3,
          display: "flex",
          gap: 2,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <Story />
      </Box>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof CohortChip>;

export const MasterAI: Story = {
  args: {
    cohort: {
      diploma: "M",
      year: 1,
      tags: ["AI", "Dev"],
    },
    size: "medium",
  },
};

export const BachelorCyber: Story = {
  args: {
    cohort: {
      diploma: "B",
      year: 3,
      tags: ["Cyber"],
    },
    size: "medium",
  },
};

export const FormationIoT: Story = {
  args: {
    cohort: {
      diploma: "F",
      year: 0,
      tags: ["Network", "IoT"],
    },
    size: "medium",
  },
};

export const LicenceNoTags: Story = {
  args: {
    cohort: {
      diploma: "L",
      year: 2,
      tags: [],
    },
    size: "medium",
  },
};

export const DoctorateAI: Story = {
  args: {
    cohort: {
      diploma: "D",
      year: 4,
      tags: ["AI", "Data", "Research"],
    },
    size: "medium",
  },
};

export const CertificationCloud: Story = {
  args: {
    cohort: {
      diploma: "C",
      year: 0,
      tags: ["Cloud"],
    },
    size: "medium",
  },
};

export const SizeVariants: Story = {
  render: () => (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        alignItems: "flex-start",
      }}
    >
      <CohortChip
        cohort={{ diploma: "M", year: 1, tags: ["AI", "Dev"] }}
        size="small"
      />
      <CohortChip
        cohort={{ diploma: "M", year: 1, tags: ["AI", "Dev"] }}
        size="medium"
      />
      <CohortChip
        cohort={{ diploma: "M", year: 1, tags: ["AI", "Dev"] }}
        size="large"
      />
    </Box>
  ),
};

export const InteractiveWithDelete: Story = {
  args: {
    cohort: {
      diploma: "M",
      year: 2,
      tags: ["Cloud", "Security"],
    },
    size: "medium",
    onClick: () => alert("Cohort clicked!"),
    onDelete: () => alert("Delete clicked!"),
  },
};
