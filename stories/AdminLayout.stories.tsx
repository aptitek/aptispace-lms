import type { Meta, StoryObj } from "@storybook/react-vite";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import AdminLayout from "~/components/templates/AdminLayout/AdminLayout";
import HeaderTabs from "~/components/molecules/HeaderTabs/HeaderTabs";
import type { AuthUser } from "~/utils/auth";

const mockAdmin: AuthUser = {
  id: "adm-1",
  role: "admin",
  name: "Admin Eleanor",
  email: "admin@aptitek.io",
  isProfileComplete: true,
};

const meta = {
  title: "Templates/AdminLayout",
  component: AdminLayout,
  tags: ["autodocs"],
  args: {
    onLogout: () => {},
    tabs: null,
    children: null,
  },
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof AdminLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultWithHeaderTabs: Story = {
  render: () => (
    <AdminLayout
      onLogout={() => alert("Logout clicked")}
      tabs={<HeaderTabs user={mockAdmin} />}
    >
      <Paper
        variant="outlined"
        sx={{
          p: 4,
          borderRadius: 3,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 800 }}>
          Admin Main Workspace
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Central management console for institutions, cohorts, courses, and
          system telemetry.
        </Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
            gap: 2,
            mt: 2,
          }}
        >
          {[
            "Institutions (3)",
            "Active Cohorts (8)",
            "Total Students (120)",
          ].map((title) => (
            <Box
              key={title}
              sx={{
                p: 2.5,
                border: 1,
                borderColor: "divider",
                borderRadius: 2,
                bgcolor: "background.paper",
              }}
            >
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                {title}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Operational and ready
              </Typography>
            </Box>
          ))}
        </Box>
      </Paper>
    </AdminLayout>
  ),
};
