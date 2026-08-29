import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import FixedDomainEmailField from "~/components/molecules/FixedDomainEmailField/FixedDomainEmailField";

const meta = {
  title: "Molecules/FixedDomainEmailField",
  component: FixedDomainEmailField,
  tags: ["autodocs"],
  argTypes: {
    domain: { control: "text" },
    label: { control: "text" },
    placeholder: { control: "text" },
    helperText: { control: "text" },
    error: { control: "boolean" },
    disabled: { control: "boolean" },
    variant: {
      control: "select",
      options: ["outlined", "filled"],
    },
    size: {
      control: "select",
      options: ["small", "medium", "large"],
    },
    fullWidth: { control: "boolean" },
    showClearButton: { control: "boolean" },
    showDomainLock: { control: "boolean" },
  },
  decorators: [
    (Story) => (
      <Box sx={{ maxWidth: 480, margin: "2rem auto", padding: "1rem" }}>
        <Story />
      </Box>
    ),
  ],
} satisfies Meta<typeof FixedDomainEmailField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: "cadet.username",
    domain: "aptispace.com",
    variant: "outlined",
    size: "medium",
    fullWidth: true,
  },
};

export const WithLabelAndHelper: Story = {
  args: {
    label: "Academy Cadet Identifier",
    placeholder: "cadet.name",
    domain: "cadet.aptispace.io",
    helperText: "Enter your official cadet identifier.",
    variant: "outlined",
    size: "medium",
    fullWidth: true,
  },
};

export const FilledVariant: Story = {
  args: {
    placeholder: "commander.riker",
    domain: "fleet.aptispace.com",
    variant: "filled",
    size: "medium",
    fullWidth: true,
  },
};

export const CustomDomain: Story = {
  args: {
    placeholder: "alicia.vance",
    domain: "mit.edu",
    variant: "outlined",
    size: "medium",
  },
};

export const WithInitialValue: Story = {
  args: {
    defaultValue: "artemis.sol",
    domain: "aptispace.com",
    variant: "outlined",
  },
};

export const WithError: Story = {
  args: {
    value: "invalid space",
    domain: "aptispace.com",
    error: true,
    helperText:
      "Email prefix can only contain lowercase alphanumeric characters and periods.",
    variant: "outlined",
  },
};

export const Disabled: Story = {
  args: {
    value: "retired.pilot",
    domain: "aptispace.com",
    disabled: true,
    helperText: "This email record is locked and cannot be modified.",
  },
};

export const SizeVariations: Story = {
  render: () => (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
      <div>
        <Typography
          variant="caption"
          sx={{ fontWeight: 700, mb: 0.5, display: "block" }}
        >
          Small (36px)
        </Typography>
        <FixedDomainEmailField
          size="small"
          domain="aptispace.com"
          placeholder="username"
        />
      </div>
      <div>
        <Typography
          variant="caption"
          sx={{ fontWeight: 700, mb: 0.5, display: "block" }}
        >
          Medium (42px - Standard)
        </Typography>
        <FixedDomainEmailField
          size="medium"
          domain="aptispace.com"
          placeholder="username"
        />
      </div>
      <div>
        <Typography
          variant="caption"
          sx={{ fontWeight: 700, mb: 0.5, display: "block" }}
        >
          Large (48px)
        </Typography>
        <FixedDomainEmailField
          size="large"
          domain="aptispace.com"
          placeholder="username"
        />
      </div>
    </Box>
  ),
};

export const InteractivePlayground: Story = {
  render: () => {
    function PlaygroundComponent() {
      const [email, setEmail] = useState("cadet.mercer");
      const [domain] = useState("aptispace.com");
      const [fullEmail, setFullEmail] = useState("cadet.mercer@aptispace.com");

      return (
        <Paper
          elevation={3}
          sx={{
            p: 3,
            borderRadius: 3,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
            Interactive Fixed-Domain Field
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Lightweight, vertically aligned input with password manager and
            autofill support.
          </Typography>

          <FixedDomainEmailField
            value={email}
            domain={domain}
            placeholder="enter username or paste full email..."
            onEmailChange={(composite, local) => {
              setEmail(local);
              setFullEmail(composite);
            }}
            helperText="Autofilled full emails automatically sanitize to username prefix."
          />

          <Box
            sx={{
              p: 1.5,
              borderRadius: 2,
              backgroundColor: "action.hover",
              border: "1px dashed",
              borderColor: "primary.main",
              display: "flex",
              flexDirection: "column",
              gap: 0.5,
            }}
          >
            <Typography
              variant="caption"
              sx={{ fontWeight: 700, color: "primary.light" }}
            >
              COMPOSITE FULL EMAIL VALUE:
            </Typography>
            <Typography
              variant="body2"
              sx={{ fontFamily: "monospace", fontWeight: 700 }}
            >
              {fullEmail || "(empty)"}
            </Typography>
          </Box>
        </Paper>
      );
    }

    return <PlaygroundComponent />;
  },
};
