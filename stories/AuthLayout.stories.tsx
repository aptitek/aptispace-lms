import type { Meta, StoryObj } from "@storybook/react-vite";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import AuthLayout from "../app/components/templates/AuthLayout/AuthLayout";
import LoginCard from "../app/components/organisms/LoginCard/LoginCard";

const meta: Meta<typeof AuthLayout> = {
  title: "Templates/AuthLayout",
  component: AuthLayout,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Full-viewport authentication template featuring dynamic Galaxy WebGL backdrop, subtle HeaderBar, centered content stage, and Footer.",
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof AuthLayout>;

export const Default: Story = {
  render: () => (
    <AuthLayout>
      <LoginCard />
    </AuthLayout>
  ),
};

export const CustomContent: Story = {
  render: () => (
    <AuthLayout>
      <Box
        sx={{
          p: 4,
          borderRadius: 3,
          bgcolor: "background.paper",
          border: 1,
          borderColor: "divider",
          textAlign: "center",
          maxWidth: 480,
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
          AptiSpace Portal
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Full screen template with Galaxy canvas background, HeaderBar, and
          Footer.
        </Typography>
      </Box>
    </AuthLayout>
  ),
};
