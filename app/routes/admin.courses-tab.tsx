import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import Chip from "~/components/atoms/Chip/Chip";
import { TabPanelContainer } from "./admin.styles";

export interface AdminCoursesTabPanelProps {
  className?: string;
}

export function AdminCoursesTabPanel({ className }: AdminCoursesTabPanelProps) {
  return (
    <TabPanelContainer className={className} data-testid="admin-courses-panel">
      <Paper
        elevation={0}
        sx={{
          p: 6,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          borderRadius: "16px",
          border: (theme) => `1px dashed ${theme.palette.divider}`,
          backgroundColor: (theme) => theme.palette.background.paper,
          minHeight: 360,
          gap: 2,
        }}
      >
        <Box
          sx={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            backgroundColor: (theme) => theme.palette.primary.main + "14",
            color: "primary.main",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <MenuBookIcon sx={{ fontSize: 36 }} />
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Curriculum & Module Management
          </Typography>
          <Chip label="Coming Soon" color="primary" size="small" />
        </Box>

        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ maxWidth: 480 }}
        >
          Manage academic programs, flight training syllabi, laboratory
          assignments, and simulation modules across your enrolled cohorts.
        </Typography>
      </Paper>
    </TabPanelContainer>
  );
}

export default AdminCoursesTabPanel;
