import type { Meta, StoryObj } from "@storybook/react-vite";
import Box from "@mui/material/Box";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import InstitutionLogo from "~/components/molecules/InstitutionLogo/InstitutionLogo";

const meta = {
  title: "Molecules/InstitutionLogo",
  component: InstitutionLogo,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    name: { control: "text" },
    logoUrl: { control: "text" },
    height: { control: "number" },
    maxWidth: { control: "number" },
    holo: { control: "boolean" },
    showText: { control: "boolean" },
  },
} satisfies Meta<typeof InstitutionLogo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const StandardLogo: Story = {
  args: {
    name: "Aptitek Institute",
    logoUrl: "/aptitek-logo.svg",
    height: 40,
    maxWidth: 160,
    holo: false,
    showText: false,
  },
};

export const HoloLogo: Story = {
  render: (args) => (
    <Box
      className="physics-card"
      sx={{
        p: 4,
        bgcolor: "background.paper",
        borderRadius: 3,
        border: 1,
        borderColor: "divider",
      }}
    >
      <InstitutionLogo {...args} />
    </Box>
  ),
  args: {
    name: "Aptitek Institute",
    logoUrl: "/aptitek-logo.svg",
    height: 48,
    maxWidth: 180,
    holo: true,
  },
};

export const FallbackText: Story = {
  args: {
    name: "École 42 Paris",
    logoUrl: "",
    height: 40,
    showText: false,
  },
};

export const FallbackCustomIcon: Story = {
  args: {
    name: "Galactic Academy",
    logoUrl: "",
    height: 40,
    fallback: (
      <SchoolRoundedIcon sx={{ fontSize: 36, color: "primary.main" }} />
    ),
  },
};

export const WithLabelText: Story = {
  args: {
    name: "Aptitek Institute",
    logoUrl: "/aptitek-logo.svg",
    height: 36,
    maxWidth: 140,
    showText: true,
  },
};
