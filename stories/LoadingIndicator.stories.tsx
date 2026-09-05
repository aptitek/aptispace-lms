import type { Meta, StoryObj } from "@storybook/react-vite";
import LoadingIndicator from "~/components/atoms/LoadingIndicator";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const meta = {
  title: "Atoms/LoadingIndicator",
  component: LoadingIndicator,
  tags: ["autodocs"],
  argTypes: {
    contained: { control: "boolean" },
    size: { control: "number" },
  },
} satisfies Meta<typeof LoadingIndicator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
  render: (args) => (
    <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
      <LoadingIndicator {...args} />
    </Box>
  ),
};

export const Contained: Story = {
  args: {
    contained: true,
  },
  render: (args) => (
    <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
      <LoadingIndicator {...args} />
    </Box>
  ),
};

export const ScaleVariants: Story = {
  render: () => (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
        <Box sx={{ textAlign: "center" }}>
          <LoadingIndicator size={24} />
          <Typography variant="caption" sx={{ display: "block" }}>
            Small (24px)
          </Typography>
        </Box>
        <Box sx={{ textAlign: "center" }}>
          <LoadingIndicator size={36} />
          <Typography variant="caption" sx={{ display: "block" }}>
            Medium (36px)
          </Typography>
        </Box>
        <Box sx={{ textAlign: "center" }}>
          <LoadingIndicator size={64} />
          <Typography variant="caption" sx={{ display: "block" }}>
            Large (64px)
          </Typography>
        </Box>
      </Box>
    </Box>
  ),
};

export const ThemedVariants: Story = {
  render: () => (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Typography variant="subtitle2">
        Solarized Palette Morphing Loaders
      </Typography>
      <Box sx={{ display: "flex", alignItems: "center", gap: 4 }}>
        <Box sx={{ textAlign: "center" }}>
          <LoadingIndicator size={40} />
          <Typography variant="caption" sx={{ display: "block", mt: 1 }}>
            Primary (Solarized Blue)
          </Typography>
        </Box>
        <Box sx={{ textAlign: "center" }}>
          <LoadingIndicator contained size={48} />
          <Typography variant="caption" sx={{ display: "block", mt: 1 }}>
            Contained (Base02 / Blue)
          </Typography>
        </Box>
        <Box sx={{ textAlign: "center" }}>
          <LoadingIndicator
            size={40}
            color="var(--color-solarized-cyan, #2aa198)"
          />
          <Typography variant="caption" sx={{ display: "block", mt: 1 }}>
            Secondary (Cyan)
          </Typography>
        </Box>
        <Box sx={{ textAlign: "center" }}>
          <LoadingIndicator
            size={40}
            color="var(--color-solarized-magenta, #d33682)"
          />
          <Typography variant="caption" sx={{ display: "block", mt: 1 }}>
            Tertiary (Magenta)
          </Typography>
        </Box>
      </Box>
    </Box>
  ),
};
