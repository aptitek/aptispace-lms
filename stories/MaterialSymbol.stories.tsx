import type { Meta, StoryObj } from "@storybook/react-vite";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import MaterialSymbol from "~/components/atoms/Icon/MaterialSymbol";

const meta = {
  title: "Atoms/MaterialSymbol",
  component: MaterialSymbol,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    name: { control: "text" },
    size: { control: "number" },
    weight: {
      control: "select",
      options: [100, 200, 300, 400, 500, 600, 700],
    },
    fill: {
      control: "radio",
      options: [0, 1],
    },
    opsz: {
      control: "radio",
      options: [20, 24, 40, 48],
    },
    color: { control: "color" },
  },
  args: {
    name: "school",
  },
} satisfies Meta<typeof MaterialSymbol>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: "school",
    size: 32,
    "aria-label": "School icon",
  },
};

export const CommonSymbols: Story = {
  render: () => {
    const symbols = [
      { name: "search", label: "Search" },
      { name: "settings", label: "Settings" },
      { name: "school", label: "School" },
      { name: "group", label: "Group" },
      { name: "calendar_today", label: "Calendar" },
      { name: "schedule", label: "Clock" },
      { name: "hub", label: "Hub" },
      { name: "bug_report", label: "Bug Report" },
      { name: "security", label: "Security" },
      { name: "close", label: "Close" },
      { name: "check_circle", label: "Check" },
      { name: "logout", label: "Logout" },
    ];

    return (
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 2.5,
          p: 2,
        }}
      >
        {symbols.map((s) => (
          <Box
            key={s.name}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 1,
              p: 1.5,
              border: 1,
              borderColor: "divider",
              borderRadius: 2,
            }}
          >
            <MaterialSymbol name={s.name} size={28} aria-label={s.label} />
            <Typography variant="caption" sx={{ fontWeight: 600 }}>
              {s.name}
            </Typography>
          </Box>
        ))}
      </Box>
    );
  },
};

export const OpticalSizes: Story = {
  render: () => (
    <Box sx={{ display: "flex", gap: 3, alignItems: "flex-end", p: 2 }}>
      {[20, 24, 40, 48].map((size) => (
        <Box key={size} sx={{ textAlign: "center" }}>
          <MaterialSymbol
            name="stars"
            size={size}
            opsz={size}
            aria-label={`Stars optical size ${size}`}
          />
          <Typography variant="caption" sx={{ display: "block", mt: 1 }}>
            {size}px
          </Typography>
        </Box>
      ))}
    </Box>
  ),
};

export const WeightsAndFill: Story = {
  render: () => (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, p: 2 }}>
      <Box sx={{ display: "flex", gap: 3, alignItems: "center" }}>
        <Typography variant="body2" sx={{ width: 100, fontWeight: 700 }}>
          Weights:
        </Typography>
        {[100, 300, 500, 700].map((w) => (
          <Box key={w} sx={{ textAlign: "center" }}>
            <MaterialSymbol
              name="favorite"
              size={32}
              weight={w as 100 | 300 | 500 | 700}
              aria-label={`Favorite weight ${w}`}
            />
            <Typography variant="caption" sx={{ display: "block" }}>
              w{w}
            </Typography>
          </Box>
        ))}
      </Box>
      <Box sx={{ display: "flex", gap: 3, alignItems: "center" }}>
        <Typography variant="body2" sx={{ width: 100, fontWeight: 700 }}>
          Fill (0 vs 1):
        </Typography>
        <Box sx={{ textAlign: "center" }}>
          <MaterialSymbol
            name="bookmark"
            size={32}
            fill={0}
            aria-label="Bookmark outline"
          />
          <Typography variant="caption" sx={{ display: "block" }}>
            Outline (0)
          </Typography>
        </Box>
        <Box sx={{ textAlign: "center" }}>
          <MaterialSymbol
            name="bookmark"
            size={32}
            fill={1}
            aria-label="Bookmark filled"
          />
          <Typography variant="caption" sx={{ display: "block" }}>
            Filled (1)
          </Typography>
        </Box>
      </Box>
    </Box>
  ),
};
