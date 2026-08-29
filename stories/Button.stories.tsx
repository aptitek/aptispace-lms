import type { Meta, StoryObj } from "@storybook/react-vite";
import Button from "@mui/material/Button";
import GitHubIcon from "@mui/icons-material/GitHub";
import LoginIcon from "@mui/icons-material/Login";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { LoadingIndicator } from "react-material-expressive";
import Box from "@mui/material/Box";

const meta = {
  title: "Atoms/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "radio",
      options: ["contained", "outlined", "text"],
    },
    color: {
      control: "select",
      options: [
        "primary",
        "secondary",
        "success",
        "error",
        "info",
        "warning",
        "inherit",
      ],
    },
    size: {
      control: "select",
      options: ["small", "medium", "large"],
    },
    disabled: { control: "boolean" },
    fullWidth: { control: "boolean" },
    children: { control: "text" },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PrimaryContained: Story = {
  args: {
    variant: "contained",
    color: "primary",
    children: "Sign In",
    endIcon: <ArrowForwardIcon />,
  },
};

export const OutlinedWithIcon: Story = {
  args: {
    variant: "outlined",
    color: "primary",
    children: "Continue with GitHub",
    startIcon: <GitHubIcon />,
  },
};

export const WithLoadingIndicator: Story = {
  args: {
    variant: "outlined",
    disabled: true,
    children: "Authenticating...",
    startIcon: <LoadingIndicator className="!size-5 [&>svg]:!size-5" />,
  },
};

export const ButtonVariants: Story = {
  render: () => (
    <Box
      sx={{ display: "flex", flexWrap: "wrap", gap: 2, alignItems: "center" }}
    >
      <Button variant="contained" color="primary">
        Primary
      </Button>
      <Button variant="outlined" color="primary">
        Outlined
      </Button>
      <Button variant="text" color="primary">
        Text
      </Button>
      <Button variant="contained" color="secondary">
        Secondary
      </Button>
      <Button variant="contained" color="success">
        Success
      </Button>
      <Button variant="contained" color="error">
        Error
      </Button>
      <Button variant="outlined" startIcon={<LoginIcon />}>
        With Icon
      </Button>
      <Button
        variant="outlined"
        disabled
        startIcon={<LoadingIndicator className="!size-5 [&>svg]:!size-5" />}
      >
        Loading
      </Button>
    </Box>
  ),
};
