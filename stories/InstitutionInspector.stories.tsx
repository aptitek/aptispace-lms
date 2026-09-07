import type { Meta, StoryObj } from "@storybook/react-vite";
import Box from "@mui/material/Box";
import InstitutionInspector from "~/components/organisms/InstitutionInspector/InstitutionInspector";
import type { SchoolConfig } from "~/types/institution";

const mockSchool: SchoolConfig = {
  id: "school-aptitek",
  name: "Aptitek Institute",
  slug: "aptitek",
  type: "academic",
  logoUrl: "/aptitek-logo.svg",
  emailDomain: "aptitek.io",
  usernamePattern: "{first}.{last}",
};

const meta = {
  title: "Organisms/InstitutionInspector",
  component: InstitutionInspector,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <Box sx={{ width: 440, maxWidth: "100%", p: 2 }}>
        <Story />
      </Box>
    ),
  ],
} satisfies Meta<typeof InstitutionInspector>;

export default meta;
type Story = StoryObj<typeof meta>;

export const EditInstitution: Story = {
  args: {
    institution: mockSchool,
    onClose: () => alert("Close clicked"),
    onSave: (payload) => alert(`Saved: ${JSON.stringify(payload)}`),
  },
};

export const AddInstitution: Story = {
  args: {
    institution: {
      id: "",
      name: "",
      slug: "",
      type: "academic",
      logoUrl: "",
      emailDomain: "",
    },
    onClose: () => alert("Close clicked"),
    onSave: (payload) => alert(`Created: ${JSON.stringify(payload)}`),
  },
};

export const CompanyPartner: Story = {
  args: {
    institution: {
      id: "school-partner",
      name: "Quantum Aerospace",
      slug: "quantum-aero",
      type: "company",
      logoUrl: "",
      emailDomain: "quantum.aero",
      usernamePattern: "{first[0]}{last}",
    },
    onClose: () => alert("Close clicked"),
    onSave: (payload) => alert(`Saved: ${JSON.stringify(payload)}`),
  },
};

export const Submitting: Story = {
  args: {
    institution: mockSchool,
    isSubmitting: true,
    onClose: () => {},
    onSave: () => {},
  },
};
