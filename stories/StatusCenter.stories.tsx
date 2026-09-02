import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import {
  StatusCenterProvider,
  type TelemetryEventItem,
} from "~/utils/statusCenterContext";
import EcgTelemetry from "~/components/atoms/StatusCenter/EcgTelemetry";
import StatusSnackbar from "~/components/molecules/StatusCenter/StatusSnackbar";
import StatusGatewayTrigger from "~/components/molecules/StatusCenter/StatusGatewayTrigger";
import StatusTerminalCard from "~/components/organisms/StatusCenter/StatusTerminalCard";
import StatusTerminalInfrastructure from "~/components/organisms/StatusCenter/StatusTerminalInfrastructure";

const sampleWarning: TelemetryEventItem = {
  id: "evt-warn-1",
  title: "High Gateway Latency",
  message:
    "Orbital Gateway node latency exceeded nominal threshold (280ms > 150ms).",
  severity: "warning",
  timestamp: new Date(Date.now() - 1000 * 60 * 3),
  source: "gateway-telemetry",
};

const sampleSecurity: TelemetryEventItem = {
  id: "evt-sec-1",
  title: "Security Infraction (403 Forbidden)",
  message:
    "Unauthorized attempt to access administrative orbital control bridge /api/admin/system-override.",
  severity: "security",
  statusCode: 403,
  timestamp: new Date(Date.now() - 1000 * 60 * 12),
  source: "auth-guard-sentinel",
  stack:
    "AccessDeniedError: 403 Forbidden\n    at assertAdminRole (app/utils/session.server.ts:182:11)\n    at Object.action (app/routes/api.admin.ts:24:5)",
  url: "https://lms.aptispace.internal/api/admin/system-override",
};

const sampleError: TelemetryEventItem = {
  id: "evt-err-1",
  title: "Telemetry Sync Exception",
  message:
    "Failed to persist student curriculum synchronization payload: SQLite D1 constraint violation.",
  severity: "error",
  statusCode: 500,
  timestamp: new Date(Date.now() - 1000 * 60 * 25),
  source: "db-sync-service",
  stack:
    "D1DatabaseError: UNIQUE constraint failed: submissions.id\n    at DrizzleD1Database.insert (node_modules/drizzle-orm/d1/index.js:52:19)\n    at syncStudentProgress (app/services/assessmentService.ts:104:14)",
  url: "https://lms.aptispace.internal/api/courses/progress",
};

function SnackbarSeverityDemo() {
  const [activeToast, setActiveToast] = useState<TelemetryEventItem | null>(
    sampleError,
  );

  return (
    <Box sx={{ minHeight: "60vh", p: 4 }}>
      <Typography variant="h6" sx={{ mb: 3, fontFamily: "monospace" }}>
        MATERIAL DESIGN 3 SNACKBAR SEVERITY TOASTS
      </Typography>
      <Stack direction="row" spacing={1.5} sx={{ flexWrap: "wrap", mb: 4 }}>
        <Button
          variant="contained"
          color="error"
          onClick={() => setActiveToast(sampleError)}
        >
          Trigger Error Toast
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => setActiveToast(sampleSecurity)}
        >
          Trigger 403 Security Toast
        </Button>
        <Button
          variant="contained"
          color="warning"
          onClick={() => setActiveToast(sampleWarning)}
        >
          Trigger Warning Toast
        </Button>
        <Button
          variant="contained"
          color="success"
          onClick={() =>
            setActiveToast({
              id: "evt-succ-1",
              title: "Station Gateway Online",
              message:
                "Orbital communication relay established. Telemetry synchronized.",
              severity: "success",
              timestamp: new Date(),
            })
          }
        >
          Trigger Success Toast
        </Button>
        <Button variant="outlined" onClick={() => setActiveToast(null)}>
          Dismiss Toast
        </Button>
      </Stack>

      <StatusSnackbar
        eventEntry={activeToast}
        onDismiss={() => setActiveToast(null)}
        onViewDetails={() => {}}
      />
    </Box>
  );
}

const meta = {
  title: "Organisms/StatusCenter",
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const TerminalCardNominal: Story = {
  render: () => (
    <StatusCenterProvider initialEvents={[]} initialOnline={true}>
      <Box
        sx={{
          minHeight: "100vh",
          p: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <StatusGatewayTrigger />
        <StatusTerminalCard />
      </Box>
    </StatusCenterProvider>
  ),
};

export const TerminalCardDegraded: Story = {
  render: () => (
    <StatusCenterProvider initialEvents={[sampleWarning]} initialOnline={true}>
      <Box
        sx={{
          minHeight: "100vh",
          p: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <StatusGatewayTrigger />
        <StatusTerminalCard />
      </Box>
    </StatusCenterProvider>
  ),
};

export const TerminalCardCriticalAndSecurity: Story = {
  render: () => (
    <StatusCenterProvider
      initialEvents={[sampleSecurity, sampleError, sampleWarning]}
      initialOnline={true}
    >
      <Box
        sx={{
          minHeight: "100vh",
          p: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <StatusGatewayTrigger />
        <StatusTerminalCard />
      </Box>
    </StatusCenterProvider>
  ),
};

export const TerminalCardOfflineFlatline: Story = {
  render: () => (
    <StatusCenterProvider initialEvents={[]} initialOnline={false}>
      <Box
        sx={{
          minHeight: "100vh",
          p: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <StatusGatewayTrigger />
        <StatusTerminalCard />
      </Box>
    </StatusCenterProvider>
  ),
};

export const EcgTelemetryOscilloscope: Story = {
  render: () => (
    <Box sx={{ p: 4, maxWidth: 800, mx: "auto" }}>
      <Typography variant="h6" sx={{ mb: 2, fontFamily: "monospace" }}>
        ECG TELEMETRY OSCILLOSCOPE MODES (CONSTANT SWEEP RATE)
      </Typography>
      <Stack spacing={3}>
        <Box>
          <Typography
            variant="caption"
            sx={{ fontFamily: "monospace", display: "block", mb: 1 }}
          >
            NOMINAL (CALM SPACING)
          </Typography>
          <EcgTelemetry status="nominal" bpm={68} height={90} />
        </Box>
        <Box>
          <Typography
            variant="caption"
            sx={{ fontFamily: "monospace", display: "block", mb: 1 }}
          >
            DEGRADED (ELEVATED FREQUENCY)
          </Typography>
          <EcgTelemetry status="degraded" bpm={98} height={90} />
        </Box>
        <Box>
          <Typography
            variant="caption"
            sx={{ fontFamily: "monospace", display: "block", mb: 1 }}
          >
            403 SECURITY INFRACTION (ALERT FREQUENCY)
          </Typography>
          <EcgTelemetry status="security_breach" bpm={132} height={90} />
        </Box>
        <Box>
          <Typography
            variant="caption"
            sx={{ fontFamily: "monospace", display: "block", mb: 1 }}
          >
            CRITICAL EMERGENCY FAULT (HIGH DENSITY)
          </Typography>
          <EcgTelemetry status="critical" bpm={156} height={90} />
        </Box>
        <Box>
          <Typography
            variant="caption"
            sx={{ fontFamily: "monospace", display: "block", mb: 1 }}
          >
            LOST CONNECTION (FLATLINE)
          </Typography>
          <EcgTelemetry status="offline" bpm={0} height={90} />
        </Box>
      </Stack>
    </Box>
  ),
};

export const StatusSnackbarSeverityToasts: Story = {
  render: () => <SnackbarSeverityDemo />,
};

export const InfrastructureConnectivity: Story = {
  render: () => (
    <StatusCenterProvider>
      <Box sx={{ p: 4, maxWidth: 720, mx: "auto" }}>
        <Typography variant="h6" sx={{ mb: 2, fontFamily: "monospace" }}>
          CLOUD INFRASTRUCTURE CONNECTIVITY TILES
        </Typography>
        <StatusTerminalInfrastructure />
      </Box>
    </StatusCenterProvider>
  ),
};
