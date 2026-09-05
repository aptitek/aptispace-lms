import type { Meta, StoryObj } from "@storybook/react-vite";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import InstitutionChip from "../app/components/molecules/InstitutionChip/InstitutionChip";

const meta = {
  title: "Molecules/InstitutionChip",
  component: InstitutionChip,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "InstitutionChip Molecule Component with distinct MD3 expressive shapes and colors: Schools (Cyan clamshell) and Institutions (Yellow semicircle).",
      },
    },
  },
  argTypes: {
    institutionType: {
      control: "select",
      options: ["school", "company", "all"],
      description: "Target institution type",
    },
    variant: {
      control: "radio",
      options: ["filled", "outlined"],
      description: "Visual surface treatment",
    },
    size: {
      control: "select",
      options: ["small", "medium"],
      description: "Size preset",
    },
    showIcon: {
      control: "boolean",
      description: "Toggle icon adornment",
    },
  },
} satisfies Meta<typeof InstitutionChip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultSchool: Story = {
  args: {
    institutionType: "school",
    variant: "filled",
    size: "medium",
    showIcon: true,
  },
};

export const Institution: Story = {
  args: {
    institutionType: "company",
    variant: "filled",
    size: "medium",
    showIcon: true,
  },
};

export const AllInstitutionTypes: Story = {
  render: () => (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3, p: 2 }}>
      <Box>
        <Typography variant="subtitle2" sx={{ mb: 1, color: "text.secondary" }}>
          Filled Variants
        </Typography>
        <Box
          sx={{
            display: "flex",
            gap: 1.5,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <InstitutionChip institutionType="school" variant="filled" />
          <InstitutionChip institutionType="company" variant="filled" />
        </Box>
      </Box>

      <Box>
        <Typography variant="subtitle2" sx={{ mb: 1, color: "text.secondary" }}>
          Outlined Variants
        </Typography>
        <Box
          sx={{
            display: "flex",
            gap: 1.5,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <InstitutionChip institutionType="school" variant="outlined" />
          <InstitutionChip institutionType="company" variant="outlined" />
        </Box>
      </Box>

      <Box>
        <Typography variant="subtitle2" sx={{ mb: 1, color: "text.secondary" }}>
          Small Size
        </Typography>
        <Box
          sx={{
            display: "flex",
            gap: 1.5,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <InstitutionChip institutionType="school" size="small" />
          <InstitutionChip institutionType="company" size="small" />
        </Box>
      </Box>
    </Box>
  ),
};
