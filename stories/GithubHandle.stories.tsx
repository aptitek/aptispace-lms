import type { Meta, StoryObj } from "@storybook/react-vite";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import GithubHandle from "../app/components/atoms/GithubHandle/GithubHandle";

const meta: Meta<typeof GithubHandle> = {
  title: "Atoms/GithubHandle",
  component: GithubHandle,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Atomic GitHub handle component for document IDs. Features theme-gray Octocat icon, monospace typography, and '@<username>' formatting.",
      },
    },
  },
  argTypes: {
    username: {
      control: "text",
      description: "GitHub username / handle",
    },
    size: {
      control: "select",
      options: ["small", "medium", "large"],
      description: "Size preset",
    },
    showIcon: {
      control: "boolean",
      description: "Display Octocat icon",
    },
  },
  args: {
    username: "aptitek",
    size: "small",
    showIcon: true,
  },
};

export default meta;
type Story = StoryObj<typeof GithubHandle>;

export const Default: Story = {
  args: {
    username: "aptitek",
    size: "small",
    showIcon: true,
  },
};

export const StudentCadet: Story = {
  args: {
    username: "cadet-42",
    size: "small",
    showIcon: true,
  },
};

export const Instructor: Story = {
  args: {
    username: "prof-aptispace",
    size: "small",
    showIcon: true,
  },
};

export const WithoutIcon: Story = {
  args: {
    username: "alexmercer",
    size: "small",
    showIcon: false,
  },
};

export const SizeVariations: Story = {
  render: () => (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Box>
        <Typography
          variant="caption"
          sx={{ color: "text.secondary", display: "block", mb: 0.5 }}
        >
          Small (ID Card default)
        </Typography>
        <GithubHandle username="aptitek" size="small" />
      </Box>
      <Box>
        <Typography
          variant="caption"
          sx={{ color: "text.secondary", display: "block", mb: 0.5 }}
        >
          Medium
        </Typography>
        <GithubHandle username="aptitek" size="medium" />
      </Box>
      <Box>
        <Typography
          variant="caption"
          sx={{ color: "text.secondary", display: "block", mb: 0.5 }}
        >
          Large
        </Typography>
        <GithubHandle username="aptitek" size="large" />
      </Box>
    </Box>
  ),
};
