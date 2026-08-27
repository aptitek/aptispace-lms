import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { styled } from "@mui/material/styles";
import type { SupportedLanguage } from "~/i18n";
import LanguageToggle, {
  MeridianToggle,
} from "~/components/atoms/LanguageToggle/LanguageToggle";

const meta = {
  title: "Atoms/LanguageToggle",
  component: LanguageToggle,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "radio",
      options: ["small", "medium", "large"],
      description: "Dimensions of the Meridian Flight switch",
    },
    disabled: {
      control: "boolean",
      description: "Whether the toggle is disabled",
    },
  },
} satisfies Meta<typeof LanguageToggle>;

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

export const EnglishTerminal: StoryObj<typeof MeridianToggle> = {
  render: (args) => <MeridianToggle {...args} language="en" />,
  args: {
    size: "medium",
    language: "en",
  },
};

export const FrenchTerminal: StoryObj<typeof MeridianToggle> = {
  render: (args) => <MeridianToggle {...args} language="fr" />,
  args: {
    size: "medium",
    language: "fr",
  },
};

const FlightHangar = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: theme.spacing(2.5),
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.default,
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: `0 4px 20px ${theme.palette.action.hover}`,
}));

const FlightFlightStatus = styled("span")(({ theme }) => ({
  fontFamily: theme.typography.fontFamily,
  fontSize: "0.85rem",
  fontWeight: 700,
  letterSpacing: "0.04em",
  color: theme.palette.text.primary,
}));

const ToggleFlightRow = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(2),
}));

function InteractiveFlightPlayground() {
  const [lang, setLang] = useState<SupportedLanguage>("en");

  return (
    <FlightHangar>
      <FlightFlightStatus>
        {lang === "en"
          ? "Terminal: London Heathrow (UK) ➔ Click to fly to Paris (FR)"
          : "Terminal: Paris Charles de Gaulle (FR) ➔ Click to fly to London (UK)"}
      </FlightFlightStatus>
      <ToggleFlightRow>
        <MeridianToggle
          size="small"
          language={lang}
          onLanguageChange={(next) => setLang(next)}
        />
        <MeridianToggle
          size="medium"
          language={lang}
          onLanguageChange={(next) => setLang(next)}
        />
        <MeridianToggle
          size="large"
          language={lang}
          onLanguageChange={(next) => setLang(next)}
        />
      </ToggleFlightRow>
    </FlightHangar>
  );
}

export const InteractiveMeridianFlightPlayground: StoryObj<
  typeof MeridianToggle
> = {
  render: () => <InteractiveFlightPlayground />,
};
