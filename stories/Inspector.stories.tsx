import type { Meta, StoryObj } from "@storybook/react-vite";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Chip from "@mui/material/Chip";
import Inspector from "~/components/organisms/Inspector/Inspector";

const meta = {
  title: "Organisms/Inspector",
  component: Inspector,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <Box sx={{ width: 400, maxWidth: "100%", p: 2 }}>
        <Story />
      </Box>
    ),
  ],
  args: {
    children: null,
  },
} satisfies Meta<typeof Inspector>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Inspector title="Inspect Record" onClose={() => alert("Close clicked")}>
      <Inspector.Body>
        <Typography variant="body2" color="text.secondary">
          Configure record properties and parameters.
        </Typography>
        <TextField
          label="Record Name"
          defaultValue="Telemetry Node Alpha"
          fullWidth
          size="small"
        />
        <TextField
          label="Description"
          defaultValue="Primary gateway receiver"
          fullWidth
          multiline
          rows={3}
          size="small"
        />
      </Inspector.Body>
      <Inspector.Actions>
        <Button variant="text" onClick={() => alert("Cancel")}>
          Cancel
        </Button>
        <Button variant="contained" onClick={() => alert("Save")}>
          Save Changes
        </Button>
      </Inspector.Actions>
    </Inspector>
  ),
};

export const WithHeaderExtra: Story = {
  render: () => (
    <Inspector
      title="Cohort Details"
      onClose={() => alert("Close clicked")}
      headerExtra={<Chip label="Active" color="success" size="small" />}
    >
      <Inspector.Body>
        <TextField
          label="Cohort Code"
          defaultValue="M1-IA-2026"
          fullWidth
          size="small"
        />
        <TextField
          label="Enrolled Students"
          defaultValue="32"
          fullWidth
          size="small"
        />
      </Inspector.Body>
      <Inspector.Actions>
        <Button variant="contained" fullWidth onClick={() => alert("Apply")}>
          Apply Changes
        </Button>
      </Inspector.Actions>
    </Inspector>
  ),
};

export const ScrollableContent: Story = {
  render: () => (
    <Inspector
      title="Audit Details"
      onClose={() => alert("Close")}
      maxHeight="400px"
    >
      <Inspector.Body>
        {["item-alpha", "item-beta", "item-gamma", "item-delta"].map(
          (id, i) => (
            <Box
              key={id}
              sx={{
                p: 1.5,
                border: 1,
                borderColor: "divider",
                borderRadius: 1.5,
              }}
            >
              <Typography variant="caption" sx={{ fontWeight: 700 }}>
                Event Log #{i + 1}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Record modified by administrator. Verified checksum valid.
              </Typography>
            </Box>
          ),
        )}
      </Inspector.Body>
    </Inspector>
  ),
};
