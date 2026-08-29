import type { Meta, StoryObj } from "@storybook/react-vite";
import { LoadingIndicator } from "react-material-expressive";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const meta = {
  title: "Atoms/LoadingIndicator",
  component: LoadingIndicator,
  tags: ["autodocs"],
  argTypes: {
    contained: { control: "boolean" },
    className: { control: "text" },
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
          <LoadingIndicator className="!size-6 [&>svg]:!size-6" />
          <Typography variant="caption" sx={{ display: "block" }}>
            Small (24px)
          </Typography>
        </Box>
        <Box sx={{ textAlign: "center" }}>
          <LoadingIndicator className="!size-9 [&>svg]:!size-9" />
          <Typography variant="caption" sx={{ display: "block" }}>
            Medium (36px)
          </Typography>
        </Box>
        <Box sx={{ textAlign: "center" }}>
          <LoadingIndicator className="!size-16 [&>svg]:!size-16" />
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
          <LoadingIndicator className="!size-10 [&>svg]:!size-10" />
          <Typography variant="caption" sx={{ display: "block", mt: 1 }}>
            Primary (Solarized Blue)
          </Typography>
        </Box>
        <Box sx={{ textAlign: "center" }}>
          <LoadingIndicator contained className="!size-12 [&>svg]:!size-10" />
          <Typography variant="caption" sx={{ display: "block", mt: 1 }}>
            Contained (Base02 / Blue)
          </Typography>
        </Box>
        <Box sx={{ textAlign: "center" }}>
          <LoadingIndicator className="!size-10 [&>svg]:!size-10 [&>svg]:!text-[var(--color-solarized-cyan)]" />
          <Typography variant="caption" sx={{ display: "block", mt: 1 }}>
            Secondary (Cyan)
          </Typography>
        </Box>
        <Box sx={{ textAlign: "center" }}>
          <LoadingIndicator className="!size-10 [&>svg]:!size-10 [&>svg]:!text-[var(--color-solarized-magenta)]" />
          <Typography variant="caption" sx={{ display: "block", mt: 1 }}>
            Tertiary (Magenta)
          </Typography>
        </Box>
      </Box>
    </Box>
  ),
};
