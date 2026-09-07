import type { Meta, StoryObj } from "@storybook/react-vite";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import PlanningLayout from "~/components/templates/PlanningLayout/PlanningLayout";

const meta = {
  title: "Templates/PlanningLayout",
  component: PlanningLayout,
  args: {
    calendar: null,
  },
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof PlanningLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultPlanningLayout: Story = {
  render: () => (
    <PlanningLayout
      hero={
        <Paper
          variant="outlined"
          sx={{
            p: 3,
            borderRadius: 3,
            bgcolor: "primary.main",
            color: "primary.contrastText",
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            Planning & Curriculum Schedule
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            Orbital timeline and scheduled sessions for the current semester.
          </Typography>
        </Paper>
      }
      calendar={
        <Paper
          variant="outlined"
          sx={{
            p: 4,
            borderRadius: 3,
            minHeight: 300,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "background.paper",
          }}
        >
          <Typography variant="subtitle1" color="text.secondary">
            Calendar & Scheduler Grid Slot
          </Typography>
        </Paper>
      }
      dialogs={
        <Box
          sx={{
            p: 2,
            border: "1px dashed",
            borderColor: "divider",
            borderRadius: 2,
          }}
        >
          <Typography variant="caption" color="text.secondary">
            Dialogs Slot (Details, Export, Create Event Dialogs)
          </Typography>
        </Box>
      }
      feedback={
        <Box sx={{ p: 1, textAlign: "right" }}>
          <Typography variant="caption" color="text.secondary">
            Feedback & Telemetry Status Slot
          </Typography>
        </Box>
      }
    />
  ),
};
