import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { styled } from "@mui/material/styles";
import ThemeToggle, {
  ZenithSwitch,
} from "~/components/atoms/ThemeToggle/ThemeToggle";

const meta = {
  title: "Atoms/ThemeToggle",
  component: ThemeToggle,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "radio",
      options: ["small", "medium", "large"],
      description: "Dimensions of the M3 Day-Night Zenith switch",
    },
    disabled: {
      control: "boolean",
      description: "Whether the switch is disabled",
    },
  },
} satisfies Meta<typeof ThemeToggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    size: "small",
    disabled: false,
  },
};

export const Medium: Story = {
  args: {
    size: "medium",
    disabled: false,
  },
};

export const Large: Story = {
  args: {
    size: "large",
    disabled: false,
  },
};

export const Disabled: Story = {
  args: {
    size: "medium",
    disabled: true,
  },
};

export const ControlledLightMode: StoryObj<typeof ZenithSwitch> = {
  render: (args) => <ZenithSwitch {...args} checked={false} />,
  args: {
    size: "medium",
    checked: false,
  },
};

export const ControlledDarkMode: StoryObj<typeof ZenithSwitch> = {
  render: (args) => <ZenithSwitch {...args} checked={true} />,
  args: {
    size: "medium",
    checked: true,
  },
};

const PlaygroundCard = styled("div")<{ $isDark: boolean }>(
  ({ theme, $isDark }) => ({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: theme.spacing(2.5),
    padding: theme.spacing(3),
    borderRadius: theme.shape.borderRadius,
    backgroundColor: $isDark
      ? theme.palette.background.default
      : theme.palette.background.paper,
    border: `1px solid ${theme.palette.divider}`,
    transition: "background-color 0.3s ease, border-color 0.3s ease",
  }),
);

const PlaygroundLabel = styled("span")(({ theme }) => ({
  fontFamily: theme.typography.fontFamily,
  fontSize: "0.85rem",
  fontWeight: 600,
  color: theme.palette.text.secondary,
}));

const SwitchRow = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(2),
}));

function InteractivePlayground() {
  const [isDark, setIsDark] = useState(true);

  return (
    <PlaygroundCard $isDark={isDark}>
      <PlaygroundLabel>
        {isDark
          ? "Night Zenith (Moon Active — Hover for Dawn Sun Peek)"
          : "Day Zenith (Sun Active — Hover for Dusk Moon Peek)"}
      </PlaygroundLabel>
      <SwitchRow>
        <ZenithSwitch
          size="small"
          checked={isDark}
          onToggle={(checked) => setIsDark(checked)}
        />
        <ZenithSwitch
          size="medium"
          checked={isDark}
          onToggle={(checked) => setIsDark(checked)}
        />
        <ZenithSwitch
          size="large"
          checked={isDark}
          onToggle={(checked) => setIsDark(checked)}
        />
      </SwitchRow>
    </PlaygroundCard>
  );
}

export const InteractiveZenithSwitchPlayground: StoryObj<typeof ZenithSwitch> =
  {
    render: () => <InteractivePlayground />,
  };
