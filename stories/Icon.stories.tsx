import type { Meta, StoryObj } from "@storybook/react-vite";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Icon, { type IconWeight } from "~/components/atoms/Icon/Icon";

const meta = {
  title: "Atoms/Icon",
  component: Icon,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    name: { control: "text" },
    size: { control: "number" },
    weight: {
      control: "select",
      options: [
        100,
        200,
        300,
        400,
        500,
        600,
        700,
        "thin",
        "light",
        "normal",
        "medium",
        "semibold",
        "bold",
      ],
    },
    fill: {
      control: "boolean",
    },
    opsz: {
      control: "radio",
      options: [20, 24, 40, 48],
    },
    color: { control: "color" },
  },
  args: {
    name: "favorite",
    size: 40,
    weight: 500,
    fill: false,
    opsz: 40,
  },
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: "favorite",
    size: 40,
    weight: 500,
    fill: false,
    opsz: 40,
    "aria-label": "Favorite icon",
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
            <Icon name={s.name} size={28} aria-label={s.label} />
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
          <Icon
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
        {([100, 300, 500, 700, "bold"] as IconWeight[]).map((w) => (
          <Box key={String(w)} sx={{ textAlign: "center" }}>
            <Icon
              name="favorite"
              size={32}
              weight={w}
              aria-label={`Favorite weight ${w}`}
            />
            <Typography variant="caption" sx={{ display: "block" }}>
              {w}
            </Typography>
          </Box>
        ))}
      </Box>
      <Box sx={{ display: "flex", gap: 3, alignItems: "center" }}>
        <Typography variant="body2" sx={{ width: 100, fontWeight: 700 }}>
          Fill (false vs true):
        </Typography>
        <Box sx={{ textAlign: "center" }}>
          <Icon
            name="bookmark"
            size={32}
            fill={false}
            aria-label="Bookmark outline"
          />
          <Typography variant="caption" sx={{ display: "block" }}>
            Outline (false)
          </Typography>
        </Box>
        <Box sx={{ textAlign: "center" }}>
          <Icon
            name="bookmark"
            size={32}
            fill={true}
            aria-label="Bookmark filled"
          />
          <Typography variant="caption" sx={{ display: "block" }}>
            Filled (true)
          </Typography>
        </Box>
      </Box>
    </Box>
  ),
};
