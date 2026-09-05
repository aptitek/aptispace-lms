import type { Meta, StoryObj } from "@storybook/react-vite";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import SecurityIcon from "@mui/icons-material/Security";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import FavoriteIcon from "@mui/icons-material/Favorite";
import LockResetIcon from "@mui/icons-material/LockReset";
import FingerprintIcon from "@mui/icons-material/Fingerprint";
import { HoldButton } from "~/components/atoms/HoldButton";
import { ALL_35_M3_SHAPES } from "~/tokens/shapes";

const meta = {
  title: "Atoms/HoldButton",
  component: HoldButton,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "radio",
      options: ["contained", "outlined", "text"],
    },
    color: {
      control: "select",
      options: ["primary", "secondary", "error", "warning", "info", "success"],
    },
    shape: {
      control: "select",
      options: [undefined, ...ALL_35_M3_SHAPES],
      description:
        "Any of the 35 Material 3 Expressive shapes or standard radius tokens",
    },
    holdTime: {
      control: "number",
      description: "Time required to hold in milliseconds",
    },
    borderThickness: {
      control: "number",
      description: "Thickness of the animated outline line in pixels",
    },
    outlineGap: {
      control: "number",
      description: "Gap between button and floating outline in pixels",
    },
    disabled: { control: "boolean" },
    children: { control: "text" },
  },
} satisfies Meta<typeof HoldButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Hold to Delete (1s)",
    color: "error",
    variant: "contained",
    holdTime: 1000,
    borderThickness: 2.5,
    outlineGap: 3.5,
    startIcon: <DeleteForeverIcon />,
    onHoldComplete: () => alert("Held for 1000ms! Action executed."),
  },
};

export const FastAction: Story = {
  args: {
    children: "Hold Quick (500ms)",
    color: "warning",
    variant: "contained",
    holdTime: 500,
    borderThickness: 2.5,
    outlineGap: 3.5,
    startIcon: <PowerSettingsNewIcon />,
    onHoldComplete: () => alert("Quick hold completed!"),
  },
};

export const HighSecurityAction: Story = {
  args: {
    children: "Hold for Critical Action (2.5s)",
    color: "error",
    variant: "contained",
    holdTime: 2500,
    borderThickness: 3,
    outlineGap: 4,
    startIcon: <SecurityIcon />,
    onHoldComplete: () => alert("Critical security action authorized!"),
  },
};

export const FloatingOutlineDemos: Story = {
  args: {
    onHoldComplete: () => {},
  },
  render: () => (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 4, p: 2 }}>
      <Box>
        <Typography
          variant="subtitle2"
          sx={{ mb: 1.5, color: "text.secondary" }}
        >
          Floating Outlines with Gap on Standard Buttons (Press & Hold)
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 3,
            alignItems: "center",
          }}
        >
          <HoldButton
            variant="contained"
            color="error"
            startIcon={<DeleteForeverIcon />}
            onHoldComplete={() => alert("Destructive action confirmed")}
          >
            Contained Standard
          </HoldButton>

          <HoldButton
            variant="outlined"
            color="primary"
            startIcon={<RestartAltIcon />}
            sx={{ borderRadius: "28px", px: 3 }}
            onHoldComplete={() => alert("Pill reset completed")}
          >
            Full Pill Outlined (28px)
          </HoldButton>

          <HoldButton
            variant="contained"
            color="success"
            startIcon={<AutoAwesomeIcon />}
            sx={{ borderRadius: "16px", px: 2.5 }}
            onHoldComplete={() => alert("Medium rounded action")}
          >
            Soft Rounded (16px)
          </HoldButton>

          <HoldButton
            variant="outlined"
            color="warning"
            sx={{ borderRadius: "6px" }}
            onHoldComplete={() => alert("Subtle rounded")}
          >
            Rounded (6px)
          </HoldButton>
        </Box>
      </Box>

      <Box>
        <Typography
          variant="subtitle2"
          sx={{ mb: 1.5, color: "text.secondary" }}
        >
          Icon-Only MD3 Expressive Buttons with Floating Outer Halo Outline
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 3.5,
            alignItems: "center",
          }}
        >
          <HoldButton
            shape="4-sided-cookie"
            variant="contained"
            color="primary"
            onHoldComplete={() => alert("4-sided Cookie icon held!")}
            title="4-sided cookie button"
          >
            <PowerSettingsNewIcon />
          </HoldButton>

          <HoldButton
            shape="9-sided-cookie"
            variant="contained"
            color="secondary"
            onHoldComplete={() => alert("9-sided Cookie icon held!")}
            title="9-sided cookie button"
          >
            <FingerprintIcon />
          </HoldButton>

          <HoldButton
            shape="sunny"
            variant="contained"
            color="warning"
            onHoldComplete={() => alert("Sunny icon held!")}
            title="Sunny shape button"
          >
            <AutoAwesomeIcon />
          </HoldButton>

          <HoldButton
            shape="gem"
            variant="contained"
            color="info"
            onHoldComplete={() => alert("Gem icon held!")}
            title="Gem shape button"
          >
            <LockResetIcon />
          </HoldButton>

          <HoldButton
            shape="heart"
            variant="contained"
            color="error"
            onHoldComplete={() => alert("Heart icon held!")}
            title="Heart shape button"
          >
            <FavoriteIcon />
          </HoldButton>

          <HoldButton
            shape="clamshell"
            variant="contained"
            color="success"
            onHoldComplete={() => alert("Clamshell icon held!")}
            title="Clamshell button"
          >
            <RestartAltIcon />
          </HoldButton>
        </Box>
      </Box>
    </Box>
  ),
};
